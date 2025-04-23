import { ApiResponse, Booking, BookingWithRes } from '../types/types';
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
    removeBooking: (id: string): Promise<ApiResponse<DeleteBookingResponse>> => {
        return api.delete(`/bookings/${id}`);
    }
};