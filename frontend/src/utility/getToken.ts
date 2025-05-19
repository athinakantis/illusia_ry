

// Adjust the import path to your Supabase client instance as needed
import { supabase } from "../config/supabase";

/**
 * Retrieves the current user's access token from the active Supabase session.
 * @returns The access token string, or null if no session is found.
 * @throws Error if fetching the session fails.
 */
export async function getAccessToken(): Promise<string | null> {
  // For Supabase JS v2
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();
console.log("session", session);
  console.log("token", session?.access_token);
  console.log("refresh", session?.refresh_token);
  console.log("user", session?.user);
  if (error) {
    throw new Error(error.message);
  }

  return session?.access_token ?? null;
}