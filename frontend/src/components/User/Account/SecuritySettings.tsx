import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Stack,
  Paper,
} from '@mui/material';
import { supabase } from '../../../config/supabase';
import { Factor } from '@supabase/supabase-js';
import { useTranslation } from 'react-i18next';

const SecuritySettings = () => {
  const [totpFactor, setTotpFactor] = useState<Factor | null>(null);
  const [pending, setPending] = useState<{ id: string; qr: string; secret: string } | null>(null);
  const [code, setCode] = useState('');
  const [status, setStatus] = useState<string>();
  const { t } = useTranslation();

  /** fetch existing factors */
  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.auth.mfa.listFactors();
      if (error) return console.error(error);
      const totp = (data?.totp ?? [])[0] ?? null; // totp array has at most one factor
      setTotpFactor(totp);
    })();
  }, []);
  /** cancel setup */
  async function handleCancelSetup(factorId: string) {
    const { error } = await supabase.auth.mfa.unenroll({ factorId });
    if (error) {
      setStatus(t('security.status.unenrollFailed', { defaultValue: 'Unenroll failed' }) + ': ' + error.message);
    } else {
      setStatus(t('security.status.canceled', { defaultValue: 'MFA setup canceled.' }));
      setPending(null);
    }
  }
  /** enrol */
  const handleEnroll = async () => {
    setStatus(t('security.status.generating', { defaultValue: 'Generating secret…' }));
    const { data, error } = await supabase.auth.mfa.enroll({ factorType: 'totp' });
    if (error) return setStatus(error.message);
    setPending({
      id: data.id,
      qr: data.totp.qr_code,
      secret: data.totp.secret,
    });
    setStatus(t('security.status.scanQr', { defaultValue: 'Scan this QR in your authenticator app, then enter the 6-digit code' }));
  };

  /** verify */
  const handleVerify = async () => {
    if (!pending || !code) return;
    setStatus(t('security.status.verifying', { defaultValue: 'Verifying…' }));

    // 1) Ask Supabase to create a new challenge for this factor
    const { data: challengeData, error: challengeErr } =
      await supabase.auth.mfa.challenge({ factorId: pending.id });
    if (challengeErr) {
      setStatus(challengeErr.message);
      return;
    }

    // 2) Verify the 6-digit code against the challenge we just received
    const { error } = await supabase.auth.mfa.verify({
      factorId: pending.id,
      challengeId: challengeData.id,
      code,
    });
    if (error) {
      setStatus(error.message);
      return;
    }

    setStatus(t('security.status.enabled', { defaultValue: 'MFA enabled 🎉' }));
    window.location.reload();
  };

  // Remove handleDisable, use handleUnenroll for AAL2 challenge-based unenroll

  // Handles the full AAL2 challenge flow for disabling MFA
  async function handleUnenroll(factorId: string) {
    // 1) challenge
    const { data: ch, error: chErr } = await supabase.auth.mfa.challenge({ factorId });
    if (chErr) {
      setStatus(chErr.message || t('security.status.challengeError', { defaultValue: 'Challenge error' }));
      return;
    }

    // 2) prompt user for code...
    const code = prompt(t('security.prompt.code', { defaultValue: 'Enter the 6-digit code from your authenticator app' }));
    if (!code) return;

    // 3) verify
    const { error: vErr } = await supabase.auth.mfa.verify({
      factorId,
      challengeId: ch.id,
      code,
    });
    if (vErr) {
      setStatus(vErr.message || t('security.status.verificationFailed', { defaultValue: 'Verification failed' }));
      return;
    }

    // 4) now unenroll
    const { error: uErr } = await supabase.auth.mfa.unenroll({ factorId });
    if (uErr) {
      setStatus(uErr.message || t('security.status.unenrollFailed', { defaultValue: 'Unenroll failed' }));
      return;
    }
    setStatus(t('security.status.removed', { defaultValue: 'MFA factor removed' }));
    setTotpFactor(null);
    setPending(null);
    setCode('');
    // reload the page to reflect the changes
    window.location.reload();
  }

  return (
    <Paper sx={{ p: 4, maxWidth: 450, m: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        {t('security.heading', { defaultValue: 'Security settings' })}
      </Typography>

      {/* ───────── NO FACTOR ENROLLED YET ───────── */}
      {!totpFactor && !pending && (
        <Button variant="contained" onClick={handleEnroll}>
          {t('security.enableTOTP', { defaultValue: 'Enable TOTP MFA' })}
        </Button>
      )}

      {/* ───────── SHOW QR & VERIFY ───────── */}
      {pending && (
        <Stack spacing={2}>
          <Box sx={{ textAlign: 'center' }}>
            {/* Supabase returns an SVG string – embed directly */}
            <img
              src={pending.qr}
              alt="QR code for TOTP MFA"
              style={{ width: '250px', height: '250px', marginBottom: '1rem', margin: '0 auto' }}
            />

            <Typography variant="caption">Secret: {pending.secret}</Typography>
          </Box>
          <TextField
            label={t('security.codeLabel', { defaultValue: '6-digit code' })}
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <Button variant="contained" onClick={handleVerify}>
            {t('security.verifyActivate', { defaultValue: 'Verify & Activate' })}
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={() => handleCancelSetup(pending.id)}
          >
            {t('security.cancelSetup', { defaultValue: 'Cancel setup' })}
          </Button>
        </Stack>

      )}

      {/* ───────── FACTOR ALREADY ENROLLED ───────── */}
      {totpFactor && (
        <Box>
          <Typography sx={{ mb: 2 }}>
            {t('security.enabled', { defaultValue: 'Authenticator-app MFA is enabled.' })}
          </Typography>
          <Button
            variant="outlined"
            color="error"
            onClick={() => handleUnenroll(totpFactor.id)}
          >
            {t('security.disableTOTP', { defaultValue: 'Disable TOTP MFA' })}
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