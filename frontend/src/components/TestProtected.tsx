import { useEffect, useState } from 'react';
import { fetchProtectedData } from '../api/services/endpoints';
import { supabase } from '../config/supabase';
import { DynamicTable } from './DynamicTable';
export interface Item{
  category_id: string;
  created_at: Date;
  description: string;
  image_path: string;
  item_id: string;
  item_name: string;
  location: string;
  quantity: number;
}
export interface ProtectedResponse {
  data: Item[]; // Replace with more specific type if known
  success: boolean;
}

const TestProtected = () => {
    const [response, setResponse] = useState<ProtectedResponse | null>(null);
  
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
            setResponse(result);
          } catch (error) {
            console.error('Error fetching protected data:', error);
          }
        }
      }
      fetchData();
    }, []);
  if (response === null) return <p>Loading protected data...</p>;
  return (
    <div>
      <h1>Protected Route Test</h1>
      <p>If you see data below, the protected route is working:</p>
      <DynamicTable data={response.data} />
    </div>
  );
};

export default TestProtected;