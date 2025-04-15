import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles'; // Import useTheme to access the theme
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
const Logout = () => {
  const { user, signOut } = useAuth();
  const theme = useTheme(); // Access the theme object

  const handleLogout = () => {
    signOut();
  };
  if (!user) {
    return (
      <Link to="/login" className='logInOut'
        style={{
          fontSize: theme.typography.body1.fontSize, // Apply body1 font size
          fontWeight: theme.typography.body1.fontWeight,
          fontFamily: theme.typography.body1.fontFamily,
          textTransform: 'uppercase', // Optional: Add text transform
          textDecoration: 'none',
        }}>
        Login
      </Link >
    );
  }
  return (
    <Button className='logInOut' variant="text" color="secondary" onClick={handleLogout}
      sx={{
        fontSize: `${theme.typography.body1.fontSize} !important`, // Force font size
      }}>
      Logout
    </Button>
  );
};
export default Logout;
