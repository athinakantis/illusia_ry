declare class CreateReservationDto {
    item_id: string;
    start_date: string;
    end_date: string;
    quantity: number;
}
export declare class CreateBookingDto {
    user_id: string;
    items: CreateReservationDto[];
}
export {};
