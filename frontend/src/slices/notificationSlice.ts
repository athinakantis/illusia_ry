import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store/store';

export interface NotificationState {
  message: string;
  severity: 'success' | 'error' | 'warning' | 'info';
  open: boolean;
}

const initialState: NotificationState = {
  message: '',
  severity: 'info',
  open: false,
};

export const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    showNotification: (
      state,
      action: PayloadAction<Omit<NotificationState, 'open'>>,
    ) => {
      state.message = action.payload.message;
      state.severity = action.payload.severity;
      state.open = true;
    },
    hideNotification: (state) => {
      state.open = false;
    },
  },
});

export const { showNotification, hideNotification } = notificationSlice.actions;
export const selectNotification = (state: RootState) => state.notification;
export default notificationSlice.reducer;
