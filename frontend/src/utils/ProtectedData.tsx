import { useEffect, useState } from 'react';
import { supabase } from '../config/supabase';
import { fetchProtectedData } from '../api/services/endpoints';

const ProtectedData = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        console.error(sessionError);
        return;
      }
      const session = sessionData.session;
      if (session) {
        try {
          const result = await fetchProtectedData(session.access_token);
          setData(result);
        } catch (error) {
          console.error('Error fetching protected data:', error);
        }
      }
    }
    fetchData();
  }, []);

  if (!data) return <p>Loading protected data...</p>;
  return <pre>{JSON.stringify(data, null, 2)}</pre>;
};

export default ProtectedData;