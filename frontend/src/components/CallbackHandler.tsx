import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabase';
import { useTranslatedSnackbar } from './CustomComponents/TranslatedSnackbar/TranslatedSnackbar';
// This component handles the callback from when the user changes their email address
export default function AuthCallbackHandler() {
  const location = useLocation();
  const navigate = useNavigate();
  const { showSnackbar } = useTranslatedSnackbar()

  useEffect(() => {
    const hash = window.location.hash.replace(/^#/, '?');
    const params = new URLSearchParams(hash);
    const a = params.get('access_token');
    const r = params.get('refresh_token');
    const m = params.get('message');

    if (a && r) {
      supabase.auth.setSession({ access_token: a, refresh_token: r }).catch(console.error);  //  
    }
    if (m) {
      showSnackbar({ message: decodeURIComponent(m), variant: 'info' });
    }
    // finally send them into the protected Account page
    navigate('/account', { replace: true });
  }, [location, navigate]);

  return null;
}