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
  Link,
  Avatar,
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
import { useTranslatedSnackbar } from '../CustomComponents/TranslatedSnackbar/TranslatedSnackbar';
import { useTranslation} from 'react-i18next';

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
      showSnackbar({
        message: t('userBookings.snackbar.bookingDeleted', {
        defaultValue: 'Your booking was deleted!',
        }),
        variant: 'info',
      });
    } else {
      dispatch(updateBookingStatus({ id: booking.booking_id, status: 'cancelled' }))
      showSnackbar({message: t('userBookings.snackbar.bookingCancelled', {
          defaultValue: 'Booking cancelled',  
        }),
        variant: 'info',               
      });
    }

    setWantsToCancel(null)
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

  const { t } = useTranslation();
  const { showSnackbar } = useTranslatedSnackbar();

  // Helper to fetch the first image url for an item
  const getItemImage = (id: string): string | undefined =>
    items.find(i => i.item_id === id)?.image_path?.[0];

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
          {t('userBookings.heading', { defaultValue: 'Your Bookings' })}
        </Typography>

        {bookings.length === 0 ? (
          <Typography>
            {t('userBookings.noBookings', { defaultValue: 'No bookings yet.' })}
          </Typography>
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
                      {t('userBookings.bookingId', { defaultValue: 'Booking ID' })}:
                        {booking.booking_id.slice(-12).toUpperCase()}
                      </Typography>
                      <Typography variant="body3" fontWeight={500} fontSize={14}>
                      {t('userBookings.created', { defaultValue: 'Created at' })} {new Date(booking.created_at).toLocaleString()}
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
                        <Tooltip
                          title={
                            booking.status === 'approved'
                              ? t('userBookings.cancelTooltip', { defaultValue: 'Cancel booking' })
                              : t('userBookings.deleteTooltip', { defaultValue: 'Delete booking' })
                          }
                        >
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
                      {/*——————————— Table Header —————————————*/}
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ width: 56 }} />
                          {/*——————————— Item Name ————————————*/}
                          <TableCell align="left" sx={{ pl: 0 }}>
                            {t('userBookings.item', { defaultValue: 'Item' })}
                          </TableCell>
                          {/*——————————— Start Date ———————————*/}
                          <TableCell>
                            {t('userBookings.startDate', { defaultValue: 'Start Date' })}
                          </TableCell>
                          {/*——————————— End Date ——————————————*/}
                          <TableCell>
                            {t('userBookings.endDate', { defaultValue: 'End Date' })}
                          </TableCell>
                          {/*———————————— Quantity —————————————*/}
                          <TableCell align="center">
                            {t('userBookings.quantity', { defaultValue: 'Quantity' })}
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      {/*——————————— Table Body ———————————*/}
                      <TableBody>
                        {booking.reservations.map((res) => (
                          <TableRow key={res.reservation_id}>
                            {/*———————— Item Image —————————*/}
                            <TableCell sx={{ width: 56 }}>
                              <Avatar
                                src={getItemImage(res.item_id)}
                                alt={items.find((i) => i.item_id === res.item_id)?.item_name ?? res.item_id}
                                variant="square"
                                sx={{ width: 48, height: 48 }}
                              />
                            </TableCell>
                            {/*————————— Item Name ——————————*/}
                            <TableCell align="left" sx={{ pl: 0 }}>
                              {items.find((i) => i.item_id === res.item_id)
                                ?.item_name ?? res.item_id}
                            </TableCell>
                            {/*—————————— Start Date ——————————*/}
                            <TableCell>
                              {new Date(res.start_date).toLocaleDateString()}
                            </TableCell>
                            {/*—————————— End Date —————————————*/}
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
        // Dialog to confirm booking cancellation
        <Dialog
          open={wantsToCancel ? true : false}
          onClose={() => setWantsToCancel(null)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          {/* Confirm Cancel */}
          <DialogTitle id="alert-dialog-title">
            {t('userBookings.confirmCancel', {
              defaultValue: 'Are you sure you want to cancel your booking?',
            })}
          </DialogTitle>
          <DialogActions>
            <Button variant="outlined" onClick={() => handleCancel(wantsToCancel)}>
              {t('userBookings.confirmYes', { defaultValue: "Yes, I'm sure" })}
            </Button>
            <Button
              variant="contained"
              color="secondary"
              autoFocus
              onClick={() => setWantsToCancel(null)}
            >
              {t('userBookings.confirmNo', { defaultValue: 'No thanks' })}
            </Button>
          </DialogActions>
        </Dialog>
      }
    </Container>
  );
};

export default UserBookings;
