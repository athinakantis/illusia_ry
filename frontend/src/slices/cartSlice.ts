import { createSlice } from '@reduxjs/toolkit';
import { CartState } from '../types/types';
import { RootState } from '../store/store';

const initialState: CartState = {
    cart: [],
    selectedDateRange: { start_date: null, end_date: null }
};

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addItemToCart: (state, action) => {
            // Destructure new item
            const { item, quantity, start_date, end_date } = action.payload;

            const itemAlreadyInCart = state.cart.findIndex(cartItem => cartItem.item_id == item.item_id);

            if (itemAlreadyInCart !== -1) {
                state.cart[itemAlreadyInCart].quantity += quantity;
            } else {
                const newItem = {...item, ['quantity']: quantity}
                state.cart.push(newItem);
            }
            state.selectedDateRange = { start_date, end_date };

            // Save the updated cart to localStorage
            localStorage.setItem('savedCart', JSON.stringify(state));
        },
        removeItemFromCart: (state, action) => {
            // Destructure item to remove
            const { item_id, quantityToRemove } = action.payload;
            const itemAlreadyInCart = state.cart.find(
                (item) => item.item_id == item_id,
            );
            if (itemAlreadyInCart) {
                if (itemAlreadyInCart.quantity > +quantityToRemove) {
                    itemAlreadyInCart.quantity -= +quantityToRemove;
                } else {
                    state.cart = state.cart.filter((item) => item.item_id !== item_id);
                }
            }
            if (state.cart.length < 1) {
                state.selectedDateRange = { start_date: null, end_date: null };
                localStorage.removeItem('savedCart')
            }

            // Save the updated cart to localStorage
            localStorage.setItem('savedCart', JSON.stringify(state));
        },
        emptyCart: (state) => {
            state.cart = [];
            state.selectedDateRange = { start_date: null, end_date: null };
            localStorage.removeItem('savedCart');
            // if the cart is emptied, it removes selected date range and all the things saved in local storage

        },
        loadCartFromStorage: (state, action) => {
            state.cart = action.payload.cart;
            state.selectedDateRange = action.payload.selectedDateRange;
        },
    },
});

export const selectCart = (state: RootState) => {
    return state.cart;
};

export const {
    addItemToCart,
    removeItemFromCart,
    emptyCart,
    loadCartFromStorage,
} = cartSlice.actions;

export const selectItemInCartById = (id: string) => (state: RootState) => {
    return state.cart.cart.find((item) => item.item_id === id);
};

export const selectQtyForItemInCartByIdInDateRange =
    (id: string, start_date: string, end_date: string) => (state: RootState) => {
        const itemInCartReservations = state.cart.cart.filter(
            (item) => item.item_id === id,
        );

        if (itemInCartReservations.length > 0) {
            // if any of the instances of the items found in cart
            if (
                state.cart.selectedDateRange.start_date === start_date ||
                state.cart.selectedDateRange.end_date === end_date
            ) {
                return itemInCartReservations[0].quantity; // item added for already existing time range
            } else {
                return -1; // item added for a new time range
            }
        } else {
            return 0; // new item added to cart
        }
    };

export const setDateRange = (newStartDate: string | null, newEndDate: string | null) => (state: RootState) => {
    state.cart.selectedDateRange.start_date = newStartDate;
    state.cart.selectedDateRange.end_date = newEndDate;

}



export const selectDateRange = (state: RootState) => {
    return state.cart.selectedDateRange;
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
