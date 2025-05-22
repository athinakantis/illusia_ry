import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  Stack,
} from '@mui/material';
// import { useAuth } from '../../hooks/useAuth';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { computeDuration } from '../../utility/bookings';
// import { buildBookingOverviews, BookingOverview } from '../../utility/bookings';
import { supabase } from '../../config/supabase';
import { Link as MuiLink } from '@mui/material';

// ─── Thunk actions ──────────────────────────────────────────
import { fetchAllItems } from '../../slices/itemsSlice';
import { fetchAllBookings } from '../../slices/bookingsSlice';
import { fetchAllUsersWithRole } from '../../slices/usersSlice';
import { fetchAllReservations } from '../../slices/reservationsSlice';
import { format, parseISO } from 'date-fns';
import { Link, Navigate } from 'react-router-dom';
import { bookingsApi } from '../../api/bookings';
import { UpcomingBooking } from '../../types/types';
// - Additions for StyledDataGrid
import { StyledDataGrid } from '../CustomComponents/StyledDataGrid';
import { useAuth } from '../../hooks/useAuth';
import Spinner from '../Spinner';

// - Translations
import { Trans, useTranslation } from 'react-i18next';
import { fi } from 'date-fns/locale';


// ─── Re-usable stat card ────────────────────────────────────
const StatCard: React.FC<{ label: string; value: number | string }> = ({
  label,
  value,
}) => (
  <Paper
    elevation={0}
    sx={{
      p: 3,
      border: '1px solid',
      borderColor: 'divider',
      height: '100%',
      borderRadius: 0,
    }}
  >
    <Typography
      variant="subtitle1"
      color="text.secondary"
      fontSize={'1.1rem'}
      gutterBottom
    >
      <Trans i18nKey={`admin.dashboard.stats.${label.toLowerCase().replace(/\s+/g, '_')}`}>
        {label}
      </Trans>
    </Typography>
    <Typography variant="heading_secondary_bold" lineHeight={1} fontSize={56}>
      {value}
    </Typography>
  </Paper>
);




// ── Main component ────────────────────────────────────────

