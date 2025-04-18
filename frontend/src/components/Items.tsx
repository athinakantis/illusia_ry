import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { showNotification } from '../slices/notificationSlice';
import { fetchAllCategories, fetchAllItems, selectAllCategories, selectAllItems } from '../slices/itemsSlice';
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
  Chip,
} from '@mui/material';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import { addItemToCart } from '../slices/cartSlice'
import Pagination from './Pagination';
import { Link } from 'react-router-dom';
import { createSearchParams, useNavigate, useSearchParams } from 'react-router-dom';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { store } from '../store/store';
import { checkAvailabilityForItemOnDates } from '../selectors/availabilitySelector';


function Items() {
  const items = useAppSelector(selectAllItems);
  const categories = useAppSelector(selectAllCategories)
  const dispatch = useAppDispatch();
  const [offset, setOffset] = useState(0)
  const navigate = useNavigate()
  const [searchParams, _] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (items.length < 1) {
      dispatch(fetchAllItems())
    }
    if (!categories || categories.length < 1) {
      dispatch(fetchAllCategories())
    }
  }, [dispatch, items, categories]);


  const addToCart = (item_id: string, quantityToAdd: number = 1) => {

    // need to fetch the bookings and reservations first in order for this to work properly

    const start_date = "2025-04-14";
    const end_date = "2025-04-15";

    if (checkAvailabilityForItemOnDates(item_id, quantityToAdd, start_date, end_date)(store.getState())) {
      dispatch(addItemToCart({ item_id, quantityToAdd, start_date, end_date }));
    } else {
      console.log("not enough of item");

    }


    dispatch(showNotification({
      message: 'Item added to cart',
      severity: 'success',
    }));
  }

  const toggleCategory = (category: string) => {
    const formattedCategory = category.replace(/ /g, '-');
    const currentCategories = searchParams.get('category')?.split(',') || [];

    let newCategories: string[];

    if (currentCategories.includes(formattedCategory)) {
      // Remove it
      newCategories = currentCategories.filter(cat => cat !== formattedCategory);
    } else {
      // Add it
      newCategories = [...currentCategories, formattedCategory];
    }

    const params = new URLSearchParams();
    if (newCategories.length > 0) {
      params.set("category", newCategories.join(','));
    }

    navigate({
      pathname: '/items',
      search: `?${createSearchParams(params)}`
    });
  }

  const categoryParams = searchParams.get('category')?.split(',') || [];

  const filteredItems = items.filter((item) => {
    const matchesCategory = categoryParams.length
      ? (() => {
        const category = categories.find(cat => cat.category_id === item.category_id);
        if (!category) return false;
        const formattedCategory = category.category_name.replace(/ /g, '-');
        return categoryParams.includes(formattedCategory);
      })()
      : true;

    const matchesSearch = item.item_name.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

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
          p: 2
        }}
      >
        <TextField
          id="filled-search"
          label="Search our items"
          type="search"
          variant="standard"
          sx={{ width: '80%', mt: 1 }}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Box sx={{ pt: 4, pr: 2, gap: 1, display: 'flex' }}>
          {categories.map(category => (
            <Chip
              variant={categoryParams.includes(category.category_name.replace(/ /g, '-')) ? 'filled' : 'outlined'}
              key={category.category_id}
              label={category.category_name}
              clickable
              onClick={() => toggleCategory(category.category_name)}
              onDelete={
                categoryParams.includes(category.category_name.replace(/ /g, '-'))
                  ? () => toggleCategory(category.category_name)
                  : undefined
              }
              deleteIcon={<RemoveCircleIcon />}
              sx={{
                height: 27,
                '&:hover': { backgroundColor: 'background.lightgrey', cursor: 'pointer' }
              }}
            />
          ))}
        </Box>
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

          {filteredItems.slice(offset, offset + 8).map((item) => (
            <Card
              component={Link}
              to={`/items/${item.item_id}`}
              key={item.item_id}
              sx={{ width: 280, minHeight: 300, boxShadow: 'none' }}
            >
              <CardMedia
                component='img'
                image={item.image_path ?? ''}
                sx={{
                  bgcolor: 'background.lightgrey',
                  height: '300px',
                  borderRadius: '14px',
                }}
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
                  <Button sx={{ padding: '3px', minWidth: 'fit-content' }} onClick={(e) => {
                    // Stop add-to-cart btn from navigating elsewhere
                    e.preventDefault()
                    e.stopPropagation()
                    addToCart(item.item_id)
                  }}>
                    <AddCircleOutlineOutlinedIcon />
                  </Button>
                </CardActions>
              </CardContent>
            </Card>
          ))}
        </Stack>
        <Pagination items={filteredItems} setOffset={setOffset} />
      </Box>
    </Box>
  );
}

export default Items;
