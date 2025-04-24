import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { showNotification } from '../slices/notificationSlice';
import {
  fetchAllCategories,
  fetchAllItems,
  selectAllCategories,
  selectAllItems,
  selectItemById,
} from '../slices/itemsSlice';
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
import { addItemToCart, selectDateRange } from '../slices/cartSlice';
import Pagination from './Pagination';
import { Link } from 'react-router-dom';
import {
  createSearchParams,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { store } from '../store/store';
import { checkAvailabilityForAllItemsOnDates, checkAvailabilityForItemOnDates } from '../selectors/availabilitySelector';
import {
  fetchFutureReservations,
  selectAllReservations,
} from '../slices/reservationsSlice';
import { DateRangePicker, defaultTheme, Provider } from '@adobe/react-spectrum';
import { RangeValue } from '@react-types/shared';
import { DateValue, getLocalTimeZone, parseDate, today } from '@internationalized/date';

function Items() {
  const items = useAppSelector(selectAllItems);
  const categories = useAppSelector(selectAllCategories);
  const dispatch = useAppDispatch();
  const [offset, setOffset] = useState(0);
  const navigate = useNavigate();

  // eslint-disable-next-line
  const [searchParams, _] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const reservations = useAppSelector(selectAllReservations);
  const now = today(getLocalTimeZone());
  const [range, setRange] = useState<RangeValue<DateValue> | null>(null);
  const selectedDateRange = useAppSelector(selectDateRange);

  useEffect(() => {
    if (selectedDateRange.start_date && selectedDateRange.end_date) {
      setRange({ start: parseDate(selectedDateRange.start_date), end: parseDate(selectedDateRange.end_date) });
    }
  }, [selectedDateRange]);

  useEffect(() => {
    if (reservations.length < 1) {
      dispatch(fetchFutureReservations());
    }
  }, [dispatch, reservations]);

  useEffect(() => {
    if (items.length < 1) {
      dispatch(fetchAllItems());
    }
    if (!categories || categories.length < 1) {
      dispatch(fetchAllCategories());
    }
  }, [dispatch, items, categories]);

  const addToCart = (item_id: string, quantity: number = 1) => {
    // need to fetch the bookings and reservations first in order for this to work properly

    if (range?.start === undefined) {
      dispatch(showNotification({
        message: "Select dates before adding to cart",
        severity: 'warning',
      }));
      return;
    }
    // checks if there is any range selected

    const checkAdditionToCart = checkAvailabilityForItemOnDates(
      item_id,
      quantity,
      range.start.toString(),
      range.end.toString(),
    )(store.getState());
    // checks if item can be added to cart


    if (checkAdditionToCart.severity === 'success') {
      dispatch(addItemToCart({ item: selectItemById(item_id)(store.getState()), quantity, start_date: range.start.toString(), end_date: range.end.toString() }));
      dispatch(
        showNotification({
          message: 'Item added to cart',
          severity: 'success',
        }),
      );
      // adds the item in case it is available
    } else {
      dispatch(
        showNotification({
          message: checkAdditionToCart.message,
          severity: checkAdditionToCart.severity,
        }),
      );
    }
  };

  const handleBrokenImg = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    (e.target as HTMLImageElement).src = '/src/assets/broken_img.png';
  }

  const toggleCategory = (category: string) => {
    const formattedCategory = category.replace(/ /g, '-');
    const currentCategories = searchParams.get('category')?.split(',') || [];

    let newCategories: string[];

    if (currentCategories.includes(formattedCategory)) {
      // Remove it
      newCategories = currentCategories.filter(
        (cat) => cat !== formattedCategory,
      );
    } else {
      // Add it
      newCategories = [...currentCategories, formattedCategory];
    }

    const params = new URLSearchParams();
    if (newCategories.length > 0) {
      params.set('category', newCategories.join(','));
    }

    navigate({
      pathname: '/items',
      search: `?${createSearchParams(params)}`,
    });
  };

  const categoryParams = searchParams.get('category')?.split(',') || [];

  const filteredItems = items.filter((item) => {
    const matchesCategory = categoryParams.length
      ? (() => {
        const category = categories.find(
          (cat) => cat.category_id === item.category_id,
        );
        if (!category) return false;
        const formattedCategory = category.category_name.replace(/ /g, '-');
        return categoryParams.includes(formattedCategory);
      })()
      : true;

    const matchesSearch = item.item_name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const handleDateChange = (newRange: RangeValue<DateValue> | null) => {

    if (newRange) {

      const startDate = new Date(newRange.start.toString());
      const endDate = new Date(newRange.end.toString());
      const diffInMs = endDate.getTime() - startDate.getTime();
      const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

      if (diffInDays > 14) {
        alert('You can only book a maximum of 14 days.');
        return;
      }
      checkAvailabilityForAllItemsOnDates(newRange.start.toString(), newRange.end.toString())(store.getState());
      setRange(newRange);
    }
  }

  return (
    <Box
      sx={{
        display: 'flex',
        padding: 0,
        pb: '8rem',
        gap: '32px'
      }}
    >
      {/* Side panel */}
      <Stack
        sx={{
          minWidth: 300,
          maxWidth: 286,
          gap: '30px',
        }}
      >
        {/* Search */}
        <TextField
          id="filled-search"
          label="Search our items"
          type="search"
          variant="outlined"
          sx={{ width: '90%', mt: 1 }}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {/* Categories */}
        <Box sx={{ pr: 2, gap: 1, display: 'flex', flexWrap: 'wrap' }}>
          {categories.map((category) => (
            <Chip
              variant={
                categoryParams.includes(
                  category.category_name.replace(/ /g, '-'),
                )
                  ? 'filled'
                  : 'outlined'
              }
              key={category.category_id}
              label={category.category_name}
              clickable
              onClick={() => toggleCategory(category.category_name)}
              onDelete={
                categoryParams.includes(
                  category.category_name.replace(/ /g, '-'),
                )
                  ? () => toggleCategory(category.category_name)
                  : undefined
              }
              deleteIcon={<RemoveCircleIcon />}
              sx={{
                height: 27,
                '&:hover': {
                  backgroundColor: 'background.lightgrey',
                  cursor: 'pointer',
                },
              }}
            />
          ))}
        </Box>
        <Provider
          theme={defaultTheme}
          colorScheme="light"
          maxWidth={270}
        >
          <DateRangePicker
            labelPosition="side"
            labelAlign="end"
            width={270}
            aria-label="Select dates"
            value={range}
            minValue={now}
            onChange={handleDateChange}
            isRequired
            maxVisibleMonths={1}
            isDisabled={(selectedDateRange.start_date != null)}
          />
        </Provider>
      </Stack>


      {/* Items Display */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          '& .css-1c5o7vy-MuiPagination-ul': {
            justifyContent: 'center',
            pt: 2,
          }
        }}
      >
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
              sx={{ width: 280, minHeight: 300, boxShadow: 'none', textDecoration: 'none' }}
            >
              <CardMedia
                component="img"
                image={item.image_path || '/src/assets/broken_img.png'}
                onError={handleBrokenImg}
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
                <Box
                  sx={{ width: '80%', alignItems: 'center', display: 'flex' }}
                >
                  <Typography variant="body1" sx={{ width: '70%' }}>
                    {item.item_name}
                  </Typography>
                </Box>

                <CardActions
                  sx={{ padding: 0, justifySelf: 'end', width: 'fit-content' }}
                >
                  <Button
                    sx={{ padding: '3px', minWidth: 'fit-content' }}
                    onClick={(e) => {
                      // Stop add-to-cart btn from navigating elsewhere
                      e.preventDefault();
                      e.stopPropagation();
                      addToCart(item.item_id);
                    }}
                  >
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
