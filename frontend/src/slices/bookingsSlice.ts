import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Booking, BookingsState } from '../types/types';
import { RootState } from '../store/store';
import { bookingsApi } from '../api/bookings';
import axios from 'axios';

const initialState: BookingsState = {
  bookings: [],
  userBookings: [],
  booking: null,
  loading: false,
  error: null as string | null,
};

export const fetchAllBookings = createAsyncThunk(
  'bookings/fetchAllBookings',
  async () => {
    const response = await bookingsApi.getAllBookings();
    return response.data;
  },
);

export const fetchBooking = createAsyncThunk(
  'bookings/fetchBooking',
  async (id: string) => {
    const response = await bookingsApi.getBooking(id);
    return response.data;
  },
);

/**
 * Delete a booking by ID
 * @param id - The ID of the booking to delete
 * @returns A promise that resolves to the backend response
 */
export const deleteBooking = createAsyncThunk<
  Booking,
  string,
  { rejectValue: string }
>('bookings/deleteBooking', async (id, { rejectWithValue }) => {
  try {
    const { data, error, message } = await bookingsApi.removeBooking(id);
    if (error) {
      return rejectWithValue(message);
    }

    return data;
  } catch (error: unknown) {
    if (axios.isAxiosError<{ message: string }>(error)) {
      return rejectWithValue(error.response?.data?.message ?? 'Network error');
    }
    return rejectWithValue('Unknown error');
  }
});
/**
 * Fetch all bookings for a specific user (including reservations)
 * @param userId - The ID of the user whose bookings to fetch
 * @returns A promise that resolves to an array of bookings with reservations
 */
export const fetchUserBookings = createAsyncThunk<
  Booking[],
  string,
  { rejectValue: string }
>('bookings/fetchUserBookings', async (userId, { rejectWithValue }) => {
  try {
    const { data, error, message } = await bookingsApi.getUserBookings(userId);
    if (error) return rejectWithValue(message);
    return data;
  } catch (error: unknown) {
    // now error is unknown, so we narrow it:
    if (axios.isAxiosError<{ message: string }>(error)) {
      return rejectWithValue(error.response?.data?.message ?? 'Network error');
    }
    return rejectWithValue('Unknown error');
  }
});
/**
 * Change the status of a booking
 * @param id - The ID of the booking to change
 * @param status - The new status to set for the booking(either "approved" or "rejected")
 * @returns A promise that resolves to the updated booking
 */
export const updateBookingStatus = createAsyncThunk<
  Booking,
  { id: string; status: 'approved' | 'rejected' },
  { rejectValue: string }
>(
  'bookings/updateBookingStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const { data, error, message } = await bookingsApi.updateBookingStatus(
        id,
        status,
      );
      if (error) return rejectWithValue(message);
      return data;
    } catch (error: unknown) {
      if (axios.isAxiosError<{ message: string }>(error)) {
        return rejectWithValue(
          error.response?.data?.message ?? 'Network error',
        );
      }
      return rejectWithValue('Unknown error');
    }
  },
);

export const addBooking = createAsyncThunk<
  Booking,
  object,
  { rejectValue: string }
>('bookings/rpc', async (newBooking, { rejectWithValue }) => {
  try {
    const response = await bookingsApi.createBooking(newBooking);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError<{ message: string }>(error)) {
      return rejectWithValue(error.response?.data?.message ?? 'Network error');
    }
    return rejectWithValue('Unknown error');
  }
});

export const bookingsSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAllBookings.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchAllBookings.fulfilled, (state, action) => {
      state.bookings = action.payload;
      state.loading = false;
    });
    builder.addCase(fetchAllBookings.rejected, (state) => {
      state.error = 'Could not fetch bookings';
      state.loading = false;
    });
    builder.addCase(fetchBooking.pending, (state) => {
      state.error = null;
      state.loading = true;
    });
    builder.addCase(fetchBooking.fulfilled, (state, action) => {
      state.booking = action.payload;
      state.loading = false;
    });
    builder.addCase(fetchBooking.rejected, (state) => {
      state.error = 'Could not fetch booking';
      state.loading = false;
    });

    // handle fetching bookings for a specific user
    builder.addCase(fetchUserBookings.pending, (state) => {
      state.error = null;
      state.loading = true;
    });
    builder.addCase(fetchUserBookings.fulfilled, (state, action) => {
      state.loading = false;
      state.userBookings = action.payload;
    });
    builder.addCase(fetchUserBookings.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload ?? 'Could not fetch user bookings';
    });

    builder.addCase(addBooking.fulfilled, (state, action) => {
      localStorage.removeItem('savedCart');
      state.bookings.push(action.payload);
      state.loading = false;
    });
    builder.addCase(addBooking.rejected, (state, action) => {
      state.error = action.payload ?? 'Failed to add item';
      state.loading = false;
    });
    //────── handle changing booking status ─────────────────────
    builder.addCase(updateBookingStatus.pending, (state) => {
      state.error = null;
    });
    builder.addCase(updateBookingStatus.fulfilled, (state, action) => {
      const updatedBooking = action.payload;
      const index = state.bookings.findIndex(
        (booking) => booking.booking_id === updatedBooking.booking_id,
      );
      if (index !== -1) {
        state.bookings[index] = updatedBooking;
      }
      state.loading = false;
    });
    builder.addCase(updateBookingStatus.rejected, (state, action) => {
      state.error = action.payload ?? 'Could not change booking status';
      state.loading = false;
    });

    // handle deleting a booking
    builder.addCase(deleteBooking.pending, (state) => {
      state.error = null;
    });
    builder.addCase(deleteBooking.fulfilled, (state, action) => {
      const deletedId = action.meta.arg; // id passed to the thunk
      state.bookings = state.bookings.filter(
        (booking) => booking.booking_id !== deletedId,
      );
      state.loading = false;
    });
    builder.addCase(deleteBooking.rejected, (state, action) => {
      state.error = action.payload ?? 'Could not delete booking';
      state.loading = false;
    });
  },
});

export const selectAllBookings = (state: RootState) => state.bookings.bookings;

export const selectUserBookings = (state: RootState) =>
  state.bookings.userBookings;

export const selectBooking = (state: RootState) => state.bookings.booking;

export const selectBookingsLoading = (state: RootState) =>
  state.bookings.loading;
export const selectBookingsError = (state: RootState) => state.bookings.error;
export const selectBookingsCount = (state: RootState) =>
  state.bookings.bookings.length;
export const selectBookingsByUserId = (userId: string) => (state: RootState) =>
  state.bookings.bookings.filter((booking) => booking.user_id === userId);

export const selectBookingDates = (booking_id: string) => (state: RootState) => {
  const bookingWihId = state.bookings.userBookings.find((booking) => booking.booking_id === booking_id);

  if (bookingWihId?.reservations)
    return { start_date: bookingWihId?.reservations[0].start_date, end_date: bookingWihId?.reservations[0].end_date }
  else return;
}


export default bookingsSlice.reducer;
