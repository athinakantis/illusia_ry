import { useNavigate } from 'react-router-dom';
import { Button, TextField, Box, Typography } from '@mui/material';
import { useState } from 'react';
import { createItem } from '../slices/itemsSlice';
import { useAppDispatch } from '../store/hooks';

const AdminAddProduct = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [formData, setFormData] = useState({
        item_name: '',
        description: '',
        image_path: '',
        location: '',
        quantity: 1,
        category_id: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'quantity' ? parseInt(value, 10) : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
           dispatch(createItem(formData));  
            alert('Product added successfully!');
            navigate('/items'); 
        } catch (error) {
            console.error('Error adding product:', error);
            alert('Failed to add product.');
        }
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                maxWidth: 400,
                margin: '0 auto',
            }}
        >
            <Typography variant="h5" textAlign="center">
                Add New Product
            </Typography>
            <TextField
                label="Item Name"
                name="item_name"
                value={formData.item_name}
                onChange={handleChange}
                required
            />
            <TextField
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={3}
            />
            <TextField
                label="Image Path"
                name="image_path"
                value={formData.image_path}
                onChange={handleChange}
            />
            <TextField
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
            />
            <TextField
                label="Quantity"
                name="quantity"
                type="number"
                value={formData.quantity}
                onChange={handleChange}
                required
            />
            <TextField
                label="Category ID"
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                required
            />
            <Button type="submit" variant="contained" color="primary">
                Add Product
            </Button>
        </Box>
    );
};

export default AdminAddProduct;