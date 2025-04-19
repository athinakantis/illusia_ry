import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store/store";
import { LocalReservation, ReservationsState } from "../types/types";
import { reservationsApi } from "../api/reservations";
import { getMaxAvailableQtyInRange } from "../utility/OverlappingDates";


const initialState: ReservationsState = {
    reservations: [],
    loading: false,
    error: null
    // reservatonsMap: 
}

export const fetchAllReservations = createAsyncThunk(
    'reservations/fetchAllReservations',
    async () => {
        const response = await reservationsApi.getAllReservations();
        return response;
    }
);

// export const fetchReservationsByItemId = createAsyncThunk();


export const reservationsSlice = createSlice({
    name: 'reservations',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchAllReservations.pending, (state) => {
            state.loading = true
        })
        builder.addCase(fetchAllReservations.fulfilled, (state, action) => {
            state.loading = false
            state.reservations = action.payload.data;
        })
        builder.addCase(fetchAllReservations.rejected, (state) => {
            state.loading = false
            state.error = 'Could not fetch items'
        })
    }
})


export const selectAllReservations = (state: RootState) =>
    state.reservations.reservations;

export const selectAllReservationsForItem = (item_id: string) => (state: RootState) => {
    return state.reservations.reservations.filter((item) => item.item_id === item_id);
}

export const selectQtyForItemInReservationsByIdInDateRange = (id: string, start_date: string, end_date: string) => (state: RootState) => {
    const itemReservations: LocalReservation[] = state.reservations.reservations.filter((item) => item.item_id === id);
    console.log(itemReservations);

    const maxAvailableQtyInRange = getMaxAvailableQtyInRange(new Date(start_date), new Date(end_date), itemReservations);

    // should we just build a map of all the reservations straight from the beginning? Shhould make the things much simpler

    return maxAvailableQtyInRange;
}

export default reservationsSlice.reducer;