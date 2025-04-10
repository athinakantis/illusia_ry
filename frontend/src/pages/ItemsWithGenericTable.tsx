import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { deleteItem, fetchAllItems, selectAllItems } from "../slices/itemsSlice";
import { Box } from "@mui/material";
import { DataGridGeneric } from "../components/UIComponents/Grid/DataGridGeneric";
import { useNavigate } from "react-router-dom";
import { GiMagnifyingGlass } from "react-icons/gi";
import { AiTwotoneDelete } from "react-icons/ai";
import { addItemToBooking } from "../slices/bookingSlice";
import { Item } from "../types/types";

function ItemsWithGenericTable() {

    const navigate = useNavigate();

    const { role } = useAuth();
    const items = useAppSelector(selectAllItems);
    const dispatch = useAppDispatch();
    useEffect(() => {
        if (role !== 'Head Admin') return;
    }, [role]);

    useEffect(() => {
        if (items.length < 1) {
            dispatch(fetchAllItems());
        }
    }, [dispatch, items]);

    const usedColumns = [
        { columnName: "Item ID", columnField: "item_id" },
        { columnName: "Name", columnField: "item_name" },
        { columnName: "Pcs available", columnField: "quantity" },
        { columnName: "Created at", columnField: "created_at" },
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

            <DataGridGeneric data={items} idColumn={"item_id"} usedColumns={usedColumns} functions={[
                { functionName: "go to", functionBody: (id: string) => navigate(`/items/${id}`), functionIcon: <GiMagnifyingGlass /> },
                {
                    functionName: "delete", functionBody: (id: string) => {
                        if (confirm('Are you sure you want to delete this item?')) {
                            dispatch(deleteItem(id)).then(() => dispatch(fetchAllItems()));
                        }
                    }, functionIcon: <AiTwotoneDelete />
                },
                { functionName: "log", functionBody: (id: string) => console.log(`/items/${id}`) },
                {
                    functionName: "a", functionBody: (id: string, quantityToBook: number = 1) => {
                        const itemToBook: Item | undefined = items.find((item) => item.item_id === id);
                        // some checks of qty and if item exists should be implemented
                        dispatch(addItemToBooking({ itemToBook, quantityToBook }));
                    }
                },
            ]} />
        </Box>
    );
}


export default ItemsWithGenericTable;