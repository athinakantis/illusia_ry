import { Box, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchBooking, selectBooking } from '../slices/bookingsSlice';

function SingleBooking() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { booking_id } = useParams();
  const booking_selector = useAppSelector(selectBooking);

  useEffect(() => {
    if (!booking_id) {
      navigate('/bookings');
    }
  }, [booking_id, navigate]);
console.log(booking_id)
  useEffect(() => {
    if (!booking_id) return;
    if (!booking_selector) dispatch(fetchBooking(booking_id));
  }, [dispatch]);

  if (!booking_selector) return (
    <Stack sx={{ textAlign: 'center' }}><Typography variant='heading_secondary_bold'>No booking found!</Typography></Stack>
  )

  const { items, booking } = booking_selector

  return (
    <Box maxWidth={900} sx={{ m: 'auto' }}>
      <Typography variant="heading_secondary_bold">
        Booking ID: {booking.booking_id.substring(24).toUpperCase()}
      </Typography>
      <Typography variant='body2'>{`${items[0].start_date} - ${items[0].end_date}`}</Typography>

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
                <TableRow key={item.item_id}>
                  <TableCell>
                    <Stack direction='row' gap={1}>
                      <img style={{ maxWidth: 78, borderRadius: '14px' }} src={item.image_path ?? '/src/assets/broken_img.png'} />
                      <Stack>
                        <Typography>{item.item_name}</Typography>
                      </Stack>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Typography>{item.quantity}</Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}

export default SingleBooking;
