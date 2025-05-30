import { useEffect, useState, useRef, ReactNode } from "react";
import { AuthContext, AuthContextType } from "./AuthContext";
import { supabase } from "../config/supabase";
import { usersApi } from "../api/users";

export type Role = 'Unapproved' | 'User' | 'Admin' | 'Head Admin' | 'Banned'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthContextType["session"]>(null);
  const [user, setUser] = useState<AuthContextType["user"]>(null);
  const [role, setRole] = useState<AuthContextType['role']>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);


  // Track the last user ID we fetched for, to avoid duplicate calls
  const lastFetchedUserId = useRef<string | null>(null);

  useEffect(() => {
    const loadRole = async (userId: string) => {
      try {
        const { data } = await usersApi.getUserWithRoleById(userId);
        setRole(data?.role as Role);
      } catch (err) {
        console.error('Error loading role in AuthProvider:', err);
        setRole('Unapproved');
      }
    };

    if (session?.user?.id && session.user.id !== lastFetchedUserId.current) {
      lastFetchedUserId.current = session.user.id;
      loadRole(session.user.id);
    }

    if (!session) {
      setRole(undefined);
      lastFetchedUserId.current = null;
    }
  }, [session]);

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