import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import {
  Box,
  Button,
  TextField,
  Typography,
  Stack,
} from '@mui/material';

export const ItemManager = () => {
  const { session } = useAuth();
  const [itemName, setItemName] = useState('');
  const [itemIdToDelete, setItemIdToDelete] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [description, setDescription] = useState('');
  const [imagePath, setImagePath] = useState('');
  const [location, setLocation] = useState('');
  const [quantity, setQuantity] = useState(0);

  const handleAddItem = async () => {
    if (!session?.access_token) return;

    try {
      const res = await fetch('http://localhost:5001/items', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          item_name: itemName,
          description,
          image_path: imagePath,
          location,
          quantity,
        }),
      });

      const result = await res.json();
      if (res.ok) {
        setResponseMessage('Item added successfully!');
      } else {
        setResponseMessage(`Error: ${result.message}`);
      }
    } catch (err) {
        console.log(err);
      setResponseMessage('Error adding item.');
    }
  };

  const handleDeleteItem = async () => {
    if (!session?.access_token) return;

    try {
      const res = await fetch(`http://localhost:5001/items/${itemIdToDelete}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      const result = await res.json();
      if (res.ok) {
        setResponseMessage(`Item ${itemIdToDelete} deleted.`);
      } else {
        setResponseMessage(`Error: ${result.message}`);
      }
    } catch (err) {
        console.log(err);
      setResponseMessage('Error deleting item.');
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Manage Items
      </Typography>

      <Stack spacing={2} direction="column" maxWidth={400}>
        <TextField
          label="Item Name"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
        />
        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <TextField
          label="Image Path"
          value={imagePath}
          onChange={(e) => setImagePath(e.target.value)}
        />
        <TextField
          label="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <TextField
          label="Quantity"
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
        />
        <Button variant="contained" onClick={handleAddItem}>
          Add Item
        </Button>

        <TextField
          label="Item ID to Delete"
          value={itemIdToDelete}
          onChange={(e) => setItemIdToDelete(e.target.value)}
        />
        <Button variant="outlined" color="error" onClick={handleDeleteItem}>
          Delete Item
        </Button>

        {responseMessage && (
          <Typography variant="body2" color="primary">
            {responseMessage}
          </Typography>
        )}
      </Stack>
    </Box>
  );
};