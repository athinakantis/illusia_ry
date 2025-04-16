import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store/store";
import { selectAllItems, selectItemById } from "../slices/itemsSlice";
import { selectAllReservations, selectAllReservationsForItem } from "../slices/reservationsSlice";
import { selectCart, selectItemInCartById, selectItemQtyInCartById } from "../slices/cartSlice";



export const checkAvailabilityForItemOnDates = (item_id: string, quantity: number, start_date: string, end_date: string) => createSelector(
    [
        selectItemById(item_id), selectAllReservations, selectItemQtyInCartById(item_id)
    ],
    (item, reservations, itemQtyInCart) => {

        const availableQuantityOfItem = (item?.quantity ? item.quantity : 0) - itemQtyInCart;

        console.log(reservations);


        // somehow solve the reservations checkup

        return (quantity - availableQuantityOfItem) <= 0;
    }

);