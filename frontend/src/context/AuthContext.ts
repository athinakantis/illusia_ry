import { createContext } from "react";
import { Session, User } from "@supabase/supabase-js";
import { Role } from './AuthProvider';

export interface AuthContextType {
  session: Session | null;
  user: User | null;
  role: Role | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);