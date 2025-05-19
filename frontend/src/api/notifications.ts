import { Tables } from '../types/supabase';
import { NotificationsType } from '../types/types';
import { api } from './axios';

export const notificationsApi = {
  getUserNotifications: (userId: string) => {
    console.log('api userid: ', userId);
    console.log('Making request for user notifications');
    return api.get(`/notifications/user/${userId}`);
  },
  getAdminNotifications: () => api.get(`/notifications/recipient_type/admin`),
  getNotificationsOfType: (type: NotificationsType) =>
    api.get(`/notifications/notification_type/${type}`),
  updateNotification: (
    notification_id: string,
    body: Partial<Tables<'notifications'>>,
  ) => api.patch(`/notifications/notification/${notification_id}`, body),
};
