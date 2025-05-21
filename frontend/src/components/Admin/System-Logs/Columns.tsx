import { Box, Chip, Tooltip, Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { SystemLog } from '../../../api/system-logs';
import {
  UserLabelCell,
  CategoryLabelCell,
  BookingLabelCell,
  ReservationLabelCell,
} from './CellRenderers';
import {
  TABLE_LABELS,
  SINGULAR_TABLE_LABELS,
} from './constants';

dayjs.extend(relativeTime);
/* ─────────——————————— Column Definitions ————───────── */
export const systemLogColumns: GridColDef<SystemLog>[] = [

   /*——————————————— Created at ————————————————————*/
  {
    field: 'created_at',
    headerName: 'When',
    width: 170,
    sortComparator: (v1: string, v2: string) =>
      new Date(v1).getTime() - new Date(v2).getTime(),
    renderCell: (params: GridRenderCellParams<SystemLog>) => (
      <Tooltip title={dayjs(params.value).format('DD MMM YYYY, HH:mm')}>
        <span>{dayjs(params.value).fromNow()}</span>
      </Tooltip>
    ),
  },
  /*——————————————— Table Name ————————————————————*/
  {
    field: 'table_name',
    headerName: 'Table',
    width: 140,
    renderCell: (params: GridRenderCellParams<SystemLog, string | undefined>) => {
      const value = params.value ?? ''  // coalesce undefined → ''
      return TABLE_LABELS[value] || value
    },
  },
  /*——————————————— Action Type ————————————————————*/
  {
    field: 'action_type',
    headerName: 'Action',
    width: 110,
    renderCell: (params: GridRenderCellParams<SystemLog, string | undefined>) => {
      const action = params.value ?? '';
      const tableKey = params.row.table_name ?? '';
      const verbMap: Record<string, string> = {
        INSERT: 'Create',
        UPDATE: 'Change',
        DELETE: 'Delete',
        CREATE_ITEM: 'Create',
      };
      const singular =
        SINGULAR_TABLE_LABELS[tableKey] ??
        TABLE_LABELS[tableKey]?.replace(/s$/, '') ??
        tableKey;
      const actionLabel = `${verbMap[action] || action} ${singular}`;
      const commonSx = { textTransform: 'capitalize', fontWeight: 600 };
      if (action === 'UPDATE' || action === 'CREATE_ITEM') {
        return (
          <Chip
            label={actionLabel}
            size="small"
            sx={{
              ...commonSx,
              backgroundColor: (theme) => theme.palette.warning.dark,
              color: (theme) => theme.palette.text.light,
            }}
          />
        );
      }
      const color: 'success' | 'warning' | 'error' =
        action === 'INSERT' ? 'success'
        : action === 'DELETE' ? 'error'
        : 'warning';
      return (
        <Chip
          label={actionLabel}
          color={color}
          size="small"
          sx={commonSx}
        />
      );
    },
  },
  /*——————————————— User ID ————————————————————*/
  {
    field: 'user_id',
    headerName: 'User',
    width: 220,
    renderCell: (params: GridRenderCellParams<SystemLog, string | null | undefined>) => {
      const userId = params.value ?? null;
      return (
        <Tooltip title={userId ?? ''}>
          <Box sx={{ fontSize: 12 }}>
            <UserLabelCell value={userId} />
          </Box>
        </Tooltip>
      );
    },
  },
  /*——————————————— Target ID ————————————————————*/
  {
    field: 'target_id',
    headerName: 'Target',
    width: 220,
    renderCell: (params: GridRenderCellParams<SystemLog, string | undefined>) => {
      const value = params.value ?? '';
      const tableKey = params.row.table_name ?? '';
      switch (tableKey) {
        case 'items':
          return (
            <Box sx={{ fontSize: 12 }}>
              {(params.row.metadata?.item_name ?? value) as React.ReactNode}
            </Box>
          );
        case 'item_reservations': {
          // Ensure metadata exists and matches the reservation shape
          if (!params.row.metadata) {
            return <Box sx={{ fontSize: 12 }}>—</Box>;
          }
          const reservationMetadata = params.row.metadata as {
            booking_id: string;
            created_at: string | null;
            end_date: string;
            id: string;
            item_id: string;
            quantity: number;
            start_date: string;
          };
          return <ReservationLabelCell value={value} metadata={reservationMetadata} />;
        }
        case 'categories':
          return <CategoryLabelCell value={value} />;
        case 'users':
        case 'user_roles':
          return <UserLabelCell value={value} />;
        case 'bookings':
          return (
            <Box sx={{ fontSize: 12, display: 'flex', alignItems: 'center' }}>
              <BookingLabelCell value={value} />
              <Box component="span" sx={{ ml: 0.5 }}>{`'s booking`}</Box>
            </Box>
          );
        default:
          return <Box sx={{ fontSize: 12 }}>{value ?? '—'}</Box>;
      }
    },
  },
  /*——————————————— Metadata ————————————————————*/
  {
    field: 'metadata',
    headerName: 'Details',
    flex: 1,
    minWidth: 320,
    renderCell: (params: GridRenderCellParams<SystemLog, SystemLog['metadata'] | undefined>) => {
      const metadata = params.value ?? {};
      return (
        <Accordion sx={{ width: '100%' }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ p: 0, m: 0 }}>
            <Typography variant="caption">View JSON</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 1, maxHeight: 200, overflow: 'auto' }}>
            <pre style={{ whiteSpace: 'pre-wrap', fontSize: 12 }}>
              {JSON.stringify(metadata, null, 2)}
            </pre>
          </AccordionDetails>
        </Accordion>
      );
    },
  },
];
