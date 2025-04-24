import { Tables } from 'src/types/supabase';

// Combination of user data and role title
export type AdminUserRow = Pick<
  Tables<'users'>,
  'user_id' | 'display_name' | 'email' | 'user_status'
> | {
  role_title: string | null; // Added based on user_with_roles_view
};

/*
Example structure (from user_with_roles_view):

[
    {
      "user_id": "b6ff48fa-14bf-4544-8c7d-88f7fe5b3246",
      "display_name": null,
      "email": "test.user@gmail.com",
      "user_status": "pending",
      "role_title": "Unapproved"
    }
]
*/
