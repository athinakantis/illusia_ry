import UserItems from '../components/Items';
import { useAuth } from '../hooks/useAuth';
import AdminItems from './Admin/Items';

function Items() {
  const { role } = useAuth();
  if (role === 'User' || role === 'Unapproved' || !role) {
    return (
      <>
        <UserItems />
      </>
    )
  } else {
    return (
      <>
        <AdminItems />
      </>
    )
  }
}

export default Items;