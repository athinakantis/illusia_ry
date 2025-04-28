// src/components/User/UserBookings.tsx
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
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { RootState } from '../../store/store';
import { BookingWithRes, Item } from '../../types/types';
import { useAuth } from '../../hooks/useAuth';
import { useEffect } from 'react';
import { deleteBooking, fetchUserBookings } from '../../slices/bookingsSlice';
import { showNotification } from '../../slices/notificationSlice';

const UserBookings = () => {
  const { user } = useAuth();
  const userId = user?.id;
  const dispatch = useAppDispatch();
  const theme = useTheme();

  /* ─────────────────── handlers ─────────────────── */
  const handleCancel = (bookingId: string) => {
    dispatch(deleteBooking(bookingId)).then(() =>
      dispatch(
        showNotification({
          message: 'Booking cancelled',
          severity: 'info',
        }),
      ),
    );
  };

  /* ─────────────────── selectors ─────────────────── */
  const {
    bookings: rawBookings,
    loading,
    error,
  } = useAppSelector((state: RootState) => state.bookings);

  // cast so TS knows reservations exist
  const bookings = rawBookings as BookingWithRes[];
  const sortedBookings = [...bookings].sort((a, b) =>
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );


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
        <Typography variant="heading_secondary" component='h1' gutterBottom sx={{ mb: 2 }}>
          Your Bookings
        </Typography>

        {bookings.length === 0 ? (
          <Typography>No bookings yet.</Typography>
        ) : (
          <Stack spacing={4}>
            {sortedBookings.map((booking) => (
              <Box key={booking.booking_id} sx={{ p: 3, pb: 4 }} border={'1px solid #E2E2E2'}>
                {/* booking header */}
                <Stack justifyContent={'space-between'} sx={{ mb: 2, flexDirection: { xs: 'column', md: 'row' }, gap: { xs: 2, md: 0 } }}>
                  <Stack sx={{ gap: '2px' }}>
                    <Typography
                      variant="subheading"
                      fontWeight={600}
                    >
                      Booking&nbsp;ID:&nbsp;{booking.booking_id}
                    </Typography>
                    <Typography
                      variant="body3"
                      fontWeight={500}
                      fontSize={14}
                    >Created at{' '}
                      {new Date(booking.created_at).toLocaleString()}
                    </Typography>
                  </Stack>

                  <Box>
                    <Chip
                      sx={{
                        mr: 1,
                        ...(booking.status === 'pending'
                          ? { bgcolor: '#FFCA28', color: theme.palette.getContrastText('#FFCA28') }
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
                              : 'default'
                      }
                    />
                    <Tooltip title="Cancel booking">
                      <IconButton
                        size="small"
                        onClick={() => handleCancel(booking.booking_id)}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>

                </Stack>
                <TableContainer>
                  <Table
                    sx={{
                      // Remove bottom border (divider) on the last row
                      '& .MuiTableRow-root:last-child td, & .MuiTableRow-root:last-child th': {
                        borderBottom: 0,
                      },
                    }}
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell align='left' sx={{ pl: 0 }}>Item ID</TableCell>
                        <TableCell>Start Date</TableCell>
                        <TableCell>End Date</TableCell>
                        <TableCell align='center'>Quantity</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {booking.reservations.map((res) => (
                        <TableRow key={res.reservation_id}>
                          <TableCell align='left' sx={{ pl: 0 }}>
                            {items.find((i) => i.item_id === res.item_id)?.item_name ?? res.item_id}
                          </TableCell>
                          <TableCell>
                            {new Date(res.start_date).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {new Date(res.end_date).toLocaleDateString()}
                          </TableCell>
                          <TableCell align='center'>{res.quantity}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            ))}
          </Stack>
        )
        }
      </Box >
    </Container>

  );
};

export default UserBookings;