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



export interface FormData {
  item_name: string;
  description: string;
  category_id: string; // Assuming this holds the ID, maybe from a select input
  location: string;
  quantity: number;
  // Add other relevant fields from your 'items' table if needed
}

export interface Booking {
  booking_id: string,
  user_id: string,
  status: string,
  created_at: string,
  reservations?: Array<{
    reservation_id: string
    item_id: string
    start_date: string
    end_date: string
    quantity: number
    created_at: string
  }>
}

export interface BookingsState {
  bookings: Booking[],
  error: null | string,
  loading: boolean
}

export interface Reservation {
  id?: string,
  booking_id?: string,
  created_at?: string,
  item_id: string,
  start_date: string,
  end_date: string,
  quantity: number,
}

export interface ReservationsState {
  // reservations: Reservation[],
  reservations: Reservation[],
  error: null | string,
  loading: boolean
}

export interface ItemWithQuantity extends Item {
  quantity: number,
}

export interface CartState {
  cart: ItemWithQuantity[];
  selectedDateRange: { start_date: string | null, end_date: string | null }
  // stores the items added to the cart and the date range, on which all the items will be booked
}

export type Result =
  | { severity: 'success'; data: boolean }
  | { severity: 'error'; message: string }
  | { severity: 'warning'; message: string };

export type BookingWithRes = {
  booking_id: string
  user_id: string
  status: string
  created_at: string
  reservations: Array<{
    reservation_id: string
    item_id: string
    start_date: string
    end_date: string
    quantity: number
    created_at: string
  }>
}

/** Shape of the successful DELETE /bookings/:id response */
export interface DeleteBookingResponse {
  message: string;    // "Booking deleted successfully"
  data: Booking[];    // usually a one-element array with the deleted booking
}
