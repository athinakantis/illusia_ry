import { createSelector } from '@reduxjs/toolkit';
import { selectItemById } from '../slices/itemsSlice';
import { selectQtyForItemInReservationsByIdInDateRange } from '../slices/reservationsSlice';
import { selectQtyForItemInCartByIdInDateRange } from '../slices/cartSlice';
import { Result } from '../types/types';

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
