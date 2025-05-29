import {
  Box,
  Button,
  Chip,
  ButtonGroup,
  Dialog,
  DialogActions,
  DialogTitle,
  Link,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  deleteBooking,
  fetchBooking,
  selectBooking,
  selectBookingsLoading,
  updateBookingStatus,
} from '../slices/bookingsSlice';
import Spinner from './Spinner';

import { useTranslatedSnackbar } from './CustomComponents/TranslatedSnackbar/TranslatedSnackbar';
import { BookingWithItems } from '../types/types';
import broken_img from '../assets/broken_img.png'
import { useTranslation } from 'react-i18next';
import { RangeValue } from '@react-types/shared';
import { DateValue, getLocalTimeZone, parseDate, today } from '@internationalized/date';
import { Reservation } from '../types/types';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import { checkAvailabilityForItemOnDates } from '../selectors/availabilitySelector';
import { store } from '../store/store';
import { DateRangePicker, defaultTheme, Provider } from '@adobe/react-spectrum';
import { updateReservation } from '../slices/reservationsSlice';
import { useAuth } from '../hooks/useAuth';
import { Tables } from '../types/supabase';

function SingleBooking() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { booking_id } = useParams();
  const booking_selector = useAppSelector(selectBooking);
  const loading = useAppSelector(selectBookingsLoading);
  const [wantsToCancel, setWantsToCancel] = useState(false)
  const { showSnackbar } = useTranslatedSnackbar();
  const { t } = useTranslation();
  const [editingBooking, setEditingBooking] = useState(false); // for editing the booking
  const [tempBookingRange, setTempBookingRange] = useState<RangeValue<DateValue> | null>(null);
  const [tempBookingItems, setTempBookingItems] = useState<Array<
    Partial<Tables<'items'>> &
    Pick<Reservation, 'id' | 'quantity' | 'start_date' | 'end_date'>
  >>([]);
  const [qtyCheckErrors] = useState<Record<string, string>>({});
  const [incorrectTempBooking, setIncorrectTempBooking] = useState(false);
  const { role } = useAuth();
  const isAdmin = role === 'Admin' || role === 'Head Admin';
  const now = today(getLocalTimeZone());



  /* ─────────────────── handlers ─────────────────── */
  const handleCancel = (booking_id: string) => {
    if (booking.status === 'pending') {
      dispatch(deleteBooking(booking_id));
      showSnackbar({
        message: t('Bookings.snackbar.deleted', { defaultValue: 'Your booking was deleted' }),
        variant: 'success',
        autoHideDuration: 3000,
      })
      setTimeout(() => navigate('/bookings'), 2000)
    } else {
      dispatch(updateBookingStatus({ id: booking.booking_id, status: 'cancelled' }))
      showSnackbar({
        message: t('Bookings.snackbar.cancelled', { defaultValue: 'Your booking was cancelled' }),
        variant: 'info',
        autoHideDuration: 3000,
      })
    }
    setWantsToCancel(false)
  };

  const handleBrokenImg = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    (e.target as HTMLImageElement).src = broken_img;
  }

  /**
 * A booking can be "touched" (button shown) when:
 *   • status === "pending"   → user may DELETE the booking
 *   • status === "approved"  → user may CANCEL it *if* start date is in the future
 */
  const canModify = (b: BookingWithItems) => {
    // earliest start date across all reservations
    const earliestStart = Math.min(
      ...b?.items?.map(r => new Date(r.start_date).getTime())
    );
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (b?.booking?.status === 'pending') return true;                       // deletable
    if (b?.booking?.status === 'approved' && earliestStart > today.getTime())
      return true;                                                 // cancellable
    return false;
  };
  const handleStartEditingBooking = () => {
    setEditingBooking(true);
  }

  const handleSaveEditingBooking = () => {
    if (tempBookingRange)
      tempBookingItems.map(item => {
        item.id && dispatch(updateReservation({
          bookingId: booking.booking_id, reservationId: item.id, updatedReservation: {
            item_id: item.item_id,
            start_date: tempBookingRange.start.toString(),
            end_date: tempBookingRange.end.toString(),
            quantity: item.quantity
          }
        }))
      })
    setEditingBooking(false);
    // refetch the booking ??
  }

  const handleCancelEditingBooking = () => {
    updateTempBookingWithBooking();
    setIncorrectTempBooking(false);
    setEditingBooking(false);
  }

  const checkTempBookingForDates = (newRange: RangeValue<DateValue> | null = tempBookingRange) => {
    Object.keys(qtyCheckErrors).forEach(key => {
      delete qtyCheckErrors[key];
    }); // emtying the errors array*/

    if (newRange) {

      tempBookingItems.forEach(item => {
        const initialItemQty = booking_selector?.items.find(initialItem => initialItem.item_id === item.item_id)?.quantity ?? 0;
        if (item.item_id) {
          const availabilityCheck = checkAvailabilityForItemOnDates(
            item.item_id,
            item.quantity - initialItemQty, // is not updated fast enough
            newRange.start.toString(),
            newRange.end.toString(),
            false
          )(store.getState());

          if (availabilityCheck.severity != 'success') {
            qtyCheckErrors[item.item_id] = availabilityCheck.message;
          }
          // finish the check - if there is no success ,then there is a error
        }
      });

      setIncorrectTempBooking(Object.keys(qtyCheckErrors).length !== 0);
    }
  }

  const handleDateChange = (newRange: RangeValue<DateValue> | null) => {
    if (newRange) {
      const startDate = new Date(newRange.start.toString());
      const endDate = new Date(newRange.end.toString());
      const diffInMs = endDate.getTime() - startDate.getTime();
      const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

      if (diffInDays > 14) {
        showSnackbar({ message: t('booking.snackbar.maxDays', { defaultValue: "You can only book a maximum of 14 days" }), variant: 'warning' });
        return;
      }
      setTempBookingRange(newRange);
      checkTempBookingForDates(newRange);
    }
  };

  const handleRemove = (item_id: string, quantity: number = 1) => {
    if (editingBooking) {
      setTempBookingItems(tempBookingItems.map(item => {
        if (item.item_id == item_id) {
          if (item.quantity - quantity >= 0) {
            item.quantity -= quantity;
          }
        }
        return item;
      }))

      checkTempBookingForDates();
      // if the cart is being edited, the changes reflect only in local cart, not touching redux
    }
  }

  const handleIncrease = (item_id: string, quantity: number = 1) => {
    if (tempBookingRange) {
      const start_date = tempBookingRange.start.toString();
      const end_date = tempBookingRange.end.toString();
      const qtyInLocalCart = tempBookingItems.find(item => item.item_id === item_id)?.quantity ?? 0;
      const initialItemQty = booking_selector?.items.find(item => item.item_id === item_id)?.quantity ?? 0;

      const checkAdditionToCart = checkAvailabilityForItemOnDates(
        item_id,
        qtyInLocalCart + quantity - initialItemQty, // currently still includes the number from the reservation. Should subsctract the total qty in of the item in the reservation
        start_date,
        end_date,
        false,
      )(store.getState());
      // checks if item can be added to cart
      if (checkAdditionToCart.severity === 'success') {
        if (editingBooking) {
          setTempBookingItems(tempBookingItems.map(item => {
            if (item.item_id == item_id) {
              item.quantity += quantity;
            }
            return item;
          }))
          // if the cart is being edited, then only added to local cart
        }
        showSnackbar({ message: t('items.snackbar.itemAdded', { defaultValue: 'Item added to cart!' }), variant: 'info' });
        // adds the item in case it is available

      } else {
        showSnackbar({
          message: t(checkAdditionToCart.translationKey, { defaultValue: checkAdditionToCart.message }),
          variant: checkAdditionToCart.severity,
        });
      }
    }
  };

  const updateTempBookingWithBooking = () => {
    if (booking_selector) {
      setTempBookingItems(booking_selector.items.map(item => ({ ...item })));
      setTempBookingRange({
        start: parseDate(booking_selector.items[0].start_date),
        end: parseDate(booking_selector.items[0].end_date)
      }
      );
    }
  }

  useEffect(() => {
    updateTempBookingWithBooking();
  }, [booking_selector]);


  useEffect(() => {
    if (!booking_id) {
      navigate('/bookings');
      return;
    }
    // Always fetch fresh booking details when the ID changes
    dispatch(fetchBooking(booking_id));
  }, [booking_id, dispatch, navigate]);

  if (loading)
    return (
      <Spinner />
    );

  if (!booking_selector)
    return (
      <Stack sx={{ textAlign: 'center' }}>
        <Typography variant="heading_secondary_bold">
          No booking found!
        </Typography>
      </Stack>
    );

  const { booking } = booking_selector;

  return (
    <Box maxWidth={900} sx={{ m: 'auto', p: 2 }}>
      <Stack sx={{ justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }}>
        <Stack>
          <Typography variant="heading_secondary_bold">
            Booking ID: {booking.booking_id.slice(0, 8).toUpperCase()}
          </Typography>
          {!editingBooking ?
            <Typography variant="body2">{tempBookingRange && `${tempBookingRange.start.toString()} - ${tempBookingRange.end.toString()}`}</Typography>
            :
            <Provider theme={defaultTheme} colorScheme="light" maxWidth={270}>
              <DateRangePicker
                labelPosition="side"
                labelAlign="end"
                width={270}
                minValue={now}
                aria-label="Select dates"
                value={tempBookingRange}
                onChange={handleDateChange}
                isRequired
                maxVisibleMonths={1}
              />
            </Provider>
          }
        </Stack>

        <Chip label={booking.status} />
      </Stack>

      <Box>
        <TableContainer sx={{ pt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Item</TableCell>
                <TableCell align='center'>Qty</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tempBookingItems.map((item) => (
                <TableRow sx={{ height: 130 }} key={item.item_id}>
                  <TableCell>
                    <Link href={`/items/${item.item_id}`} sx={{ textDecoration: 'none' }}>
                      <Stack direction="row" gap={1}>
                        <img
                          onError={handleBrokenImg}
                          style={{ maxWidth: 78, borderRadius: '14px' }}
                          src={item.image_path?.[0] ?? broken_img}
                        />
                        <Stack>
                          <Typography>{item.item_name}</Typography>
                          {incorrectTempBooking &&
                            <Typography color="error">{(item.item_id && qtyCheckErrors[item.item_id])}</Typography>
                          }
                        </Stack>
                      </Stack>
                    </Link>
                  </TableCell>
                  <TableCell align='center' sx={{ width: 200 }}>
                    {!editingBooking ?
                      <Typography>{item.quantity}</Typography>
                      :
                      <ButtonGroup
                        sx={{ height: '40px' }}
                        disableElevation
                        variant="contained"
                        aria-label="Disabled button group"
                      >
                        <Button
                          onClick={() => {
                            (item.item_id && handleRemove(item.item_id));
                          }}
                          variant="outlined"
                          sx={{
                            borderRadius: '60px',
                            borderTop: '1px solid #E2E2E2 !important',
                            borderLeft: '1px solid #E2E2E2 !important',
                            borderBottom: '1px solid #E2E2E2 !important',
                            borderRight: '0px !important',
                          }}
                        >
                          <RemoveIcon />
                        </Button>
                        <Box
                          sx={{
                            width: 20,
                            textAlign: 'center',
                            borderTop: '1px solid #E2E2E2',
                            borderBottom: '1px solid #E2E2E2',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            px: 2,
                          }}
                        >
                          <Typography
                            variant="body1"
                            sx={{ height: 'fit-content', lineHeight: 1 }}
                          >
                            {item.quantity}
                          </Typography>
                        </Box>
                        <Button
                          variant="outlined"
                          onClick={() => {
                            (item.item_id && handleIncrease(item.item_id));
                          }}
                          sx={{
                            borderRadius: '60px',
                            borderTop: '1px solid #E2E2E2 !important',
                            borderRight: '1px solid #E2E2E2 !important',
                            borderBottom: '1px solid #E2E2E2 !important',
                            borderLeft: '0px',
                          }}
                        >
                          <AddIcon />
                        </Button>
                      </ButtonGroup>
                    }
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {
          // Only allow dates that are after todays date to be cancelled
          // And booking that haven't been cancelled or rejected
          canModify(booking_selector) && (
            <>
              {isAdmin &&
                <Stack display="flex" sx={{ flexDirection: 'row', gap: '10px', justifyContent: 'end' }}>
                  {editingBooking &&
                    <>
                      {!incorrectTempBooking &&
                        <Button
                          size="small"
                          variant="outlined_rounded"
                          sx={{
                            mt: 2,
                            display: 'block',
                            height: 'fit-content',
                            width: 'fit-content',
                            padding: '6px 40px',
                          }}
                          onClick={handleSaveEditingBooking}
                        >
                          Save
                        </Button>
                      }
                      <Button
                        size="small"
                        variant="outlined_rounded"
                        sx={{
                          mt: 2,
                          display: 'block',
                          height: 'fit-content',
                          width: 'fit-content',
                          padding: '6px 40px',
                        }}
                        onClick={handleCancelEditingBooking}
                      >
                        Cancel
                      </Button>
                    </>
                  }
                </Stack>
              }
              {!editingBooking && (
                <Stack sx={{ flexDirection: 'row', gap: '10px', justifyContent: 'end' }}>
                  {isAdmin &&
                    <Button
                      size="small"
                      variant="outlined_rounded"
                      sx={{
                        mt: 2,
                        display: 'block',
                        height: 'fit-content',
                        width: 'fit-content',
                        padding: '6px 40px',
                      }}
                      onClick={handleStartEditingBooking}
                    >
                      Edit Booking
                    </Button>
                  }
                  <Button
                    onClick={() => setWantsToCancel(true)}
                    size="small"
                    variant="outlined_rounded"
                    sx={{
                      mt: 2,
                      display: 'block',
                      height: 'fit-content',
                      width: 'fit-content',
                      padding: '6px 40px',
                    }}
                  >
                    Cancel Booking
                  </Button>
                </Stack>
              )
              }
            </>
          )
        }
        {wantsToCancel &&
          <Dialog
            maxWidth="md"
            open={wantsToCancel ? true : false}
            onClose={() => setWantsToCancel(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              Are you sure you want to {booking.status === 'pending' ? 'delete' : 'cancel'} your booking?
            </DialogTitle>
            <DialogActions>
              <Button variant='outlined' onClick={() => handleCancel(booking.booking_id)}>
                Yes, I'm sure
              </Button>
              <Button variant='contained' color='secondary' autoFocus onClick={() => setWantsToCancel(false)}>No thanks</Button>
            </DialogActions>
          </Dialog>
        }
      </Box>

    </Box>
  );
}

export default SingleBooking;
