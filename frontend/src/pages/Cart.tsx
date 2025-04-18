import { Box, Button } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { removeItemFromCart, selectCart } from "../slices/cartSlice";
import { DataGridGeneric } from '../components/CustomComponents/DataGridGeneric';
import { selectAllItems } from "../slices/itemsSlice";
import ClearIcon from '@mui/icons-material/Clear';
import { addBooking } from "../slices/bookingsSlice";
import { useAuth } from "../hooks/useAuth";


function Cart() {

    const dispatch = useAppDispatch();
    const itemsInCart = useAppSelector(selectCart);
    const items = useAppSelector(selectAllItems);
    const { user } = useAuth();

    const itemsInCartInfo = itemsInCart.map(itemToShow => ({
        ...items.find(item => item.item_id === itemToShow.item_id),
        ...itemToShow,
    }));

    const usedColumns = [
        { columnName: "Item ID", columnField: "item_id" },
        { columnName: "Item Name", columnField: "item_name" },
        { columnName: "Start Date", columnField: "start_date" },
        { columnName: "End Date", columnField: "end_date" },
        { columnName: "Pcs ordered", columnField: "quantity" },
    ];

    const createBookingFromCart = () => {
        return { user_id: user?.id, items: itemsInCart };
    }


    const handleAddBooking = () => {
        const newBookingData: object = createBookingFromCart();
        dispatch(addBooking(newBookingData));
    }

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
                {itemsInCart.length > 0 ? (
                    <>
                        <DataGridGeneric data={itemsInCartInfo} idColumn={"item_id"} usedColumns={usedColumns} functions={[
                            {
                                functionName: "remove", functionIcon: <ClearIcon />, functionBody: (item_id: string, quantityToRemove: number = 1) => {
                                    dispatch(removeItemFromCart({ item_id, quantityToRemove }));
                                }
                            },
                        ]} />

                    </>
                ) : (
                    <p>Cart is empty</p>
                )
                }

            </Box >
            <Button
                variant="contained"
                color="primary"
                onClick={handleAddBooking}
            > Make booking</Button>
        </>
    );

}

export default Cart;