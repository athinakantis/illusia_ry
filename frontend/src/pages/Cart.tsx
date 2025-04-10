import { Box } from "@mui/material";
import { DataGridGeneric } from "../components/UIComponents/Grid/DataGridGeneric";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { removeItemFromBooking, selectBooking } from "../slices/bookingSlice";

function Cart() {

    const dispatch = useAppDispatch();
    const bookedItems = useAppSelector(selectBooking);

    const bookingItemsInfo = bookedItems.map(({ itemToBook, quantityToBook }) => ({
        ...itemToBook,
        quantityToBook,
    }));

    const usedColumns = [
        { columnName: "Item ID", columnField: "item_id" },
        { columnName: "Name", columnField: "item_name" },
        { columnName: "Pcs total", columnField: "quantity" },
        { columnName: "Pcs ordered", columnField: "quantityToBook" },
    ];

    return (
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
            {bookedItems.length > 0 ? (
                <DataGridGeneric data={bookingItemsInfo} idColumn={"item_id"} usedColumns={usedColumns} functions={[
                    { functionName: "log", functionBody: (id: string) => console.log(`/items/${id}`) },
                    {
                        functionName: "remove", functionBody: (id: string, quantityToRemove: number = 1) => {
                            dispatch(removeItemFromBooking({ id, quantityToRemove }));
                        }
                    },
                ]} />
            ) : (
                <p>Cart is empty</p>
            )}

        </Box>
    );

}

export default Cart;