import { Box } from "@mui/material";
import { DataGridGeneric } from "../components/UIComponents/Grid/DataGridGeneric";

function Cart() {

    const bookedItems = [
        {
            item_id: "123",
            name: "asdasd"
        },
        {
            item_id: "1234",
            name: "asdasd"
        },
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

            <DataGridGeneric data={bookedItems} functions={[
                { functionName: "log", functionBody: (id: string) => console.log(`/items/${id}`) },
            ]} />
        </Box>
    );

}

export default Cart;