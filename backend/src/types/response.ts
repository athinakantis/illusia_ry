import { Database } from 'src/types/supabase';
    
export interface ApiResponse<T> {
    data: T;
    error?: string | Error;
    message: string;
  }

  export type BookingWithRes = {
    booking_id: string
    user_id:    string
    status:     string
    created_at: string
    reservations: Array<{
      reservation_id: string
      item_id:        string
      start_date:     string
      end_date:       string
      quantity:       number
      created_at:     string
    }>
  }

  // Command + Click "user_with_roles_view" to see the view structure
  export type UserWithRole = Database['public']['Views']['user_with_roles_view']['Row'];