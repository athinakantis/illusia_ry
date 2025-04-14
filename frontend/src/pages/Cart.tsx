import { Box } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { removeItemFromCart, selectCart } from "../slices/cartSlice";
import { DataGridGeneric } from '../components/CustomComponents/DataGridGeneric';

function Cart() {

    const dispatch = useAppDispatch();
    const itemsInCart = useAppSelector(selectCart);

    const itemsInCartInfo = itemsInCart.map(({ itemInCart, quantityOfItem }) => ({
        ...itemInCart,
        quantityOfItem,
    }));

    const usedColumns = [
        { columnName: "Item ID", columnField: "item_id" },
        { columnName: "Name", columnField: "item_name" },
        { columnName: "Pcs total", columnField: "quantity" },
        { columnName: "Pcs ordered", columnField: "quantityOfItem" },
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
            {itemsInCart.length > 0 ? (
                <DataGridGeneric data={itemsInCartInfo} idColumn={"item_id"} usedColumns={usedColumns} functions={[
                    { functionName: "log", functionBody: (id: string) => console.log(`/items/${id}`) },
                    {
                        functionName: "remove", functionBody: (id: string, quantityToRemove: number = 1) => {
                            dispatch(removeItemFromCart({ id, quantityToRemove }));
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