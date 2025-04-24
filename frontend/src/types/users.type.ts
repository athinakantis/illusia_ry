export interface User {
  user_id: string;
  display_name: string;
  email: string;
  role?: string;
  user_status: string;
}

export interface UsersState {
  users: User[]
  user: User | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  loading: boolean;
}

export interface userApiResponse {
  message: string;
  data: User[];
}