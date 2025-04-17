import { configureStore } from '@reduxjs/toolkit';
import itemsReducer from '../slices/itemsSlice';
import cartReducer from '../slices/cartSlice';
import notificationReducer from '../slices/notificationSlice';

export const store = configureStore({
  reducer: {
    items: itemsReducer,
    cart: cartReducer,
    notification: notificationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
