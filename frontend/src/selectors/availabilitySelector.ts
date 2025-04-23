import { createSelector } from '@reduxjs/toolkit';
import { selectAllItems, selectItemById } from '../slices/itemsSlice';
import { selectAllReservations, selectQtyForAllItemsInReservationsInDateRange, selectQtyForItemInReservationsByIdInDateRange } from '../slices/reservationsSlice';
import { selectCart, selectQtyForItemInCartByIdInDateRange } from '../slices/cartSlice';
import { Result } from '../types/types';
import { getBookedQtyByDateAndItemForReservationsInRange, getMaxBookedQtyForManyItems } from '../utility/overlappingDates';

export const checkAvailabilityForItemOnDates = (
    item_id: string,
    quantity: number,
    start_date: string,
    end_date: string,
) =>
    createSelector(
        [
            selectItemById(item_id),
            selectQtyForItemInReservationsByIdInDateRange(
                item_id,
                start_date,
                end_date,
            ),
            selectQtyForItemInCartByIdInDateRange(item_id, start_date, end_date),
        ],
        (item, reservation, itemQtyInCart): Result => {
            if (itemQtyInCart < 0)
                return {
                    severity: 'warning',
                    message: 'Item is already in cart for another date',
                };
            // when trying to add the item on other date
            // should be fixed, so it is possible to do so, but the "item_id" column does not work for this

            if ((item?.quantity ? item.quantity : 0) < quantity + itemQtyInCart)
                return { severity: 'warning', message: 'Not enough of item overall' };

            const availableQuantityOfItem =
                (item?.quantity ? item.quantity : 0) - itemQtyInCart - reservation;

            return quantity - availableQuantityOfItem <= 0
                ? { severity: 'success', data: true }
                : {
                    severity: 'warning',
                    message: 'Not enough quantity for selected dates',
                };
        },
    );

export const checkAvailabilityForAllItemsOnDates = (
    start_date: string,
    end_date: string,
) =>
    createSelector(
        [
            selectAllItems,
            selectAllReservations,
            selectCart,
        ],
        (items, reservations, cart) => {

            const itemsMaxBookedQty = getMaxBookedQtyForManyItems(getBookedQtyByDateAndItemForReservationsInRange(new Date(start_date), new Date(end_date), reservations))

            const itemsAvailability = items.map(item => {
                return { item_id: item.item_id, quantity: item.quantity - (itemsMaxBookedQty[item.item_id] || 0) }
            });

            // console.log(itemsAvailability);

        }
    );
