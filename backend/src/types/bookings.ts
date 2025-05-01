import { Tables } from './supabase';

export type UpcomingBooking = Tables<'item_reservations'> & {
  booking: Tables<'bookings'> & {
    user: Tables<'users'>;
  };
};