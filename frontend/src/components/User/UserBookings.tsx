import {
  Container,
  Typography,
  CircularProgress,
  Alert,
  Box,
  Paper,
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
import { deleteBooking, fetchUserBookings, selectUserBookings } from '../../slices/bookingsSlice';
import { fetchAllItems } from '../../slices/itemsSlice';
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
    loading,
    error,
  } = useAppSelector((state: RootState) => state.bookings);

  // Use selector for user bookings
  const bookings = useAppSelector(selectUserBookings) as BookingWithRes[];

  /* ─────────────────── side-effects ─────────────────── */
  useEffect(() => {
    if (userId) dispatch(fetchUserBookings(userId));
  }, [dispatch, userId]);

  const items = useAppSelector(
    (state: RootState) => state.items.items as Item[],
  );
  useEffect(() => {
    if (items.length === 0) dispatch(fetchAllItems());
  }, [dispatch, items.length]);

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
    <Container sx={{ mt: 4 }}>
    <Typography variant="h4" gutterBottom>
      Your Bookings
    </Typography>

    {bookings.length === 0 ? (
      <Typography>No bookings yet.</Typography>
    ) : (
      <Stack spacing={4}>
        {bookings.map((booking) => (
          <Paper key={booking.booking_id} sx={{ p: 2 }}>
            {/* booking header */}
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={1}
            >
              <Typography
                variant="h6"
                fontWeight={600}
                color={theme.palette.primary.main}
              >
                Booking&nbsp;ID:&nbsp;{booking.booking_id}
              </Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              
                <Typography
                  variant="body1"
                  fontWeight={500}
                  color={theme.palette.text.primary}
                >
                  {new Date(booking.created_at).toLocaleString()}
                </Typography>
       
              <Box display="flex" alignItems="center">
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
            </Box>
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
                    <TableCell>Item ID</TableCell>
                    <TableCell>Start Date</TableCell>
                    <TableCell>End Date</TableCell>
                    <TableCell>Quantity</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {booking.reservations.map((res) => (
                    <TableRow key={res.reservation_id}>
                      <TableCell>
                        {items.find((i) => i.item_id === res.item_id)?.item_name ?? res.item_id}
                      </TableCell>
                      <TableCell>
                        {new Date(res.start_date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {new Date(res.end_date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{res.quantity}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        ))}
      </Stack>
    )}
  </Container>
  );
};

export default UserBookings;