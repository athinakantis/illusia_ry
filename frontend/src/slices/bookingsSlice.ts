import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Booking, BookingWithRes, BookingsState } from "../types/types";
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
 * Fetch all bookings for a specific user (including reservations)
 * @param userId - The ID of the user whose bookings to fetch
 * @returns A promise that resolves to an array of bookings with reservations
 */
export const fetchUserBookings = createAsyncThunk<
  BookingWithRes[],
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
        // now error is unknown, so we narrow it:
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
        } catch (err: any) {
            if (err.response?.data?.message) {
                return rejectWithValue(err.response.data.message);
            }
            return "Unknown error";
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

    }
})

export const selectAllBookings = (state: RootState) =>
    state.bookings.bookings;

export const selectBookingById = (id: string) => (state: RootState) => {
    return state.bookings.bookings.find((booking) => booking.booking_id === id);
}

export default bookingsSlice.reducer;