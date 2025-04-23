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
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { RootState } from '../../store/store';
import { BookingWithRes, Item } from '../../types/types';
import { useAuth } from '../../hooks/useAuth';
import { useEffect } from 'react';
import { deleteBooking, fetchUserBookings } from '../../slices/bookingsSlice';
import { fetchAllItems } from '../../slices/itemsSlice';
import { showNotification } from '../../slices/notificationSlice';

const UserBookings = () => {
  const { user } = useAuth();
  const userId = user?.id;
  const dispatch = useAppDispatch();

  const handleCancel = (bookingId: string) => {
    try {
      dispatch(deleteBooking(bookingId));
      dispatch(
        showNotification({
          message: 'Booking cancelled', // adjust wording if you like
          severity: 'info',
        })
      );
      
    } catch (error) {
      console.error('Error cancelling booking:', error);
    }
  };

  const {
    bookings: rawBookings,
    loading,
    error,
  } = useAppSelector((state: RootState) => state.bookings);

  // Assert that these bookings include reservations, had to cast because of having different types than the store.
  const bookings = rawBookings as BookingWithRes[];

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserBookings(userId));
    }
  }, [dispatch, userId]);
  // Brought in items to match by id with the item name
  const items = useAppSelector((state: RootState) => state.items.items as Item[]);

    // This isnt ideal but we need the name of the item to show in the table
  useEffect(() => {
    if (items.length === 0) {
      dispatch(fetchAllItems());
    }
  }, [dispatch, items.length]);

  if (loading) {
    return (
      <Container sx={{ textAlign: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

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
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="subtitle2" color="textSecondary">
                  {new Date(booking.created_at).toLocaleString()}
                </Typography>

                <Box display="flex" alignItems="center">
                  <Chip
                    sx={{ mr: 1 }}
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
                <Table>
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
