import { configureStore } from '@reduxjs/toolkit';
import itemsReducer from '../slices/itemsSlice'
import cartReducer from '../slices/cartSlice'
import bookingsReducer from '../slices/bookingsSlice'
import reservationsReducer from '../slices/reservationsSlice'

export const store = configureStore({
    reducer: {
        items: itemsReducer,
        cart: cartReducer,
        bookings: bookingsReducer,
        reservations: reservationsReducer
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;