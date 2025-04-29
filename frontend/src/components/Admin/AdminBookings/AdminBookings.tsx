import React, { SyntheticEvent, useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import {
  Alert,
  Container,
  Paper,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  useTheme,
  Collapse,
  IconButton,
  Button,
  Menu,
  MenuItem,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import {
  fetchAllBookings,
  selectAllBookings,
  selectBookingsLoading,
  selectBookingsError,
  updateBookingStatus,
} from "../../../slices/bookingsSlice";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import Spinner from "../../Spinner";
import { fetchAllUsers, selectAllUsers } from "../../../slices/usersSlice";
import {
  fetchAllItems,
  selectAllItems,
} from "../../../slices/itemsSlice";
import {
  fetchAllReservations,
  selectAllReservations,
} from "../../../slices/reservationsSlice";
import CollapsibleDetail from "./CollapsibleDetail";
import SnackBar from "../../../utility/SnackBar";

/**
 * Allowed status filters rendered as Tabs
 */
const STATUS_FILTERS = [
  { label: "All", value: "all" },
  { label: "Pending approval", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
];

const AdminBookings = () => {
  const theme = useTheme();

  // ─── Redux selectors ──────────────────────────────────────────
  const dispatch = useAppDispatch();
  const users = useAppSelector(selectAllUsers)
  const bookings = useAppSelector(selectAllBookings);
  const loading = useAppSelector(selectBookingsLoading);
  const error = useAppSelector(selectBookingsError);
  const items = useAppSelector(selectAllItems);
  const reservations = useAppSelector(selectAllReservations);


  // ─── Local state (active filter tab) ──────────────────────────
  const [filter, setFilter] = useState<string>("all");
  const handleFilterChange = (_: SyntheticEvent, newValue: string) =>
    setFilter(newValue);

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const toggleExpand = (id: string) =>
    setExpandedId((prev) => (prev === id ? null : id));

  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [menuBookingId, setMenuBookingId] = useState<string | null>(null);
  const openMenu = Boolean(menuAnchor);

  const handleStatusClick = (
    e: React.MouseEvent<HTMLElement>,
    bookingId: string
  ) => {
    e.stopPropagation();
    setMenuAnchor(e.currentTarget);
    setMenuBookingId(bookingId);
  };
  const handleMenuClose = () => {
    setMenuAnchor(null);
    setMenuBookingId(null);
  };

  // ─── Snackbar state ─────────────────────────────────────────
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMsg, setSnackMsg] = useState('');
  const [snackSeverity, setSnackSeverity] = useState<'success' | 'error'>('success');

  // Placeholder mutations
  const approveBooking = () => {
    if (!menuBookingId) return;
    dispatch(updateBookingStatus({ id: menuBookingId, status: "approved" }));
    handleMenuClose();
    setSnackMsg('Booking approved');
    setSnackSeverity('success');
    setSnackOpen(true);
  };
  const rejectBooking = () => {
    if (!menuBookingId) return;
    dispatch(updateBookingStatus({ id: menuBookingId, status: "rejected" }));
    handleMenuClose();
    setSnackMsg('Booking rejected');
    setSnackSeverity('error');
    setSnackOpen(true);
  };

  // ─── Side Effects ──────────────────────────────────
  
  useEffect(() => {
    if (bookings.length === 0) dispatch(fetchAllBookings());
  }, [dispatch, bookings.length]);

  useEffect(() => {
    if (users.length === 0) dispatch(fetchAllUsers());
  }, [dispatch, users.length]);
  useEffect(() => {
    if (items.length === 0) dispatch(fetchAllItems());
  }, [dispatch, items.length]);
  useEffect(() => {
    if (reservations.length === 0) dispatch(fetchAllReservations());
  }, [dispatch, reservations.length]);

  // ─── Memoised filtered list ───────────────────────────────────
  const filteredBookings = useMemo(() => {
    if (filter === "all") return bookings;
    return bookings.filter((b) => b.status === filter);
  }, [bookings, filter]);

  // ─── Helper functions ────────────────────────────────────────
  
  // Display name || email || uid for user
  const userName = (uid?: string) =>
    users.find((u) => u.user_id === uid)?.display_name || users.find((u) => u.user_id === uid)?.email || uid;
  
  // Get item name by id
  const itemName = (iid: string) =>
    items.find((it) => it.item_id === iid)?.item_name || iid.slice(0, 6);

  const itemImage = (iid: string) =>
    items.find((it) => it.item_id === iid)?.image_path;
  // Navigate to item page
  const itemLink = (iid: string) => `/items/manage/${iid}`;


  const reservationsByBooking = (bid: string) =>
    reservations.filter((r) => r.booking_id === bid);

  // ─── Loading/Error states ─────────────────────────────────────
  if (loading)
    return (
      <Container sx={{ textAlign: "center", mt: 4 }}>
        <Spinner />
      </Container>
    );

  if (error)
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );

  // ─── Render ───────────────────────────────────────────────────
  return (
    <Container maxWidth="lg" sx={{ mt: 6 }}>
      <Typography variant="h4" gutterBottom>
        Bookings
      </Typography>

      {/* Filter Tabs */}
      <Tabs
        value={filter}
        onChange={handleFilterChange}
        textColor="primary"
        indicatorColor="primary"
        sx={{
          mb: 3,
          "& .MuiTab-root": { textTransform: "none", fontWeight: 500 },
        }}
      >
        {STATUS_FILTERS.map(({ label, value }) => (
          <Tab key={value} label={label} value={value} />
        ))}
      </Tabs>

      {/* Bookings table */}
      <Paper variant="outlined">
        <Table size="medium">
          <TableHead sx={{ bgcolor: theme.palette.background.verylightgrey }}>
            <TableRow>
              <TableCell />
              <TableCell>ID</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell align="center">Items</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredBookings.map((b) => {
              const res = reservationsByBooking(b.booking_id);
              const itemsCount = res.reduce((sum, r) => sum + (r.quantity ?? 1), 0);

              return (
                <React.Fragment key={b.booking_id}>
                  <TableRow
                    hover
                    onClick={() => toggleExpand(b.booking_id)}
                    sx={{ cursor: "pointer" }}
                  >
                    <TableCell padding="checkbox">
                      <IconButton size="small">
                        {expandedId === b.booking_id ? (
                          <KeyboardArrowUpIcon />
                        ) : (
                          <KeyboardArrowDownIcon />
                        )}
                      </IconButton>
                    </TableCell>
                    <TableCell sx={{ color: "primary.main" }}>
                      {b.booking_id.slice(0, 8)}
                    </TableCell>
                    <TableCell>{dayjs(b.created_at).format("DD.MM.YYYY")}</TableCell>
                    <TableCell>{userName(b.user_id)}</TableCell>
                    <TableCell align="center">{itemsCount}</TableCell>
                    <TableCell sx={{ textTransform: "capitalize" }}>
                      {b.status === "pending" ? (
                        <Button
                          size="small"
                          variant="contained"
                          color="secondary"
                          onClick={(e) => handleStatusClick(e, b.booking_id)}
                          endIcon={<KeyboardArrowDownIcon />}
                          sx={{
                            textTransform: "none",
                            borderRadius: 20,
                            bgcolor: "secondary.light",
                            color: "text.primary",
                          }}
                        >
                          Awaiting Approval
                        </Button>
                      ) : (
                        b.status
                      )}
                    </TableCell>
                  </TableRow>

                  {/* Collapsible detail */}
                  <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                      <Collapse
                        in={expandedId === b.booking_id}
                        timeout="auto"
                        unmountOnExit
                      >
                        <CollapsibleDetail
                          reservations={res}
                          itemName={itemName}
                          itemImage={itemImage}
                          itemLink={itemLink}
                        />
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              );
            })}
            {filteredBookings.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 5 }}>
                  No bookings found for selected filter.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <Menu
          anchorEl={menuAnchor}
          open={openMenu}
          onClose={handleMenuClose}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "left" }}
        >
          <MenuItem onClick={approveBooking}>Approve</MenuItem>
          <MenuItem onClick={rejectBooking}>Reject</MenuItem>
        </Menu>
      </Paper>

      <SnackBar
        open={snackOpen}
        message={snackMsg}
        severity={snackSeverity}
        duration={3500}
        onClose={() => setSnackOpen(false)}
      />
    </Container>
  );
};

export default AdminBookings;
