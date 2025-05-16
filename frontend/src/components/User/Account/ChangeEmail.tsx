import { useState } from 'react';
import { supabase } from '../../../config/supabase'; // adjust path if needed
import { Box, Button, Stack, TextField, Typography } from '@mui/material';

interface ChangeEmailProps {
  initialEmail?: string | null;
  onDone?: () => void;
}

export default function ChangeEmail({
  initialEmail,
  onDone,
}: ChangeEmailProps) {
  const [email, setEmail] = useState(initialEmail ?? '');
  const [status, setStatus] = useState<string>();
  const [loading, setLoading] = useState(false);

  // Ensure user has AAL2 (MFA step‑up) before updating sensitive credentials
  const ensureAal2 = async (): Promise<true | string> => {
    const { data } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    const currentLevel = data?.currentLevel;
    if (currentLevel === 'aal2') return true;
    // Find first verified TOTP factor
    const { data: factors } = await supabase.auth.mfa.listFactors();
    const totp = factors?.all.find(
      (f) => f.factor_type === 'totp' && f.status === 'verified',
    );
    if (!totp)
      return 'Please verify your authenticator app before changing email.';
    const { data: challenge } = await supabase.auth.mfa.challenge({
      factorId: totp.id,
    });
    if (!challenge) return 'Challenge could not be initiated, please try again.';
    const code = prompt(
      'Enter your 6-digit authenticator code to confirm email change:',
    );
    if (!code) return 'Email change cancelled.';
    const { error } = await supabase.auth.mfa.verify({
      factorId: totp.id,
      challengeId: challenge.id,
      code,
    });
    return error ? error.message : true;
  };

  const handleSendChange = async () => {
    const ok = await ensureAal2();
    if (ok !== true) {
      setStatus(ok);
      return;
    }

    setLoading(true);
    setStatus('Sending confirmation email…');
    // Call Supabase to update the email
    const { error } = await supabase.auth.updateUser({ email },
      { emailRedirectTo: `${window.location.origin}/auth/callback` } 
    );

    setLoading(false);
    if (error) {
      setStatus(error.message);
    } else {
      setStatus(
        'Confirmation link sent to your new email. Please check your inbox.',
      );
      onDone?.();
    }
  };

  return (
    <Box sx={{ width: '100%', mt: 2 }}>
      <Stack spacing={2}>
        <TextField
          label="New email address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
        />
        <Button
          variant="contained"
          onClick={handleSendChange}
          disabled={!email || loading}
        >
          {loading ? 'Sending…' : 'Update email'}
        </Button>
        {status && (
          <Typography variant="caption" color="text.secondary">
            {status}
          </Typography>
        )}
      </Stack>
    </Box>
  );
}
