import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Grid,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchAllItems } from '../../slices/itemsSlice';
import { Link, useParams } from 'react-router-dom';
import { DateRangePicker, defaultTheme, Provider } from '@adobe/react-spectrum';
import { DateValue, getLocalTimeZone, today } from '@internationalized/date';
import type { RangeValue } from '@react-types/shared';
import { checkAvailabilityForItemOnDates } from '../../selectors/availabilitySelector';
import { addItemToCart } from '../../slices/cartSlice';
import { showNotification } from '../../slices/notificationSlice';
import { store } from '../../store/store';

type Props = {
  initialStartDate: DateValue,
  initialEndDate: DateValue
} | null

const ItemDetail: React.FC<Props> = (props) => {

  const [quantity, setQuantity] = useState(1);
  const now = today(getLocalTimeZone());
  const [range, setRange] = useState<RangeValue<DateValue> | null>(null);
  const dispatch = useAppDispatch();
  const { itemId } = useParams<{ itemId: string }>();
  const items = useAppSelector((state) => state.items.items);
  const item = items.find((i) => i.item_id === itemId);

  useEffect(() => {
    if (!items.length) {
      dispatch(fetchAllItems());
    }
  }, [dispatch, items]);

  useEffect(() => {
    if (props) {
      setRange({ start: props.initialStartDate, end: props.initialEndDate });
    }
  }, [])

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

      setRange(newRange);
    } else {

    }
  }

  const handleCartAddition = () => {

    if (range?.start === undefined) {
      dispatch(showNotification({
        message: "Select dates before adding to cart",
        severity: 'warning',
      }));
      return;
    }

    if (itemId && range) {
      const checkAdditionToCart = checkAvailabilityForItemOnDates(itemId, quantity, range.start.toString(), range.end.toString())(store.getState());
      if (checkAdditionToCart.severity === 'success') {
        dispatch(addItemToCart({ item_id: itemId, quantityToAdd: quantity, start_date: range.start.toString(), end_date: range.end.toString() }));
        dispatch(showNotification({
          message: 'Item added to cart',
          severity: 'success',
        }));
      } else {
        dispatch(showNotification({
          message: checkAdditionToCart.message,
          severity: checkAdditionToCart.severity,
        }));
      }
    }
  }

  const categories = useAppSelector((state) => state.items.categories);
  const category = categories.find(
    (cat) => cat.category_id === item?.category_id,
  );
  const handleQuantityChange = (amount: number) => {
    setQuantity((prevQuantity) => Math.max(1, prevQuantity + amount));
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1300, margin: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-start', px: 1, pb: 3 }}>
        <Button
          variant="outlined"
          size="small"
          component={Link}
          to="/items"
        >
          Back
        </Button>
      </Box>
      <Grid container spacing={4}>
        {/* Left Column: Image */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Box
            component="img"
            sx={{
              width: '100%',
              height: 'auto',
              borderRadius: 2,
              objectFit: 'cover',
              boxShadow: 3, //
            }}
            src={item?.image_path || ''}
            alt={item?.item_name || 'Item'}
          />
        </Grid>

        {/* Right Column: Details */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Stack spacing={2}>
            <Typography variant="h4" component="h1" fontWeight="bold">
              {item?.item_name || 'Item name'}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              {category?.category_name || 'Category'}
            </Typography>
            <Typography component={'p'} variant="body1" color="text.secondary">
              {item?.description || 'Description not available.'}
            </Typography>

            <Typography variant="h6" component="div" sx={{ mt: 2 }}>
              Select dates
            </Typography>
            <Provider
              theme={defaultTheme}
              colorScheme="light"
              maxWidth={250}
            >
              {/* Set the max width of the provider to the max width of the component to avoid nasty UI */}
              <DateRangePicker
                labelPosition="side"
                labelAlign="end"
                width={250}

                aria-label="Select dates"
                value={range}
                minValue={now}
                onChange={handleDateChange}
                isRequired
                maxVisibleMonths={1}
              />
            </Provider>

            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              sx={{ mt: 3 }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: '50px', // Rounded corners
                  padding: '4px 8px',
                }}
              >
                <IconButton
                  size="small"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  aria-label="decrease quantity"
                >
                  <RemoveIcon fontSize="small" />
                </IconButton>
                <Typography sx={{ px: 2 }}>{quantity}</Typography>
                <IconButton
                  size="small"
                  onClick={() => handleQuantityChange(1)}
                  aria-label="increase quantity"
                >
                  <AddIcon fontSize="small" />
                </IconButton>
              </Box>
              <Button
                variant="contained"
                size="large"
                onClick={handleCartAddition}
                sx={{
                  backgroundColor: '#333', // Dark color like image
                  color: 'white',
                  borderRadius: '50px', // Rounded corners
                  px: 4, // Padding
                  py: 1.5, // Padding
                  textTransform: 'none', // Match image text case
                  '&:hover': {
                    backgroundColor: '#555', // Slightly lighter on hover
                  },
                }}
              >
                Add to Cart
              </Button>
            </Stack>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ItemDetail;
