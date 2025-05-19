import { Outlet } from 'react-router-dom';
import Header from './Header/Header';
import Footer from './Footer';
import { Box } from '@mui/material';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchFutureReservations, selectAllReservations } from '../slices/reservationsSlice';
import { fetchAllCategories, fetchAllItems, selectAllCategories, selectAllItems } from '../slices/itemsSlice';
import { loadCartFromStorage, selectCart } from '../slices/cartSlice';
import ScrollToTop from '../utility/ScrollToTop';

function Root() {
  const reservations = useAppSelector(selectAllReservations);
  const items = useAppSelector(selectAllItems);
  const categories = useAppSelector(selectAllCategories);
  const { cart } = useAppSelector(selectCart);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (reservations.length < 1) {
      dispatch(fetchFutureReservations());
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


  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh', // Ensure the layout takes the full viewport height
        '& main:not(:has(>#home))': { paddingTop: '3rem' } // Padding for all pages except Home
      }}
    >
      <Header />
      <main
        style={{
          flexGrow: 1, // Allow the main content to grow and fill available space
          paddingBottom: '3rem',
        }}
      >
        {/* Component that scrolls to top of page when navigating */}
        <ScrollToTop />
        <Outlet />
      </main>
      <Footer />
    </Box>
  )
}

export default Root;