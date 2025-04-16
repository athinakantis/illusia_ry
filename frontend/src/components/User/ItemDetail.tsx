import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    Grid,
    IconButton,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchAllItems } from "../../slices/itemsSlice";
import { useParams } from "react-router-dom";

const ItemDetail: React.FC = () => {
    const [quantity, setQuantity] = useState(1);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const dispatch = useAppDispatch();
    const { itemId } = useParams<{ itemId: string }>();
    const items = useAppSelector((state) => state.items.items);
    const item = items.find((i) => i.item_id === itemId);
    console.log(item);
    useEffect(() => {
        if (!items.length) {
            dispatch(fetchAllItems());
        }
    }, [dispatch, items]);

    const handleQuantityChange = (amount: number) => {
        setQuantity((prevQuantity) => Math.max(1, prevQuantity + amount));
    };

    // Basic calculation for days - replace with actual date logic later
    const calculateDays = () => {
        if (startDate && endDate) {
            // This is a very basic placeholder calculation
            // A proper implementation would use date objects and libraries like date-fns or moment
            return "X"; // Placeholder for calculated days
        }
        return 0;
    };

    return (
        <Box sx={{ p: 3, maxWidth: 1200, margin: "auto" }}>
            <Grid container spacing={4}>
                {/* Left Column: Image */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Box
                        component="img"
                        sx={{
                            width: "100%",
                            height: "auto",
                            borderRadius: 2, // Match the rounded corners from the image
                            objectFit: "cover",
                            boxShadow: 3, // Add a subtle shadow like in the image
                        }}
                        src={item?.image_path || "/placeholder.jpg"}
                        alt={item?.item_name || "Item"}
                    />
                </Grid>

                {/* Right Column: Details */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Stack spacing={2}>
                        <Typography
                            variant="h4"
                            component="h1"
                            fontWeight="bold"
                        >
                            {item?.item_name || "Item name"}
                        </Typography>
                        <Typography
                            variant="subtitle1"
                            color="text.secondary"
                            gutterBottom
                        >
                            {item?.category || "Category"}
                        </Typography>
                        <Typography
                            component={"p"}
                            variant="body1"
                            color="text.secondary"
                            
                        >
                            {item?.description || "Description not available."}
                        </Typography>

                        <Typography variant="h6" component="div" sx={{ mt: 2 }}>
                            Select dates
                        </Typography>
                        <Stack direction="row" spacing={2} alignItems="center">
                            <TextField
                                label="Start"
                                type="date" // Use date type for better UX, though image shows text
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        borderRadius: "50px", // Rounded corners like image
                                    },
                                }}
                            />
                            <Typography>-</Typography>
                            <TextField
                                label="End"
                                type="date" // Use date type for better UX
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        borderRadius: "50px", // Rounded corners like image
                                    },
                                }}
                            />
                        </Stack>
                        <Typography variant="body2" color="text.secondary">
                            Days: {calculateDays()}
                        </Typography>

                        <Stack
                            direction="row"
                            spacing={2}
                            alignItems="center"
                            sx={{ mt: 3 }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    border: "1px solid",
                                    borderColor: "divider",
                                    borderRadius: "50px", // Rounded corners
                                    padding: "4px 8px",
                                }}
                            >
                                <IconButton
                                    size="small"
                                    onClick={() => handleQuantityChange(-1)}
                                    disabled={quantity <= 1}
                                    aria-label="decrease quantity"
                                >
                                    <RemoveIcon fontSize="small" />
                                </IconButton>
                                <Typography sx={{ px: 2 }}>
                                    {quantity}
                                </Typography>
                                <IconButton
                                    size="small"
                                    onClick={() => handleQuantityChange(1)}
                                    aria-label="increase quantity"
                                >
                                    <AddIcon fontSize="small" />
                                </IconButton>
                            </Box>
                            <Button
                                variant="contained"
                                size="large"
                                sx={{
                                    backgroundColor: "#333", // Dark color like image
                                    color: "white",
                                    borderRadius: "50px", // Rounded corners
                                    px: 4, // Padding
                                    py: 1.5, // Padding
                                    textTransform: "none", // Match image text case
                                    "&:hover": {
                                        backgroundColor: "#555", // Slightly lighter on hover
                                    },
                                }}
                            >
                                Add to Cart
                            </Button>
                        </Stack>
                    </Stack>
                </Grid>
            </Grid>
        </Box>
    );
};

export default ItemDetail;
