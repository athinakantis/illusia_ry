import {
  AppBar,
  Box,
  Toolbar,
  Typography,
} from '@mui/material';
import Logout from './auth/LoginOutBtn'
import PersonIcon from '@mui/icons-material/Person';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import { Link } from 'react-router-dom';
const Header = () => {

  return (
    <AppBar
      position="sticky"
      color='default'
      sx={{
        backgroundColor: 'white',
        boxShadow: 'none',
        px: 2,
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="h1" color='secondary' component="div" sx={{ fontWeight: '400', fontSize: '1.7rem' }}>
            ILLUSIA
          </Typography>
          <Typography
            sx={{ fontWeight: 400, fontFamily: 'Lato, sans-serif', height: '33px', fontSize: '1.2rem' }}
          >STORE</Typography>
        </Box>
        {/* Right side: Navigation links */}
        <Box sx={{
          display: 'flex', gap: '2rem',
          '& a:active': { color: 'primary.light' }
        }}>
          <Typography variant='link'>
            <Link to='/' style={{ textDecoration: 'none' }}>Home</Link>
          </Typography>
          <Typography variant='link'>
            <Link to='/items' style={{ textDecoration: 'none' }}>Items</Link>
          </Typography>
          <Typography variant='link'>
            <Link to='/items' style={{ textDecoration: 'none' }}>Contact</Link>
          </Typography>
        </Box>

        <Box sx={{
          display: 'flex', alignItems: 'center', gap: 2,
          '& a': { p: 0.5, borderRadius: '3px', transition: 'background-color 200ms', display: 'inline-flex', minWidth: 'fit-content', color: '#2c2c2c' },
          '& a:hover': { bgcolor: 'background.verylightgrey' },
          '& .logInOut': { textTransform: 'uppercase', fontSize: '0.875rem', fontWeight: 500, fontFamily: 'Roboto, sans-serif', textDecoration: 'none', color: 'primary.light', p: '6px 8px' }
          ,
        }}>
          <Link to='/' aria-label="View profile">
            <PersonIcon />
          </Link>
          <Link to='/cart' aria-label="Go to cart">
            <ShoppingBagIcon />
          </Link>
          <Logout />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;