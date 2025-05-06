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
        setDateRange: (state, action) => {
            state.selectedDateRange.start_date = action.payload.newStartDate;
            state.selectedDateRange.end_date = action.payload.newEndDate;
            localStorage.setItem('savedCart', JSON.stringify(state));
            // mb not needed
        },
        setCartItems: (state, action) => {
            state.cart = action.payload.cart;
            state.selectedDateRange.start_date = action.payload.newStartDate;
            state.selectedDateRange.end_date = action.payload.newEndDate;
            localStorage.setItem('savedCart', JSON.stringify(state));
        },
        addItemToCart: (state, action) => {
            // Destructure new item
            const { item, quantity, start_date, end_date } = action.payload;

            const itemAlreadyInCart = state.cart.findIndex(cartItem => cartItem.item_id == item.item_id);

            if (itemAlreadyInCart !== -1) {
                state.cart[itemAlreadyInCart].quantity += quantity;
            } else {
                const newItem = { ...item, ['quantity']: quantity }
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
    setDateRange,
    setCartItems
} = cartSlice.actions;

export const selectItemInCartById = (id: string) => (state: RootState) => {
    return state.cart.cart.find((item) => item.item_id === id);
};

export const selectQtyForItemInCartByIdInDateRange =
    (id: string) => (state: RootState) => {
        const itemInCartReservations = state.cart.cart.filter(
            (item) => item.item_id === id,
        );

        if (itemInCartReservations.length > 0) {
            return itemInCartReservations[0].quantity;
            // if any of the instances of the items found in cart
        } else {
            return 0; // new item added to cart
        }
    };

export const selectDateRange = (state: RootState) => {
    return state.cart.selectedDateRange;
}

export default cartSlice.reducer;
