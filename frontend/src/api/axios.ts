import axios from 'axios';
import { supabase } from '../config/supabase';
import { ApiResponse } from '../types/types';

export const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach the user accesstoken with each request
api.interceptors.request.use(
  async (config) => {
    const { data: sessionData } = await supabase.auth.getSession();

    if (sessionData?.session?.access_token) {
      config.headers.Authorization = `Bearer ${sessionData.session.access_token}`;
    }

    (response: ApiResponse<any>) => response.data;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Map the response to the data
api.interceptors.response.use((response) => response.data);
