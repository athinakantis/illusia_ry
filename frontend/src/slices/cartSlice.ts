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

            const itemAlreadyInCart = state.cart.find(item => item.itemInCart.item_id == action.payload.itemToAdd.item_id);
            if (itemAlreadyInCart) {
                itemAlreadyInCart.quantityOfItem += action.payload.quantityOfItem;
            } else {
                state.cart.push({ itemInCart: action.payload.itemToAdd, quantityOfItem: action.payload.quantityOfItem });
            }

        },
        removeItemFromCart: (state, action) => {

            const itemAlreadyInCart = state.cart.find(item => item.itemInCart.item_id == action.payload.id);
            if (itemAlreadyInCart) {
                if (itemAlreadyInCart.quantityOfItem > action.payload.quantityToRemove) {
                    itemAlreadyInCart.quantityOfItem -= action.payload.quantityToRemove;
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