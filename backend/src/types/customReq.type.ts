import { SupabaseClient, User } from '@supabase/supabase-js';
import { Request } from 'express';

export interface CustomRequest extends Request {
  supabase: SupabaseClient;
  user: User;
}
