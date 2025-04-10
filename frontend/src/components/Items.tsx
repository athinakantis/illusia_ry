import { useEffect, useState } from 'react';
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
import Pagination from './Pagination';

function Items() {
  const items = useAppSelector(selectAllItems);
  const dispatch = useAppDispatch();
  const [offset, setOffset] = useState(0)


  useEffect(() => {
    if (items.length < 1) {
      dispatch(fetchAllItems())
    }
  }, [dispatch, items])

  return (
    <Box
      sx={{
        width: '95%',
        margin: 'auto',
        display: 'flex',
        pb: '8rem'
      }}
    >
      <Box
        sx={{
          minWidth: 300,
        }}
      >
        <TextField
          id="filled-search"
          label="Search our items"
          type="search"
          variant="standard"
          sx={{ width: '80%', mt: 1 }}
        />
      </Box>


      <Box
        sx={{
          display: 'flex', flexDirection: 'column', flex: 1,
          '& .css-1c5o7vy-MuiPagination-ul': { justifyContent: 'center', pt: 2 }
        }}>
        <Stack
          direction={'row'}
          flexWrap={'wrap'}
          gap={3}
          justifySelf={'center'}
          padding={'none'}
          textAlign={'start'}
        >

          {items.slice(offset, offset + 8).map((item) => (
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
                  <Button sx={{ padding: '3px', minWidth: 'fit-content' }}>
                    <AddCircleOutlineOutlinedIcon />
                  </Button>
                </CardActions>
              </CardContent>
            </Card>
          ))}
        </Stack>
        <Pagination items={items} setOffset={setOffset} />
      </Box>
    </Box>
  );
}

export default Items;
