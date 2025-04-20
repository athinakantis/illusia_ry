import { LocalReservation } from "../types/types";

function getDailyKey(date: Date): string {
    return date.toISOString().slice(0, 10); // 'YYYY-MM-DD'
}

export const getMaxAvailableQtyByDateForOneItem = (newReservationStart: Date, newReservationEnd: Date, itemReservations: LocalReservation[]) => {

    const availabilityMap: Record<string, number> = {};

    itemReservations.forEach(reservation => {
        const reservationStart = new Date(reservation.start_date);
        const reservationEnd = new Date(reservation.end_date);

        for (let dayOfReservation = new Date(newReservationStart); dayOfReservation <= newReservationEnd; dayOfReservation.setDate(dayOfReservation.getDate() + 1)) {

            if (reservationStart <= dayOfReservation && reservationEnd >= dayOfReservation) {

                const dailyKey = getDailyKey(dayOfReservation);
                availabilityMap[dailyKey] = (availabilityMap[dailyKey] ?? 0) + reservation.quantity;
            }
        }
        // creates a map of availability for each of the days for requested booking 
    });
    // it is done for each of the reservations and combined

    return availabilityMap;
}

export const getMaxAvailableQtyInRangeForOneItem = (newReservationStart: Date, newReservationEnd: Date, itemReservations: LocalReservation[]) => {

    const availabilityMap = getMaxAvailableQtyByDateForOneItem(newReservationStart, newReservationEnd, itemReservations);

    const higestQty = Math.max(...Object.values(availabilityMap));
    // checkes what is the highest booked quantity on the date range

    return (higestQty < 0) ? 0 : higestQty;
}
