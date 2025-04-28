import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import Logout from '../Auth/LoginOutBtn';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import { Link } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from 'react';
import PersonMenu from './PersonMenu';

const Header = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navigationLinks = [
    { text: 'Home', path: '/' },
    { text: 'Items', path: '/items' },
    { text: 'Contact', path: '/items' },
    { text: 'Bookings', path: '/bookings' },
  ];

  const drawer = (
    <List>
      {navigationLinks.map((item) => (
        <ListItem key={item.text} component={Link} to={item.path}>
          <ListItemText primary={item.text} />
        </ListItem>
      ))}
    </List>
  );

  return (
    <AppBar
      position="sticky"
      color='default'
      sx={{
        backgroundColor: 'white',
        boxShadow: 'none',
        px: { xs: 1, sm: 2 }, // Responsive padding
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h1" color='secondary' component="div"
            sx={{ fontWeight: '400', fontSize: { xs: '1.2rem', sm: '1.7rem' } }}>
            ILLUSIA
          </Typography>
          <Typography
            sx={{
              fontWeight: 400,
              fontFamily: 'Lato, sans-serif',
              fontSize: { xs: '1.2rem', sm: '1.7rem' }
            }}
          >STORE</Typography>
        </Box>

        {/* Navigation Links - Desktop */}
        {!isMobile && (
          <Box sx={{
            display: 'flex',
            gap: '2rem',
            /* Booking was blue so had to add these to adjust colors */
            '& a:active': { color: 'primary.light' },
            '& a:hover': { color: 'primary.main' },
            '& a': {
              textDecoration: 'none',
              color: "primary.light", 
            }
          }}>
            {navigationLinks.map((item) => (
              <Typography key={item.text} variant='link'>
                <Link to={item.path} style={{ textDecoration: 'none' }}>{item.text}</Link>
              </Typography>
            ))}
          </Box>
        )}

        {/* Icons */}
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          gap: { xs: 1, sm: 2 },
          '& a': {
            p: 0.5,
            borderRadius: '3px',
            transition: 'background-color 200ms',
            display: 'inline-flex',
            minWidth: 'fit-content',
            color: '#2c2c2c'
          },
          '& a:hover': { bgcolor: 'background.verylightgrey' },
          '& .logInOut': {
            textTransform: 'uppercase',
            fontSize: '0.875rem',
            fontWeight: 500,
            fontFamily: 'Roboto, sans-serif',
            textDecoration: 'none',
            color: 'primary.light',
            p: '6px 8px'
          }
        }}>
         <PersonMenu />
          <Link to='/cart' aria-label="Go to cart">
            <ShoppingBagIcon />
          </Link>
          <Logout />
        </Box>
      </Toolbar>

      {/* Mobile Navigation Drawer */}
      <Drawer
        variant="temporary"
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
          /* Had to add something to fix the link colors, Booking was blue when added */
          '& a:active': { color: 'primary.light' },
          '& a:hover': { color: 'primary.main' },
          '& a': {
            textDecoration: 'none',
            color: "secondary.main", 
          }
        }}
      >
        {drawer}
      </Drawer>
    </AppBar>
  );
};

export default Header;