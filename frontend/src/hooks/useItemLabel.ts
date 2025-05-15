import { useMemo } from 'react';
import { useAppSelector } from '../store/hooks';
import { selectAllItems } from '../slices/itemsSlice';

/**
 * React hook that resolves the human‑readable label for an item.
 *
 * Falls back to "Unknown" when the ID isn't found.
 *
 * @example: 
 *      const itemLabel = useItemLabel(reservation.item_id);
 * @returns      The best available label or `"Unknown"`
 */
export function useItemLabel(itemId: string | null | undefined): string {
  const items = useAppSelector(selectAllItems);

  return useMemo(() => {
    if (!itemId) return 'Unknown';
    const match = items.find((i) => i.item_id === itemId);
    return match?.item_name?.trim() || 'Unknown';
  }, [itemId, items]);
}
