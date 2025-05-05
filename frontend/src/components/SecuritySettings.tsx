import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Stack,
  Paper,
} from '@mui/material';
import { supabase } from '../config/supabase';

/** type helper */
type Factor = Awaited<
  ReturnType<typeof supabase.auth.mfa.listFactors>
>["data"]["all"][number];

const SecuritySettings = () => {
  const [totpFactor, setTotpFactor] = useState<Factor | null>(null);
  const [pending, setPending] = useState<{ id: string; qr: string; secret: string } | null>(null);
  const [code, setCode] = useState('');
  const [status, setStatus] = useState<string>();

  /** fetch existing factors */
  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.auth.mfa.listFactors();
      if (error) return console.error(error);
      const totp = (data?.totp ?? [])[0] ?? null; // totp array has at most one factor
      setTotpFactor(totp);
    })();
  }, []);

  /** enrol */
  const handleEnroll = async () => {
    setStatus('Generating secret…');
    const { data, error } = await supabase.auth.mfa.enroll({ factorType: 'totp' });
    if (error) return setStatus(error.message);
    setPending({
      id: data.id,
      qr: data.totp.qr_code,
      secret: data.totp.secret,
    });
    setStatus('Scan this QR in your authenticator app, then enter the 6‑digit code');
  };

  /** verify */
  const handleVerify = async () => {
    if (!pending || !code) return;
    setStatus('Verifying…');
  
    // 1) Ask Supabase to create a new challenge for this factor
    const { data: challengeData, error: challengeErr } =
      await supabase.auth.mfa.challenge({ factorId: pending.id });
    if (challengeErr) {
      setStatus(challengeErr.message);
      return;
    }
  
    // 2) Verify the 6‑digit code against the challenge we just received
    const { error } = await supabase.auth.mfa.verify({
      factorId: pending.id,
      challengeId: challengeData.id, // ✅ real UUID, no more empty string
      code,
    });
    if (error) {
      setStatus(error.message);
      return;
    }
  
    setStatus('MFA enabled 🎉');
    window.location.reload();
  };

  /** disable */
  const handleDisable = async () => {
    if (!totpFactor) return;
    const { error } = await supabase.auth.mfa.unenroll({ factorId: totpFactor.id });
    if (error) return setStatus(error.message);
    setStatus('MFA disabled');
    window.location.reload();
  };

  return (
    <Paper sx={{ p: 4, maxWidth: 450, m: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        Security settings
      </Typography>

      {/* ───────── NO FACTOR ENROLLED YET ───────── */}
      {!totpFactor && !pending && (
        <Button variant="contained" onClick={handleEnroll}>
          Enable TOTP MFA
        </Button>
      )}

      {/* ───────── SHOW QR & VERIFY ───────── */}
      {pending && (
        <Stack spacing={2}>
          <Box sx={{ textAlign: 'center' }}>
            {/* Supabase returns an SVG string – embed directly */}
            <div dangerouslySetInnerHTML={{ __html: pending.qr }} />
            <Typography variant="caption">Secret: {pending.secret}</Typography>
          </Box>
          <TextField
            label="6‑digit code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <Button variant="contained" onClick={handleVerify}>
            Verify &amp; Activate
          </Button>
        </Stack>
      )}

      {/* ───────── FACTOR ALREADY ENROLLED ───────── */}
      {totpFactor && (
        <Box>
          <Typography sx={{ mb: 2 }}>
            Authenticator‑app MFA is <strong>enabled</strong>.
          </Typography>
          <Button variant="outlined" color="error" onClick={handleDisable}>
            Disable TOTP MFA
          </Button>
        </Box>
      )}

      {status && (
        <Typography sx={{ mt: 2 }} color="text.secondary">
          {status}
        </Typography>
      )}
    </Paper>
  );
};

export default SecuritySettings;