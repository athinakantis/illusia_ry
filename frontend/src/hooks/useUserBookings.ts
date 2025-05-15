import { useMemo } from 'react';
import { useAppSelector } from '../store/hooks';
import { selectBookingById } from '../slices/bookingsSlice';
import { useUserName } from './useUserName';

interface UseUserNameForBookingResult {
  name: string;
}

/**
 * Hook that returns the display name for the user attached to a given booking,
 * using data from the Redux store (booking slice + user slice).
 */
export function useUserNameForBooking(bookingId: string): UseUserNameForBookingResult {
  // Select the booking from the Redux store
  const booking = useAppSelector(state => selectBookingById(state, bookingId));

  // Extract user_id (or null if not found)
  const userId = booking?.user_id ?? null;

  // Use existing hook to get the display name
  const name = useUserName(userId);

  return useMemo(() => ({
    name: name || 'Unknown',
  }), [name]);
}
