import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  getUserBookings,
  updateBookingStatus,
  updateReservation,
  deleteReservations,
  UserBooking,

} from '../api/bookings';
import { BookingResponse } from '../types/types';
import { Tables } from '../types/supabase.types';

// Extend UserBooking with optional BookingResponse fields
type BookingWithStatus = UserBooking & Partial<BookingResponse>;

/* ------------------------------------------------------------------ */
/* 1.  Async thunks                                                   */
/* ------------------------------------------------------------------ */

// GET /reservations/user/:userId
export const fetchUserBookings = createAsyncThunk<
  BookingWithStatus[],                    // return type
  string,                           // userId
  { rejectValue: string }
>(
  'bookings/fetchUserBookings',
  async (userId, { rejectWithValue }) => {
    try {
      const res = await getUserBookings(userId);    // AxiosResponse<ApiEnvelope<UserBooking[]>>
      return res.data;                         // unwrap to plain array
    } catch (err) {
      return rejectWithValue(
        err instanceof Error ? err.message : 'Failed to fetch bookings',
      );
    }
  }
);

// PATCH /bookings/:bookingId  (status)
export const patchBookingStatus = createAsyncThunk<
  BookingResponse,                                // updated booking row
  { bookingId: string; status: string },
  { rejectValue: string }
>(
  'bookings/patchStatus',
  async ({ bookingId, status }, { rejectWithValue }) => {
    try {
      const res = await updateBookingStatus(bookingId, status);
      return res.data.data;                         // unwrap
    } catch (err) {
      return rejectWithValue(
        err instanceof Error ? err.message : 'Failed to update status',
      );
    }
  }
);

// PATCH reservation row
export const patchReservation = createAsyncThunk<
  Tables<'item_reservations'>,                    // updated reservation
  {
    bookingId: string;
    reservationId: string;
    payload: Partial<{
      item_id: string;
      start_date: string;
      end_date: string;
      quantity: number;
    }>;
  },
  { rejectValue: string }
>(
  'bookings/patchReservation',
  async (args, { rejectWithValue }) => {
    try {
      const res = await updateReservation(
        args.bookingId,
        args.reservationId,
        args.payload,
      );
      return res.data.data;                         // unwrap
    } catch (err) {
      return rejectWithValue(
        err instanceof Error ? err.message : 'Failed to update reservation',
      );
    }
  }
);

// DELETE reservations
export const removeReservations = createAsyncThunk<
  { bookingId: string; deletedIds: string[] },
  { bookingId: string; reservationIds: string[] },
  { rejectValue: string }
>(
  'bookings/deleteReservations',
  async ({ bookingId, reservationIds }, { rejectWithValue }) => {
    try {
      await deleteReservations(bookingId, reservationIds);
      return { bookingId, deletedIds: reservationIds };
    } catch (err) {
      return rejectWithValue(
        err instanceof Error ? err.message : 'Failed to delete reservations',
      );
    }
  }
);

/* ------------------------------------------------------------------ */
/* 2.  State & slice                                                  */
/* ------------------------------------------------------------------ */

export interface BookingsState {
  bookings: BookingWithStatus[];
  loading:  boolean;
  error:    string | null;
}

const initialState: BookingsState = {
  bookings: [],
  loading:  false,
  error:    null,
};

export const bookingsSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // fetchUserBookings
    builder
      .addCase(fetchUserBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchUserBookings.fulfilled,
        (state, action: PayloadAction<BookingWithStatus[]>) => {
          state.loading = false;
          state.bookings = action.payload;
        }
      )
      .addCase(fetchUserBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Unknown error';
      });

    // patchBookingStatus
    builder.addCase(
      patchBookingStatus.fulfilled,
      (state, action: PayloadAction<BookingResponse>) => {
        const booking = state.bookings.find(
          (b) => b.booking_id === action.payload.booking_id
        );
        if (booking) {
          // Update just the status field
          booking.status = action.payload.status;
        }
      }
    );

    // patchReservation
    builder.addCase(
      patchReservation.fulfilled,
      (state, action: PayloadAction<Tables<'item_reservations'>>) => {
        const updated = action.payload;
        const booking = state.bookings.find(
          (b) => b.booking_id === updated.booking_id
        );
        if (!booking) return;
        if (!booking.reservations) {
          booking.reservations = [];
        }
        const i = booking.reservations.findIndex((r) => r.id === updated.id);
        if (i === -1) {
          booking.reservations.push(updated);
        } else {
          booking.reservations[i] = updated;
        }
      }
    );

    // removeReservations
    builder.addCase(
      removeReservations.fulfilled,
      (state, action: PayloadAction<{ bookingId: string; deletedIds: string[] }>) => {
        const booking = state.bookings.find(
          (b) => b.booking_id === action.payload.bookingId
        );
        if (!booking || !booking.reservations) return;
        booking.reservations = booking.reservations.filter(
          (r) => !action.payload.deletedIds.includes(r.id)
        );
      }
    );
  },
});

export default bookingsSlice.reducer;

/* ------------------------------------------------------------------ */
/* 3.  Selectors                                                      */
/* ------------------------------------------------------------------ */

export const selectBookings = (state: { bookings: BookingsState }) =>
  state.bookings.bookings;
export const selectBookingsError = (state: { bookings: BookingsState }) =>
  state.bookings.error;
export const selectBookingsLoading = (state: { bookings: BookingsState }) =>
  state.bookings.loading;