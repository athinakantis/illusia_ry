import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  MenuItem,
  Paper,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { DataGrid, GridPaginationModel } from '@mui/x-data-grid';
import { DatePicker, Provider, defaultTheme } from '@adobe/react-spectrum';
import { parseDate, type CalendarDate } from '@internationalized/date';
import dayjs from 'dayjs';
import {
  systemLogsApi,
  SystemLog,
  SystemLogQuery,
} from '../../../api/system-logs';
import { useUserName } from '../../../hooks/useUserName';
import { useItemLabel } from '../../../hooks/useItemLabel';
import { useCategoryLabel } from '../../../hooks/useCategoryLabel';

/* Label helpers that can safely call hooks inside DataGrid renderers */
const UserLabelCell: React.FC<{ value: string | null }> = ({ value }) => {
  const name = useUserName(value ?? undefined);
  return <Box sx={{ fontSize: 12 }}>{name}</Box>;
};

const ItemLabelCell: React.FC<{ value: string | null }> = ({ value }) => {
  const label = useItemLabel(value ?? undefined);
  return <Box sx={{ fontSize: 12 }}>{label}</Box>;
};

const CategoryLabelCell: React.FC<{ value: string | null }> = ({ value }) => {
  const label = useCategoryLabel(value ?? undefined);
  return <Box sx={{ fontSize: 12 }}>{label}</Box>;
};


const TABLE_NAMES = [
    'users',
    'roles',
    'user_roles',
    'tags',
    'item_tags',
    'categories',
    'items',
    'bookings',
    'item_reservations',
    'system_logs',
] as const;

