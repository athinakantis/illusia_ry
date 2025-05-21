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
import { useTranslatedSnackbar } from '../../CustomComponents/TranslatedSnackbar/TranslatedSnackbar';
import { useSearchParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';




const AdminBookings = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const { showSnackbar } = useTranslatedSnackbar();
  // ─── Redux selectors ──────────────────────────────────────────
  const dispatch = useAppDispatch();
  const users = useAppSelector(selectAllUsers)
  const bookings = useAppSelector(selectAllBookings);
  const loading = useAppSelector(selectBookingsLoading);
  const error = useAppSelector(selectBookingsError);
  const items = useAppSelector(selectAllItems);
  const reservations = useAppSelector(selectAllReservations);
  const [searchParams] = useSearchParams()

  type Filter = 'all' | 'pending' | 'approved' | 'rejected';
  // ─── Local state (active filter tab) ──────────────────────────
  const [filter, setFilter] = useState<Filter>("all");
  const handleFilterChange = (_: SyntheticEvent, newValue: string) =>
      setFilter(newValue as Filter);

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

 /*——————————————Approve Booking —————————————————————*/
  const approveBooking = () => {
    if (!menuBookingId) return;
    console.log(menuBookingId)
    dispatch(updateBookingStatus({ id: menuBookingId, status: "approved" }));
    handleMenuClose();
    showSnackbar({
      message: t('adminBookings.snackbar.bookingApproved', { defaultValue: 'Booking approved'}),
      variant: 'success',
    });
  };
  /*——————————————Reject Booking —————————————————————*/
  const rejectBooking = () => {
    if (!menuBookingId) return;
    dispatch(updateBookingStatus({ id: menuBookingId, status: "rejected" }));
    handleMenuClose();
    showSnackbar({ 
      message: t('adminBookings.snackbar.bookingRejected', { defaultValue: 'Booking rejected'}),
      variant: 'error',
    });
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
  useEffect(() => {
          const search = searchParams.get('filter')
          if (search && ['all', 'pending', 'approved', 'rejected'].includes(search)) {
            setFilter(search as Filter)
          }
              // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [])

  // ─── Memoised filtered list ───────────────────────────────────
  const filteredBookings = useMemo(() => {
    // apply status filter
    const base =
      filter === "all" ? bookings : bookings.filter((b) => b.status === filter);

    // decorate with earliest start, then sort
    return base
      .map((b) => {
        const res = reservations.filter((r) => r.booking_id === b.booking_id);
        const earliestStart = Math.min(
          ...res.map((r) => new Date(r.start_date).getTime())
        );
        return { booking: b, start: earliestStart };
      })
      .sort((a, b) => a.start - b.start)
      .map((entry) => entry.booking);
  }, [bookings, reservations, filter]);

  // ─── Helper functions ────────────────────────────────────────

  // Display name || email || uid for user
  const userName = (uid?: string) =>
    users.find((u) => u.user_id === uid)?.display_name || users.find((u) => u.user_id === uid)?.email || uid;

  // Get item name by id
  const itemName = (iid: string) =>
    items.find((it) => it.item_id === iid)?.item_name || iid.slice(0, 6);

  const itemImage = (iid: string) =>
    items.find((it) => it.item_id === iid)?.image_path[0];
  // Navigate to item page
  const itemLink = (iid: string) => `/items/manage/${iid}`;


  const reservationsByBooking = (bid: string) =>
    reservations.filter((r) => r.booking_id === bid);

  // ─── Loading/Error states ─────────────────────────────────────
  if (loading)
    return (
      <Spinner />
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
      <Typography variant="heading_secondary_bold" gutterBottom>
        {t('adminBookings.heading', { defaultValue: 'Bookings' })}
      </Typography>

      {/* Filter Tabs */}
      <Tabs
        value={filter}
        onChange={handleFilterChange}
        textColor="primary"
        indicatorColor="primary"
        sx={{
          mb: 3,
          '& .MuiTab-root': { textTransform: 'none', fontWeight: 500 },
        }}
      >
        <Tab
          value="all"
          label={t('adminBookings.tabs.all', {
            defaultValue: 'All',
          })}
        />
        <Tab
          value="pending"
          label={t('adminBookings.tabs.pending', {
            defaultValue: 'Pending approval',
          })}
        />
        <Tab
          value="approved"
          label={t('adminBookings.tabs.approved', {
            defaultValue: 'Approved',
          })}
        />
        <Tab
          value="rejected"
          label={t('adminBookings.tabs.rejected', {
            defaultValue: 'Rejected',
          })}
        />
      </Tabs>

      {/* Bookings table */}
      <Paper variant="outlined">
        <Table size="medium">
          <TableHead sx={{ bgcolor: theme.palette.background.verylightgrey }}>
            <TableRow>
              <TableCell />
              {/*——————————————————————— ID ————————————————————————————*/}
              <TableCell>
                {t('adminBookings.id', { defaultValue: 'ID' })}
              </TableCell>
              {/*——————————————————————— Created ————————————————————————————*/}
              <TableCell>
                {t('adminBookings.created', { defaultValue: 'Created' })}
              </TableCell>
              {/*——————————————————————— Booking Dates ————————————————————————————*/}
              <TableCell>
                {t('adminBookings.bookingDates', {
                  defaultValue: 'Booking Dates',
                })}
              </TableCell>
              {/*——————————————————————— Customer ————————————————————————————*/}
              <TableCell>
                {t('adminBookings.customer', { defaultValue: 'Customer' })}
              </TableCell>
              {/*——————————————————————— Items ————————————————————————————*/}
              <TableCell align="center">
                {t('adminBookings.items', { defaultValue: 'Items' })}
              </TableCell>
              {/*——————————————————————— Status ————————————————————————————*/}
              <TableCell>
                {t('adminBookings.status', { defaultValue: 'Status' })}
              </TableCell>
            </TableRow>
          </TableHead>
          {/*———————————————————————————— Table Body ——————————————————————————*/}
          <TableBody>
            {filteredBookings.map((b) => {
              const res = reservationsByBooking(b.booking_id);
              const itemsCount = res.reduce(
                (sum, r) => sum + (r.quantity ?? 1),
                0,
              );
              // derive overall date range for the booking
              const earliestStart = Math.min(
                ...res.map((r) => new Date(r.start_date).getTime()),
              );
              const latestEnd = Math.max(
                ...res.map((r) => new Date(r.end_date).getTime()),
              );

              return (
                <React.Fragment key={b.booking_id}>
                  <TableRow
                    hover
                    onClick={() => toggleExpand(b.booking_id)}
                    sx={{ cursor: 'pointer' }}
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
                    {/*——————————————————————— ID ————————————————————————————*/}
                    <TableCell sx={{ color: 'primary.main' }}>
                      <Link to={`/bookings/${b.booking_id}`} style={{ color: 'inherit' }}>
                        {b.booking_id.slice(0, 8).toUpperCase()}
                      </Link>
                    </TableCell>
                    {/*——————————————————————— Created ————————————————————————————*/}
                    <TableCell>
                      {dayjs(b.created_at).format('DD.MM.YYYY')}
                    </TableCell>
                    {/*——————————————————————— Booking Dates ————————————————————————————*/}
                    <TableCell>
                      {`${dayjs(earliestStart).format('DD.MM.YYYY')} - ${dayjs(
                        latestEnd,
                      ).format('DD.MM.YYYY')}`}
                    </TableCell>
                    {/*——————————————————————— Customer ————————————————————————————*/}
                    <TableCell>{userName(b.user_id)}</TableCell>
                    {/*——————————————————————— Items ————————————————————————————*/}
                    <TableCell align="center">{itemsCount}</TableCell>
                    {/*——————————————————————— Status ————————————————————————————*/}
                    <TableCell sx={{ textTransform: 'capitalize' }}>
                      {b.status === 'pending' ? (
                        <Button
                          size="small"
                          variant="contained"
                          color="secondary"
                          onClick={(e) => handleStatusClick(e, b.booking_id)}
                          endIcon={<KeyboardArrowDownIcon />}
                          sx={{
                            textTransform: 'none',
                            borderRadius: 20,
                            bgcolor: 'secondary.light',
                            color: 'text.primary',
                          }}
                        >
                          {t('adminBookings.awaiting', {
                            defaultValue: 'Awaiting Approval',
                          })}
                        </Button>
                      ) : (
                        b.status
                      )}
                    </TableCell>
                  </TableRow>

                  {/* Collapsible detail */}
                  <TableRow>
                    <TableCell
                      style={{ paddingBottom: 0, paddingTop: 0 }}
                      colSpan={7}
                    >
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
                <TableCell colSpan={7} align="center" sx={{ py: 5 }}>
                  {t('adminBookings.noResults', {
                    defaultValue: 'No bookings found for selected filter.',
                  })}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <Menu
          anchorEl={menuAnchor}
          open={openMenu}
          onClose={handleMenuClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        >
          {/*——————————————————————— Approve Booking ———————————————————————*/}
          <MenuItem onClick={approveBooking}>
            {t('adminBookings.approve', { defaultValue: 'Approve' })}
          </MenuItem>
          {/*——————————————————————— Reject Booking ———————————————————————*/}
          <MenuItem onClick={rejectBooking}>
            {t('adminBookings.reject', { defaultValue: 'Reject' })}
          </MenuItem>
        </Menu>
      </Paper>
    </Container>
  );
};

export default AdminBookings;
