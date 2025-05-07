import React, { useEffect, useMemo, useState } from 'react';
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
import { buildBookingOverviews, BookingOverview, computeDuration } from '../../utility/bookings';
import { supabase } from '../../config/supabase';
import { Link as MuiLink } from '@mui/material';

// ─── Thunk actions ──────────────────────────────────────────
import { fetchAllItems } from '../../slices/itemsSlice';
import { fetchAllBookings } from '../../slices/bookingsSlice';
import { fetchAllUsersWithRole } from '../../slices/usersSlice';
import { fetchAllReservations } from '../../slices/reservationsSlice';
import { format, parseISO } from 'date-fns';
import { Link } from 'react-router-dom';
import { bookingsApi } from '../../api/bookings';
import { UpcomingBooking } from '../../types/types';
// - Additions for StyledDataGrid
import { StyledDataGrid } from '../CustomComponents/StyledDataGrid';
// import { GridColDef } from '@mui/x-data-grid';

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
      {label}
    </Typography>
    <Typography variant="heading_secondary_bold" lineHeight={1} fontSize={56}>
      {value}
    </Typography>
  </Paper>
);

// ── Main component ────────────────────────────────────────

const AdminDashboard = () => {
  const dispatch = useAppDispatch();
  // const { user } = useAuth();

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
  }, [
    dispatch,
    users.length,
    items.length,
    bookings.length,
    reservations.length,
  ]);

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

  /* ────────── Memoized values ────────── */
  // combine bookings + reservations + users

  // inside your component:
  // const overviews: BookingOverview[] = useMemo(
  //   () => buildBookingOverviews(bookings, reservations, users, items),
  //   [bookings, reservations, users, items],
  // );
  // console.log("Overviews" + overviews);
  // console.log("upcomingBookings:", upcomingBookings);

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
          Admin Dashboard
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
          Quick Actions
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <Button variant="rounded"
            sx={{
              height: '50%', fontSize: 'clamp(15px, 1vw, 16px)',
              pl: 4, pr: 4, textTransform: 'capitalize'
            }}>
            Add Item
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
            Approve bookings
          </Button>
          <Button
            variant="rounded" color="grey"
            sx={{
              height: '50%', fontSize: 'clamp(15px, 1vw, 16px)',
              pl: 4, pr: 4, textTransform: 'capitalize'
            }}>
            Manage users
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
          Upcoming bookings
        </Typography>
        <StyledDataGrid
          style={{ width: '100%' }}
          hideFooter
          disableColumnResize
          // slots={{ toolbar: null }}
          // getRowHeight={() => 'auto'}
          rowHeight={50}
          // autoHeight
          disableRowSelectionOnClick
          rows={upcomingBookings.map((booking) => ({
            id: booking.booking_id, // Used internally by DataGrid
            name: booking.booking.user.display_name,
            status: booking.booking.status,
            duration: `${computeDuration(booking.start_date, booking.end_date)} Days`,
            dateRange: `${booking.start_date} - ${booking.end_date}`,
            view: `/bookings/${booking.booking_id}`,
          }))}
          columns={[
            { field: 'name', headerName: 'Name', flex: 1, headerClassName: 'super-app-theme--header' },
            { field: 'status', headerName: 'Status', flex: 1, headerClassName: 'super-app-theme--header' },
            { field: 'duration', headerName: 'Duration', flex: 1, headerClassName: 'super-app-theme--header' },
            { field: 'dateRange', headerName: 'Date Range', flex: 1, headerClassName: 'super-app-theme--header' },
            {
              field: 'view',
              headerName: 'Actions',
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
                  Show booking
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
            Recent activity
          </Typography>
          {/* User, Last sign-in, Confirmed */}
          <StyledDataGrid
            hideFooter
            disableColumnResize
            autoHeight
            // slots={{ toolbar: null }}
            // getRowHeight={() => 'auto'}
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
                  ? format(parseISO(act.last_sign_in_at), 'PPpp')
                  : '—',
                confirmed: act.confirmed_at
                  ? format(parseISO(act.confirmed_at), 'PPpp')
                  : '—',
              }))}
            columns={[
              { field: 'name', headerName: 'User', flex: 1, headerClassName: 'super-app-theme--header' },
              {
                field: 'lastSignIn', headerName: 'Last sign-in', flex: 1, headerClassName: 'super-app-theme--header',
                renderCell: (params) => (
                  <div style={{
                    whiteSpace: 'normal',
                    lineHeight: '20px',
                    padding: '8px 0'
                  }}>
                    {params.value}
                  </div>
                )
              },
              {
                field: 'confirmed', headerName: 'Confirmed', flex: 1, headerClassName: 'super-app-theme--header',
                renderCell: (params) => (
                  <div style={{
                    whiteSpace: 'normal',
                    lineHeight: '20px',
                    padding: '8px 0'
                  }}>
                    {params.value}
                  </div>
                )
              },
            ]}
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
            Users &amp; Roles
          </Typography>
          <StyledDataGrid
            hideFooter
            disableColumnResize
            autoHeight
            // style={{ display: 'flex', flexDirection: 'column' }}
            rows={users
              .filter(u => u.user_id)
              .slice(0, 3)
              .map((u) => ({
                id: u.user_id,
                name: u.display_name ?? u.email,
                role: u.role_title ?? '—',
              }))}
            columns={[
              { field: 'name', headerName: 'User', flex: 1, headerClassName: 'super-app-theme--header' },
              { field: 'role', headerName: 'Role', flex: 1, headerClassName: 'super-app-theme--header' },
            ]}
          />
        </Grid>
      </Grid>
    </Stack>
  );
};

export default AdminDashboard;
