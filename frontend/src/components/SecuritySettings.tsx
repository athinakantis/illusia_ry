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

/** base MFA factor type (non‑null) */
type BaseFactor = NonNullable<
  Awaited<ReturnType<typeof supabase.auth.mfa.listFactors>>["data"]
>["all"][number];

/** narrowed type for TOTP factors (includes the `totp` payload) */
type TotpFactor = BaseFactor & {
  factor_type: 'totp';
  totp: {
    qr_code: string;
    secret: string;
  };
};

const SecuritySettings = () => {
  const [totpFactor, setTotpFactor] = useState<TotpFactor | null>(null);
  const [pending, setPending] = useState<{ id: string; qr: string; secret: string } | null>(null);
  const [code, setCode] = useState('');
  const [status, setStatus] = useState<string>();

  /** fetch existing factors */
  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.auth.mfa.listFactors();
      console.log('listFactors() →', { data, error });
      if (error) return console.error(error);
      const totp = (data?.all ?? []).find(
        (f): f is TotpFactor => f.factor_type === 'totp' && f.status === 'verified',
      ) ?? null;
      setTotpFactor(totp);
    })();
  }, []);

  /** enrol */
const handleEnroll = async () => {
    console.log('--- handleEnroll clicked ---');
    setStatus('Checking factors…');
  
    // 1) See if an unverified TOTP factor already exists
    const { data, error: listErr } = await supabase.auth.mfa.listFactors();
    if (listErr) return setStatus(listErr.message);
    const existing = (data?.all ?? []).find(
      (f): f is TotpFactor => f.factor_type === 'totp' && f.status === 'unverified',
    );
    console.log('existing', existing);
    if (existing) {
      setPending({
        id: existing.id,
        qr: existing.totp.qr_code,
        secret: existing.totp.secret,
      });
      setStatus('Scan the QR and enter the 6‑digit code');
      return;
    }
  
    // 2) Otherwise create a new one
    const { data: enrolled, error } = await supabase.auth.mfa.enroll({
      factorType: 'totp',
      friendlyName: `totp-${Date.now()}`, // unique name avoids collision
    });
    console.log('enroll() →', { enrolled, error });
    if (error) return setStatus(error.message);
    const enrolledTotp = enrolled 
    setPending({
      id: enrolledTotp.id,
      qr: enrolledTotp.totp.qr_code,
      secret: enrolledTotp.totp.secret,
    });
    setStatus('Scan the QR and enter the 6‑digit code');
  };

  /** verify */
  const handleVerify = async () => {
    console.log('--- handleVerify ---', { pending, code });
    if (!pending || !code) return;
    setStatus('Requesting challenge…');

    // 1️⃣ create a challenge for the new factor
    const { data: challenge, error: challErr } = await supabase.auth.mfa.challenge({
      factorId: pending.id,
    });
    console.log('challenge() →', { challenge, challErr });
    if (challErr) {
      setStatus(challErr.message);
      return;
    }

    // 2️⃣ verify the code using the challengeId
    setStatus('Verifying code…');
    const { error } = await supabase.auth.mfa.verify({
      factorId: pending.id,
      challengeId: challenge.id,
      code,
    } );
    console.log('verify() →', { error });
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
    console.log('unenroll() →', { error });
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
          Enable TOTP MFA
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
            Authenticator-app MFA is <strong>enabled</strong>.
          </Typography>
          <Button variant="outlined" color="error" onClick={handleDisable}>
            Disable TOTP MFA
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