import { configureStore } from '@reduxjs/toolkit';
import itemsReducer from '../slices/itemsSlice';
import cartReducer from '../slices/cartSlice';
import bookingsReducer from '../slices/bookingsSlice'
import reservationsReducer from '../slices/reservationsSlice'
import usersReducer from '../slices/usersSlice';

export const store = configureStore({
  reducer: {
    items: itemsReducer,
    cart: cartReducer,
    bookings: bookingsReducer,
    reservations: reservationsReducer,
    users: usersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
