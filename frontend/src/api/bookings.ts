import { api } from './axios';
import { Tables } from '../types/supabase.types';
import axios, { AxiosResponse } from 'axios';
import {
  ApiEnvelope,
  ApiResponse,
  BookingResponse,
} from '../types/types';

export interface UserBooking {
  user_id: string;
  booking_id: string;
  reservations: Tables<'item_reservations'>[] | null;
}

export type GetUserBookingsEnvelope = ApiEnvelope<UserBooking[]>;

/**
 * Fetches all bookings for a specific user.(With the policies in place you should only fetch your own bookings if your not an admin/head admin)
 * Assumes the backend returns bookings with nested item_reservations.
 * @param userId - The UUID of the user.
 * @returns Promise resolving to an array of UserBooking objects. or null [] if no bookings exist
 *
 */
export const getUserBookings = async (
  userId: string,
): Promise<AxiosResponse<GetUserBookingsEnvelope>> => {
  try {
    const response = await api.get<GetUserBookingsEnvelope>(
      `/reservations/user/${userId}`,
    );

    return response;
  } catch (error) {
    console.error(`API Error fetching bookings for user ${userId}:`, error);
    let msg = 'Failed to fetch bookings';
    if (axios.isAxiosError(error)) {
      msg = error.response?.data?.message ?? error.message ?? msg;
    } else if (error instanceof Error) {
      msg = error.message;
    }
    throw new Error(msg);
  }
};
/**
 * Updates the status of a specific booking.
 * @param bookingId - The UUID of the booking to update.
 * @param status - The new status string (e.g., 'cancelled').
 * @returns Promise resolving to the API response containing the updated booking.
 */
export type UpdateBookingStatusEnvelope = ApiEnvelope<BookingResponse>;

export const updateBookingStatus = async (
  bookingId: string,
  status: string,
): Promise<AxiosResponse<UpdateBookingStatusEnvelope>> => {
  try {
    const response = await api.patch<UpdateBookingStatusEnvelope>(
      `/bookings/${bookingId}`,
      { status },
    );
    return response;
  } catch (error: unknown) {
    console.error(`API Error updating status for booking ${bookingId}:`, error);
    let errorMessage = 'Failed to update booking status';
    if (axios.isAxiosError(error)) {
      errorMessage =
        error.response?.data?.message || error.message || errorMessage;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    throw new Error(errorMessage);
  }
};

interface UpdateReservationPayload {
  item_id?: string;
  start_date?: string; // ISO Date string
  end_date?: string; // ISO Date string
  quantity?: number; // Min 1
}

/**
 * Update a single reservation within a booking and return the full response wrapper.
 *
 * @param bookingId      Parent booking UUID
 * @param reservationId  Reservation UUID to update
 * @param payload        Partial fields to update (item_id, start_date, end_date, quantity)
 * @returns              { message: string; data: Tables<'item_reservations'> }
 */
export const updateReservation = async (
  bookingId: string,
  reservationId: string,
  payload: UpdateReservationPayload,
): Promise<AxiosResponse<ApiResponse<Tables<'item_reservations'>>>> => {
  try {
    const response = await api.patch<ApiResponse<Tables<'item_reservations'>>>(
      `/reservations/booking/${bookingId}/${reservationId}`,
      payload,
    );
    // return the full wrapper, including message
    return response;
  } catch (error: unknown) {
    console.error(`API Error updating reservation ${reservationId}:`, error);
    let message = 'Failed to update reservation';
    if (axios.isAxiosError(error)) {
      message = error.response?.data?.message || error.message || message;
    } else if (error instanceof Error) {
      message = error.message;
    }
    throw new Error(message);
  }
};

/**
 * Delete one or more reservations by ID.
 * @param bookingId     Parent booking UUID
 * @param reservationIds Array of reservation UUIDs
 */
export const deleteReservations = async (
  bookingId: string,
  reservationIds: string[],
): Promise<ApiResponse<{ deleted: number }>> => {
  try {
    const response = await api.delete<ApiResponse<{ deleted: number }>>(
      `/reservations/booking/${bookingId}`,
      { data: { reservationIds } },
    );
    return response.data;
  } catch (error: unknown) {
    console.error('API Error deleting reservations:', error);
    let message = 'Failed to delete reservations';
    if (axios.isAxiosError(error)) {
      message = error.response?.data?.message || error.message || message;
    } else if (error instanceof Error) {
      message = error.message;
    }
    throw new Error(message);
  }
};
