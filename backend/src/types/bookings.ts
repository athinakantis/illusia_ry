import { Tables } from './supabase';

export type UpcomingBooking = Tables<'item_reservations'> & {
  booking: Tables<'bookings'> & {
    user: Tables<'users'>;
  };
};


export type BookingWithItems = {
  booking: Tables<'bookings'>;
  items: Array<Partial<Tables<'items'>> & Pick<Tables<'item_reservations'>, 'id' | 'quantity' | 'start_date' | 'end_date'>>
};