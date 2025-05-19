import { UpdateReservationDto } from "src/modules/reservations/dto/updateReservations.dto";
import { ItemReservationService } from "src/modules/reservations/reservations.service";
import { CustomRequest } from "src/types/request.type";
export declare class ItemReservationsController {
    private readonly itemReservationService;
    constructor(itemReservationService: ItemReservationService);
    getAllReservations(req: CustomRequest): Promise<import("../../types/response").ApiResponse<{
        booking_id: string;
        created_at: string | null;
        end_date: string;
        id: string;
        item_id: string;
        quantity: number;
        start_date: string;
    }[]>>;
    getByItem(req: CustomRequest, itemId: string): Promise<import("../../types/response").ApiResponse<{
        booking_id: string;
        created_at: string | null;
        end_date: string;
        id: string;
        item_id: string;
        quantity: number;
        start_date: string;
    }[]>>;
    getByBooking(req: CustomRequest, bookingId: string): Promise<import("../../types/response").ApiResponse<{
        booking_id: string;
        created_at: string | null;
        end_date: string;
        id: string;
        item_id: string;
        quantity: number;
        start_date: string;
    }[]>>;
    getByDateRange(req: CustomRequest, from: string, to: string): Promise<import("../../types/response").ApiResponse<{
        booking_id: string;
        created_at: string | null;
        end_date: string;
        id: string;
        item_id: string;
        quantity: number;
        start_date: string;
    }[]>>;
    getByItemAndDateRange(req: CustomRequest, itemId: string, from: string, to: string): Promise<import("../../types/response").ApiResponse<{
        booking_id: string;
        created_at: string | null;
        end_date: string;
        id: string;
        item_id: string;
        quantity: number;
        start_date: string;
    }[]>>;
    getByStartDate(req: CustomRequest, startDate: string): Promise<import("../../types/response").ApiResponse<{
        booking_id: string;
        created_at: string | null;
        end_date: string;
        id: string;
        item_id: string;
        quantity: number;
        start_date: string;
    }[]>>;
    getByEndDate(req: CustomRequest, endDate: string): Promise<import("../../types/response").ApiResponse<{
        booking_id: string;
        created_at: string | null;
        end_date: string;
        id: string;
        item_id: string;
        quantity: number;
        start_date: string;
    }[]>>;
    createReservation(req: CustomRequest, dto: {
        booking_id: string;
        item_id: string;
        start_date: string;
        end_date: string;
        quantity: number;
    }): Promise<import("../../types/response").ApiResponse<{
        booking_id: string;
        created_at: string | null;
        end_date: string;
        id: string;
        item_id: string;
        quantity: number;
        start_date: string;
    }>>;
    deleteReservations(req: CustomRequest, bookingId: string, reservationIds: string[]): Promise<import("../../types/response").ApiResponse<{
        deleted: number;
        deletedItems: import("../../types/supabase").Tables<"item_reservations">[];
    }>>;
    updateReservation(req: CustomRequest, bookingId: string, reservationId: string, dto: UpdateReservationDto): Promise<import("../../types/response").ApiResponse<{
        booking_id: string;
        created_at: string | null;
        end_date: string;
        id: string;
        item_id: string;
        quantity: number;
        start_date: string;
    }>>;
}
