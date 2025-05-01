import { ApiResponse, Booking, BookingWithRes, UpcomingBooking } from '../types/types';
import { api } from './axios';

export const bookingsApi = {
    getAllBookings: (): Promise<ApiResponse<Booking[]>> =>

        api.get('bookings',
            { headers: { 'Access-Control-Allow-Origin': '*' } }
        ),
    /*getBookingbyId: (id: string): Promise<ApiResponse<Item>> => {
        return api.get(`/items/${id}`)
    },*/

    createBooking: async (newBooking: object) => {

        const response = await api.post('bookings/rpc', newBooking)
        return response;
    },

    /**
   * Fetch all bookings for a specific user (including reservations)
   */
  getUserBookings: (
    userId: string,
  ): Promise<ApiResponse<BookingWithRes[]>> =>
    api.get(`bookings/user/${userId}`, {
      headers: { 'Access-Control-Allow-Origin': '*' },
    }),
    updateBookingStatus: (id: string, status: "approved" | "rejected"): Promise<ApiResponse<Booking>> => {
        return api.patch(`/bookings/${id}`, { status })
    },
    removeBooking: (id: string): Promise<ApiResponse<Booking>> => {
        return api.delete(`/bookings/${id}`)
    },

    getUpcomingBookings(amount: number = 3): Promise<ApiResponse<UpcomingBooking[]>> {
        return api.get(`/bookings/upcoming/${amount}`)
    }
};