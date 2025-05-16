import { useState } from 'react';
import { Box, Button, Paper, Stack, TextField, Typography } from '@mui/material';
import { supabase } from '../../config/supabase';

export default function PhoneLogin() {
  const [phone, setPhone]   = useState('');
  const [code,  setCode]    = useState('');
  const [step,  setStep]    = useState<'enterPhone' | 'enterCode'>('enterPhone');
  const [status, setStatus] = useState<string>();

  /** 1) Send the OTP */
  const requestOtp = async () => {
    setStatus('Sending code…');
    const { error } = await supabase.auth.signInWithOtp({ phone });
    if (error) return setStatus(error.message);
    setStatus('Check your SMS for the 6-digit code');
    setStep('enterCode');
  };

  /** 2) Verify the OTP */
  const verifyOtp = async () => {
    setStatus('Verifying…');
    const { error } = await supabase.auth.verifyOtp({
      phone,
      token: code,
      type: 'sms',      // use 'phone_change' when confirming an updateUser flow
    });
    if (error) return setStatus(error.message);
    setStatus('Logged in 🎉 – redirecting…');
    window.location.href = '/';   // or however you redirect after login
  };

  return (
    <Paper sx={{ p: 4, maxWidth: 400, m: 'auto' }}>
      <Typography variant="h5" gutterBottom>Phone Login</Typography>

      {step === 'enterPhone' && (
        <Stack spacing={2}>
          <TextField
            label="Mobile number"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            helperText="Use E.164 format, e.g. +358401234567"
          />
          <Button variant="contained" onClick={requestOtp}>
            Send Code
          </Button>
        </Stack>
      )}

      {step === 'enterCode' && (
        <Stack spacing={2}>
          <TextField
            label="6-digit code"
            value={code}
            onChange={e => setCode(e.target.value)}
          />
          <Button variant="contained" onClick={verifyOtp}>
            Verify & Log In
          </Button>
        </Stack>
      )}

      {status && <Box mt={2}><Typography color="text.secondary">{status}</Typography></Box>}
    </Paper>
  );
}