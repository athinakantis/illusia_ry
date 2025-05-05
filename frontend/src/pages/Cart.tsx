import {
	Box,
	Button,
	ButtonGroup,
	CardMedia,
	Stack,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
} from '@mui/material';
import RemoveIcon from '@mui/icons-material/Remove';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
	addItemToCart,
	emptyCart,
	removeItemFromCart,
	selectCart,
	selectDateRange,
	setDateRange,
} from '../slices/cartSlice';
import InfoOutlineIcon from '@mui/icons-material/InfoOutline';
import { addBooking, fetchUserBookings } from '../slices/bookingsSlice';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';
import { showCustomSnackbar } from '../components/CustomSnackbar';
import { store } from '../store/store';
import { checkAvailabilityForItemOnDates } from '../selectors/availabilitySelector';
import { useEffect, useState } from 'react';
import { DateValue, getLocalTimeZone, parseDate, today } from '@internationalized/date';
import { RangeValue } from '@react-types/shared';
import { DateRangePicker, defaultTheme, Provider } from '@adobe/react-spectrum';

function Cart() {
	const dispatch = useAppDispatch();
	const { cart } = useAppSelector(selectCart);
	const { user } = useAuth();
	const selectedDateRange = useAppSelector(selectDateRange);
	const [editingDate, setEditingDate] = useState(false);
	const [range, setRange] = useState<RangeValue<DateValue> | null>(null);
	const now = today(getLocalTimeZone());

	useEffect(() => {
		updateRangeWithSelectedRange();
	}, [selectedDateRange]);

	const updateRangeWithSelectedRange = () => {
		if (selectedDateRange.start_date && selectedDateRange.end_date) {
			setRange({
				start: parseDate(selectedDateRange.start_date),
				end: parseDate(selectedDateRange.end_date),
			});
			// move to range in the DatePickjer
		} else {
			setRange(null);
		}
	}

	// Calculate total quantity of all cart items
	const totalItems = cart.reduce(
		(total, item) => total + (item.quantity || 0),
		0,
	);

	const createBookingFromCart = () => {
		const itemsForBooking = cart.map((item) => {
			const { start_date, end_date } = selectedDateRange;
			return {
				item_id: item.item_id,
				start_date: start_date,
				end_date: end_date,
				quantity: item.quantity,
			};
		});
		return { user_id: user?.id, items: itemsForBooking };
	};

	const handleBrokenImg = (
		e: React.SyntheticEvent<HTMLImageElement, Event>,
	) => {
		console.log('handle error');
		(e.target as HTMLImageElement).src = '/src/assets/broken_img.png';
	};

	const handleToggle = () => {
		setEditingDate((prev) => !prev); // Toggles between true/false
	};

	const handleCancelDateEdit = () => {
		updateRangeWithSelectedRange();
		handleToggle();
	}

	const handleCompleteDateEdit = () => {
		if (editingDate === true) {
			if (range) {
				dispatch(setDateRange({ newStartDate: range.start.toString(), newEndDate: range.end.toString() }));
				showCustomSnackbar('Date is updated', 'success');
				handleToggle();
			}
		}
	}

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

	const handleIncrease = (item_id: string, quantity: number = 1) => {
		const { start_date, end_date } = selectedDateRange;

		if (start_date && end_date) {
			const checkAdditionToCart = checkAvailabilityForItemOnDates(
				item_id,
				quantity,
				start_date,
				end_date,
			)(store.getState());
			// checks if item can be added to cart

			if (checkAdditionToCart.severity === 'success') {
				dispatch(
					addItemToCart({
						item: cart.find((itemInCart) => itemInCart.item_id === item_id),
						quantity: quantity,
						start_date: start_date,
						end_date: end_date,
					}),
				);
				showCustomSnackbar('Item added to cart', 'success');
				// adds the item in case it is available
			} else {
				showCustomSnackbar(
					checkAdditionToCart.message,
					checkAdditionToCart.severity,
				);
			}
		}
	};

	const handleAddBooking = async () => {
		const newBookingData: object = createBookingFromCart();
		const resultAction = await dispatch(addBooking(newBookingData));
		if (!user) {
			showCustomSnackbar('Only registered users can make a booking', 'error');
			return;
		}
		if (addBooking.rejected.match(resultAction)) {
			showCustomSnackbar(resultAction.payload ?? 'unknown error', 'error');
		} else {
			showCustomSnackbar('Booking created', 'success');
			dispatch(emptyCart());
			dispatch(fetchUserBookings(user.id));
		}
	};

	return (
		<Box
			sx={{
				maxWidth: 1240,
				m: '0 auto',
				px: 2,
			}}
		>
			<Typography variant="heading_secondary_bold">Your Cart</Typography>

			{cart.length > 0 ? (
				<Stack
					sx={{
						gap: '32px',
						flexWrap: 'wrap',
						flexDirection: {
							xs: 'column',
							md: 'row',
						},
					}}
				>
					<TableContainer sx={{ maxWidth: 816, flex: 1, minWidth: 360 }}>
						<Table aria-label="simple table">
							<TableHead>
								<TableRow>
									<TableCell>Items ({totalItems})</TableCell>
									<TableCell align="center">Qty</TableCell>
									<TableCell align="right">Action</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{cart.map((item) => (
									<TableRow
										key={item.item_id}
										sx={{
											'&:last-child td, &:last-child th': { border: 0 },
											'& > td': { minHeight: 127.64 },
											minHeight: 127.64,
										}}
									>
										<TableCell>
											<Stack direction={'row'} sx={{ gap: '21px' }}>
												<CardMedia
													component="img"
													image={
														item.image_path || '/src/assets/broken_img.png'
													}
													onError={handleBrokenImg}
													style={{ width: 78, borderRadius: 14 }}
												/>
												<Stack sx={{ maxWidth: 186 }}>
													<Typography>{item.item_name}</Typography>
												</Stack>
											</Stack>
										</TableCell>
										<TableCell align="center">
											<ButtonGroup
												sx={{ height: '40px' }}
												disableElevation
												variant="contained"
												aria-label="Disabled button group"
											>
												<Button
													onClick={() => {
														dispatch(
															removeItemFromCart({
																item_id: item.item_id,
																quantityToRemove: 1,
															}),
														);
													}}
													variant="outlined"
													sx={{
														borderRadius: '60px',
														borderTop: '1px solid #E2E2E2 !important',
														borderLeft: '1px solid #E2E2E2 !important',
														borderBottom: '1px solid #E2E2E2 !important',
														borderRight: '0px !important',
													}}
												>
													<RemoveIcon />
												</Button>
												<Box
													sx={{
														width: 20,
														textAlign: 'center',
														borderTop: '1px solid #E2E2E2',
														borderBottom: '1px solid #E2E2E2',
														display: 'flex',
														alignItems: 'center',
														justifyContent: 'center',
														px: 2,
													}}
												>
													<Typography
														variant="body1"
														sx={{ height: 'fit-content', lineHeight: 1 }}
													>
														{item.quantity}
													</Typography>
												</Box>
												<Button
													variant="outlined"
													onClick={() => {
														handleIncrease(item.item_id);
													}}
													sx={{
														borderRadius: '60px',
														borderTop: '1px solid #E2E2E2 !important',
														borderRight: '1px solid #E2E2E2 !important',
														borderBottom: '1px solid #E2E2E2 !important',
														borderLeft: '0px',
													}}
												>
													<AddIcon />
												</Button>
											</ButtonGroup>
										</TableCell>
										<TableCell align="right" sx={{ pr: 0 }}>
											<Button
												sx={{ gap: '6px' }}
												variant="outlined_rounded"
												onClick={() =>
													dispatch(
														removeItemFromCart({
															item_id: item.item_id,
															quantityToRemove: item.quantity,
														}),
													)
												}
											>
												Remove
												<CloseIcon sx={{ fill: '#414141' }} />
											</Button>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</TableContainer>

					{/* Booking Summary */}
					<Stack
						id="booking_summary"
						sx={{
							border: '1px solid #E2E2E2',
							padding: '40px 30px',
							maxWidth: {
								xs: 'auto',
								md: 392,
							},
							flex: 1,
							gap: '24px',
							height: 'fit-content',
							minWidth: 290,
						}}
					>
						<Typography
							variant="body3"
							sx={{
								fontSize: 22,
								borderLeft: '2px solid black',
								color: 'text.primary',
								pl: 2,
								fontWeight: 500,
							}}
						>
							Booking Summary
						</Typography>
						<Stack direction={'row'} justifyContent={'space-between'}>
							<Typography variant="body2">Dates</Typography>
							{!editingDate ?
								<Typography variant="body2">
									{selectedDateRange.start_date} - {selectedDateRange.end_date}
								</Typography>
								: <Provider theme={defaultTheme} colorScheme="light" maxWidth={270}>
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
									/>
								</Provider>}
						</Stack>
						<Stack direction={'row'} justifyContent={'right'} spacing={1}>
							{!editingDate ?
								<Button
									variant="text"
									color="primary"
									sx={{
										textDecoration: 'underline',
										textTransform: 'none', // Keep original casing
										padding: 0, // Remove extra space
										minWidth: 0, // Optional: tighter layout
										fontWeight: 'normal', // Optional: make it look like regular link text
									}}
									onClick={handleToggle}
								>
									Change the booking dates
								</Button>
								:
								<>
									<Button
										variant="text"
										color="primary"
										sx={{
											textDecoration: 'underline',
											textTransform: 'none', // Keep original casing
											padding: 0, // Remove extra space
											minWidth: 0, // Optional: tighter layout
											fontWeight: 'normal', // Optional: make it look like regular link text
										}}
										onClick={handleCompleteDateEdit}
									>
										Confirm new dates
									</Button>

									<Button
										variant="text"
										color="primary"
										sx={{
											textDecoration: 'underline',
											textTransform: 'none', // Keep original casing
											padding: 0, // Remove extra space
											minWidth: 0, // Optional: tighter layout
											fontWeight: 'normal', // Optional: make it look like regular link text
										}}
										onClick={handleCancelDateEdit}
									>
										Cancel
									</Button>
								</>
							}
						</Stack>
						<Stack direction={'row'} justifyContent={'space-between'}>
							<Typography variant="body2">Total items</Typography>
							<Typography variant="body2">{totalItems}</Typography>
						</Stack>
						{!user && <Stack sx={{ border: '1px solid #E2E2E2', flexDirection: 'row', padding: '20px 24px', gap: '10px' }}>
							<InfoOutlineIcon />
							<Typography variant='body1'>Log in to book items</Typography>
						</Stack>}
						<Button
							sx={{
								width: { xs: 'fit-content', md: '100%' },
								mx: 'auto',
								px: 10,
							}}
							variant="rounded"
							size="small"
							onClick={handleAddBooking}
							disabled={false}
						>
							Book items
						</Button>
					</Stack>
				</Stack>
			) : (
				<Typography>
					Your cart is currently empty! <Link to="/items">Browse Items</Link>
				</Typography>
			)}
		</Box>
	);
}

export default Cart;
