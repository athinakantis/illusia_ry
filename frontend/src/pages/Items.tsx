import UserItems from '../components/Items';
import AdminItems from '../components/Admin/Items'
import { useAuth } from '../hooks/useAuth';
import { useEffect, useState } from 'react';
import { FormControlLabel, Switch } from '@mui/material';
import { useDispatch } from 'react-redux';
import { loadCartFromStorage, selectCart } from '../slices/cartSlice';
import { useAppSelector } from '../store/hooks';

function Items() {
  const { role } = useAuth()
  const [view, setView] = useState<boolean>(false)
  const dispatch = useDispatch()
  const cart = useAppSelector(selectCart)

  type LocallyStoredItem = {
    item_id: string;
    quantity: number
  }

  // Load locally stored cart
  useEffect(() => {
    const savedCart: LocallyStoredItem[] = JSON.parse(localStorage.getItem('savedCart') ?? '[]')
    // If cart has less items than the locally stored array
    // load from storage
    if (cart.length < savedCart.length) {
      dispatch(loadCartFromStorage(savedCart))
    }
  }, [cart.length, dispatch])


  // If user is Admin or Head Admin, return AdminItems / UserItems
  if (role && role?.includes('Admin')) return (
    <>
      <FormControlLabel // This switch can be removed later if we decide to make managing/viewing separate pages
        sx={{
          marginLeft: '20px',
          color: 'primary.main',
          '& label, span': { fontFamily: 'Roboto Slab, sans-serif' }
        }}
        control={<Switch onChange={() => setView(prev => !prev)} />}
        label={`View as ${view ? 'User' : 'Admin'}`} />
      {view ? <UserItems /> : <AdminItems />}
    </>
  );

  return <UserItems /> // If user is not admin, show User UI

}

export default Items;