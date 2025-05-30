import { Tables } from '../types/supabase';
import { ApiResponse, Booking, BookingWithItems, Reservation, UpcomingBooking } from '../types/types';
import { api } from './axios';

export const bookingsApi = {
    getAllBookings: (): Promise<ApiResponse<Booking[]>> =>

        api.get('bookings',
            { headers: { 'Access-Control-Allow-Origin': '*' } }
        ),

    getBooking: (id: string): Promise<ApiResponse<BookingWithItems>> => {
        return api.get(`/bookings/${id}`)
    },

    createBooking: async (newBooking: object): Promise<{ booking: Tables<'bookings'>, reservations: Reservation[]}> => {
        return api.post('bookings/rpc', newBooking)
    },

    /**
   * Fetch all bookings for a specific user (including reservations)
   */
  getUserBookings: (
    userId: string,
  ): Promise<ApiResponse<Booking[]>> =>
    api.get(`bookings/user/${userId}`, {
      headers: { 'Access-Control-Allow-Origin': '*' },
    }),
    updateBookingStatus: (id: string, status: "approved" | "rejected" | "cancelled"): Promise<ApiResponse<Booking>> => {
        return api.patch(`/bookings/${id}`, { status })
    },
    removeBooking: (id: string): Promise<ApiResponse<Booking>> => {
        return api.delete(`/bookings/${id}`)
    },

    getUpcomingBookings(amount: number = 3): Promise<ApiResponse<UpcomingBooking[]>> {
        return api.get(`/bookings/upcoming/${amount}`)
    }
};