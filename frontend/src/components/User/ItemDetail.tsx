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
import { selectAllCategories, selectItemById } from '../../slices/itemsSlice';
import { Link, useParams } from 'react-router-dom';
import { DateRangePicker, defaultTheme, Provider } from '@adobe/react-spectrum';
import {
  DateValue,
  getLocalTimeZone,
  parseDate,
  today,
} from '@internationalized/date';
import type { RangeValue } from '@react-types/shared';
import { checkAvailabilityForItemOnDates } from '../../selectors/availabilitySelector';
import { addItemToCart, selectDateRange } from '../../slices/cartSlice';
import { store } from '../../store/store';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { ArrowBack, ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import broken_img from '../../assets/broken_img.png';
import { selectQtyForItemInReservationsByIdInDateRange } from '../../slices/reservationsSlice';
import { useTranslatedSnackbar } from '../CustomComponents/TranslatedSnackbar/TranslatedSnackbar';
import { useTranslation } from 'react-i18next';

interface ArrowProps {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

// Custom arrow components
const NextArrow = (props: ArrowProps) => {
  const { onClick } = props;
  return (
    <IconButton
      onClick={onClick}
      sx={{
        position: 'absolute',
        right: 10,
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 1,
        bgcolor: 'rgba(255, 255, 255, 0.8)',
        '&:hover': {
          bgcolor: 'rgba(255, 255, 255, 0.9)',
        },
      }}
    >
      <ArrowForwardIos />
    </IconButton>
  );
};

const PrevArrow = (props: ArrowProps) => {
  const { onClick } = props;
  return (
    <IconButton
      onClick={onClick}
      sx={{
        position: 'absolute',
        left: 10,
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 1,
        bgcolor: 'rgba(255, 255, 255, 0.8)',
        '&:hover': {
          bgcolor: 'rgba(255, 255, 255, 0.9)',
        },
      }}
    >
      <ArrowBackIos />
    </IconButton>
  );
};

const ItemDetail: React.FC = () => {
  const [quantity, setQuantity] = useState(1);
  const now = today(getLocalTimeZone());
  const [range, setRange] = useState<RangeValue<DateValue> | null>(null);
  const dispatch = useAppDispatch();
  const { itemId } = useParams<{ itemId: string }>();
  const items = useAppSelector((state) => state.items.items);
  const item = items.find((i) => i.item_id === itemId);
  const categories = useAppSelector(selectAllCategories);
  const selectedDateRange = useAppSelector(selectDateRange);
  const { showSnackbar } = useTranslatedSnackbar();
  const { t } = useTranslation();

  const itemMaxBookedQty =
    range && itemId
      ? selectQtyForItemInReservationsByIdInDateRange(
        itemId,
        range.start.toString(),
        range.end.toString(),
      )(store.getState())
      : {};
  // checks the bookings of the items in date range

  useEffect(() => {
    if (selectedDateRange.start_date && selectedDateRange.end_date) {
      setRange({
        start: parseDate(selectedDateRange.start_date),
        end: parseDate(selectedDateRange.end_date),
      });
    }
  }, [selectedDateRange]);

  const handleDateChange = (newRange: RangeValue<DateValue> | null) => {
    if (newRange) {
      const startDate = new Date(newRange.start.toString());
      const endDate = new Date(newRange.end.toString());
      const diffInMs = endDate.getTime() - startDate.getTime();
      const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

      if (diffInDays > 14) {
        showSnackbar({
          message: t('booking.snackbar.maxDays', {
            defaultValue: 'You can only book a maximum of 14 days',
          }),
          variant: 'warning',
        });
        return;
      }
      setRange(newRange);
    }
  };

  const handleBrokenImg = (
    e: React.SyntheticEvent<HTMLImageElement, Event>,
  ) => {
    (e.target as HTMLImageElement).src = broken_img;
  };

  const handleCartAddition = () => {
    if (range?.start === undefined) {
      showSnackbar({
        message: t('items.snackbar.selectDates'),
        variant: 'warning',
      });
      return;
    }

    if (itemId && range) {
      const checkAdditionToCart = checkAvailabilityForItemOnDates(
        itemId,
        quantity,
        range.start.toString(),
        range.end.toString(),
      )(store.getState());

      if (checkAdditionToCart.severity === 'success') {
        dispatch(
          addItemToCart({
            item: selectItemById(itemId)(store.getState()),
            quantity: quantity,
            start_date: range.start.toString(),
            end_date: range.end.toString(),
          }),
        );

        showSnackbar({
          message: t('cart.snackbar.itemAdded', {
            defaultValue: 'Item was added to cart!',
          }),
          variant: 'info',
        });
      } else {
        showSnackbar({
          message: t(checkAdditionToCart.translationKey, {
            defaultValue: checkAdditionToCart.message,
            amount: checkAdditionToCart?.metadata?.amount
          }),
          variant: checkAdditionToCart.severity,
        });
      }
    }
  };

  const itemCategory = categories.find(
    (cat) => cat.category_id === item?.category_id,
  );
  const handleQuantityChange = (amount: number) => {
    setQuantity((prevQuantity) => Math.max(1, prevQuantity + amount));
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1300, margin: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-start', px: 1, pb: 3 }}>
        <Button
          component={Link}
          to="/items"
          startIcon={<ArrowBack />}
          variant="text"
          sx={{
            borderRadius: 10,
            height: 40,
            paddingLeft: 3,
            paddingRight: 3,
            color: 'text.main',
            bgcolor: 'primary.black',
            '&:hover': {
              color: 'text.main',
              bgcolor: 'primary.light',
              borderRadius: 10,
            },
          }}
        >
          Back
        </Button>
      </Box>
      <Grid container spacing={4} justifyContent={'center'}>
        {/* Left Column: Image */}
        <Grid size={{ xs: 12, sm: 6 }}>
          {item &&
            Array.isArray(item.image_path) &&
            item.image_path.some(
              (imgUrl) => typeof imgUrl === 'string' && imgUrl.trim() !== '',
            ) ? (
            <Slider
              dots
              infinite={item.image_path.length > 1}
              speed={500}
              slidesToShow={1}
              slidesToScroll={1}
              arrows={item.image_path.length > 1}
              nextArrow={<NextArrow />}
              prevArrow={<PrevArrow />}
            >
              {item.image_path
                .filter(
                  (imgUrl): imgUrl is string =>
                    typeof imgUrl === 'string' && imgUrl.trim() !== '',
                )
                .map((imgUrl, idx) => (
                  <Box key={idx}>
                    <Box
                      component="img"
                      sx={{
                        width: '100%',
                        maxWidth: 400,
                        maxHeight: 400,
                        objectFit: 'cover',
                        borderRadius: 2,
                        bgcolor: 'background.verylightgrey',
                        margin: '0 auto',
                      }}
                      onError={handleBrokenImg}
                      src={imgUrl}
                      alt={`${item.item_name} image ${idx + 1}`}
                    />
                  </Box>
                ))}
            </Slider>
          ) : (
            <Box
              component="img"
              sx={{
                width: '100%',
                height: 'auto',
                minHeight: 400,
                maxHeight: 400,
                objectFit: 'cover',
                borderRadius: 2,
                boxShadow: 0,
                bgcolor: 'background.verylightgrey',
              }}
              src={broken_img}
              alt={item?.item_name || 'Item'}
            />
          )}
        </Grid>

        {/* Right Column: Details */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Stack spacing={2}>
            <Typography
              variant="h1"
              color="#3D3D3D"
              sx={{
                fontWeight: 700,
                fontSize: 36,
                fontFamily: 'Lato, sans-serif',
              }}
            >
              {item?.item_name || 'Item name'}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              Available{' '}
              {range && item && typeof itemMaxBookedQty === 'number'
                ? item?.quantity - (itemMaxBookedQty || 0)
                : item?.quantity}{' '}
              pcs
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              {itemCategory?.category_name || 'Category'}
            </Typography>
            <Typography component={'p'} variant="body1" color="text.secondary">
              {item?.description || 'Description not available.'}
            </Typography>

            <Typography variant="subheading" component="div" sx={{ mt: 2 }}>
              Select dates
            </Typography>
            <Provider theme={defaultTheme} colorScheme="light" maxWidth={290}>
              {/* Set the max width of the provider to the max width of the component to avoid nasty UI */}
              <DateRangePicker
                labelPosition="side"
                labelAlign="end"
                width={290}
                aria-label="Select dates"
                value={range}
                minValue={now}
                onChange={handleDateChange}
                isRequired
                maxVisibleMonths={1}
                isDisabled={selectedDateRange.start_date != null}
              />
            </Provider>

            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              sx={{ mt: 3, height: '40px' }}
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
                variant="rounded"
                onClick={handleCartAddition}
                sx={{
                  height: '100%',
                  fontSize: 'clamp(15px, 1.3vw, 20px)',
                  width: '190px',
                  textTransform: 'capitalize',
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
