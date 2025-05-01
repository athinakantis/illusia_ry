import { Tables } from './supabase';

export type BookingWithItems = {
  booking: Tables<'bookings'>;
  items: Array<Partial<Tables<'items'>> & Pick<Tables<'item_reservations'>, 'quantity' | 'start_date' | 'end_date'>>
};