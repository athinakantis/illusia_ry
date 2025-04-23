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
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { RootState } from '../../store/store';
import { BookingWithRes, Item } from '../../types/types';
import { useAuth } from '../../hooks/useAuth';
import { useEffect } from 'react';
import { fetchUserBookings } from '../../slices/bookingsSlice';
import { fetchAllItems } from '../../slices/itemsSlice';

const UserBookings = () => {
  const { user } = useAuth();
  const userId = user?.id;
  const dispatch = useAppDispatch();
 
  const {
    bookings: rawBookings,
    loading,
    error,
  } = useAppSelector((state: RootState) => state.bookings);

  // Assert that these bookings include reservations, had to cast because of having different types than the store.
  const bookings = rawBookings as BookingWithRes[];

  useEffect(() => {
    if (userId && bookings.length === 0) {
      dispatch(fetchUserBookings(userId));
    }
  }, [dispatch, userId, bookings.length]);

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
              <Box display="flex" justifyContent="space-between" mb={2}>
                <Typography variant="subtitle2" color="textSecondary">
                  {new Date(booking.created_at).toLocaleString()}
                </Typography>
                {/* Status colors */}
                <Chip
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
