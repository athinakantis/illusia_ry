
import { CalendarDate, getLocalTimeZone, today } from "@internationalized/date";
import { ApiResponse, Reservation } from "../types/types";
import { api } from "./axios";


export const reservationsApi = {
    getAllReservations: (): Promise<ApiResponse<Reservation[]>> =>
        api.get('reservations',
            { headers: { 'Access-Control-Allow-Origin': '*' } }
        ),

    getFutureReservations: (): Promise<ApiResponse<Reservation[]>> => {
        const now = today(getLocalTimeZone());;
        const future = new CalendarDate(now.year + 1, now.month, now.day);

        return api.get(`reservations/date-range?from=${now.toString()}&to=${future.toString()}`,
            { headers: { 'Access-Control-Allow-Origin': '*' } }
        )
    },
    
    updateReservation: (bookingId: string, reservationId: string, updatedReservation: object) => {
        return api.patch(`reservations/booking/${bookingId}/${reservationId}`, updatedReservation);
    },
};
