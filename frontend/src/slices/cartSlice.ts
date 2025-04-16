import { createSlice } from '@reduxjs/toolkit';
import { CartState, LocalReservation } from '../types/types';
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

export const selectCart = (state: RootState) => {
    return state.cart.cart;
}


export const { addItemToCart } = cartSlice.actions;
export const { removeItemFromCart } = cartSlice.actions;
export const selectItemInCartById = (id: string) => (state: RootState) => {
    return state.cart.cart.find((item) => item.item_id === id);
}
export const selectItemQtyInCartById = (id: string) => (state: RootState) => {
    const itemInCart: LocalReservation | undefined = state.cart.cart.find((item) => item.item_id === id);
    return itemInCart ? itemInCart.quantity : 0;
}



export default cartSlice.reducer;