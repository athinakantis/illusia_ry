// utils/bookings.ts
import { parseISO, differenceInDays } from 'date-fns';
import { UpcomingBooking } from '../types/types';

/*----------- Types ----------------*/
export interface Reservation {
  id: string;
  booking_id: string;
  item_id: string;
  quantity?: number;
  start_date: string;
  end_date: string;
}
export interface Booking {
  booking_id: string;
  user_id: string;
  status: string;
  created_at: string;
}
export interface User {
  user_id: string;
  display_name?: string;
  email?: string;
}
export interface Item {
  item_id: string;
  item_name: string;
}

// 1) Compute the day-difference between two ISO dates
export function computeDuration(startDate: string, endDate: string): number {
  // e.g. "2023-10-01" → "2023-10-02" === 1
  return differenceInDays(parseISO(endDate), parseISO(startDate));
}

// 2) Group reservations by booking_id
export function groupReservationsByBooking(
  reservations: Reservation[],
): Record<string, Reservation[]> {
  return reservations.reduce((acc, r) => {
    (acc[r.booking_id] = acc[r.booking_id] || []).push(r);
    return acc;
  }, {} as Record<string, Reservation[]>);
}

// 3) Build a display‐ready overview for each booking
export interface BookingOverview {
  booking_id: string;
  userName: string;
  itemDetails: { name: string; quantity: number }[];
  totalItems: number;
  duration: number;
  range: string;
  status: string;
  createdAt: string;
}
export function buildBookingOverviews(
  bookings: Booking[],
  reservations: Reservation[],
  users: User[],
  items: Item[],
): BookingOverview[] {
  const grouped = groupReservationsByBooking(reservations);

  return bookings.map((b) => {
    // find user
    const u = users.find((u) => u.user_id === b.user_id);
    const userName = u?.display_name ?? u?.email ?? '—';

    // lookup all this booking's reservations
    const resForBooking = grouped[b.booking_id] || [];

    // detail each item
    const itemDetails = resForBooking.map((r) => {
      const it = items.find((i) => i.item_id === r.item_id);
      return { name: it?.item_name ?? '—', quantity: r.quantity ?? 1 };
    });

    // total up quantities
    const totalItems = itemDetails.reduce((sum, d) => sum + d.quantity, 0);

    // compute overall date range
    const starts = resForBooking.map((r) => r.start_date).sort();
    const ends = resForBooking.map((r) => r.end_date).sort();
    const start = starts[0] ?? '';
    const end = ends[ends.length - 1] ?? '';
    const duration = start && end ? computeDuration(start, end) : 0;
    const range = start && end ? `${start} - ${end}` : '—';

    return {
      booking_id: b.booking_id,
      userName,
      itemDetails,
      totalItems,
      duration,
      range,
      status: b.status,
      createdAt: b.created_at,
    };
  });
}

export function filterUniqueBookings(bookings: UpcomingBooking[]): UpcomingBooking[] {
  const seen = new Set<string>();
  return bookings.filter((booking) => {
    if (seen.has(booking.booking_id)) {
      return false;
    }
    seen.add(booking.booking_id);
    return true;
  });
}