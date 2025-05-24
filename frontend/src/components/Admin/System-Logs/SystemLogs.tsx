import React, { useCallback, useEffect, useState } from 'react';
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
import { FilterPanel } from './FilterPanel';
import { useAppSelector } from '../../../store/hooks';
import { selectAdmins } from '../../../slices/usersSlice';
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
  /* —————————─────────—— State —————————————───────── */

  const [query, setQuery] = useState<SystemLogQuery>({
    limit: 25,
    page: 1,
  });
  const admins = useAppSelector(selectAdmins);
  const [rows, setRows] = useState<SystemLog[]>([]);
  const [rowCount, setRowCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  /* ─────────————————————— Fetch —————————————————───────── */
  const fetchLogs = useCallback(
    async (p = query) => {
      setLoading(true);
      try {
        const res = await systemLogsApi.fetch(buildParams(p));

        // Update the table rows
        setRows(res.data as SystemLog[]);

        // Always trust the server‑side numbers coming back in `meta`
        const total = res.meta?.total ?? 0;
        const serverPage = res.meta?.page ?? p.page ?? 1;
        const serverLimit = res.meta?.limit ?? p.limit ?? 25;

        setRowCount(total);

        // Keep our local `query` in sync with what the API really used;
        // this prevents the pagination controls from getting “stuck”
        setQuery(prev => {
          if (prev.page === serverPage && prev.limit === serverLimit) {
            return prev;      // nothing changed – avoid needless re‑renders
          }
          return { ...prev, page: serverPage, limit: serverLimit };
        });
      } catch (e: unknown) {
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError('Failed to fetch logs');
        }
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
      <Typography variant="heading_secondary_bold" gutterBottom>
        System Logs
      </Typography>

      <FilterPanel query={query} onChange={handleChange} onDateChange={pickDate} onApply={() => fetchLogs(query)} loading={loading} admins={admins} />

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
