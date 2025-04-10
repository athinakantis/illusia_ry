import { Box } from "@mui/material";
import { DataGridGeneric } from "../components/UIComponents/Grid/DataGridGeneric";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { removeItemFromBooking, selectBooking } from "../slices/bookingSlice";

function Cart() {

    const bookedItems = useAppSelector(selectBooking);

    const bookingItemsInfo = bookedItems.map(({ itemToBook, quantityToBook }) => ({
        ...itemToBook,
        quantityToBook,
    }));

    const dispatch = useAppDispatch();

    /*const bookedItems2 = [{
        item_id: "1",
        text: "asd"
    }]*/

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
                <DataGridGeneric data={bookingItemsInfo} idColumn={"item_id"} functions={[
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