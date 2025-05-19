import { Tables } from "./supabase";
export type AdminUserRow = Pick<Tables<'users'>, 'user_id' | 'display_name' | 'email' | 'user_status'> | {
    role_title: string | null;
};
