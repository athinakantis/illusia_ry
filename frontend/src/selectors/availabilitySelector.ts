import { createSelector } from "@reduxjs/toolkit";
import { selectItemById } from "../slices/itemsSlice";
import { selectAllReservations, selectAllReservationsForItem } from "../slices/reservationsSlice";
import { selectQtyForItemInCartByIdInDateRange } from "../slices/cartSlice";
import { Result } from "../types/types";

export const checkAvailabilityForItemOnDates = (item_id: string, quantity: number, start_date: string, end_date: string) => createSelector(
    [
        selectItemById(item_id), selectQtyForItemInCartByIdInDateRange(item_id, start_date, end_date)
    ],
    (item, itemQtyInCart): Result => {

        if (itemQtyInCart < 0) return { severity: 'warning', message: "Item is already added for another date" };
        // when trying to add the item on other date

        const availableQuantityOfItem = (item?.quantity ? item.quantity : 0) - itemQtyInCart;
        // somehow solve the reservations checkup

        return ((quantity - availableQuantityOfItem) <= 0) ? { severity: 'success', data: true } : { severity: 'error', message: "Not enough quantity for selected date" };
    }

);

/*
export const checkAvailabilityForItemOnDates = (item_id: string, quantity: number, start_date: string, end_date: string) => createSelector(
    [
        selectItemById(item_id), selectAllReservations, selectQtyForItemInCartByIdInDateRange(item_id, start_date, end_date)
    ],
    (item, reservations, itemQtyInCart): Result => {

        if (itemQtyInCart < 0) return { severity: 'warning', message: "Item is already added for another date" };
        // when trying to add the item on other date

        const availableQuantityOfItem = (item?.quantity ? item.quantity : 0) - itemQtyInCart;
        //const availableQuantityOfItem = (item?.quantity ? item.quantity : 0) - itemQtyInCart;

        //console.log(reservations);

        //console.log("total qty of item: ");
        //console.log((item?.quantity ? item.quantity : 0));
        //console.log("Item in cart on dates requested");






        // somehow solve the reservations checkup

        return ((quantity - availableQuantityOfItem) <= 0) ? { severity: 'success', data: true } : { severity: 'error', message: "Not enough quantity for selected date" };
    }

);
*/