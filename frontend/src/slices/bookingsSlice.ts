import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Booking, BookingsState } from "../types/types";
import { RootState } from "../store/store";
import { bookingsApi } from "../api/bookings";

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