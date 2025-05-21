import {
  Box,
  Button,
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
import { useDebugValue, useEffect, useState } from 'react';
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
import { showCustomSnackbar } from './CustomSnackbar';
import { RangeValue } from '@react-types/shared';
import { DateValue, parseDate } from '@internationalized/date';
import { ItemWithQuantity, Reservation } from '../types/types';
import { Tables } from '../types/supabase.type';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';

function SingleBooking() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { booking_id } = useParams();
  const booking_selector = useAppSelector(selectBooking);
  const loading = useAppSelector(selectBookingsLoading);
  const [wantsToCancel, setWantsToCancel] = useState(false)
  const NON_CANCELLABLE = ['cancelled', 'rejected'];

  const [editingBooking, setEditingBooking] = useState(false); // for editing the booking
  const [tempBookingRange, setTempBookingRange] = useState<RangeValue<DateValue> | null>(null);
  const [tempBookingItems, setTempBookingItems] = useState<Array<
    Partial<Tables<'items'>> &
    Pick<Reservation, 'quantity' | 'start_date' | 'end_date'>
  >>([]);
  const [qtyCheckErrors] = useState<Record<string, string>>({});
  const [incorrectBooking, setIncorrectBooking] = useState(false);




  /* ─────────────────── handlers ─────────────────── */
  const handleCancel = (booking_id: string) => {
    if (booking.status === 'pending') {
      dispatch(deleteBooking(booking_id));
      showCustomSnackbar('Your booking was deleted!', 'info');
      setTimeout(() => navigate('/bookings'), 2000)
    } else {
      dispatch(updateBookingStatus({ id: booking.booking_id, status: 'cancelled' }))
      showCustomSnackbar('Your booking was cancelled!', 'info');
    }
    setWantsToCancel(false)
  };

  const handleBrokenImg = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    (e.target as HTMLImageElement).src = '/src/assets/broken_img.png';
  }

  const handleStartEditingBooking = () => {
    setEditingBooking(true);
    updateTempBooking();
  }

  const handleSaveEditingBooking = () => {
    setEditingBooking(false);
  }

  const handleCancelEditingBooking = () => {
    setEditingBooking(false);

  }

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
      <Box sx={{ mx: 'auto', width: 'fit-content' }}>
        <Spinner />
      </Box>
    );

  if (!booking_selector)
    return (
      <Stack sx={{ textAlign: 'center' }}>
        <Typography variant="heading_secondary_bold">
          No booking found!
        </Typography>
      </Stack>
    );

  const updateTempBooking = () => {
    setTempBookingItems(booking_selector.items.map(item => ({ ...item })));
    setTempBookingRange({
      start: parseDate(booking_selector.items[0].start_date),
      end: parseDate(booking_selector.items[0].end_date)
    });
  }

  const { items, booking } = booking_selector;

  console.log(booking_selector);


  return (
    <Box maxWidth={900} sx={{ m: 'auto', p: 2 }}>
      <Typography variant="heading_secondary_bold">
        Booking ID: {booking.booking_id.substring(24).toUpperCase()}
      </Typography>
      <Typography variant="body2">{`${items[0].start_date} - ${items[0].end_date}`}</Typography>

      <Box>
        <TableContainer sx={{ pt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Item</TableCell>
                <TableCell>Qty</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item) => (
                <TableRow sx={{ height: 130 }} key={item.item_id}>
                  <TableCell>
                    <Link href={`/items/${item.item_id}`} sx={{ textDecoration: 'none' }}>
                      <Stack direction="row" gap={1}>
                        <img
                          onError={handleBrokenImg}
                          style={{ maxWidth: 78, borderRadius: '14px' }}
                          src={item.image_path ?? '/src/assets/broken_img.png'}
                        />
                        <Stack>
                          <Typography>{item.item_name}</Typography>
                        </Stack>
                      </Stack>
                    </Link>
                  </TableCell>
                  <TableCell>
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

        <Box display="flex" justifyContent="flex-end">
          {!editingBooking ?
            <Button
              size="small"
              variant="outlined_rounded"
              sx={{
                mt: 2,
                display: 'block',
                ml: 'auto',
                height: 'fit-content',
                width: 'fit-content',
                padding: '6px 40px',
              }}
              onClick={handleStartEditingBooking}
            >
              Edit Booking
            </Button>
            :
            <>
              <Button
                size="small"
                variant="outlined_rounded"
                sx={{
                  mt: 2,
                  display: 'block',
                  ml: 'auto',
                  height: 'fit-content',
                  width: 'fit-content',
                  padding: '6px 40px',
                }}
                onClick={handleSaveEditingBooking}
              >
                Save
              </Button>
              <Button
                size="small"
                variant="outlined_rounded"
                sx={{
                  mt: 2,
                  display: 'block',
                  ml: 'auto',
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
        </Box>
        {
          // Only allow dates that are after todays date to be cancelled
          // And booking that haven't been cancelled or rejected
          items[0].start_date >
          new Date().toLocaleDateString().slice(0, 10) &&
          !NON_CANCELLABLE.includes(booking.status) && (
            <>
              <Button
                onClick={() => setWantsToCancel(true)}
                size="small"
                variant="outlined_rounded"
                sx={{
                  mt: 2,
                  display: 'block',
                  ml: 'auto',
                  height: 'fit-content',
                  width: 'fit-content',
                  padding: '6px 40px',
                }}
              >
                Cancel
              </Button>
            </>
          )
        }
        {wantsToCancel &&
          <Dialog
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
