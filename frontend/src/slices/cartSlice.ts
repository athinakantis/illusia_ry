import { createSlice } from '@reduxjs/toolkit';
import { CartState, LocalReservation } from '../types/types';
import { RootState } from '../store/store';
import { parseDate } from '@internationalized/date';
import { getOverlappingRange } from '../utility/OverlappingDates';



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
            // can only add the same item on one date
        },
        /*addItemToCart: (state, action) => {

            const itemAlreadyInCart = state.cart.find(item => item.item_id == action.payload.item_id);
            if (itemAlreadyInCart) {
                console.log("same item");

                if ((itemAlreadyInCart.start_date === action.payload.start_date) || (itemAlreadyInCart.end_date === action.payload.end_date)) {
                    itemAlreadyInCart.quantity += action.payload.quantityToAdd;
                    console.log("same date");

                    return;
                }
            }
            state.cart.push({ item_id: action.payload.item_id, quantity: action.payload.quantityToAdd, start_date: action.payload.start_date, end_date: action.payload.end_date });
            // can only add the same item on one date
        },*/
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
        emptyCart: (state) => {
            state.cart = [];
        }
    }
})

export const selectCart = (state: RootState) => {
    return state.cart.cart;
}


export const { addItemToCart } = cartSlice.actions;
export const { removeItemFromCart } = cartSlice.actions;
export const { emptyCart } = cartSlice.actions;

export const selectItemInCartById = (id: string) => (state: RootState) => {
    return state.cart.cart.find((item) => item.item_id === id);
}

export const selectQtyForItemInCartByIdInDateRange = (id: string, start_date: string, end_date: string) => (state: RootState) => {
    const itemInCartReservations: LocalReservation[] = state.cart.cart.filter((item) => item.item_id === id);

    if (itemInCartReservations.length > 0) {
        // if any of the instances of the items found in cart
        if ((itemInCartReservations[0].start_date === start_date) || (itemInCartReservations[0].end_date === end_date)) {
            return itemInCartReservations[0].quantity; // item added for already existing time range
        } else {
            return -1; // item added fora new time range
        }
    } else {
        return 0; // new item added to cart
    }
}

/*
export const selectQtyForItemInCartByIdInDateRange2 = (id: string, start_date: string, end_date: string) => (state: RootState) => {
    const itemInCartReservations: LocalReservation[] = state.cart.cart.filter((item) => item.item_id === id);

    if (itemInCartReservations.length > 0) {
        // if any of the instances of the items found in cart

        if ((itemInCartReservations[0].start_date === start_date) || (itemInCartReservations[0].end_date === end_date)) {
            // item added for already existing time range
            return itemInCartReservations[0].quantity;
        } else {
            // item added fora new time range
            return -1;
        }
        // console.log(getOverlappingRange(parseDate(itemInCartReservations[0].start_date), parseDate(itemInCartReservations[0].end_date), parseDate(start_date), parseDate(end_date)));
    } else {
        // new item added to cart
        return 0;
    }
}*/


export default cartSlice.reducer;