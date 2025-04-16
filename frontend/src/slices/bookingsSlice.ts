import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { BookingsState } from "../types/types";
import { RootState } from "../store/store";
import { bookingsApi } from "../api/bookings";

const initialState: BookingsState = {
    bookings: [],
    loading: false,
    error: null
}

export const fetchAllBookings = createAsyncThunk(
    'bookings/fetchAllBookings',
    async () => {
        const response = await bookingsApi.getAllBookings();
        return response;
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

export const addBooking = createAsyncThunk(
    'bookings/rpc',
    async (newBooking: object) => {
        const response = await bookingsApi.createBooking(newBooking);
        return response;
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
            state.bookings = action.payload.data;
        })
        builder.addCase(fetchAllBookings.rejected, (state) => {
            state.loading = false
            state.error = 'Could not fetch items'
        })
        builder.addCase(addBooking.fulfilled, (state, action) => {

            state.bookings.push(action.payload.data);
        })

    }
})

export const selectAllBookings = (state: RootState) =>
    state.bookings.bookings;

export const selectBookingById = (id: string) => (state: RootState) => {
    return state.bookings.bookings.find((booking) => booking.booking_id === id);
}

export default bookingsSlice.reducer;