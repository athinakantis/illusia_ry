import { useEffect, useState, useMemo } from 'react';
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
  Alert,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Divider,
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
import Spinner from './Spinner';
import broken_img from '../assets/broken_img.png';
import { useTranslation } from 'react-i18next';
import { useTranslatedSnackbar } from './CustomComponents/TranslatedSnackbar/TranslatedSnackbar';

function Items() {
  const items = useAppSelector(selectVisibleItems);
  const itemsLoading = useAppSelector(selectItemsLoading);
  const categories = useAppSelector(selectAllCategories);
  const dispatch = useAppDispatch();
  const [offset, setOffset] = useState(0);
  const navigate = useNavigate();
  const { showSnackbar } = useTranslatedSnackbar()


  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
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
      showSnackbar({ message: t('items.snackbar.selectDates'), variant: 'warning' });
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
      showSnackbar({ message: t('items.snackbar.itemAdded'), variant: 'info', divider: true, secondaryMessage: item.item_name, src: item.image_path[0] });
    } else {
      showSnackbar({ message: t(checkAdditionToCart.translationKey, { defaultValue: checkAdditionToCart.message }), variant: checkAdditionToCart.severity });
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

  const categoryParams = useMemo(() => searchParams.get('category')?.split(',') || [], [searchParams]);

  // Wrap itemsMaxBookedQty in useMemo to prevent recalculation on every render
  const itemsMaxBookedQty = useMemo(() => {
    return (range) ? checkAvailabilityForAllItemsOnDates(
      range.start.toString(),
      range.end.toString(),
    )(store.getState())
      :
      {};
  }, [range]);
  // checks the bookings of the items in date range

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Category filtering (existing logic)
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

      // Location filtering (new logic)
      const matchesLocation = selectedLocations.length === 0 || 
        selectedLocations.some(location => 
          item.location && item.location.toLowerCase().includes(location.toLowerCase())
        );

      // Enhanced search functionality (updated logic)
      const normalizedQuery = searchQuery.toLowerCase();
      const matchesSearch = normalizedQuery === '' ? true : (
        // Search in item name
        item.item_name.toLowerCase().includes(normalizedQuery) ||
        // Search in description (if exists)
        (item.description && item.description.toLowerCase().includes(normalizedQuery)) ||
        // Search in location (if exists)
        (item.location && item.location.toLowerCase().includes(normalizedQuery)) ||
        // Search in tags (if exists and is an array)
        (item.tags && Array.isArray(item.tags) && item.tags.some(tag => 
          tag.toLowerCase().includes(normalizedQuery)
        ))
      );

      // Quantity filtering (existing logic)
      const matchesQty = (range) ? (item.quantity - (itemsMaxBookedQty[item.item_id] || 0) > 0) : true;
      // checks the map, if any of the item is available

      return matchesCategory && matchesLocation && matchesSearch && matchesQty;
    });
  }, [items, categoryParams, selectedLocations, searchQuery, range, itemsMaxBookedQty, categories]);

  const handleDateChange = (newRange: RangeValue<DateValue> | null) => {
    if (newRange) {
      const startDate = new Date(newRange.start.toString());
      const endDate = new Date(newRange.end.toString());
      const diffInMs = endDate.getTime() - startDate.getTime();
      const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

      if (diffInDays > 14) {
        showSnackbar({ message: t('booking.snackbar.maxDays', { defaultValue: 'You can only book a maximum of 14 days' }), variant: 'warning' });
        return;
      }

      setRange(newRange);
    }
  };

  /* Remove 'Uncategorised' from cat options */
  const filteredCategories = categories.filter(c => c.category_name !== 'Uncategorized')

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
            width: '100%', mt: 1,
          }}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {/* Info box for disabled date picker */}
        {selectedDateRange.start_date != null && (
          <Alert severity="info" sx={{ mb: 2 }}>
            {t('items.date_picker_disabled_info')}
          </Alert>
        )}
        <Provider theme={defaultTheme} colorScheme="light">
          <DateRangePicker
            labelPosition="side"
            labelAlign="end"
            width="100%"
            aria-label="Select dates"
            value={range}
            minValue={now}
            onChange={handleDateChange}
            isRequired
            maxVisibleMonths={1}
            isDisabled={selectedDateRange.start_date != null}
          />
        </Provider>
        {/* Categories */}
        <Box>
          <Typography variant="body2" fontWeight="bold" sx={{ mb: 1 }}>
            {t('items.categories')}
          </Typography>
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
        </Box>

        {/* Location Filters */}
        <Box>
          <Divider sx={{ my: 2 }} />
          <Typography variant="body2" fontWeight="bold" sx={{ mb: 1 }}>
            {t('items.filter_by_location')}
          </Typography>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox 
                  checked={selectedLocations.includes('helsinki')}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedLocations(prev => [...prev, 'helsinki']);
                    } else {
                      setSelectedLocations(prev => prev.filter(loc => loc !== 'helsinki'));
                    }
                  }}
                  size="small"
                />
              }
              label="Helsinki"
            />
            <FormControlLabel
              control={
                <Checkbox 
                  checked={selectedLocations.includes('akaa')}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedLocations(prev => [...prev, 'akaa']);
                    } else {
                      setSelectedLocations(prev => prev.filter(loc => loc !== 'akaa'));
                    }
                  }}
                  size="small"
                />
              }
              label="Akaa"
            />
          </FormGroup>
        </Box>

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
                        maxWidth: { xs: '100%', md: 300 }
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
