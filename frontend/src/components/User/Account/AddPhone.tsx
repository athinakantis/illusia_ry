import { useState } from 'react';
import { supabase } from '../../../config/supabase';
import {
  Box,
  Button,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

/**
 * Add or change the signed‑in user’s phone number.
 *
 * 1. updateUser({ phone }) → Supabase sends an OTP to the phone.
 * 2. verifyOtp({ phone, token, type: 'phone_change' }) → confirms the number.
 */
const AddPhone = ({
  initialPhone,
  onDone,
}: {
  initialPhone?: string | null;
  onDone?: () => void;
}) => {
  const [phone, setPhone] = useState(initialPhone ?? '');
  const [code,  setCode]  = useState('');
  const [step, setStep] = useState<'enterPhone' | 'enterCode'>('enterPhone');
  const [status, setStatus] = useState<string>();
  // helper : ensure AAL2 before sensitive updates
  const ensureAal2 = async (): Promise<true | string> => {
    const { data: aal } =
      await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    if (aal?.currentLevel === 'aal2') return true;

    // create challenge against the first verified TOTP factor
    const { data: factors } = await supabase.auth.mfa.listFactors();
    const totp = factors?.all.find(f => f.factor_type === 'totp' && f.status === 'verified');
    if (!totp) return 'Need a verified TOTP factor to continue.';

    const { data: challenge } =
      await supabase.auth.mfa.challenge({ factorId: totp.id });
    const code = prompt('Enter 6‑digit code from your Authenticator app');
    if (!code) return 'Cancelled.';

    const { error } = await supabase.auth.mfa.verify({
      factorId: totp.id,
      challengeId: challenge.id,
      code,
    });
    return error ? error.message : true;
  };
  /** Step 1 – send / change phone, trigger SMS */
  const handleSendOtp = async () => {
    setStatus('Sending code…');
    const ok = await ensureAal2();
    if (ok !== true) {
      setStatus(ok);
      return;
    }
    setStatus('Sending code…');
    const { error } = await supabase.auth.updateUser({ phone });
    if (error) return setStatus(error.message);
    setStatus('SMS sent! Enter the 6‑digit code.');
    setStep('enterCode');
  };

  /** Step 2 – verify 6‑digit pin */
  const handleVerifyOtp = async () => {
    setStatus('Verifying…');
    const { error } = await supabase.auth.verifyOtp({
      phone,
      token: code,
      type: 'phone_change',           // “sms” is for sign‑in; phone_change confirms updates
    });
    if (error) return setStatus(error.message);
    setStatus('Phone number confirmed ✅');
    onDone?.();                       // callback to parent (e.g. reload profile)
  };

  return (
    <Box sx={{ width: '100%' }}>
      {step === 'enterPhone' && (
        <Stack spacing={2}>
          <TextField
            label="Phone number (E.164 e.g. +358401234567)"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            fullWidth
          />
          <Button variant="contained" onClick={handleSendOtp} disabled={!phone}>
            Send code
          </Button>
        </Stack>
      )}

      {step === 'enterCode' && (
        <Stack spacing={2}>
          <TextField
            label="6-digit code"
            value={code}
            onChange={e => setCode(e.target.value)}
            fullWidth
          />
          <Button
            variant="contained"
            onClick={handleVerifyOtp}
            disabled={code.length < 6}
          >
            Verify & Save
          </Button>
        </Stack>
      )}

      {status && (
        <Typography variant="caption" color="text.secondary" sx={{ mt: 2 }}>
          {status}
        </Typography>
      )}
    </Box>
  );
};

export default AddPhone;