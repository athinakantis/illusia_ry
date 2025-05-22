import { configureStore } from '@reduxjs/toolkit';
import itemsReducer from '../slices/itemsSlice';
import cartReducer from '../slices/cartSlice';
import bookingsReducer from '../slices/bookingsSlice'
import reservationsReducer from '../slices/reservationsSlice'
import usersReducer from '../slices/usersSlice';
import tagReducer from '../slices/tagSlice';
import notificationReducer from '../slices/notificationSlice';

export const store = configureStore({
  reducer: {
    items: itemsReducer,
    cart: cartReducer,
    bookings: bookingsReducer,
    reservations: reservationsReducer,
    users: usersReducer,
    notifications: notificationReducer,
    tags: tagReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
