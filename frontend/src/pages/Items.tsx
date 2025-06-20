import UserItems from '../components/Items';
import { useEffect } from 'react';
import { Box } from '@mui/material';
import { useDispatch } from 'react-redux';
import { loadCartFromStorage, selectCart } from '../slices/cartSlice';
import { useAppSelector } from '../store/hooks';
import { CartState } from '../types/types';

function Items() {
  const dispatch = useDispatch()
  const { cart } = useAppSelector(selectCart)

  // Load locally stored cart
  useEffect(() => {
    const savedCart: CartState = JSON.parse(localStorage.getItem('savedCart') ?? '[]');
    if (!savedCart || !savedCart.cart) return

    if (cart.length < savedCart.cart.length) {
      dispatch(loadCartFromStorage(savedCart));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <Box sx={{ flex: 1 }}>
        <UserItems />
      </Box>
    </>
  )
}

export default Items;