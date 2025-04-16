import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
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
import { Item } from '../types/types';
import { addItemToCart } from '../slices/cartSlice'
import Pagination from './Pagination';
import { createSearchParams, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
function Items() {
  const items = useAppSelector(selectAllItems);
  const categories = useAppSelector(selectAllCategories)
  const dispatch = useAppDispatch();
  const [offset, setOffset] = useState(0)
  const { search } = useLocation()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams();


  useEffect(() => {
    if (items.length < 1) {
      dispatch(fetchAllItems())
    }
    if (!categories || categories.length < 1) {
      dispatch(fetchAllCategories())
    }
  }, [dispatch, items]);

  const addToCart = (id: string, quantityOfItem: number = 1) => {
    const itemToAdd: Item | undefined = items.find((item: Item) => item.item_id === id);
    // some checks of qty and if item exists should be implemented
    dispatch(addItemToCart({ itemToAdd, quantityOfItem }));
  }

  const updateSearch = (category: string) => {
    const formattedCategory = category.replaceAll(' ', '-')
    const currentCategories = searchParams.get('category')?.split('+') || []

    if (currentCategories?.includes(formattedCategory)) return

    // Add new category to current
    currentCategories?.push(formattedCategory)

    // Create new search parameters
    const params = new URLSearchParams();
    params.set("category", currentCategories!.join(','));

    navigate({
      pathname: '/items',
      search: `?${createSearchParams(params)}`
    });
  }

  const removeFromSearch = (category: string) => {
    const formattedCategory = category.replaceAll(' ', '-')

    let filteredCategories;
    const params = new URLSearchParams(location.search)
    const currentCategories = params.get('category')!.split(',')
    filteredCategories = currentCategories.filter(cat => cat !== formattedCategory)

    // If no more category filters, clear category query
    if (filteredCategories.length < 1) {
      params.delete('category')
      return navigate('/items')
    }

    params.set('category', filteredCategories.toString())

    navigate({
      pathname: '/items',
      search: `?${createSearchParams(params)}`
    });
  }


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
        />
        <Box sx={{ pt: 4, pr: 2, gap: 1, display: 'flex' }}>
          {categories.map(category => (
            <Chip variant='filled'
              key={category.category_id}
              label={category.category_name}
              clickable={true}
              deleteIcon={search.includes(category.category_name.replaceAll(' ', '-')) ? <RemoveCircleIcon /> : <></>}
              onDelete={() => { removeFromSearch(category.category_name) }}
              onClick={() => updateSearch(category.category_name)}
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

          {items.slice(offset, offset + 8).map((item) => (
            <Card
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
                  <Button sx={{ padding: '3px', minWidth: 'fit-content' }} onClick={() => addToCart(item.item_id)}>
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
