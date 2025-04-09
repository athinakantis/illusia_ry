import { configureStore } from '@reduxjs/toolkit';
import itemsReducer from '../slices/itemsSlice'
import bookingReducer from '../slices/bookingSlice'

export const store = configureStore({
    reducer: {
        items: itemsReducer,
        booking: bookingReducer
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;