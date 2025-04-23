import UserItems from '../components/Items';
import AdminItems from '../components/Admin/Items'
import { useAuth } from '../hooks/useAuth';
import { useEffect, useState } from 'react';
import { Box, Tab, Tabs } from '@mui/material';
import { useDispatch } from 'react-redux';
import { loadCartFromStorage, selectCart } from '../slices/cartSlice';
import { useAppSelector } from '../store/hooks';

type LocallyStoredItem = {
  item_id: string;
  quantity: number
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 4 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}


function Items() {
  const { role } = useAuth()
  const dispatch = useDispatch()
  const cart = useAppSelector(selectCart)
  const [value, setValue] = useState(0);


  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };


  // Load locally stored cart
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('savedCart') ?? '[]')
    // If cart has less items than the locally stored array
    // load from storage
    if (cart.cart.length < savedCart.cart.length) {
      dispatch(loadCartFromStorage(savedCart))
    }
  }, [cart, dispatch])


  // If user is Admin or Head Admin, return AdminItems / UserItems
  if (role && role?.includes('Admin')) return (
    <Box sx={{ maxWidth: 1300, m: '0 auto', p: 2 }}>
      <Tabs value={value} onChange={handleChange} aria-label="Item View">
        <Tab label="Browse Items" {...a11yProps(0)} />
        <Tab label="Manage Items" {...a11yProps(1)} />
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