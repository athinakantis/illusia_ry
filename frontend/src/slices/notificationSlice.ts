import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { notificationsApi } from '../api/notifications';
import { NotificationState } from '../types/types';
import { RootState } from '../store/store';

const initialState: NotificationState = {
  userNotifications: [],
  adminNotifications: [],
  loading: false,
  error: null,
};

export const fetchUserNotifications = createAsyncThunk(
  'notifications/fetchUserNotifications',
  async (userId: string) => {
    const response = await notificationsApi.getUserNotifications(userId);
    return response;
  },
);
export const fetchAdminNotifications = createAsyncThunk(
  'notifications/fetchAdminNotifications',
  async () => {
    const response = await notificationsApi.getAdminNotifications();
    return response;
  },
);

export const updateNotification = createAsyncThunk(
  'notifications/updateNotification',
  async ({ id, body }: { id: string; body: object }) => {
    const response = await notificationsApi.updateNotification(id, body);
    return response;
  },
);

export const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    updateAdminNotification(state, action) {
      const { id } = action.payload;
      const index = state.adminNotifications.findIndex((n) => n.id === id);
      state.adminNotifications[index].is_read = true;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUserNotifications.pending, (state) => {
      state.error = null;
      state.loading = true;
    });
    builder.addCase(fetchUserNotifications.fulfilled, (state, action) => {
      state.userNotifications = action.payload.data;
      state.loading = false;
    });
    builder.addCase(fetchUserNotifications.rejected, (state) => {
      state.error = 'Could not retrieve notifications';
      state.loading = false;
    });
    builder.addCase(fetchAdminNotifications.pending, (state) => {
      state.error = null;
      state.loading = true;
    });
    builder.addCase(fetchAdminNotifications.fulfilled, (state, action) => {
      state.adminNotifications = action.payload.data;
      state.loading = false;
    });
    builder.addCase(fetchAdminNotifications.rejected, (state) => {
      state.error = 'Could not retrieve notifications';
      state.loading = false;
    });
    builder.addCase(updateNotification.pending, (state) => {
      state.error = null;
      state.loading = true;
    });
    builder.addCase(updateNotification.fulfilled, (state, action) => {
      const notificationToUpdate = state.userNotifications.findIndex(
        (n) => n.id === action.payload.data.id,
      );
      if (notificationToUpdate !== -1) {
        state.userNotifications[notificationToUpdate] = action.payload.data;
      }
      state.loading = false;
    });
    builder.addCase(updateNotification.rejected, (state) => {
      state.error = 'Failed to update notification';
      state.loading = false;
    });
  },
});

/* Reducers */
export const { updateAdminNotification } = notificationSlice.actions;

/* State */
export const selectUserNotifications = (state: RootState) =>
  state.notifications.userNotifications;
export const selectAdminNotifications = (state: RootState) =>
  state.notifications.adminNotifications;
export const selectNotificationLoading = (state: RootState) =>
  state.notifications.loading;
export const selectNotificationError = (state: RootState) =>
  state.notifications.error;

export default notificationSlice.reducer;
