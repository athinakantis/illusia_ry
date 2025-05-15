import { useMemo } from 'react';
import { useAppSelector } from '../store/hooks';
import { selectAllUsers } from '../slices/usersSlice';

/**
 * React hook that resolves a user's display name (or email fallback)
 * directly from Redux state.
 *
 * @param userId UUID of the user you want to resolve
 * @returns      The best available label or `"Unknown"`
 *
 * Usage:
 *   @example const userName = useUserName(booking.user_id);
 */
export function useUserName(userId: string | null | undefined): string {
  // Pull the users array from the Redux store
  const users = useAppSelector(selectAllUsers);

  // Compute the label; memoised so it doesn't recalc on every render
  return useMemo(() => {
    if (!userId) return 'Unknown';
    const match = users.find((u) => u.user_id === userId);
    if (!match) return 'Unknown';
    return match.display_name?.trim() || match.email?.trim() || 'Unknown';
  }, [userId, users]);
}