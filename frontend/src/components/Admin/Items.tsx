import { ItemDataGrid } from '../ItemGrid/ItemDataGrid';
import { fetchAllItemsAdmin, selectAllItems } from '../../slices/itemsSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { useAuth } from '../../hooks/useAuth';
import { Box, Button, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';


function Items() {
  const { role } = useAuth();
  const items = useAppSelector(selectAllItems);
  const navigate = useNavigate()
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchAllItemsAdmin());
  }, [dispatch]);
  // Check if user is authorized
  if (!role?.includes('Admin') || !role) return

  return (
    <>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: 2,
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
        <Box>
          <Button component={Link} variant='contained'
            onClick={() => navigate('/items/new')}
            sx={{
              bgcolor: 'primary.black',
              borderRadius: 10,
              fontSize: 16,
              px: 5
            }}>Add new item</Button>
        </Box>
        <ItemDataGrid data={items} />
      </Box>
    </>
  );
}

export default Items;
