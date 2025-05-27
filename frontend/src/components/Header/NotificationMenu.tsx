import {
  Box,
  Button,
  IconButton,
  Link,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from '@mui/material';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  fetchAdminNotifications,
  fetchUserNotifications,
  selectAdminNotifications,
  selectUserNotifications,
  updateAdminNotification,
  updateNotification,
} from '../../slices/notificationSlice';
import { Tables } from '../../types/supabase';
import { BookingMetaData } from '../../types/types';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from 'react-i18next';

const NotificationsMenu = () => {
  // ─── menu state ──────────────────────────────────────────────
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);
  const handleMenuOpen = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };
  const handleMenuClose = () => setAnchorEl(null);
  const userNotifications = useAppSelector(selectUserNotifications);
  const adminNotifications = useAppSelector(selectAdminNotifications);
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const { t } = useTranslation();


  // Unread notifications
  const unreadUserNotifications = userNotifications.filter(
    (n) => n.is_read === false,
  );
  const unreadAdminNotifications = adminNotifications.filter(
    (n) => n.is_read === false,
  );
  const notificationCount =
    unreadUserNotifications.length + unreadAdminNotifications.length;

  useEffect(() => {
    if (user && userNotifications.length < 1)
      dispatch(fetchUserNotifications(user.id));
    if (user && user.role && user.role.includes('Admin')) {
      dispatch(fetchAdminNotifications());
    }
  }, []);

  const renderNotificationLink = (
    notification: Partial<Tables<'notifications'>>,
  ) => (notification.metadata as BookingMetaData)?.booking_id;

  // ─── handlers ──────────────────────────────────────────────
  const handleSetRead = (id: string, type: 'user_notification' | 'admin_notification') => {
    type === 'user_notification' ?
      dispatch(updateNotification({ id: id, body: { is_read: true } }))
      :
      dispatch(updateAdminNotification({ id: id }))
  }

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
      }}
    >
      <IconButton
        aria-label="Open profile menu"
        onClick={handleMenuOpen}
        size="small"
        disableRipple
      >
        <NotificationsRoundedIcon />
        {notificationCount > 0 && (
          <Box
            component="span"
            sx={{
              '&::after': {
                content: `""`,
                width: '8px',
                height: '8px',
                position: 'absolute',
                top: '3px',
                right: '3px',
                bgcolor: 'accent.main',
                color: '#FFF',
                borderRadius: '50px',
                fontSize: '10px',
                display: 'flex',
                justifyContent: 'center',
                alignContent: 'center',
                fontWeight: 800,
              },
            }}
          />
        )}
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{
          '& .MuiMenuItem-root': {
            py: 1.2,
            px: 2,
            borderBottom: '1px solid #e2e2e2',
          },
          '& .MuiList-root': { p: 0, width: '100%', alignContent: 'center' },
          '& .MuiPaper-root': {
            boxShadow: 'none',
            border: '1px solid #e2e2e2',
            minWidth: 300,
            display: 'flex',
          },
        }}
      >
        {/* User notifications */}
        {unreadUserNotifications.length > 0 && (
          <>
            {unreadUserNotifications.map((n) => (
              <MenuItem
                key={n.id}
                disableRipple
                component={Link}
                href={`/bookings/${renderNotificationLink(n)}`}
                sx={{ justifyContent: 'space-between', gap: '1rem' }}
              >
                {t(`notifications.${n.type}`)}
                <Tooltip title="Mark as read">
                  <Button
                    sx={{ minWidth: 'fit-content', p: '3px' }}
                    onClick={(e) => {
                      e.preventDefault();
                      handleSetRead(n.id, 'user_notification');
                    }}
                  >
                    <CloseRoundedIcon />
                  </Button>
                </Tooltip>
              </MenuItem>
            ))}
          </>
        )}

        {unreadAdminNotifications.length > 0 && (
          <>
            {unreadAdminNotifications.map((n) => (
              <MenuItem
                key={n.id}
                disableRipple
                component={Link}
                href={n.link}
                sx={{ justifyContent: 'space-between', gap: '1rem' }}
              >
                {t(`notifications.${n.id}`, { amount: Number(n.amount) })}
                <Tooltip title={t("notifications.markRead")}>
                  <Button
                    sx={{ minWidth: 'fit-content', p: '3px' }}
                    onClick={(e) => {
                      e.preventDefault();
                      handleSetRead(n.id, 'admin_notification');
                    }}
                  >
                    <CloseRoundedIcon />
                  </Button>
                </Tooltip>
              </MenuItem>
            ))}
          </>
        )}

        {/* No notifications */}
        {notificationCount < 1 && (
          <MenuItem
            disableRipple
            sx={{
              '&:hover': { backgroundColor: 'inherit' },
              justifyContent: 'center',
            }}
          >
            <Typography>{t("notifications.noNew", { defaultValue: "You have no new notifications!" })}</Typography>
          </MenuItem>
        )}
      </Menu>
    </Box>
  );
};

export default NotificationsMenu;
