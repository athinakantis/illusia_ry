import { useEffect, useState, ReactNode } from "react";
import { AuthContext, AuthContextType } from "./AuthContext";
import { supabase } from "../config/supabase";

function extractRoleFromSession(session: AuthContextType["session"]): string | null {
  try {
    const token = session?.access_token;
    if (!token) return null;
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload?.app_metadata?.role ?? null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthContextType["session"]>(null);
  const [user, setUser] = useState<AuthContextType["user"]>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setRole(extractRoleFromSession(session));
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setRole(extractRoleFromSession(session));
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = {
    session,
    user,
    role,
    loading,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}