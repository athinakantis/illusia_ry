import { Box } from "@mui/material";
import { DataGridGeneric } from "../components/UIComponents/Grid/DataGridGeneric";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { removeItemFromBooking, selectBooking } from "../slices/bookingSlice";

function Cart() {

    const bookedItems = useAppSelector(selectBooking);

    const dispatch = useAppDispatch();

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
                <DataGridGeneric data={bookedItems} idColumn={"item_id"} functions={[
                    { functionName: "log", functionBody: (id: string) => console.log(`/items/${id}`) },
                    {
                        functionName: "remove", functionBody: (id: string) => {
                            dispatch(removeItemFromBooking(id));
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