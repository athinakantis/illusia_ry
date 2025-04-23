import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Booking, BookingsState, } from "../types/types";
import { RootState } from "../store/store";
import { bookingsApi } from "../api/bookings";
import axios from "axios";



  
const initialState: BookingsState = {
    bookings: [],
    loading: false,
    error: null as string | null
}

export const fetchAllBookings = createAsyncThunk(
    'bookings/fetchAllBookings',
    async () => {
        const response = await bookingsApi.getAllBookings();
        return response.data;
    }
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
>(
  'bookings/deleteBooking',
  async (id, { rejectWithValue }) => {
    try {
      const { data, error, message } = await bookingsApi.removeBooking(id);
      if (error) {
        return rejectWithValue(message);
      }

      return data;
    } catch (error: unknown) {
      if (axios.isAxiosError<{ message: string }>(error)) {
        return rejectWithValue(
          error.response?.data?.message ?? 'Network error'
        );
      }
      return rejectWithValue('Unknown error');
    }
    
  }
);
/**
 * Fetch all bookings for a specific user (including reservations)
 * @param userId - The ID of the user whose bookings to fetch
 * @returns A promise that resolves to an array of bookings with reservations
 */
export const fetchUserBookings = createAsyncThunk<
    Booking[],
  string,
  { rejectValue: string }
>(
  'bookings/fetchUserBookings',
  async (userId, { rejectWithValue }) => {
    try {
        const { data, error, message } = await bookingsApi.getUserBookings(userId);
        if (error) return rejectWithValue(message);
        return data;
      } catch (error: unknown) {
        if (axios.isAxiosError<{ message: string }>(error)) {
          return rejectWithValue(
            error.response?.data?.message ?? 'Network error'
          );
        }
        return rejectWithValue('Unknown error');
      }
    }
);

/*
export const fetchBookingById = createAsyncThunk(
    'bookings/fetchBookingById',
    async (id: string) => {
        const response = await itemsApi.getItembyId(id);
        return response;
    }
);*/

export const addBooking = createAsyncThunk<Booking, object, { rejectValue: string }>(
    'bookings/rpc',
    async (newBooking, { rejectWithValue }) => {
        try {
            const response = await bookingsApi.createBooking(newBooking);
            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError<{ message: string }>(error)) {
                return rejectWithValue(
                  error.response?.data?.message ?? 'Network error'
                );
              }
              return rejectWithValue('Unknown error');
            
        }
    }

);


export const bookingsSlice = createSlice({
    name: 'bookings',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchAllBookings.pending, (state) => {
            state.loading = true
        })
        builder.addCase(fetchAllBookings.fulfilled, (state, action) => {
            state.loading = false
            state.bookings = action.payload;
        })
        builder.addCase(fetchAllBookings.rejected, (state) => {
            state.loading = false
            state.error = 'Could not fetch items'
        })

        // handle fetching bookings for a specific user
        builder.addCase(fetchUserBookings.pending, (state) => {
          state.loading = true;
          state.error = null;
        });
        builder.addCase(fetchUserBookings.fulfilled, (state, action) => {
          state.loading = false;
          state.bookings = action.payload;
        });
        builder.addCase(fetchUserBookings.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload ?? 'Could not fetch user bookings';
        });

        builder.addCase(addBooking.fulfilled, (state, action) => {
            state.loading = false;
            localStorage.removeItem('savedCart')
            state.bookings.push(action.payload);
        })
        builder.addCase(addBooking.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload ?? "Failed to add item";
        })

        // handle deleting a booking
        builder.addCase(deleteBooking.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(deleteBooking.fulfilled, (state, action) => {
            state.loading = false;
            const deletedId = action.meta.arg; // id passed to the thunk
            state.bookings = state.bookings.filter(
                (booking) => booking.booking_id !== deletedId
            );
        });
        builder.addCase(deleteBooking.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload ?? 'Could not delete booking';
        });

    }
})

export const selectAllBookings = (state: RootState) =>
    state.bookings.bookings;

export const selectBookingById = (id: string) => (state: RootState) => {
    return state.bookings.bookings.find((booking) => booking.booking_id === id);
}

export default bookingsSlice.reducer;