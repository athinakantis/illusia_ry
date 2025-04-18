import { ApiResponse, Reservation } from "../types/types";
import { api } from "./axios";


export const reservationsApi = {
    getAllReservations: (): Promise<ApiResponse<Reservation[]>> =>

        api.get('reservations',
            { headers: { 'Access-Control-Allow-Origin': '*' } }
        ),

};