const ACTION_TYPES = ['INSERT', 'UPDATE', 'DELETE'] as const;

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
    const users = useAppSelector(selectAllUsers);
  const [rows, setRows] = useState<SystemLog[]>([]);
  const [rowCount, setRowCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
console.log('users', users);
useEffect(() => {
    if(!users.length) {
        dispatch(fetchAllUsers());
    }
})
  /* ───────── column def ───────── */
  const columns = useMemo(
    () => [
      {
        field: 'created_at',
        headerName: 'When',
        width: 170,
        valueFormatter: ({ value }: { value: string }) =>
          dayjs(value).format('DD-MM-YYYY HH:mm'),
      },
      { field: 'table_name', headerName: 'Table', width: 140 },
      {
        field: 'action_type',
        headerName: 'Action',
        width: 110,
        renderCell: (p: any) => {
          const color =
            p.value === 'INSERT'
              ? 'success.main'
              : p.value === 'DELETE'
                ? 'error.main'
                : 'warning.main';
          return (
            <Box sx={{ color, fontWeight: 600, textTransform: 'capitalize' }}>
              {p.value}
            </Box>
          );
        },
      },
      {
        field: 'user_id',
        headerName: 'User',
        width: 220,
        renderCell: ({ value }: any) => <UserLabelCell value={value} />,
      },
      {
        field: 'target_id',
        headerName: 'Target',
        width: 220,
        renderCell: (params: any) => {
          const { value, row } = params;
          switch (row.table_name) {
            case 'items':
            case 'item_tags':
            case 'item_reservations':
              return <ItemLabelCell value={value} />;
            case 'categories':
              return <CategoryLabelCell value={value} />;
            case 'users':
            case 'user_roles':
              return <UserLabelCell value={value} />;
            default:
              return <Box sx={{ fontSize: 12 }}>{value ?? '—'}</Box>;
          }
        },
      },
      {
        field: 'metadata',
        headerName: 'Meta (JSON)',
        flex: 1,
        minWidth: 320,
        renderCell: (p: any) => (
          <Box
            sx={{
              fontSize: 12,
              whiteSpace: 'pre-wrap',
              maxHeight: 200,
              overflow: 'auto',
              width: '100%',
            }}
          >
            {JSON.stringify(p.value, null, 2)}
          </Box>
        ),
      },
    ],
    [],
  );

  /* ───────── fetch ───────── */
  const fetchLogs = useCallback(
    async (p = query) => {
      setLoading(true);
      try {
        const res = await systemLogsApi.fetch(buildParams(p));
        if (Array.isArray((res as any).data)) {
          setRows((res as any).data);
          setRowCount((res as any).meta.total ?? (res as any).data.length);
        } else {
          setRows(res as any[]);
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
      setQuery((prev) => ({ ...prev, [field]: e.target.value || undefined }));

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

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
          useFlexGap
          flexWrap="wrap"
        >
          {/* ———————— Table —————————— */}
          <TextField
            label="Table"
            select
            value={query.table_name ?? ''}
            onChange={handleChange('table_name')}
            sx={{ minWidth: 160 }}
          >
            <MenuItem value="">All</MenuItem>
            {TABLE_NAMES.map((name) => (
              <MenuItem key={name} value={name}>
                {name}
              </MenuItem>
            ))}
          </TextField>
          {/* ———————— Action —————————— */}
          <TextField
            label="Action"
            select
            value={query.action_type ?? ''}
            onChange={handleChange('action_type')}
            sx={{ minWidth: 160 }}
          >
            <MenuItem value="">All</MenuItem>
            {ACTION_TYPES.map((a) => (
              <MenuItem key={a} value={a}>
                {a}
              </MenuItem>
            ))}
          </TextField>
          {/* ———————— User ID —————————— */}
          <TextField
            label="User ID"
            value={query.user_id ?? ''}
            onChange={handleChange('user_id')}
            sx={{ minWidth: 240 }}
          />
          {/* ———————— Search Metadata —————————— */}
          <TextField
            label="Search"
            value={query.search ?? ''}
            onChange={handleChange('search')}
            sx={{ flexGrow: 1, minWidth: 200 }}
          />
          {/* ———————— Date Range —————————— */}
          <Provider theme={defaultTheme} colorScheme="light">
            <DatePicker
              label="From"
              value={query.from ? parseDate(query.from) : null}
              onChange={pickDate('from')}
            />
          </Provider>
          <Provider theme={defaultTheme} colorScheme="light">
            <DatePicker
              label="To"
              value={query.to ? parseDate(query.to) : null}
              onChange={pickDate('to')}
            />
          </Provider>

 {/* ———————— Rows / Page —————————————————— */}
 <TextField
              label="Rows / page"
              select
              value={query.limit ?? 'all'}
              onChange={(e) =>
                setQuery((prev) => ({
                  ...prev,
                  page: 1,
                  limit:
                    e.target.value === 'all'
                      ? undefined
                      : Number(e.target.value),
                }))
              }
              sx={{ minWidth: 140 }}
            >
              {[25, 50, 100].map((n) => (
                <MenuItem key={n} value={n}>
                  {n}
                </MenuItem>
              ))}
              <MenuItem value="all">All</MenuItem>
            </TextField>
            {/* ———————— Apply button —————————— */}
          <Button
            variant="contained"
            onClick={() => fetchLogs(query)}
            disabled={loading}
            sx={{ alignSelf: 'center' }}
          >
           
            Apply
          </Button>
        </Stack>
      </Paper>

      {/* DataGrid */}
      <Box sx={{ flexGrow: 1 }}>
        <StripedDataGrid
          rows={rows}
          columns={columns}
          loading={loading}
          getRowId={(row) => row.log_id}
          getRowClassName={(params) =>
            params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
          }
          getRowHeight={() => 'auto'}
          rowCount={rowCount}
          pageSizeOptions={[25, 50, 100]}
          paginationMode="server"
          paginationModel={{
            page: (query.page ?? 1) - 1,
            pageSize: query.limit ?? 25,
          }}
          onPaginationModelChange={handlePagination}
          initialState={{
            sorting: { sortModel: [{ field: 'created_at', sort: 'desc' }] },
          }}
        />
      </Box>

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

import { styled } from '@mui/material/styles';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchAllUsers, selectAllUsers } from '../../../slices/usersSlice';

const StripedDataGrid = styled(DataGrid)(({ theme }) => ({
  '& .even': {
    backgroundColor: theme.palette.action.hover,
  },
}));

export default SystemLogs;
