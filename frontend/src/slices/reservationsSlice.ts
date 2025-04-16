import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store/store";
import { ReservationsState } from "../types/types";
import { reservationsApi } from "../api/reservations";


const initialState: ReservationsState = {
    reservations: [],
    loading: false,
    error: null
}

export const fetchAllReservations = createAsyncThunk(
    'reservations/fetchAllReservations',
    async () => {
        const response = await reservationsApi.getAllReservations();
        return response;
    }
);

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

export default reservationsSlice.reducer;