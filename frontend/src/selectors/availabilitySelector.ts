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
  includeCart: boolean = true,
) =>
  createSelector(
    [
      selectItemById(item_id),
      selectQtyForItemInReservationsByIdInDateRange(
        item_id,
        start_date,
        end_date,
      ),
      selectQtyForItemInCartByIdInDateRange(item_id),
    ],
    (item, itemQtyInReservatios, itemQtyInCart): Result => {
      const overallItemQty = item?.quantity ? item.quantity : 0;
      const availableQuantityOfItem =
        overallItemQty -
        itemQtyInReservatios -
        (includeCart ? itemQtyInCart : 0);

      if (includeCart && overallItemQty === itemQtyInCart)
        return {
          severity: 'warning',
          message: 'Max quantity of the item is already in cart',
          translationKey: 'cart.snackbar.maxQtyError',
        };

      if (includeCart && availableQuantityOfItem === 0) {
        if (itemQtyInCart === 0)
          return {
            severity: 'warning',
            message: 'Item is not available for selected dates',
            translationKey: 'cart.snackbar.datesUnavailable',
          };
        else
          return {
            severity: 'warning',
            message:
              'Max quantity of the item for the dates is already in cart',
            translationKey: 'cart.snackbar.maxQtyDateError',
          };
      }

      if (overallItemQty < quantity)
        return {
          severity: 'warning',
          message: `Requested bigger quantity than available overall by ${
            quantity - overallItemQty
          }`,
          translationKey: 'cart.snackbar.qtyUnavailable',
        };

      return quantity - availableQuantityOfItem <= 0
        ? { severity: 'success', data: true }
        : {
            severity: 'warning',
            message: `Not enough of item available for selected dates.`,
            translationKey: 'cart.snackbar.itemQtyUnavailable',
          };
    },

    // add error that tracks if the item is already in cart, then error "all the item already in cart"
  );
