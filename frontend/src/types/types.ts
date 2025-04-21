export interface Item {
  item_id: string,
  category_id: string,
  item_name: string,
  description?: string,
  image_path: string,
  location: string,
  quantity: number,
  created_at: string
}

export interface ItemState {
  items: Item[],
  item: Item | null,
  error: null | string,
  loading: boolean,
  categories: {
    category_id: string,
    category_name: string,
    image_path: string
  }[]
}
export interface ApiResponse<T> {
  data: T;
  error?: string | Error;
  message: string;
}

export interface ItemAndQuantity {
  itemInCart: Item,
  quantityOfItem: number,
}

export interface CartState {
  cart: ItemAndQuantity[];
}

export interface FormData {
  item_name: string;
  description: string;
  category_id: string; // Assuming this holds the ID, maybe from a select input
  location: string;
  quantity: number;
  // Add other relevant fields from your 'items' table if needed
}

export interface BookingResponse {
    booking_id: string;
    user_id:    string;
    status:     'pending' | 'approved' | 'cancelled' | string;
    created_at: string;
  }

  /**
 * The uniform wrapper every endpoint uses.
 */
export interface ApiEnvelope<T> {
  /** A human‑readable status or success message */
  message: string;
  /** The actual payload for this call */
  data: T;
}

/**
 * Booking shape as returned by updateBookingStatus.
 */
export interface Booking {
  booking_id: string;
  user_id:    string;
  status:     string;
  created_at: string; // ISO timestamp
}

/**
 * Response from PATCH /bookings/:id
 */
export type UpdateBookingStatusResponse = ApiEnvelope<Booking>;

/**
 * A single booking plus its reservations, as returned by getUserBookings.
 */
export interface UserBooking {
  user_id:     string;
  booking_id:  string;
  reservations: Array<{
    id:         string;
    booking_id: string;
    item_id:    string;
    start_date: string;
    end_date:   string;
    quantity:   number;
    created_at: string;
  }> | null;
}

/**
 * Response from GET /reservations/user/:userId
 */
export type GetUserBookingsResponse = ApiEnvelope<UserBooking[]>;