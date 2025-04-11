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

            const bookingForItemExists = state.booking.find(item => item.itemToBook.item_id == action.payload.itemToBook.item_id);
            if (bookingForItemExists) {
                bookingForItemExists.quantityToBook += action.payload.quantityToBook;
            } else {
                state.booking.push(action.payload);
            }

        },
        removeItemFromBooking: (state, action) => {

            const bookingForItemExists = state.booking.find(item => item.itemToBook.item_id == action.payload.id);
            if (bookingForItemExists) {
                if (bookingForItemExists.quantityToBook > action.payload.quantityToRemove) {
                    bookingForItemExists.quantityToBook -= action.payload.quantityToRemove;
                } else {
                    state.booking = state.booking.filter(item => item.itemToBook.item_id !== action.payload.id);
                }

            } else {
                state.booking = state.booking.filter(item => item.itemToBook.item_id !== action.payload.id);
            }
        },
    }
})

export const selectBooking = (state: RootState) =>
    state.booking.booking;

export const { addItemToBooking } = bookingSlice.actions;
export const { removeItemFromBooking } = bookingSlice.actions;


export default bookingSlice.reducer;