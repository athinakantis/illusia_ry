import { Box, Button } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { emptyCart, loadCartFromStorage, removeItemFromCart, selectCart, selectDateRange } from '../slices/cartSlice';
import { DataGridGeneric } from '../components/CustomComponents/DataGridGeneric';
import ClearIcon from '@mui/icons-material/Clear';
import { addBooking } from '../slices/bookingsSlice';
import { useAuth } from '../hooks/useAuth';
import { showNotification } from '../slices/notificationSlice';
import { ItemWithQuantity, LocalReservation } from '../types/types';
import { useEffect } from 'react';

function Cart() {
    const dispatch = useAppDispatch();
    const cart = useAppSelector(selectCart);
    const { user } = useAuth();
    const selectedDateRange = useAppSelector(selectDateRange);


    // Load locally stored cart
    useEffect(() => {
        const savedCart: ItemWithQuantity[] = JSON.parse(localStorage.getItem('savedCart') ?? '[]')
        // If cart has less items than the locally stored array
        // load from storage
        if (cart.length < savedCart.length) {
            dispatch(loadCartFromStorage(savedCart))
        }
    }, [])

    const cartInfo = cart.map(({ item, quantity }) => ({
        ...item, quantity
    }));

    const usedColumns = [
        { columnName: 'Item ID', columnField: 'item_id' },
        { columnName: 'Item Name', columnField: 'item_name' },
        { columnName: 'Pcs ordered', columnField: 'quantity' },
    ];

    const createBookingFromCart = () => {
        const itemsForBooking = cart.map(item => {
            return { item_id: item.item.item_id, start_date: selectedDateRange.start_date, end_date: selectedDateRange.end_date, quantity: item.quantity }
        })
        return { user_id: user?.id, items: itemsForBooking };
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
        }
    };

    return (
        <>
            <Box
                sx={{
                    mt: 5,
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    padding: 4,
                    boxSizing: 'border-box',
                }}
            >
                {cart.length > 0 ? (
                    <>
                        <DataGridGeneric
                            data={cartInfo}
                            idColumn={'item_id'}
                            usedColumns={usedColumns}
                            functions={[
                                {
                                    functionName: 'remove',
                                    functionIcon: <ClearIcon />,
                                    functionBody: (
                                        item_id: string,
                                        quantityToRemove: number = 1,
                                    ) => {
                                        dispatch(removeItemFromCart({ item_id, quantityToRemove }));
                                    },
                                },
                            ]}
                        />
                    </>
                ) : (
                    <p>Cart is empty</p>
                )}
            </Box>
            <Button variant="contained" color="primary" onClick={handleAddBooking}>
                {' '}
                Make booking
            </Button>
            <Button
                variant="contained"
                color="primary"
                onClick={() => dispatch(emptyCart())}
            >
                {' '}
                Clear cart
            </Button>
        </>
    );
}

export default Cart;
