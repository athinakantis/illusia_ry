import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabase';
import { showCustomSnackbar } from '../components/CustomSnackbar';
// This component handles the callback from when the user changes their email address
export default function AuthCallbackHandler() {
  const location = useLocation();
  const navigate = useNavigate();

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
      showCustomSnackbar(decodeURIComponent(m), 'success');
    }
    // finally send them into the protected Account page
    navigate('/account', { replace: true });
  }, [location, navigate]);

  return null;
}