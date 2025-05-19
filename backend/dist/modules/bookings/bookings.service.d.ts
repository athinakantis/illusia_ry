import { Tables } from 'src/types/supabase';
import { ApiResponse, BookingWithRes } from 'src/types/response';
import { CustomRequest } from 'src/types/request.type';
import { BookingWithItems } from 'src/types/bookings';
import { UpcomingBooking } from 'src/types/bookings';
export declare class BookingService {
    getBookings(req: CustomRequest): Promise<ApiResponse<Tables<'bookings'>[]>>;
    getBookingById(req: CustomRequest, id: string): Promise<ApiResponse<BookingWithItems>>;
    createBooking(req: CustomRequest, payload: {
        items: {
            item_id: string;
            start_date: string;
            end_date: string;
            quantity: number;
        }[];
    }): Promise<ApiResponse<{
        booking_id: Tables<'bookings'>['booking_id'];
        reservations: Tables<'item_reservations'>[];
    }>>;
    createBookingWithItemsViaRpc(req: CustomRequest, payload: {
        items: {
            item_id: string;
            start_date: string;
            end_date: string;
            quantity: number;
        }[];
    }): Promise<{
        booking_id: string;
        status: string;
    }>;
    createEmptyBooking(req: CustomRequest): Promise<ApiResponse<Tables<'bookings'>>>;
    reviewBookingAvailability(req: CustomRequest, bookingId: string): Promise<ApiResponse<{
        booking_id: string;
        status: string;
        issues: string[];
    }>>;
    updateBookingStatus(req: CustomRequest, bookingId: string, status: Tables<'bookings'>['status']): Promise<ApiResponse<Tables<'bookings'>>>;
    deleteBooking(req: CustomRequest, bookingId: string): Promise<ApiResponse<Tables<'bookings'>[]>>;
    getUserBookings(req: CustomRequest, userId: string): Promise<ApiResponse<BookingWithRes[]>>;
    getUpcomingBookings(req: CustomRequest, amount: string): Promise<ApiResponse<UpcomingBooking[]>>;
}
