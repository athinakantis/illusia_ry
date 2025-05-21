import { selectAllCategories } from "../slices/itemsSlice";
import { useAppSelector } from "../store/hooks";
import { useMemo } from "react";


/**
 * React hook that resolves the human‑readable label for a category.
 *
 * Falls back to "Unknown" when the ID isn't found.
 *
 * @example: 
 *      const categoryLabel = useCategoryLabel(item.category_id);
 * @returns      The best available label or `"Unknown"`
 */
export function useCategoryLabel(categoryId: string | null | undefined): string {
  const categories = useAppSelector(selectAllCategories);

  return useMemo(() => {
    if (!categoryId) return 'Unknown';
    const match = categories.find((c) => c.category_id === categoryId);
    return match?.category_name?.trim() || 'Unknown';
  }, [categoryId, categories])
}