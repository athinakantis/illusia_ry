import { Tables } from './supabase';

export interface Item {
  item_id: string;
  category_id: string;
  item_name: string;
  description?: string;
  image_path: string[];
  location: string;
  quantity: number;
  created_at: string;
  visible?: boolean;
}

export interface ItemState {
  items: Item[];
  item: Item | null;
  error: null | string;
  loading: boolean;
  categories: {
    category_id: string;
    category_name: string;
    image_path: string;
  }[];
}
export interface ApiResponse<T> {
  data: T;
  error?: string | Error;
  message: string;
}

export interface FormData {
  item_name: string;
  description: string;
  category_id: string; // Assuming this holds the ID, maybe from a select input
  location: string;
  quantity: number;
  visible?: boolean;
  // Add other relevant fields from your 'items' table if needed
}

export interface Booking {
  booking_id: string;
  user_id: string;
  status: string;
  created_at: string;
  reservations?: Array<{
    reservation_id: string;
    item_id: string;
    start_date: string;
    end_date: string;
    quantity: number;
    created_at: string;
  }>;
}

export interface BookingsState {
  bookings: Booking[];
  userBookings: Booking[];
  booking: BookingWithItems | null;
  error: null | string;
  loading: boolean;
}

export interface Reservation {
  id?: string;
  booking_id?: string;
  created_at?: string;
  item_id: string;
  start_date: string;
  end_date: string;
  quantity: number;
}

export interface ReservationsState {
  // reservations: Reservation[],
  reservations: Reservation[];
  error: null | string;
  loading: boolean;
}

export interface ItemWithQuantity extends Item {
  quantity: number;
}

export interface CartState {
  cart: ItemWithQuantity[];
  selectedDateRange: { start_date: string | null; end_date: string | null };
  // stores the items added to the cart and the date range, on which all the items will be booked
}

export type Result =
  | { severity: 'success'; data: boolean }
  | { severity: 'error'; message: string }
  | { severity: 'warning'; message: string };

export type BookingWithRes = {
  booking_id: string;
  user_id: string;
  status: string;
  created_at: string;
  reservations: Array<{
    reservation_id: string;
    item_id: string;
    start_date: string;
    end_date: string;
    quantity: number;
    created_at: string;
  }>;
};

export type BookingWithItems = {
  booking: Tables<'bookings'>;
  items: Array<
    Partial<Tables<'items'>> &
      Pick<Reservation, 'quantity' | 'start_date' | 'end_date'>
  >;
};

/** Shape of the successful DELETE /bookings/:id response */
export interface DeleteBookingResponse {
  message: string; // "Booking deleted successfully"
  data: Booking[]; // usually a one-element array with the deleted booking
}

export type UpcomingBooking = Tables<'item_reservations'> & {
  booking: Tables<'bookings'> & {
    user: Tables<'users'>;
  };
};

export type NotificationsType =
  | BookingNotifications
  | UserManagementNotifications;

export type BookingNotifications =
  | 'NEW BOOKING'
  | 'BOOKING_REJECTED'
  | 'BOOKING_APPROVED';
export type UserManagementNotifications = 'NEW_USER';

export interface NotificationState {
  userNotifications: Array<Tables<'notifications'>>;
  adminNotifications: AdminNotification[];
  loading: boolean;
  error: null | string;
}

// NOTIFICATIONS
// Metadata types
export type BookingMetaData = {
  booking_id: string;
};
export type BookingApprovedMetadata = {
  booking_id: number;
};

export type BookingRejectedMetadata = {
  booking_id: number;
  reason?: string;
};

export type Notification =
  | {
      type: 'BOOKING_APPROVED';
      metadata: BookingApprovedMetadata;
    }
  | {
      type: 'BOOKING_REJECTED';
      metadata: BookingRejectedMetadata;
    }
  | {
      type: string;
      metadata: JSON; // fallback for unknown types
    };

export type AdminNotification = {
  id: 'pending_bookings_notification' | 'pending_users_notification';
  message: string;
  is_read: boolean;
  link: string;
};
