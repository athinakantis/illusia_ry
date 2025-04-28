import {
    Box,
    Button,
    IconButton,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
    emptyCart,
    removeItemFromCart,
    selectCart,
    selectDateRange,
} from '../slices/cartSlice';
import { addBooking, fetchUserBookings } from '../slices/bookingsSlice';
import { useAuth } from '../hooks/useAuth';
import { showNotification } from '../slices/notificationSlice';
import { Link } from 'react-router-dom';

function Cart() {
    const dispatch = useAppDispatch();
    const { cart } = useAppSelector(selectCart);
    const { user } = useAuth();
    const selectedDateRange = useAppSelector(selectDateRange);

    // Calculate total quantity of all cart items
    const totalItems = cart.reduce((total, item) => total + (item.quantity || 0), 0)

    const createBookingFromCart = () => {
        const itemsForBooking = cart.map((item) => {
            const { start_date, end_date } = selectedDateRange;
            return {
                item_id: item.item_id,
                start_date: start_date,
                end_date: end_date,
                quantity: item.quantity,
            };
        });
        return { user_id: user?.id, items: itemsForBooking };
    };

    const handleBrokenImg = (
        e: React.SyntheticEvent<HTMLImageElement, Event>,
    ) => {
        (e.target as HTMLImageElement).src = '/src/assets/broken_img.png';
    };

    const handleAddBooking = async () => {
        const newBookingData: object = createBookingFromCart();
        const resultAction = await dispatch(addBooking(newBookingData));

        if (addBooking.rejected.match(resultAction)) {
            dispatch(
                showNotification({
                    message: resultAction.payload ?? 'unknown error',
                    severity: 'error',
                }),
            );
        } else {
            dispatch(
                showNotification({
                    message: 'Booking created',
                    severity: 'success',
                }),
            );
            dispatch(emptyCart())
        }
    };

    return (
        <Box
            sx={{
                maxWidth: 1240,
                m: '0 auto',
                px: 2,
            }}
        >
            <Typography variant="heading_secondary_bold">Your Cart</Typography>

            {cart.length > 0 ? (
                <Stack
                    sx={{
                        gap: '32px',
                        flexWrap: 'wrap',
                        flexDirection: {
                            xs: 'column',
                            md: 'row'
                        }
                    }}
                >
                    <TableContainer sx={{ maxWidth: 816, flex: 1, minWidth: 360 }}>
                        <Table aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Items ({totalItems})</TableCell>
                                    <TableCell align="right">Qty</TableCell>
                                    <TableCell align="right">Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {cart.map((item) => (
                                    <TableRow
                                        key={item.item_id}
                                        sx={{
                                            '&:last-child td, &:last-child th': { border: 0 },
                                            '& > td': { minHeight: 127.64 },
                                            minHeight: 127.64
                                        }}
                                    >
                                        <TableCell>
                                            <Stack direction={'row'} sx={{ gap: '21px' }}>
                                                <img
                                                    src={item.image_path}
                                                    style={{ width: 78, borderRadius: 14 }}
                                                    onError={handleBrokenImg}
                                                />
                                                <Stack sx={{ maxWidth: 186 }}>
                                                    <Typography>{item.item_name}</Typography>
                                                </Stack>
                                            </Stack>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Typography>{item.quantity}</Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                            <IconButton
                                                onClick={() => {
                                                    dispatch(
                                                        removeItemFromCart({
                                                            item_id: item.item_id,
                                                            quantityToRemove: 1,
                                                        }),
                                                    );
                                                }}
                                                aria-label="view"
                                                color="primary"
                                                size="medium"
                                            >
                                                <ClearIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Booking Summary */}
                    <Stack
                        id="booking_summary"
                        sx={{
                            border: '1px solid #E2E2E2',
                            padding: '40px 30px',
                            maxWidth: {
                                xs: 'auto',
                                md: 392
                            },
                            flex: 1,
                            gap: '24px',
                            height: 'fit-content',
                            minWidth: 290,
                        }}
                    >
                        <Typography
                            variant="body3"
                            sx={{
                                fontSize: 22,
                                borderLeft: '2px solid black',
                                color: 'text.primary',
                                pl: 2,
                                fontWeight: 500,
                            }}
                        >
                            Booking Summary
                        </Typography>
                        <Stack direction={'row'} justifyContent={'space-between'}>
                            <Typography variant="body2">Dates</Typography>
                            <Typography variant="body2">
                                {selectedDateRange.start_date} - {selectedDateRange.end_date}
                            </Typography>
                        </Stack>
                        <Stack direction={'row'} justifyContent={'space-between'}>
                            <Typography variant="body2">Total items</Typography>
                            <Typography variant="body2">{totalItems}</Typography>
                        </Stack>
                        <Button sx={{ width: { xs: 'fit-content', md: '100%' }, mx: 'auto', px: 10 }} variant="rounded" size="small" onClick={handleAddBooking}>
                            Book items
                        </Button>
                    </Stack>
                </Stack>
            ) : (
                <Typography>Your cart is currently empty! <Link to='/items'>Browse Items</Link></Typography>
            )}
        </Box>
    );
}

export default Cart;
