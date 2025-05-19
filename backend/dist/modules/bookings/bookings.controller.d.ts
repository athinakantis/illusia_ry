import { CreateBookingDto } from './dto/create-booking.dto';
import { BookingService } from 'src/modules/bookings/bookings.service';
import { CustomRequest } from 'src/types/request.type';
export declare class BookingController {
    private readonly bookingService;
    constructor(bookingService: BookingService);
    getAllBookings(req: CustomRequest): Promise<import("../../types/response").ApiResponse<{
        booking_id: string;
        created_at: string | null;
        status: string;
        user_id: string;
    }[]>>;
    getBookingById(req: CustomRequest, id: string): Promise<import("../../types/response").ApiResponse<import("../../types/bookings").BookingWithItems>>;
    getBookingsByUserId(req: CustomRequest, user_id: string): Promise<import("../../types/response").ApiResponse<import("../../types/response").BookingWithRes[]> | {
        message: string;
        error: string;
    }>;
    createBooking(req: CustomRequest, payload: CreateBookingDto): Promise<import("../../types/response").ApiResponse<{
        booking_id: import("../../types/supabase").Tables<"bookings">["booking_id"];
        reservations: import("../../types/supabase").Tables<"item_reservations">[];
    }>>;
    createViaRpc(req: CustomRequest, dto: CreateBookingDto): Promise<{
        booking_id: string;
        status: string;
    }>;
    createEmptyBooking(req: CustomRequest): Promise<import("../../types/response").ApiResponse<{
        booking_id: string;
        created_at: string | null;
        status: string;
        user_id: string;
    }>>;
    reviewBooking(req: CustomRequest, bookingId: string): Promise<import("../../types/response").ApiResponse<{
        booking_id: string;
        status: string;
        issues: string[];
    }>>;
    updateBookingStatus(req: CustomRequest, bookingId: string, payload: {
        status: string;
    }): Promise<import("../../types/response").ApiResponse<{
        booking_id: string;
        created_at: string | null;
        status: string;
        user_id: string;
    }>>;
    deleteBooking(req: CustomRequest, id: string): Promise<import("../../types/response").ApiResponse<{
        booking_id: string;
        created_at: string | null;
        status: string;
        user_id: string;
    }[]>>;
    getUpcomingBookings(req: CustomRequest, amount: string): Promise<import("../../types/response").ApiResponse<import("../../types/bookings").UpcomingBooking[]>>;
}
