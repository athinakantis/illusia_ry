import UserItems from '../components/Items';
import AdminItems from '../components/Admin/Items'
import { useAuth } from '../hooks/useAuth';
import { useState } from 'react';
import { FormControlLabel, Switch } from '@mui/material';

function Items() {
  const { role } = useAuth()
  const [view, setView] = useState<boolean>(false)


  // If user is Admin or Head Admin, return AdminItems / UserItems
  if (role?.includes('Admin')) return (
    <>
      <FormControlLabel
        sx={{ color: 'primary.main', '& span': { fontFamily: 'Roboto Slab, sans-serif' } }} // Add custom Typography type?
        control={<Switch onChange={() => setView(prev => !prev)} />}
        label={`View as ${view ? 'User' : 'Admin'}`} />
      {view ? <UserItems /> : <AdminItems />}
    </>
  ); else (
    <UserItems />
  )
}

export default Items;