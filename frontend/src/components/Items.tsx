import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchAllItems, selectAllItems } from '../slices/itemsSlice';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Box,
  Stack,
  Typography,
  TextField,
} from '@mui/material';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import { Item } from '../types/types';
import { addItemToBooking } from '../slices/bookingSlice'



function Items() {
  const items = useAppSelector(selectAllItems);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (items.length < 1) {
      dispatch(fetchAllItems());
    }
  }, [dispatch, items]);

  const addToCart = (id: string, quantity: number = 1) => {

    const itemToBook: Item | undefined = items.find((item: Item) => item.item_id === id);
    // some checks of qty and if item exists should be implemented
    dispatch(addItemToBooking({ itemToBook, quantity }));
  }

  return (
    <Box
      sx={{
        width: '95%',
        margin: 'auto',
        display: 'flex'
      }}>
      <Box
        sx={{
          minWidth: 300
        }}>
        <TextField
          id="filled-search"
          label="Search our items"
          type="search"
          variant="standard"
          sx={{ width: '80%', mt: 1 }}
        />
      </Box>
      <Stack
        direction={'row'}
        flexWrap={'wrap'}
        gap={3}
        justifyContent={'center'}
        maxWidth={'95%'}
        justifySelf={'center'}
        padding={'none'}
        textAlign={'start'}
      >
        {items.map((item) => (
          <Card
            key={item.item_id}
            sx={{ width: 280, minHeight: 300, boxShadow: 'none' }}
          >
            <CardMedia
              sx={{
                bgcolor: 'background.lightgrey',
                height: '300px',
                borderRadius: '14px',
              }}
              src={
                item.image_path ||
                'https://placehold.co/200x200?text=hello+world'
              }
            />
            <CardContent
              sx={{
                padding: '0.5rem 0',
                mb: '1rem',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <Box sx={{ width: '80%', alignItems: 'center', display: 'flex' }}>
                <Typography variant="body1" sx={{ width: '70%' }}>
                  {item.item_name}
                </Typography>
              </Box>

              <CardActions
                sx={{ padding: 0, justifySelf: 'end', width: 'fit-content' }}
              >
                <Button sx={{ padding: '3px', minWidth: 'fit-content' }} onClick={() => addToCart(item.item_id)}>
                  <AddCircleOutlineOutlinedIcon />
                </Button>
              </CardActions>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>
  );
}

export default Items;
