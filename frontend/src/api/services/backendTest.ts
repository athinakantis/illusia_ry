import axios from 'axios';

export const testConnection = async () => {

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