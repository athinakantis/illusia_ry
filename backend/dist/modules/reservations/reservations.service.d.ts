import { Tables } from 'src/types/supabase';
import { ApiResponse } from 'src/types/response';
import { CustomRequest } from 'src/types/request.type';
export declare class ItemReservationService {
    getAllReservations(req: CustomRequest): Promise<ApiResponse<Tables<'item_reservations'>[]>>;
    getReservationsForItem(req: CustomRequest, itemId: string): Promise<ApiResponse<Tables<'item_reservations'>[]>>;
    getReservationsByBooking(req: CustomRequest, bookingId: string): Promise<ApiResponse<Tables<'item_reservations'>[]>>;
    getReservationsInDateRange(req: CustomRequest, from: string, to: string): Promise<ApiResponse<Tables<'item_reservations'>[]>>;
    getReservationsForItemInDateRange(req: CustomRequest, itemId: string, from: string, to: string): Promise<ApiResponse<Tables<'item_reservations'>[]>>;
    getReservationsByStartDate(req: CustomRequest, startDate: string): Promise<ApiResponse<Tables<'item_reservations'>[]>>;
    getReservationsByEndDate(req: CustomRequest, endDate: string): Promise<ApiResponse<Tables<'item_reservations'>[]>>;
    createReservation(req: CustomRequest, payload: {
        booking_id: string;
        item_id: string;
        start_date: string;
        end_date: string;
        quantity: number;
    }): Promise<ApiResponse<Tables<'item_reservations'>>>;
    updateReservation(req: CustomRequest, bookingId: string, reservationId: string, payload: Partial<{
        item_id: string;
        start_date: string;
        end_date: string;
        quantity: number;
    }>): Promise<ApiResponse<Tables<'item_reservations'>>>;
    deleteReservations(req: CustomRequest, bookingId: string, reservationIds: string[]): Promise<ApiResponse<{
        deleted: number;
        deletedItems: Tables<'item_reservations'>[];
    }>>;
}
