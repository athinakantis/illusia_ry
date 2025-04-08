import UserItems from '../components/Items';
import AdminItems from '../components/Admin/Items'
import { useAuth } from '../hooks/useAuth';
import { useState } from 'react';
import { Button } from '@mui/material';

function Items() {
  const { role } = useAuth()
  const [view, setView] = useState<boolean>(false)


  if (role?.includes('Admin')) return (
    <>
      <Button onClick={() => setView(prev => !prev)}>Switch view</Button>
      {view ? <UserItems /> : <AdminItems />}
    </>
  ); else (
    <UserItems />
  )
}

export default Items;