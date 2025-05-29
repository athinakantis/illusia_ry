import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store/store";
import { Reservation, ReservationsState } from "../types/types";
import { reservationsApi } from "../api/reservations";
import { getMaxBookedQtyForItem, getBookedQtyByDateAndItemForReservationsInRange, getMaxBookedQtyForManyItems } from "../utility/overlappingDates";



const initialState: ReservationsState = {
    reservations: [], // probably should store only future or current reservations here
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

export const fetchFutureReservations = createAsyncThunk(
    'reservations/fetchFutureReservations',
    async () => {
        const response = await reservationsApi.getFutureReservations();
        return response;
    }
);

export const updateReservation = createAsyncThunk(
    'reservations/updateReservations',
    async ({ bookingId, reservationId, updatedReservation }: { bookingId: string, reservationId: string, updatedReservation: object }) => {
        const response = await reservationsApi.updateReservation(bookingId, reservationId, updatedReservation);
        return response;
    }
)

export const reservationsSlice = createSlice({
    name: 'reservations',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchAllReservations.pending, (state) => {
            state.loading = true
        })
        builder.addCase(fetchAllReservations.fulfilled, (state, action) => {
            state.reservations = action.payload.data;
            state.loading = false
        })
        builder.addCase(fetchAllReservations.rejected, (state) => {
            state.error = 'Could not fetch items'
            state.loading = false
        })
        builder.addCase(fetchFutureReservations.pending, (state) => {
            state.loading = true
        })
        builder.addCase(fetchFutureReservations.fulfilled, (state, action) => {
            state.reservations = action.payload.data;
            state.loading = false
        })
        builder.addCase(fetchFutureReservations.rejected, (state) => {
            state.error = 'Could not fetch items'
            state.loading = false
        })
    }
})


export const selectAllReservations = (state: RootState) =>
    state.reservations.reservations;

export const selectAllReservationsForItem = (item_id: string) => (state: RootState) => {
    return state.reservations.reservations.filter((item) => item.item_id === item_id);
}

export const selectQtyForItemInReservationsByIdInDateRange = (id: string, start_date: string, end_date: string) => (state: RootState) => {
    const itemReservations: Reservation[] = state.reservations.reservations.filter((item) => item.item_id === id);

    const maxAvailableQtyInRange = getMaxBookedQtyForItem(getBookedQtyByDateAndItemForReservationsInRange(new Date(start_date), new Date(end_date), itemReservations)[id]);

    return maxAvailableQtyInRange;
}

export const checkAvailabilityForAllItemsOnDates = (
    start_date: string,
    end_date: string,
) => (state: RootState) => {

    const activeReservations = state.reservations.reservations.filter(res => res.is_active === true)
    const itemsMaxBookedQty = getMaxBookedQtyForManyItems(getBookedQtyByDateAndItemForReservationsInRange(new Date(start_date), new Date(end_date), activeReservations))

    return itemsMaxBookedQty;
    // calculates the max booked qty over the dates of the items for filtering
}


export default reservationsSlice.reducer;