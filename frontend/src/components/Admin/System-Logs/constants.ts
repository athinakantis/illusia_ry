

/**
 * List of table names for filtering and display.
 */
export const TABLE_NAMES = [
  'users',
  'roles',
  'user_roles',
  'tags',
  'item_tags',
  'categories',
  'items',
  'bookings',
  'item_reservations',
  'system_logs',
] as const;

/**
 * Plural labels for each table.
 */
export const TABLE_LABELS: Record<string, string> = {
  users: 'Users',
  user_roles: 'User Roles',
  item_reservations: 'Item Reservations',
  items: 'Items',
  categories: 'Categories',
  bookings: 'Bookings',
  system_logs: 'System Logs',
  roles: 'Roles',
  tags: 'Tags',
  item_tags: 'Item Tags',
};

/**
 * Singular labels for actions.
 */
export const SINGULAR_TABLE_LABELS: Record<string, string> = {
  users: 'User',
  roles: 'Role',
  user_roles: 'User Role',
  tags: 'Tag',
  item_tags: 'Item Tag',
  categories: 'Category',
  items: 'Item',
  bookings: 'Booking',
  item_reservations: 'Item Reservation',
  system_logs: 'System Log',
};

/**
 * Allowed action types for filtering.
 */
export const ACTION_TYPES = ['INSERT', 'UPDATE', 'DELETE'] as const;