import { SupabaseClient } from '@supabase/supabase-js';
import { Request } from 'express';

export interface CustomRequest extends Request {
  messsage: string;
  supabase: SupabaseClient;
  /** Decoded JWT payload with custom app_metadata */
  user: import('jsonwebtoken').JwtPayload & { app_metadata?: { role: string }; [key: string]: unknown };
}
