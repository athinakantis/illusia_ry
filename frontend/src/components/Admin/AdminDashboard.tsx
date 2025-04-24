import React, { useEffect, useMemo } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Stack,
} from "@mui/material";
import { useAuth } from "../../hooks/useAuth";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
    buildBookingOverviews,
    BookingOverview} from "../../utility/bookings";
    import { supabase } from "../../config/supabase";
/* ──────────────────────────────────────────────────────────
   Thunk actions – make sure these already exist in your app.
   ────────────────────────────────────────────────────────── */
import { fetchAllItems } from "../../slices/itemsSlice";
import { fetchAllBookings } from "../../slices/bookingsSlice";
import { fetchAllUsersWithRole } from "../../slices/usersSlice";
import { fetchAllReservations } from "../../slices/reservationsSlice";
import { format, parseISO } from "date-fns";
/* ──────────────────────────────────────────────────────────
   Re-usable stat card (outlined box with a headline number)
   ────────────────────────────────────────────────────────── */
const StatCard: React.FC<{ label: string; value: number | string }> = ({
  label,
  value,
}) => (
  <Paper
    elevation={0}
    sx={{ p: 3, border: "1px solid", borderColor: "divider", height: "100%" }}
  >
    <Typography variant="subtitle1" color="text.secondary" gutterBottom>
      {label}
    </Typography>
    <Typography variant="h4">{value}</Typography>
  </Paper>
);

/* ──────────────────────────────────────────────────────────
   Main component
   ────────────────────────────────────────────────────────── */
const AdminDashboard = () => {
  const dispatch = useAppDispatch();
  const { user } = useAuth();

  const [authActivities, setAuthActivities] = React.useState<
    {
      display_name: string;
      last_sign_in_at: string;
      confirmed_at: string;
    }[]
  >([]);

  /*----------- Selectors ------------- */
  const users = useAppSelector((state) => state.users.users);
  const items = useAppSelector((state) => state.items.items);
  const bookings = useAppSelector((state) => state.bookings.bookings);
  const reservations = useAppSelector((state) => state.reservations.reservations);

    /* ────────── Effects ────────── */
  useEffect(() => {
    if (users.length === 0) dispatch(fetchAllUsersWithRole());
    if (items.length === 0) dispatch(fetchAllItems());
    if (bookings.length === 0) dispatch(fetchAllBookings());
    if (reservations.length === 0) dispatch(fetchAllReservations());
  }, [dispatch, users.length, items.length, bookings.length, reservations.length]);


    // Fetch user activity from Supabase(temporary)
  useEffect(() => {
    if (!supabase) return;
    (async () => {
      const { data, error } = await supabase
        .from("user_activity_view_test")
        .select("display_name, last_sign_in_at, confirmed_at")
        .order("last_sign_in_at", { ascending: false });
      if (error) {
        console.error("Error fetching user activity:", error);
      } else if (data) {
        setAuthActivities(data);
      }
    })();
  }, []);
  
    /* ────────── Memoized values ────────── */
      // combine bookings + reservations + users

      // inside your component:
      const overviews: BookingOverview[] = useMemo(
        () =>
          buildBookingOverviews(bookings, reservations, users, items),
        [bookings, reservations, users, items]
      );
    
  /* ────────── Render ────────── */
  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>

      {/* ───── Stats ───── */}
      <Grid container spacing={6}>
        <Grid size={{xs: 12, md: 4}} >
          <StatCard label="Total users" value={users.length} />
        </Grid>
        <Grid  size={{xs: 12, md: 4}} >
          <StatCard label="Total bookings" value={bookings.length} />
        </Grid>
        <Grid  size={{xs: 12, md: 4}} >
          <StatCard label="Inventory items" value={items.length} />
        </Grid>
      </Grid>

      {/* ───── Quick actions ───── */}
      <Box mt={4} mb={3} >
        <Typography variant="h5" gutterBottom>
          Quick Actions
        </Typography>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <Button variant="contained" color="secondary">
            Add item
          </Button>
          <Button variant="contained" color="secondary">
            Approve bookings
          </Button>
          <Button variant="contained" color="secondary">
            Manage users
          </Button>
        </Stack>
      </Box>


      {/* ───── Bookings overview ───── */}
      <Box width={"90%"} mt={3}>
        <Typography variant="h5" gutterBottom>
          Bookings overview
        </Typography>
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Items</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell>Date range</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
                {/* Show only the first 3 bookings for now. Also it looks bad with a huge list of bookings */}
              {overviews.slice(0, 3).map((overview) => (
                <TableRow key={overview.booking_id}>
                  <TableCell>{overview.userName}</TableCell>
                  <TableCell>{overview.status}</TableCell>
                  <TableCell>{overview.totalItems}</TableCell>
                  <TableCell>{overview.duration} Days</TableCell>
                  <TableCell>{overview.range}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* ───── Recent activity & Users/Roles ───── */}
      <Grid container spacing={0} mt={4}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="h5" gutterBottom>
            Recent activity
          </Typography>
          <TableContainer component={Paper} variant="outlined" sx={{ maxWidth: 500 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell>Last sign-in</TableCell>
                  <TableCell>Confirmed</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {authActivities
                  .filter((act) =>
                    act.display_name &&
                    act.last_sign_in_at != null &&
                    act.confirmed_at != null
                  )
                  .map((act) => (
                    <TableRow key={act.display_name + act.last_sign_in_at}>
                      <TableCell>{act.display_name}</TableCell>
                      <TableCell>
                        {act.last_sign_in_at
                          ? format(parseISO(act.last_sign_in_at), "PPpp")
                          : "—"}
                      </TableCell>
                      <TableCell>
                        {act.confirmed_at
                          ? format(parseISO(act.confirmed_at), "PPpp")
                          : "—"}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="h5" gutterBottom>
            Users &amp; Roles
          </Typography>
          <TableContainer component={Paper} variant="outlined" sx={{ maxWidth: 400 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell>Role</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.slice(0, 5).map((u) => (
                  <TableRow key={u.user_id}>
                    <TableCell>{u.display_name ?? u.email}</TableCell>
                    <TableCell>{u.role_title ?? "—"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;
