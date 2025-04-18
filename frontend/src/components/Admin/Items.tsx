import { ItemDataGrid } from '../ItemGrid/ItemDataGrid';
import { useEffect } from 'react';
import {  fetchAllItems, selectAllItems } from '../../slices/itemsSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { useAuth } from '../../hooks/useAuth';
import { Box } from '@mui/material';


function Items() {
  const { role } = useAuth();
  const items = useAppSelector(selectAllItems);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!items || items.length < 1) {
      dispatch(fetchAllItems());
    }

  }, [dispatch, items]);

  // Check if user is authorized
  if (!role?.includes('Admin') || !role) return

  return (
    <>
      <Box
        sx={{
          mt: 5,
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          padding: 4,
          boxSizing: 'border-box',
          '& .super-app-theme--header': {
            fontFamily: 'Roboto Slab, sans-serif',
            fontSize: '1rem'
          },
          '& .super-app-theme--header svg': {
            fill: 'white'
          }
        }}
      >
        <ItemDataGrid data={items} />
      </Box>
    </>
  );
}

export default Items;
