import { createSlice } from '@reduxjs/toolkit';
import { BookingState } from '../types/types';
import { RootState } from '../store/store';


const initialState: BookingState = {
    booking: []
};



export const bookingSlice = createSlice({
    name: 'booking',
    initialState,
    reducers: {
        addItemToBooking: (state, action) => {
            state.booking.push(action.payload);  // Mutating the state directly, allowed by Redux Toolkit
        },
        removeItemFromBooking: (state, action) => {
            console.log("removing item");
            state.booking = state.booking.filter(item => item.item_id !== action.payload);
            // state.booking.push(action.payload);  // not yet working
        },
    }
})

export const selectBooking = (state: RootState) =>
    state.booking.booking;

export const { addItemToBooking } = bookingSlice.actions;
export const { removeItemFromBooking } = bookingSlice.actions;


export default bookingSlice.reducer;