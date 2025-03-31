import { useEffect, useState } from "react";
import { supabase } from "../config/supabase";

export const ProtectedData = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function fetchProtectedData() {
      // Get the current session from Supabase
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        console.error(sessionError);
        return;
      }
      const session = sessionData.session;
      if (session) {
        // Call your NestJS endpoint with the access token in the Authorization header
        const response = await fetch('http://localhost:5001/api/protected', {
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
          },
        });
        const result = await response.json();
        setData(result);
      }
    }
    fetchProtectedData();
  }, []);

  if (!data) return <p>Loading protected data...</p>;
  return <pre>{JSON.stringify(data, null, 2)}</pre>;
};