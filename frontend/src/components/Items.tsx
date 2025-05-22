import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  selectAllCategories,
  selectItemsLoading,
  selectVisibleItems,
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
import {
  checkAvailabilityForItemOnDates,
} from '../selectors/availabilitySelector';
import {
  checkAvailabilityForAllItemsOnDates,
  fetchFutureReservations,
  selectAllReservations,
} from '../slices/reservationsSlice';
import { DateRangePicker, defaultTheme, Provider } from '@adobe/react-spectrum';
import { RangeValue } from '@react-types/shared';
import {
  DateValue,
  getLocalTimeZone,
  parseDate,
  today,
} from '@internationalized/date';
import { Item } from '../types/types';
import { showCustomSnackbar } from './CustomSnackbar';
import Spinner from './Spinner';
import broken_img from '../assets/broken_img.png';
import { useTranslation } from 'react-i18next';

function Items() {
  const items = useAppSelector(selectVisibleItems);
  const itemsLoading = useAppSelector(selectItemsLoading);
  const categories = useAppSelector(selectAllCategories);
  const dispatch = useAppDispatch();
  const [offset, setOffset] = useState(0);
  const navigate = useNavigate();


  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const reservations = useAppSelector(selectAllReservations);
  const now = today(getLocalTimeZone());
  const [range, setRange] = useState<RangeValue<DateValue> | null>(null);
  const selectedDateRange = useAppSelector(selectDateRange);
  const { t } = useTranslation();

  useEffect(() => {
    if (reservations.length < 1) {
      dispatch(fetchFutureReservations());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedDateRange.start_date && selectedDateRange.end_date) {
      setRange({
        start: parseDate(selectedDateRange.start_date),
        end: parseDate(selectedDateRange.end_date),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const addToCart = (item: Item, quantity: number = 1) => {
    // need to fetch the bookings and reservations first in order for this to work properly
    if (range?.start === undefined) {
      showCustomSnackbar('Select dates before adding to cart', 'warning');
      return;
    }
    // checks if there is any range selected

    const checkAdditionToCart = checkAvailabilityForItemOnDates(
      item.item_id,
      quantity,
      range.start.toString(),
      range.end.toString(),
    )(store.getState());
    // checks if item can be added to cart


    if (checkAdditionToCart.severity === 'success') {
      dispatch(
        addItemToCart({
          item: item,
          quantity: quantity,
          start_date: range.start.toString(),
          end_date: range.end.toString(),
        }),
      );

      showCustomSnackbar('Item added to cart', 'success');

      // adds the item in case it is available
    } else {
      showCustomSnackbar(checkAdditionToCart.message, checkAdditionToCart.severity);
    }
  };

  const handleBrokenImg = (
    e: React.SyntheticEvent<HTMLImageElement, Event>,
  ) => {
    (e.target as HTMLImageElement).src = broken_img;
  };

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

  const itemsMaxBookedQty = (range) ? checkAvailabilityForAllItemsOnDates(
    range.start.toString(),
    range.end.toString(),
  )(store.getState())
    :
    {};
  // checks the bookings of the items in date range

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

    const matchesQty = (range) ? (item.quantity - (itemsMaxBookedQty[item.item_id] || 0) > 0) : true;
    // checks the map, if any of hte item is available

    return matchesCategory && matchesSearch && matchesQty;
  });

  const handleDateChange = (newRange: RangeValue<DateValue> | null) => {
    if (newRange) {
      const startDate = new Date(newRange.start.toString());
      const endDate = new Date(newRange.end.toString());
      const diffInMs = endDate.getTime() - startDate.getTime();
      const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

      if (diffInDays > 14) {

        showCustomSnackbar('You can only book a maximum of 14 days', 'warning');

        return;
      }

      setRange(newRange);
    }
  };

  /* Remove 'Uncategorised' from cat options */
  const filteredCategories = categories.filter(c => c.category_name !== 'Uncategorised')

  return (
    <Box
      sx={{
        display: 'flex',
        pt: 2,
        pb: '8rem',
        gap: '32px',
        flexDirection: { xs: 'column', md: 'row' },

      }}
    >
      {/* Side panel */}
      <Stack
        sx={{
          minWidth: 300,
          maxWidth: { xs: '100%', md: 286 },
          gap: '30px',
        }}
      >
        {/* Search */}
        <TextField
          id="filled-search"
          label={t('items.search')}
          type="search"
          variant="outlined"
          sx={{
            width: { xs: '100%', md: '90%' }, mt: 1,
          }}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {/* Categories */}
        <Box sx={{ pr: 2, gap: 1, display: 'flex', flexWrap: 'wrap' }}>
          {filteredCategories.map((category) => (
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
        <Provider theme={defaultTheme} colorScheme="light" maxWidth={270}>
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
            isDisabled={selectedDateRange.start_date != null}
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
          },
        }}
      >

        {itemsLoading ?
          <Box sx={{ margin: '0 auto' }}>
            <Spinner />
          </Box>
          :
          <>
            {filteredItems.length > 0 ?
              <>
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
                      sx={{
                        width: 280,
                        minHeight: 300,
                        boxShadow: 'none',
                        textDecoration: 'none',
                        flex: 1,
                        flexBasis: 230,
                        maxWidth: 300
                      }}
                    >
                      <Box sx={{
                        height: 300,
                        borderRadius: '14px',
                        bgcolor: 'background.lightgrey',
                        overflow: 'hidden',
                        '&:hover img': { scale: 1.03 }
                      }}>
                        <CardMedia
                          component="img"
                          image={Array.isArray(item.image_path) && item.image_path.length > 0 ? item.image_path[0] : broken_img}
                          onError={handleBrokenImg}
                          sx={{
                            height: '100%',
                            transition: 'scale 200ms',
                            backgroundColor: 'background.verylightgrey'
                          }}
                        />
                      </Box>
                      <CardContent
                        sx={{
                          padding: '0.5rem 0',
                          mb: '1rem',
                          display: 'flex',
                          justifyContent: 'space-between',
                        }}
                      >
                        <Stack
                          sx={{ width: '80%', lineHeight: '100%' }}
                        >
                          <Typography variant="body1">
                            {item.item_name}
                          </Typography>
                          <Typography variant="body3" sx={{ fontStyle: 'italic' }}>
                            Available {(range) ? item.quantity - (itemsMaxBookedQty[item.item_id] || 0) : item.quantity} pcs
                          </Typography>
                        </Stack>


                        <CardActions
                          sx={{ padding: 0, justifySelf: 'end', width: 'fit-content' }}
                        >
                          <Button
                            sx={{ padding: '3px', minWidth: 'fit-content' }}
                            onClick={(e) => {
                              // Stop add-to-cart btn from navigating elsewhere
                              e.preventDefault();
                              e.stopPropagation();
                              addToCart(item);
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
              </> :
              <Box sx={{ height: 300, justifyContent: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant='heading_secondary_bold' fontSize={24}>No items found!</Typography>
                <Typography>Try updating categories to explore our collection</Typography>
              </Box>
            }
          </>
        }
      </Box>
    </Box>
  );
}

export default Items;
