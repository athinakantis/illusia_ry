import { Box, useMediaQuery, useTheme } from '@mui/material';
import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { fetchAllBookings, selectAllBookings } from '../slices/bookingsSlice';
import { loadCartFromStorage, selectCart } from '../slices/cartSlice';
import { fetchAllCategories, fetchAllItems, selectAllCategories, selectAllItems } from '../slices/itemsSlice';
import { fetchUserNotifications, selectUserNotifications } from '../slices/notificationSlice';
import { fetchFutureReservations, selectAllReservations } from '../slices/reservationsSlice';
import { fetchAllUsersWithRole, selectAllUsers } from '../slices/usersSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import ScrollToTop from '../utility/ScrollToTop';
import Footer from './Footer';
import Header from './Header/Header';
import SideMenu from './Header/SideMenu';

function Root() {
  const { pathname } = useLocation()
  const theme = useTheme();
  const reservations = useAppSelector(selectAllReservations);
  const items = useAppSelector(selectAllItems);
  const users = useAppSelector(selectAllUsers);
  const bookings = useAppSelector(selectAllBookings);
  const categories = useAppSelector(selectAllCategories);
  const { cart } = useAppSelector(selectCart);
  const dispatch = useAppDispatch();
  const userNotifications = useAppSelector(selectUserNotifications)
  const { user } = useAuth()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));


  useEffect(() => {
    if (reservations.length < 1) {
      dispatch(fetchFutureReservations());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (users.length <= 1) {
      dispatch(fetchAllUsersWithRole());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!bookings.length) {
      dispatch(fetchAllBookings());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  /*
  Effect to fetch ITEMS and CATEGORIES
  */
  useEffect(() => {
    if (items.length <= 1) {
      dispatch(fetchAllItems());
    }
    if (!categories || categories.length < 1) {
      dispatch(fetchAllCategories());
    }
  }, [dispatch, items, categories]);

  // Load locally stored cart
  useEffect(() => {
    if (items.length <= 1) dispatch(fetchAllItems());
    const savedCart = JSON.parse(localStorage.getItem('savedCart') ?? '[]');

    if (!savedCart || !savedCart.cart) return
    // If cart has less items than the locally stored array
    // load from storage
    if (cart.length < savedCart.cart.length) {
      dispatch(loadCartFromStorage(savedCart));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (user && userNotifications.length < 1) dispatch(fetchUserNotifications(user.id))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, userNotifications.length])


  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh', // Ensure the layout takes the full viewport height
        '& main:not(:has(>#home))': { padding: '1rem' } // Padding for all pages except Home
      }}
    >
      <Header />
      <main
        style={{
          flexGrow: 1, // Allow the main content to grow and fill available space
          display: pathname === '/' ? 'block' : 'flex',
          flexDirection: 'row',
          gap: '2rem',
        }}
      >
        {!isMobile && pathname !== '/' && <SideMenu />}
        {/* Component that scrolls to top of page when navigating */}
        <ScrollToTop />
        <Outlet />
      </main>
      <Footer />
    </Box>
  )
}

export default Root;