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
import { Factor } from '@supabase/supabase-js';


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
/** enrol */
const handleEnroll = async () => {
    setStatus('Checking factors…');
  
    // 1) See if an unverified TOTP factor already exists
    const { data, error: listErr } = await supabase.auth.mfa.listFactors();
    if (listErr) return setStatus(listErr.message);
    const existing = (data?.totp ?? []).find((f) => f.status === 'unverified');
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
    if (error) return setStatus(error.message);
  
    setPending({
      id: enrolled.id,
      qr: enrolled.totp.qr_code,
      secret: enrolled.totp.secret,
    });
    setStatus('Scan the QR and enter the 6‑digit code');
  };

  /** verify */
  const handleVerify = async () => {
    if (!pending || !code) return;
    setStatus('Verifying…');
    const { error } = await supabase.auth.mfa.verify({
      factorId: pending.id,
      code,
    } ); // casting to any avoids the outdated type that requires challengeId
    if (error) return setStatus(error.message);
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