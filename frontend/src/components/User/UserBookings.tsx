import {
  Container,
  Typography,
  CircularProgress,
  Alert,
  Box,
  Stack,
  Chip,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Tooltip,
  useTheme,
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
  Link
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { RootState } from '../../store/store';
import { BookingWithRes, Item } from '../../types/types';
import { useAuth } from '../../hooks/useAuth';
import { useEffect, useState } from 'react';
import {
  deleteBooking,
  fetchUserBookings,
  selectUserBookings,
  updateBookingStatus,
} from '../../slices/bookingsSlice';
import { showCustomSnackbar } from '../CustomSnackbar';

const UserBookings = () => {
  const { user } = useAuth();
  const userId = user?.id;
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const [wantsToCancel, setWantsToCancel] = useState<BookingWithRes | null>(null);

  /* ─────────────────── handlers ─────────────────── */
  const handleCancel = (booking: BookingWithRes) => {
    if (booking.status === 'pending') {
      dispatch(deleteBooking(booking.booking_id));
      showCustomSnackbar('Your booking was deleted!', 'info');
    } else {
      dispatch(updateBookingStatus({ id: booking.booking_id, status: 'cancelled' }))
      showCustomSnackbar('Your booking was cancelled!', 'info');
    }

    setWantsToCancel(null)
    setTimeout(() => {
      if (user) dispatch(fetchUserBookings(user?.id))
    }, 10)
  };

  /* ─────────────────── selectors ─────────────────── */
  const { loading, error } = useAppSelector(
    (state: RootState) => state.bookings,
  );

  // Use selector for user bookings
  const bookings = useAppSelector(selectUserBookings) as BookingWithRes[];
  const sortedBookings = [...bookings].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );

  /**
   * A booking can be "touched" (button shown) when:
   *   • status === "pending"   → user may DELETE the booking
   *   • status === "approved"  → user may CANCEL it *if* start date is in the future
   */
  const canModify = (b: BookingWithRes) => {
    // earliest start date across all reservations
    const earliestStart = Math.min(
      ...b.reservations.map(r => new Date(r.start_date).getTime())
    );
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (b.status === 'pending') return true;                       // deletable
    if (b.status === 'approved' && earliestStart > today.getTime())
      return true;                                                 // cancellable
    return false;
  };

  /* ─────────────────── side-effects ─────────────────── */
  useEffect(() => {
    if (userId) dispatch(fetchUserBookings(userId));
  }, [dispatch, userId]);

  const items = useAppSelector(
    (state: RootState) => state.items.items as Item[],
  );

  /* ─────────────────── UI states ─────────────────── */
  if (loading)
    return (
      <Container sx={{ textAlign: 'center', mt: 4 }}>
        <CircularProgress color="secondary" />
      </Container>
    );

  if (error)
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );

  /* ─────────────────── main render ─────────────────── */
  return (
    <Container>
      <Box sx={{ maxWidth: 900, mx: 'auto', mt: 4 }}>
        <Typography
          variant="heading_secondary"
          component="h1"
          gutterBottom
          sx={{ mb: 2 }}
        >
          Your Bookings
        </Typography>

        {bookings.length === 0 ? (
          <Typography>No bookings yet.</Typography>
        ) : (
          <Stack spacing={4}>
            {sortedBookings.map((booking) => (
              <Link key={booking.booking_id} href={`/bookings/${booking.booking_id}`} sx={{ textDecoration: 'none' }}>
                <Box
                  sx={{ p: 3, pb: 4 }}
                  border={'1px solid #E2E2E2'}
                >
                  {/* booking header */}
                  <Stack
                    justifyContent={'space-between'}
                    sx={{
                      mb: 2,
                      flexDirection: { xs: 'column', md: 'row' },
                      gap: { xs: 2, md: 0 },
                    }}
                  >
                    <Stack sx={{ gap: '2px' }}>
                      <Typography variant="subheading" fontWeight={600}>
                        Booking&nbsp;ID:&nbsp;
                        {booking.booking_id.slice(-12).toUpperCase()}
                      </Typography>
                      <Typography variant="body3" fontWeight={500} fontSize={14}>
                        Created at {new Date(booking.created_at).toLocaleString()}
                      </Typography>
                    </Stack>

                    <Box>
                      <Chip
                        sx={{
                          mr: 1,
                          ...(booking.status === 'pending'
                            ? {
                              bgcolor: '#FFCA28',
                              color: theme.palette.getContrastText('#FFCA28'),
                            }
                            : {}),
                        }}
                        label={booking.status}
                        color={
                          booking.status === 'approved'
                            ? 'success'
                            : booking.status === 'pending'
                              ? 'warning'
                              : booking.status === 'rejected'
                                ? 'error'
                                : booking.status === 'cancelled'
                                  ? 'warning'
                                  : 'default'
                        }
                      />
                      {canModify(booking) && (
                        <Tooltip title={booking.status === 'approved' ? 'Cancel booking' : 'Delete booking'}>
                          <IconButton
                            onClick={(e) => {
                              e.preventDefault();
                              setWantsToCancel(booking);
                            }}
                            size="small"
                          >
                            <CloseIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}

                    </Box>
                  </Stack>

                  <TableContainer>
                    <Table
                      sx={{
                        // Remove bottom border (divider) on the last row
                        '& .MuiTableRow-root:last-child td, & .MuiTableRow-root:last-child th':
                        {
                          borderBottom: 0,
                        },
                      }}
                    >
                      <TableHead>
                        <TableRow>
                          <TableCell align="left" sx={{ pl: 0 }}>
                            Item
                          </TableCell>
                          <TableCell>Start Date</TableCell>
                          <TableCell>End Date</TableCell>
                          <TableCell align="center">Quantity</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {booking.reservations.map((res) => (
                          <TableRow key={res.reservation_id}>
                            <TableCell align="left" sx={{ pl: 0 }}>
                              {items.find((i) => i.item_id === res.item_id)
                                ?.item_name ?? res.item_id}
                            </TableCell>
                            <TableCell>
                              {new Date(res.start_date).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              {new Date(res.end_date).toLocaleDateString()}
                            </TableCell>
                            <TableCell align="center">{res.quantity}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              </Link>
            ))}
          </Stack>
        )}
      </Box>
      {wantsToCancel &&
        <Dialog
          open={wantsToCancel ? true : false}
          onClose={() => setWantsToCancel(null)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            Are you sure you want to cancel your booking?
          </DialogTitle>
          <DialogActions>
            <Button variant='outlined' onClick={() => handleCancel(wantsToCancel)}>
              Yes, I'm sure
            </Button>
            <Button variant='contained' color='secondary' autoFocus onClick={() => setWantsToCancel(null)}>No thanks</Button>
          </DialogActions>
        </Dialog>
      }
    </Container>
  );
};

export default UserBookings;
