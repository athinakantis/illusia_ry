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
      <Link to="/login">
        <Button variant="text" color="secondary">
          Login
        </Button>
      </Link>
    );
  }
  return (
    <Button variant="text" color="secondary" onClick={handleLogout}>
      Logout
    </Button>
  );
};
export default Logout;
