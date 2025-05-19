import { Role } from "../context/AuthProvider";

export interface User {
  user_id: string;
  display_name: string;
  email: string;
  role_title?: string;
  user_status: string;
}

export interface UsersState {
  users: User[]
  user: User | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  loading: boolean;
}
export type fetchUserRole = {
  data: {
    role: Role;
  }
  message: string;
  error?: string| undefined;
}

export interface userApiResponse {
  message: string;
  data: User[];
}
