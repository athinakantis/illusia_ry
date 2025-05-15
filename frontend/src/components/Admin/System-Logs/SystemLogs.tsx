import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Box,
  Snackbar,
  Typography,
} from '@mui/material';
import { parseDate, type CalendarDate } from '@internationalized/date';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import {
  systemLogsApi,
  SystemLog,
  SystemLogQuery,
} from '../../../api/system-logs';
import { systemLogColumns } from './columns';
import { FilterPanel } from './FilterPanel';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchAllUsers, selectAllUsers } from '../../../slices/usersSlice';
import { fetchAllCategories,selectAllCategories} from '../../../slices/itemsSlice';
import { fetchAllReservations, selectAllReservations } from '../../../slices/reservationsSlice';
import { fetchAllBookings, selectAllBookings } from '../../../slices/bookingsSlice';
import { SystemLogsTable } from './SystemLogsTable';
import { GridPaginationModel } from '@mui/x-data-grid';

dayjs.extend(relativeTime)

/* ————————————————————————————————————————————————
* Helper to build query params (inclusive “to” date)
* ———————————————————————————————————————————————— */
function buildParams(q: SystemLogQuery): SystemLogQuery {
    if (q.to) {
        const plusOne = parseDate(q.to).add({ days: 1 }); // inclusive
        return { ...q, to: plusOne.toString() };
    }
    return q;
}

const SystemLogs: React.FC = () => {
    const dispatch = useAppDispatch();
    /* ───────── state ───────── */
    const [query, setQuery] = useState<SystemLogQuery>({
        limit: 25,
        page: 1,
    });
    const reservations = useAppSelector(selectAllReservations);
    const bookings = useAppSelector(selectAllBookings);
    const categories = useAppSelector(selectAllCategories);
    const users = useAppSelector(selectAllUsers);
  const [rows, setRows] = useState<SystemLog[]>([]);
  const [rowCount, setRowCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
console.log('users', users);
/* —————————————————— Fetches —————————————————————— */
// Fetching everything in case we dont have it in the store
useEffect(() => {
    if(!users.length) {
        dispatch(fetchAllUsers());
    }
}, [dispatch, users.length]);

useEffect(() => {
    if(!categories.length) {
        dispatch(fetchAllCategories());
    }
}, [dispatch, categories.length]);

useEffect(() => {
    if(!reservations.length) {
        dispatch(fetchAllReservations());
    }
}, [dispatch, reservations.length]);

useEffect(() => {
    if(!bookings.length) {
        dispatch(fetchAllBookings());
    }
}, [dispatch, bookings.length]);

const columns = useMemo(() => systemLogColumns, []);

/* ───────── fetch ───────── */
const fetchLogs = useCallback(
  async (p = query) => {
    setLoading(true);
    try {
      const res = await systemLogsApi.fetch(buildParams(p));
      if (Array.isArray((res).data)) {
        setRows((res).data);
        setRowCount((res).meta.total ?? (res).data.length);
      } else {
        setRows(res as any);
        setRowCount((res as any).length ?? 0);
      }
    } catch (e: any) {
      setError(e?.message ?? 'Failed to fetch logs');
    } finally {
      setLoading(false);
    }
  },
  [query],
);

/* initial + query change fetch */
useEffect(() => {
  fetchLogs();
}, [fetchLogs]);

/* ───────── handlers ───────── */
const handleChange =
  (field: keyof SystemLogQuery) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setQuery((prev) => ({
      ...prev,
      page: field === 'limit' ? 1 : prev.page,
      [field]: e.target.value === 'all' ? undefined : e.target.value,
    }));

const pickDate = (field: 'from' | 'to') => (value: CalendarDate | null) =>
  setQuery((prev) => ({
    ...prev,
    [field]: value ? value.toString() : undefined,
  }));

const handlePagination = (model: GridPaginationModel) => {
  setQuery((prev) => ({
    ...prev,
    limit: model.pageSize,
    page: model.page + 1, // DataGrid is 0‑based
  }));
};

/* ───────── render ───────── */
return (
  <Box
    sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}
  >
    <Typography variant="h5" gutterBottom>
      System Logs
    </Typography>

    <FilterPanel query={query} onChange={handleChange} onDateChange={pickDate} onApply={() => fetchLogs(query)} loading={loading} />

    <SystemLogsTable
      rows={rows}
      loading={loading}
      rowCount={rowCount}
      paginationModel={{ page: (query.page ?? 1) - 1, pageSize: query.limit ?? 25 }}
      onPaginationModelChange={handlePagination}
    />

    {/* Error snackbar */}
    <Snackbar
      open={Boolean(error)}
      autoHideDuration={6000}
      onClose={() => setError(null)}
      message={error ?? ''}
    />
  </Box>
);
};

export default SystemLogs;
