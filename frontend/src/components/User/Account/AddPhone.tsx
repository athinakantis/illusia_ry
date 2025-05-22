import { useState } from 'react';
import { supabase } from '../../../config/supabase';
import {
  Box,
  Button,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
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
    if (!challenge || !challenge.id) return 'Failed to create challenge.';
    const code = prompt(t('account.email.mfaPrompt', { defaultValue: 'Enter your 6-digit authenticator code to confirm email change:' }));
    if (!code) return 'Cancelled.';

    const { error } = await supabase.auth.mfa.verify({
      factorId: totp.id,
      // @
      challengeId: challenge.id,
      code,
    });

    return error ? error.message : true;
  };
  /** Step 1 – send / change phone, trigger SMS */
  const handleSendOtp = async () => {
    setStatus(t('account.phone.status.sending', { defaultValue: 'Sending code…' }));
    const ok = await ensureAal2();
    if (ok !== true) {
      setStatus(ok);
      return;
    }
    setStatus(t('account.phone.status.sending', { defaultValue: 'Sending code…' }));
    const { error } = await supabase.auth.updateUser({ phone });
    if (error) return setStatus(error.message);
    setStatus(t('account.phone.status.smsSent', { defaultValue: 'SMS sent! Enter the 6-digit code.' }));
    setStep('enterCode');
  };

  /** Step 2 – verify 6‑digit pin */
  const handleVerifyOtp = async () => {
    setStatus(t('account.phone.status.verifying', { defaultValue: 'Verifying…' }));
    const { error } = await supabase.auth.verifyOtp({
      phone,
      token: code,
      type: 'phone_change',           // “sms” is for sign‑in; phone_change confirms updates
    });
    if (error) return setStatus(error.message);
    setStatus(t('account.phone.status.confirmed', { defaultValue: 'Phone number confirmed ✅' }));
    onDone?.();                       // callback to parent (e.g. reload profile)
  };

  return (
    <Box sx={{ width: '100%' }}>
      {step === 'enterPhone' && (
        <Stack spacing={2}>
          <TextField
            label={t('account.phone.numberLabel', { defaultValue: 'Phone number (E.164 e.g. +358401234567)' })}
            value={phone}
            onChange={e => setPhone(e.target.value)}
            fullWidth
          />
          <Button variant="contained" onClick={handleSendOtp} disabled={!phone}>
            {t('account.phone.sendCode', { defaultValue: 'Send code' })}
          </Button>
        </Stack>
      )}

      {step === 'enterCode' && (
        <Stack spacing={2}>
          <TextField
            label={t('account.phone.codeLabel', { defaultValue: '6-digit code' })}
            value={code}
            onChange={e => setCode(e.target.value)}
            fullWidth
          />
          <Button
            variant="contained"
            onClick={handleVerifyOtp}
            disabled={code.length < 6}
          >
            {t('account.phone.verifySave', { defaultValue: 'Verify & Save' })}
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