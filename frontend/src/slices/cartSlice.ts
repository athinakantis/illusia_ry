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

            const itemAlreadyInCart = state.cart.find(item => item.item_id == action.payload.item_id);
            if (itemAlreadyInCart) {
                itemAlreadyInCart.quantity += action.payload.quantityToAdd;
            } else {
                state.cart.push({ item_id: action.payload.item_id, quantity: action.payload.quantityToAdd, start_date: action.payload.start_date, end_date: action.payload.end_date });
            }

        },
        removeItemFromCart: (state, action) => {

            const itemAlreadyInCart = state.cart.find(item => item.item_id == action.payload.item_id);
            if (itemAlreadyInCart) {
                if (itemAlreadyInCart.quantity > action.payload.quantityToRemove) {
                    itemAlreadyInCart.quantity -= action.payload.quantityToRemove;
                } else {
                    state.cart = state.cart.filter(item => item.item_id !== action.payload.item_id);
                }
            } else {
                state.cart = state.cart.filter(item => item.item_id !== action.payload.item_id);
            }
        },
    }
})

export const selectCart = (state: RootState) =>
    state.cart.cart;

export const { addItemToCart } = cartSlice.actions;
export const { removeItemFromCart } = cartSlice.actions;


export default cartSlice.reducer;