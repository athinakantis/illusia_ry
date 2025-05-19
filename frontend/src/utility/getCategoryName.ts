import { Tables } from "../types/supabase.type";

/**
 * Simple helper to map a category_id to its human‑readable name.
 *
 * @param categories An array of categories (usually from Redux state)
 * @param category_id The id you want to resolve
 * @returns The category’s name, or `"Unknown"` if not found.
 */
export function getCategoryName(
    categories: Array<Pick<Tables<'categories'>, 'category_id' | 'category_name'>>,
    category_id: string | null | undefined,
  ): string {
  if (!category_id) return 'Unknown';

  const match = categories.find((c) => c.category_id === category_id);
  return match && match.category_name ? match.category_name : 'Unknown';
}