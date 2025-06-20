import { Avatar, Box, Divider, Link, ListItem, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useCurrentUserName } from '../../hooks/use-current-user-name';
import { useAuth } from '../../hooks/useAuth';
import styles from './SideMenu.module.css';
import { useNavigate } from 'react-router-dom';
import { useCurrentUserImage } from '../../hooks/use-current-user-image';
import defaultUserImg from '../../assets/user-round.png'

const SideMenu = () => {
  const { signOut, role, user } = useAuth();
  const isAdmin = role === 'Admin' || role === 'Head Admin';
  const { i18n } = useTranslation();
  const name = useCurrentUserName();
  const navigate = useNavigate()
  const profileImg = useCurrentUserImage()

  return (
    <Box className={styles.container}>

      {/* User Information */}
      <Stack className={styles.userInfoStack}>
        {user && <Avatar src={profileImg ?? defaultUserImg} sx={{ height: 35, width: 35 }} />}
        <Typography className={styles.username} component={Link} href={'/account'}>
          {user ? name : 'Welcome!'}
        </Typography>
      </Stack>

      <Divider sx={{ my: 2 }} />

      {/* User Options */}
      <Stack className={styles.stack}>
        <ListItem component="button" onClick={() => navigate('/items')}>Browse Items</ListItem>
        <ListItem component="button" onClick={() => navigate('/bookings')}>My Bookings</ListItem>
      </Stack>

      {/* Admin Options */}
      {isAdmin && (
        <>
          <Divider sx={{ my: 2 }} />

          <Stack className={styles.stack}>
            <ListItem component="button" onClick={() => navigate('/admin/dashboard')}>Dashboard</ListItem>
            <ListItem component="button" onClick={() => navigate('/items/new')}>Add New Item</ListItem>
          </Stack>
        </>
      )}

      <Divider sx={{ my: 2 }} />
      <ListItem component="button" className={styles.logOutBtn}
        onClick={user ? signOut : () => navigate('/login')}>
        {user ? 'Log out' : 'Log in'}
      </ListItem>
    </Box>
  );
};

export default SideMenu;
