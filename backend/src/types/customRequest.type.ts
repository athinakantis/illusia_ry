import { SupabaseClient } from "@supabase/supabase-js";

export interface AuthenticatedRequest extends Request {
  supabase: SupabaseClient;
}