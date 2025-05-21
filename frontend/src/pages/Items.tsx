import UserItems from '../components/Items';
import AdminItems from '../components/Admin/Items'
import { useAuth } from '../hooks/useAuth';
import { useEffect, useState } from 'react';
import { Box, Tab, Tabs } from '@mui/material';
import { useDispatch } from 'react-redux';
import { loadCartFromStorage, selectCart } from '../slices/cartSlice';
import { useAppSelector } from '../store/hooks';
import { a11yProps, CustomTabPanel } from '../components/CustomComponents/CustomTabPanel';
import { CartState } from '../types/types';
import { useTranslation } from 'react-i18next';

function Items() {
  const { role } = useAuth()
  const dispatch = useDispatch()
  const { cart } = useAppSelector(selectCart)
  const [value, setValue] = useState(0);
  const { t } = useTranslation();


  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  // Load locally stored cart
  useEffect(() => {
    const savedCart: CartState = JSON.parse(localStorage.getItem('savedCart') ?? '[]');
    if (!savedCart || !savedCart.cart) return

    // If cart has less items than the locally stored array
    // load from storage
    if (cart.length < savedCart.cart.length) {
      dispatch(loadCartFromStorage(savedCart));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  // If user is Admin or Head Admin, return AdminItems / UserItems
  if (role && role?.includes('Admin')) return (
    <Box sx={{ maxWidth: 1300, m: '0 auto', p: 2 }}>
      <Tabs value={value} onChange={handleChange} aria-label="Item View">
        <Tab label={t('items.browse')} {...a11yProps(0)} />
        <Tab label={t('items.manage')} {...a11yProps(1)} />
      </Tabs>
      <CustomTabPanel value={value} index={0}>
        <UserItems />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <AdminItems />
      </CustomTabPanel>
    </Box >
  );
  return (
    <Box sx={{ maxWidth: 1300, m: '0 auto', p: 2 }}>
      <UserItems />
    </Box>
  )
}

export default Items;