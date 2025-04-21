// src/types/user-booking.ts  (new file)

export interface ReservationRow {
    id:          string;
    booking_id:  string;
    item_id:     string;
    start_date:  string;
    end_date:    string;
    quantity:    number;
    created_at:  string | null;   // ← nullable in the payload!
  }
  
  export interface UserBooking {
    user_id:    string;
    booking_id: string;
    status?:    string;           // present after status update
    created_at?: string | null;   // present in Booking table rows
    reservations: ReservationRow[] | null;
  }