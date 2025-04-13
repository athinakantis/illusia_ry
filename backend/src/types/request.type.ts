import { SupabaseClient, User } from '@supabase/supabase-js';
import { Request } from 'express';

export interface CustomRequest extends Request {
  messsage: string;
  supabase: SupabaseClient;
  user: User;
}
