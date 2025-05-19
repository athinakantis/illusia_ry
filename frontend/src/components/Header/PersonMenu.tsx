import { Box, Button, IconButton, Menu, MenuItem } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { Link } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation, Trans } from 'react-i18next';

const PersonMenu = () => {
  // ─── profile menu state ──────────────────────────────────────────────
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { signOut, role } = useAuth();
  const isUser = role === 'User';
  const isAdmin = role === 'Admin' || role === 'Head Admin';
  const { i18n } = useTranslation();
  const menuOpen = Boolean(anchorEl);
  const handleMenuOpen = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };
  const handleMenuClose = () => setAnchorEl(null);

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: { xs: 1, sm: 2 },
        '& a': {
          p: 0.5,
          borderRadius: '3px',
          transition: 'background-color 200ms',
          display: 'inline-flex',
          minWidth: 'fit-content',
          color: '#2c2c2c',
        },
        '& .MuiIconButton-root': {
          p: 0.5,
          borderRadius: '3px',
          transition: 'background-color 200ms',
          color: '#2c2c2c',
        },
        '& .MuiIconButton-root:hover': {
          backgroundColor: 'background.verylightgrey',
        },
        '& a:hover': { bgcolor: 'background.verylightgrey' },
        '& .logInOut': {
          textTransform: 'uppercase',
          fontSize: '0.875rem',
          fontWeight: 500,
          fontFamily: 'Roboto, sans-serif',
          textDecoration: 'none',
          color: 'primary.light',
          p: '6px 8px',
        },
      }}
    >
      <IconButton
        aria-label="Open profile menu"
        onClick={handleMenuOpen}
        size="small"
        disableRipple
      >
        <PersonIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{
          '& .MuiMenuItem-root': {
            py: '10px', gap: '7px',
            borderBottom: '1px solid #e2e2e2',
          },
          '& .MuiList-root': { pt: 0 },
          '& .MuiPaper-root': {
            boxShadow: 'none',
            border: '1px solid #e2e2e2',
            width: 200,
          },
        }}
      >
        {isUser || isAdmin && (
          <MenuItem component={Link} to="/bookings" onClick={handleMenuClose}>
            <CalendarTodayIcon sx={{ mr: 1.5, color: 'inherit' }} fontSize="small" />
            <Trans i18nKey="person.myBookings">My bookings</Trans>
          </MenuItem>
        )}
        {isAdmin && (
          <MenuItem component={Link} to="/admin/dashboard" onClick={handleMenuClose}>
            <DashboardIcon sx={{ mr: 1.5, color: 'inherit' }} fontSize="small" />
            <Trans i18nKey="person.dashboard">Dashboard</Trans>
          </MenuItem>
        )}
        <MenuItem
          sx={{ height: '100%' }}
          component={Link}
          to="/account"
          onClick={handleMenuClose}
        >
          <AccountCircleIcon sx={{ mr: 1.5, color: 'inherit' }} fontSize="small" />
          <Trans i18nKey="person.myAccount">My account</Trans>
        </MenuItem>
        <MenuItem disableRipple sx={{ pl: 2, pr: 2 }} onClick={signOut}>
          <Trans i18nKey="person.logOut">Log out</Trans>
        </MenuItem>
        {/* language buttons */}
        <Box sx={{ px: 1, pt: 1 }}>
          <Button
            variant="text"
            size="small"
            color="primary"
            sx={{ padding: '4px 10px', minWidth: 'fit-content', mr: 1 }}
            onClick={() => { i18n.changeLanguage('en'); handleMenuClose(); }}
          >
            En
          </Button>
          <Button
            variant="text"
            size="small"
            color="primary"
            sx={{ padding: '4px 10px', minWidth: 'fit-content' }}
            onClick={() => { i18n.changeLanguage('fi'); handleMenuClose(); }}
          >
            Fin
          </Button>
        </Box>
      </Menu>
    </Box>
  );
};

export default PersonMenu;
