import {
  Box,
  Button,
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
import { showCustomSnackbar } from './CustomSnackbar';
import broken_img from '../assets/broken_img.png'

function SingleBooking() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { booking_id } = useParams();
  const booking_selector = useAppSelector(selectBooking);
  const loading = useAppSelector(selectBookingsLoading);
  const [wantsToCancel, setWantsToCancel] = useState(false)
  const NON_CANCELLABLE = ['cancelled', 'rejected']

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
    (e.target as HTMLImageElement).src = broken_img;
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

  const { items, booking } = booking_selector;

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
                          src={item.image_path?.[0] ?? broken_img}
                        />
                        <Stack>
                          <Typography>{item.item_name}</Typography>
                        </Stack>
                      </Stack>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Typography>{item.quantity}</Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {
          // Only allow dates that are after todays date to be cancelled
          // And booking that haven't been cancelled or rejected
          items[0].start_date >
          new Date().toLocaleDateString().slice(0, 10) &&
          !NON_CANCELLABLE.includes(booking.status) && (
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
