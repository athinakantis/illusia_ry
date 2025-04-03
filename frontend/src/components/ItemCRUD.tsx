import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import {
  Box,
  Button,
  TextField,
  Typography,
  Stack,
  Divider,
} from '@mui/material';
import { DynamicTable } from './DynamicTable';
import { ItemDataGrid } from './ItemGrid/ItemDataGrid';

export const ItemTester = () => {
  const { session } = useAuth();
  const token = session?.access_token;

  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    item_name: '',
    description: '',
    image_path: '',
    location: '',
    quantity: 0,
    category_id: '11111111-1111-1111-1111-111111111111',
  });
  const [itemIdToUpdate, setItemIdToUpdate] = useState('');
  const [itemIdToDelete, setItemIdToDelete] = useState('');
  const [log, setLog] = useState('');

  const apiUrl = 'http://localhost:5001/items';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'quantity' ? Number(value) : value,
    }));
  };

  const logResult = (msg) => setLog(JSON.stringify(msg, null, 2));

  const getItems = async () => {
    const res = await fetch(apiUrl, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const result = await res.json();
    setItems(result.data);
    logResult(result);
  };

  const addItem = async () => {
    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });
    const result = await res.json();
    logResult(result);
    getItems();
  };

  const updateItem = async () => {
    const res = await fetch(`${apiUrl}/${itemIdToUpdate}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ...form }),
    });
    const result = await res.json();
    logResult(result);
    getItems();
  };

  const deleteItem = async () => {
    const res = await fetch(`${apiUrl}/${itemIdToDelete}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("itemIdToDelete", itemIdToDelete)
    const result = await res.json();
    logResult(result);
    getItems();
  };

  useEffect(() => {
    if (token) getItems();
  }, [token]);

  return (
    <Box p={3}>
      <Typography variant="h4">/items CRUD Tester</Typography>

      <Stack spacing={2} mt={3}>
        <TextField label="Item Name" name="item_name" value={form.item_name} onChange={handleChange} />
        <TextField label="Description" name="description" value={form.description} onChange={handleChange} />
        <TextField label="Image Path" name="image_path" value={form.image_path} onChange={handleChange} />
        <TextField label="Location" name="location" value={form.location} onChange={handleChange} />
        <TextField label="Quantity" type="number" name="quantity" value={form.quantity} onChange={handleChange} />
        <TextField label="Category ID" name="category_id" value={form.category_id} onChange={handleChange} />

        <Button variant="contained" onClick={addItem}>Create Item</Button>

        <Divider />
        <TextField label="Item ID to Update" value={itemIdToUpdate} onChange={(e) => setItemIdToUpdate(e.target.value)} />
        <Button variant="outlined" onClick={updateItem}>Update Item</Button>

        <Divider />
        <TextField label="Item ID to Delete" value={itemIdToDelete} onChange={(e) => setItemIdToDelete(e.target.value)} />
        <Button variant="outlined" color="error" onClick={deleteItem}>Delete Item</Button>

        <Divider />
        <Button variant="text" onClick={getItems}>Get Items</Button>
        <ItemDataGrid data={items} />
      
      </Stack>
    </Box>
  );
};