import axios from 'axios';
import { supabase } from '../config/supabase';

export const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    async (config) => {
      const { data: sessionData } = await supabase.auth.getSession();
  
      if (sessionData?.session?.access_token) {
        config.headers.Authorization = `Bearer ${sessionData.session.access_token}`;
      }
  
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );