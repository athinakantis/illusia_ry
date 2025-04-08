import { ItemDataGrid } from '../ItemGrid/ItemDataGrid';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { fetchAllItems, selectAllItems } from '../../slices/itemsSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { useAuth } from '../../hooks/useAuth';
import { Box, Button } from '@mui/material';


function Items() {
  const { role } = useAuth();
  const items = useAppSelector(selectAllItems);
  const dispatch = useAppDispatch();

  console.log('role in items: ', role)

  if (role === 'User' || role === 'Unapproved') return

  useEffect(() => {
    if (items.length < 1) {
      dispatch(fetchAllItems());
    }
  }, [dispatch, items]);

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
        }}
      >
        <ItemDataGrid data={items} />
      </Box>
    </>
  );
}

export default Items;
