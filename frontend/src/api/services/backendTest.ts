import axios from 'axios';

import { useSupabaseClient } from '@supabase/auth-helpers-react';


const testConnection = async () => {
    const supabase = useSupabaseClient();
    const { data: { session } } = await supabase.auth.getSession();
    const access_token = session?.access_token;

    axios.get('http://localhost:3001/test/supabase', {
        headers: {
          'Authorization': `Bearer ${access_token}`,  // access_token retrieved from Supabase session
        },
      })
        .then((response) => {
            console.log('Response:', response.data);
        })
}