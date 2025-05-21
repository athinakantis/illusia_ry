export type NotificationsType = BookingNotifications | UserManagementNotifications

export type BookingNotifications = 'NEW BOOKING' | 'BOOKING_REJECTED' | 'BOOKING_APPROVED' 
export type UserManagementNotifications = 'NEW_USER'