const AdminDashboard = () => {
  const { role } = useAuth();
  const { t, i18n } = useTranslation(); const dispatch = useAppDispatch();

  const [authActivities, setAuthActivities] = React.useState<
    {
      display_name: string;
      last_sign_in_at: string;
      confirmed_at: string;
    }[]
  >([]);

  // ─── Selectors ───────────────────────────────────────────────
  const users = useAppSelector((state) => state.users.users);
  const items = useAppSelector((state) => state.items.items);
  const bookings = useAppSelector((state) => state.bookings.bookings);
  const reservations = useAppSelector(
    (state) => state.reservations.reservations,
  );
  const [upcomingBookings, setUpcomingBookings] = useState<UpcomingBooking[]>([]);

  // ─── Side-Effects ────────────────────────────────────────────
  useEffect(() => {
    if (users.length === 0) dispatch(fetchAllUsersWithRole());
    if (items.length === 0) dispatch(fetchAllItems());
    if (bookings.length === 0) dispatch(fetchAllBookings());
    if (reservations.length === 0) dispatch(fetchAllReservations());
    if (upcomingBookings.length === 0)
      bookingsApi
        .getUpcomingBookings()
        .then((result) => {
          setUpcomingBookings(result.data)
        });
  }, [dispatch, users.length, items.length, bookings.length, reservations.length, upcomingBookings.length]);

  // Fetch user activity from Supabase(temporary)
  useEffect(() => {
    if (!supabase) return;
    (async () => {
      const { data, error } = await supabase
        .from('user_activity_view_test')
        .select('display_name, last_sign_in_at, confirmed_at')
        .order('last_sign_in_at', { ascending: false });
      if (error) {
        console.error('Error fetching user activity:', error);
      } else if (data) {
        setAuthActivities(data);
      }
    })();
  }, []);

  // Helper function to format dates based on current language
  const formatDate = (dateString: string) => {
    const date = parseISO(dateString);
    return format(date, 'PPpp', {
      locale: i18n.language === 'fi' ? fi : undefined
    });
  };

  /* ————————————————— Conditional Renders ————————————————————————*/
  // If we don’t know the role yet, render nothing (or a loader)
  if (role === null) {
    return <Spinner />;
  }
  // If not an Admin or Head Admin, redirect immediately
  if (role !== 'Admin' && role !== 'Head Admin') {
    return <Navigate to="/" replace />;
  }
  /* ────────── Memoized values ────────── */
  // combine bookings + reservations + users

  // inside your component:
  // const overviews: BookingOverview[] = useMemo(
  //   () => buildBookingOverviews(bookings, reservations, users, items),
  //   [bookings, reservations, users, items],
  // );
  // console.log("Overviews" + overviews);
  // console.log("upcomingBookings:", upcomingBookings);
  // If we don't know the role yet, render nothing (or a loader)
  if (role === undefined) {
    return <Spinner />;
  }
  // If not an Admin or Head Admin, redirect immediately
  if (role !== 'Admin' && role !== 'Head Admin') {
    return <Navigate to="/" replace />;
  }

  /* ────────── Render ────────── */
  return (
    <Stack
      p={4}
      maxWidth={1000}
      mx="auto"
      sx={{
        gap: '2rem',
        '& .MuiPaper-root:has(table)': { borderBottom: 0 },
      }}
    >
      <Box>
        <Typography
          variant="heading_secondary_bold"
          fontSize={28}
          mb={1}
          component="h1"
          gutterBottom
        >
          <Trans i18nKey="admin.dashboard.title">Admin Dashboard</Trans>
        </Typography>

        {/* ───── Stats ───── */}
        <Grid container spacing={6}>
          <Grid size={{ xs: 12, md: 4 }}>
            <StatCard label="Total users" value={users.length} />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <StatCard label="Total bookings" value={bookings.length} />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <StatCard label="Inventory items" value={items.length} />
          </Grid>
        </Grid>
      </Box>

      {/* ───── Quick actions ───── */}
      <Box mt={4} mb={3}>
        <Typography
          component="p"
          variant="heading_secondary_bold"
          fontSize={20}
          gutterBottom
        >
          <Trans i18nKey="admin.dashboard.quick_actions">Quick actions</Trans>
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <Button variant="rounded"
            component={Link}
            to='/items/new'
            sx={{
              height: '50%', fontSize: 'clamp(15px, 1vw, 16px)',
              pl: 4, pr: 4, textTransform: 'capitalize'
            }}>
            <Trans i18nKey="admin.dashboard.add_item">Add item</Trans>
          </Button>

          <Button
            component={Link}
            to="/admin/bookings?filter=pending"
            variant="rounded"
            color="grey"
            sx={{
              height: '50%', fontSize: 'clamp(15px, 1vw, 16px)',
              pl: 4, pr: 4, textTransform: 'capitalize'
            }}>
            <Trans i18nKey="admin.dashboard.view_bookings">View bookings</Trans>
          </Button>
          <Button
            component={Link} to="/admin/users" variant="rounded" color="grey"
            sx={{
              height: '50%', fontSize: 'clamp(15px, 1vw, 16px)',
              pl: 4, pr: 4, textTransform: 'capitalize'
            }}>
            <Trans i18nKey="admin.dashboard.manage_users">Manage users</Trans>
          </Button>
          <Button
            component={Link} to="/admin/logs" variant="rounded" color="grey"
            sx={{
              height: '50%', fontSize: 'clamp(15px, 1vw, 16px)',
              pl: 4, pr: 4, textTransform: 'capitalize'
            }}>
            View logs
          </Button>
        </Stack>
      </Box>

      {/* ───── Upcoming bookings ───── */}
      <Box mt={3}>
        <Typography
          component="p"
          variant="heading_secondary_bold"
          fontSize={20}
          gutterBottom
        >
          <Trans i18nKey="admin.dashboard.upcoming_bookings">Upcoming bookings</Trans>
        </Typography>
        <StyledDataGrid
          style={{ width: '100%' }}
          hideFooter
          disableColumnResize
          rowHeight={60}
          disableRowSelectionOnClick
          rows={upcomingBookings.map((booking) => ({
            id: booking.booking_id, // Used internally by DataGrid
            name: booking.booking.user.display_name,
            status: t(`admin.dashboard.status.${booking.booking.status.toLowerCase()}`),
            duration: `${computeDuration(booking.start_date, booking.end_date)} ${t('admin.dashboard.duration.days')}`,
            dateRange: `${booking.start_date} - ${booking.end_date}`,
            view: `/bookings/${booking.booking_id}`,
          }))}
          columns={[
            { field: 'name', headerName: t('admin.dashboard.columns.name'), flex: 1, headerClassName: 'super-app-theme--header' },
            { field: 'status', headerName: t('admin.dashboard.columns.status'), flex: 1, headerClassName: 'super-app-theme--header' },
            { field: 'duration', headerName: t('admin.dashboard.columns.duration'), flex: 1, headerClassName: 'super-app-theme--header' },
            { field: 'dateRange', headerName: t('admin.dashboard.columns.date_range'), flex: 1, headerClassName: 'super-app-theme--header' },
            {
              field: 'view',
              headerName: t('admin.dashboard.columns.actions'),
              flex: 1,
              renderCell: (params) => (
                <MuiLink
                  component={Link}
                  to={params.value}
                  sx={{
                    textDecoration: 'none',
                    color: 'secondary.main',
                    '&:hover': {
                      color: 'primary.light'
                    }
                  }}
                >
                  <Trans i18nKey="admin.dashboard.show_booking">Show booking</Trans>
                </MuiLink>
              ),
              headerClassName: 'super-app-theme--header',
            },
          ]}
          pageSizeOptions={[5, 10, 25]}

        />
      </Box>

      {/* ───── Recent activity ───── */}
      <Grid container spacing={4} mt={4} justifyContent="space-between">
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography
            component="p"
            variant="heading_secondary_bold"
            fontSize={20}
            gutterBottom
          >
            <Trans i18nKey="admin.dashboard.recent_activity">Recent activity</Trans>
          </Typography>
          {/* User, Last sign-in, Confirmed */}
          <StyledDataGrid
            hideFooter
            disableColumnResize
            rows={authActivities
              .filter(act =>
                act.display_name &&
                act.last_sign_in_at != null &&
                act.confirmed_at != null,
              )
              .map((act) => ({
                id: act.display_name + act.last_sign_in_at,
                name: act.display_name,
                lastSignIn: act.last_sign_in_at
                  ? formatDate(act.last_sign_in_at)
                  : '—',
                confirmed: act.confirmed_at
                  ? formatDate(act.confirmed_at)
                  : '—',
              }))}
            columns={[
              { field: 'name', headerName: t('admin.dashboard.columns.name'), flex: 1, headerClassName: 'super-app-theme--header' },
              {
                field: 'lastSignIn', headerName: t('admin.dashboard.columns.last_sign_in'), flex: 1, headerClassName: 'super-app-theme--header',
                renderCell: (params) => (
                  <div style={{ whiteSpace: 'normal', lineHeight: '20px', padding: '8px 0' }}>{params.value}</div>
                )
              },
              {
                field: 'confirmed', headerName: t('admin.dashboard.columns.confirmed'), flex: 1, headerClassName: 'super-app-theme--header',
                renderCell: (params) => (
                  <div style={{ whiteSpace: 'normal', lineHeight: '20px', padding: '8px 0' }}>{params.value}</div>
                )
              },
            ]}
            autoHeight
          />
        </Grid>

        {/* ───── Users & Roles ───── */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography
            component="p"
            variant="heading_secondary_bold"
            fontSize={20}
            gutterBottom
          >
            <Trans i18nKey="admin.dashboard.users_and_roles">Users &amp; Roles</Trans>
          </Typography>
          <StyledDataGrid
            hideFooter
            disableColumnResize
            rows={users
              .filter(u => u.user_id)
              .slice(0, 3)
              .map((u) => ({
                id: u.user_id,
                name: u.display_name ?? u.email,
                role: u.role_title
                  ? t(`roles.${u.role_title.toLowerCase().replace(/\s+/g, '_')}`)
                  : '—',
              }))}
            columns={[
              { field: 'name', headerName: t('admin.dashboard.columns.name'), flex: 1, headerClassName: 'super-app-theme--header' },
              { field: 'role', headerName: t('admin.dashboard.columns.role'), flex: 1, headerClassName: 'super-app-theme--header' },
            ]}
            autoHeight
          />
        </Grid>
      </Grid>
    </Stack>
  );
};

export default AdminDashboard;
