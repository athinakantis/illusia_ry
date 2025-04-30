import { Reservation } from "../types/types";

function getDailyKey(date: Date): string {
    return date.toISOString().slice(0, 10); // 'YYYY-MM-DD'
}

export const getBookedQtyByDateAndItemForReservationsInRange = (startOfTheRange: Date, endOfTheRange: Date, itemReservations: Reservation[]) => {

    const availabilityMap: Record<string, Record<string, number>> = {};

    itemReservations.forEach(reservation => {
        const reservationStart = new Date(reservation.start_date);
        const reservationEnd = new Date(reservation.end_date);

        if (reservationStart <= endOfTheRange && reservationEnd >= startOfTheRange) {
            // if the reservation date range is in the range taht is being checked
            for (let dayToCheck = new Date(startOfTheRange); dayToCheck <= endOfTheRange; dayToCheck.setDate(dayToCheck.getDate() + 1)) {

                if (reservationStart <= dayToCheck && reservationEnd >= dayToCheck) {

                    const dailyKey = getDailyKey(dayToCheck);

                    availabilityMap[reservation.item_id] = availabilityMap[reservation.item_id] ?? {};
                    availabilityMap[reservation.item_id][dailyKey] = (availabilityMap[reservation.item_id][dailyKey] ?? 0) + reservation.quantity;
                }
            }
        }
    });

    return availabilityMap;
}

export const getMaxBookedQtyForItem = (availabilityMapForItem: Record<string, number>) => {

    if (availabilityMapForItem === undefined) return 0;

    const higestQty = Math.max(...Object.values(availabilityMapForItem));
    return (higestQty === undefined) ? 0 : higestQty;
}

export const getMaxBookedQtyForManyItems = (availabilityMap: Record<string, Record<string, number>>) => {

    const higestQtyMap: Record<string, number> = {};

    // for one item it returns empty object
    // it actually returns empty object if there are no reservations
    Object.keys(availabilityMap).forEach(item => {

        const higestQty = Math.max(...Object.values(availabilityMap[item]));
        higestQtyMap[item] = (higestQtyMap[item] ?? 0) + (higestQty < 0 ? 0 : higestQty);

    });

    return higestQtyMap;
}

/*
export const getMaxBookedQtyInRangeForManyItems = (startOfTheRange: Date, endOfTheRange: Date, itemReservations: LocalReservation[]) => {

    const higestQtyMap: Record<string, number> = {};

    const availabilityMap = getBookedQtyByDateAndItemForReservationsInRange(startOfTheRange, endOfTheRange, itemReservations);

    // for one item it returns empty object
    // it actually returns empty object if there are no reservations

    Object.keys(availabilityMap).forEach(item => {

        const higestQty = Math.max(...Object.values(availabilityMap[item]));
        higestQtyMap[item] = (higestQtyMap[item] ?? 0) + (higestQty < 0 ? 0 : higestQty);

    });

    return higestQtyMap;
    // redo this one
}*/ // old verison, still working



