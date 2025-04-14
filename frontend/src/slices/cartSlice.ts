import { createSlice } from '@reduxjs/toolkit';
import { CartState } from '../types/types';
import { RootState } from '../store/store';


const initialState: CartState = {
    cart: []
};

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addItemToCart: (state, action) => {

            const bookingForItemExists = state.cart.find(item => item.itemInCart.item_id == action.payload.itemInCart.item_id);
            if (bookingForItemExists) {
                bookingForItemExists.quantityOfItem += action.payload.quantityToBook;
            } else {
                state.cart.push(action.payload);
            }

        },
        removeItemFromCart: (state, action) => {

            const bookingForItemExists = state.cart.find(item => item.itemInCart.item_id == action.payload.id);
            if (bookingForItemExists) {
                if (bookingForItemExists.quantityOfItem > action.payload.quantityToRemove) {
                    bookingForItemExists.quantityOfItem -= action.payload.quantityToRemove;
                } else {
                    state.cart = state.cart.filter(item => item.itemInCart.item_id !== action.payload.id);
                }

            } else {
                state.cart = state.cart.filter(item => item.itemInCart.item_id !== action.payload.id);
            }
        },
    }
})

export const selectCart = (state: RootState) =>
    state.cart.cart;

export const { addItemToCart } = cartSlice.actions;
export const { removeItemFromCart } = cartSlice.actions;


export default cartSlice.reducer;