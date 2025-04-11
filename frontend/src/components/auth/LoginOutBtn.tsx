import Button from '@mui/material/Button';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
const Logout = () => {
  const { user, signOut } = useAuth();

  const handleLogout = () => {
    signOut();
  };
  if (!user) {
    return (
      <Link to="/login" className='logInOut'>
        Login
      </Link >
    );
  }
  return (
    <Button className='logInOut' variant="text" color="secondary" onClick={handleLogout}>
      Logout
    </Button>
  );
};
export default Logout;
