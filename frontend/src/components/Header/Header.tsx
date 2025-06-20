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
  Divider,
  Button,
  Stack
} from '@mui/material';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import { Link, useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import { useEffect, useState, SyntheticEvent } from 'react';
// import PersonMenu from './PersonMenu';
import { Item } from '../../types/types';
import { selectCart } from '../../slices/cartSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import NotificationsMenu from './NotificationMenu';
import { useAuth } from '../../hooks/useAuth';
import { fetchAdminNotifications, fetchUserNotifications, selectUserNotifications } from '../../slices/notificationSlice';
import { Trans, useTranslation } from 'react-i18next';
import { useMobileSize } from '../../hooks/useMobileSize';

const Header = () => {
  const navigate = useNavigate()
  const { isMobile } = useMobileSize()
  const { t, i18n } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { cart } = useAppSelector(selectCart)
  const { role, user, signOut } = useAuth()
  const userNotifications = useAppSelector(selectUserNotifications)
  const dispatch = useAppDispatch()
  const isAdmin = role === 'Admin' || role === 'Head Admin'

  // Calculate total quantity of all cart items
  const totalItems = cart.reduce((total: number, item: Item) => total + (item.quantity || 0), 0)

  const handleDrawerToggle = (e: SyntheticEvent) => {
    e.preventDefault()
    setMobileOpen(!mobileOpen);
  };

  const navigateToPage = (page: string) => {
    navigate(page)
    setMobileOpen(!mobileOpen)
  }



  // Fetch user notifications
  useEffect(() => {
    if (user && userNotifications.length < 1) dispatch(fetchUserNotifications(user.id))
    if (role && ['Admin', 'Head Admin'].includes(role)) dispatch(fetchAdminNotifications())
  }, [role])

  const drawer = (
    <Stack sx={{
      display: isMobile ? 'flex' : 'none',
      justifyContent: 'space-between', height: '100%',
      '& .MuiList-root': { p: 2, display: 'flex', flexDirection: 'column', gap: '5px' },
      '& .MuiListItem-root': { height: 45 },
      '& .MuiListItemText-root': { transition: 'all 200ms', borderRadius: 3, m: 0 },
      '& .MuiListItemText-root:hover': { bgcolor: '#f5f5f5' }
    }}>

      <List>
        <ListItem
          onClick={() => navigateToPage('/')}
          sx={{ textDecoration: 'none', color: 'inherit', '&:hover': { cursor: 'pointer' } }}
        >
          <ListItemText primary={<Trans i18nKey="nav.home">Home</Trans>} />
        </ListItem>
        <ListItem
          onClick={() => navigateToPage('/items')}
          sx={{ textDecoration: 'none', color: 'inherit', '&:hover': { cursor: 'pointer' } }}
        >
          <ListItemText primary={<Trans i18nKey="nav.items">Items</Trans>} />
        </ListItem>
        <ListItem
          onClick={() => navigateToPage('/contact')}
          sx={{ textDecoration: 'none', color: 'inherit', '&:hover': { cursor: 'pointer' } }}
        >
          <ListItemText primary={<Trans i18nKey="nav.contact">Contact</Trans>} />
        </ListItem>
        {user && (
          <ListItem
            onClick={() => navigateToPage('/bookings')}
            sx={{ textDecoration: 'none', color: 'inherit', '&:hover': { cursor: 'pointer' } }}
          >
            <ListItemText primary={<Trans i18nKey="nav.bookings">My bookings</Trans>} />
          </ListItem>
        )}

        {isAdmin && (
          <>
            <Divider variant="middle" component="li" sx={{ my: 2 }} />

            <ListItem
              onClick={() => navigateToPage('/admin/dashboard')}
              sx={{ textDecoration: 'none', color: 'inherit', '&:hover': { cursor: 'pointer' } }}
            >
              <ListItemText primary={<Trans i18nKey="nav.dashboard">Dashboard</Trans>} />
            </ListItem>

            <ListItem
              onClick={() => navigateToPage('/admin/bookings')}
              sx={{ textDecoration: 'none', color: 'inherit', '&:hover': { cursor: 'pointer' } }}
            >
              <ListItemText primary={<Trans i18nKey="nav.manageBookings">Manage bookings</Trans>} />
            </ListItem>

            <ListItem
              onClick={() => navigateToPage('/admin/users')}
              sx={{ textDecoration: 'none', color: 'inherit', '&:hover': { cursor: 'pointer' } }}

            >
              <ListItemText primary={<Trans i18nKey="nav.manageUsers">Manage Users</Trans>} />
            </ListItem>
          </>
        )}

      </List>
      <Box>
        <Stack direction={'row'}
          sx={{ '& .MuiListItem-root': { p: 0.5, flex: 0 }, ml: 2, gap: 1, '& button': { padding: '3px 10px' } }}>
          <ListItem>
            <Button
              variant="text"
              size="small"
              color="primary"
              sx={{ padding: '4px 10px', minWidth: 'fit-content' }}
              onClick={() => { i18n.changeLanguage('en'); setMobileOpen(!mobileOpen); }}
            >
              En
            </Button>
          </ListItem>
          <ListItem>
            <Button
              variant="text"
              size="small"
              color="primary"
              sx={{ padding: '4px 10px', minWidth: 'fit-content' }}
              onClick={() => { i18n.changeLanguage('fi'); setMobileOpen(!mobileOpen); }}
            >
              Fi
            </Button>
          </ListItem>
          <ListItem>
            <Button
              variant="text"
              size="small"
              color="primary"
              sx={{ padding: '4px 10px', minWidth: 'fit-content' }}
              onClick={() => { i18n.changeLanguage('se'); setMobileOpen(!mobileOpen); }}
            >
              Se
            </Button>
          </ListItem>
        </Stack>

        {user ?
          <Button
            variant="text_contained"
            size="small"
            color="primary"
            sx={{ padding: '4px 10px', minWidth: 'fit-content', m: 2 }}
            onClick={() => {
              signOut()
              handleDrawerToggle
            }}
          >
            <Trans i18nKey="nav.logOut">Log out</Trans>
          </Button>
          :
          <Button
            variant="text_contained"
            size="small"
            color="primary"
            sx={{ padding: '4px 10px', minWidth: 'fit-content', m: 2 }}
            onClick={() => { navigate('/login'); setMobileOpen(!mobileOpen) }}
          >
            <Trans i18nKey="nav.logOut">Log in</Trans>
          </Button>
        }
      </Box>
    </Stack >

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
        <Link to='/' style={{ textDecoration: 'none', color: 'inherit' }}>
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
              {t('header.logoMain', { defaultValue: 'ILLUSIA' })}
            </Typography>
            <Typography
              sx={{
                fontWeight: 400,
                fontFamily: 'Lato, sans-serif',
                fontSize: { xs: '1.2rem', sm: '1.7rem' }
              }}
            >
              {t('header.logoSecondary', { defaultValue: 'STORE' })}
            </Typography>
          </Box>
        </Link>


        {/* Navigation Links - Desktop */}
        {!isMobile && (
          <Box sx={{
            display: 'flex',
            gap: '2rem',
            '& a:active': { color: 'primary.light' },
            '& a:hover': { color: 'primary.main' },
            '& a': {
              textDecoration: 'none',
              color: "primary.light",
            }
          }}>

            <Typography key="nav.home" variant='link'>
              <Link to="/" style={{ textDecoration: 'none' }}>
                <Trans i18nKey="nav.home">Home</Trans>
              </Link>
            </Typography>
            <Typography key="nav.items" variant='link'>
              <Link to="/items" style={{ textDecoration: 'none' }}>
                <Trans i18nKey="nav.items">Items</Trans>
              </Link>
            </Typography>
            <Typography key="nav.contact" variant='link'>
              <Link to="/contact" style={{ textDecoration: 'none' }}>
                <Trans i18nKey="nav.contact">Contact</Trans>
              </Link>
            </Typography>
            <Typography key="nav.bookings" variant='link'>
              <Link to="/bookings" style={{ textDecoration: 'none' }}>
                <Trans i18nKey="nav.bookings">My bookings</Trans>
              </Link>
            </Typography>
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

          {user && <NotificationsMenu />}
          {/*!isMobile && <PersonMenu />*/}
          <Link to='/cart' aria-label="Go to cart" style={{ position: 'relative' }}>
            <ShoppingBagIcon />
            {totalItems > 0 &&
              <Box component='span' sx={{
                '&::after': {
                  content: `"${totalItems}"`,
                  width: '15px',
                  height: '15px',
                  position: 'absolute',
                  top: '-2px',
                  right: '-2px',
                  bgcolor: '#9339C9',
                  color: '#FFF',
                  borderRadius: '50px',
                  fontSize: '10px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignContent: 'center',
                  fontWeight: 800
                }
              }} />
            }
          </Link>
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
          display: { xs: 'block', lg: 'none' },
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
  )
}

export default Header;