import React from 'react';
import { Paper, Stack, TextField, MenuItem, Button } from '@mui/material';
import { DatePicker, Provider, defaultTheme } from '@adobe/react-spectrum';
import { parseDate, type CalendarDate } from '@internationalized/date';
import {
  TABLE_NAMES,
  TABLE_LABELS,
  ACTION_TYPES,
} from './constants';
import type { SystemLogQuery } from '../../../api/system-logs';
import type { User } from '../../../types/users.type';

/**
 * Props for FilterPanel
 *
 * @property query        - Current filter values
 * @property onChange     - Handler to update a string-based filter field
 * @property onDateChange - Handler to update the 'from' or 'to' date fields
 * @property onApply      - Called when the Apply button is clicked
 * @property loading      - Whether the data is currently loading (disables Apply)
 * @param {User[]} props.admins - List of Admin/Head Admin users for the dropdown.
 */
interface FilterPanelProps {
  query: SystemLogQuery;
  onChange: (field: keyof SystemLogQuery) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDateChange: (field: 'from' | 'to') => (value: CalendarDate | null) => void;
  onApply: () => void;
  loading: boolean;
  admins: User[];
}

/**
 * @component
   🐈‍⬛ FilterPanel
 *
* @description
* ```text
*     /\_____/\
*    /  o   o  \
*   ( ==  ^  == )
*    )         (
*   (           )
*  ( (  )   (  ) )
* (__(__)___(__)__)
* ```
*
  This component renders a set of filter controls for the System Logs table.
  It includes:
    - Table selector (which database table to display logs from)
    - Action selector (INSERT, UPDATE, DELETE)
    - User ID input (filter logs by user)
    - Metadata search input (full-text search across JSON metadata)
    - Date range pickers (From / To filters)
    - Rows per page selector (pagination size)
    - Apply button to trigger the filter action
 * Renders the set of filter controls for the System Logs table.
    
 *
 * @component
 * @param {Object} props
 * @param {SystemLogQuery} props.query - Current filter values.
 * @param {(field: keyof SystemLogQuery) => (e: React.ChangeEvent<HTMLInputElement>) => void} props.onChange
 *   - Handler to update string-based filter fields.
 * @param {(field: 'from' | 'to') => (value: CalendarDate | null) => void} props.onDateChange
 *   - Handler to update the 'from' or 'to' date filters.
 * @param {() => void} props.onApply - Called when the Apply button is clicked.
 * @param {boolean} props.loading - Whether data is currently loading (disables the Apply button).
 * @param {User[]} props.admins - List of Admin/Head Admin users for the dropdown.
 * @returns {JSX.Element} The rendered filter panel.
 */
export const FilterPanel: React.FC<FilterPanelProps> = ({
  query,
  onChange,
  onDateChange,
  onApply,
  loading,
  admins,
}) => (
  <Paper sx={{ p: 2, mb: 3 }}>
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      spacing={2}
      useFlexGap
      flexWrap="wrap"
    >
      {/*  Table filter: choose which log table to query */}
      <TextField
        label="Table"
        select
        value={query.table_name ?? ''}
        onChange={onChange('table_name')}
        sx={{ minWidth: 160 }}
      >
        <MenuItem value="">All</MenuItem>
        {TABLE_NAMES.map((name) => (
          <MenuItem key={name} value={name}>
            {TABLE_LABELS[name] ?? name}
          </MenuItem>
        ))}
      </TextField>

      {/*  Action filter: choose the type of action (INSERT, UPDATE, DELETE) */}
      <TextField
        label="Action"
        select
        value={query.action_type ?? ''}
        onChange={onChange('action_type')}
        sx={{ minWidth: 160 }}
      >
        <MenuItem value="">All</MenuItem>
        {ACTION_TYPES.map((a) => (
          <MenuItem key={a} value={a}>
            {a}
          </MenuItem>
        ))}
      </TextField>
      
     {/* Admin filter: choose an Admin or Head Admin */}
     <TextField
       label="Admin"
       select
       value={query.user_id ?? ''}
       onChange={onChange('user_id')}
       sx={{ minWidth: 240 }}
     >
       <MenuItem value="">All</MenuItem>
       {admins.map((admin) => (
         <MenuItem key={admin.user_id} value={admin.user_id}>
           {admin.display_name}
         </MenuItem>
       ))}
     </TextField>

      {/*  Search Metadata filter: full-text search in metadata(case sensitive) */}
      <TextField
        label="Search Metadata"
        value={query.search ?? ''}
        onChange={onChange('search')}
        sx={{ flexGrow: 1, minWidth: 200 }}
      />

      {/*  Date Range filters: From and To date pickers */}

      {/* From date picker (wrapped in Provider for theming) */}
      <Provider theme={defaultTheme} colorScheme="light"  height={0}> 
        <DatePicker
          label="From"
          value={query.from ? parseDate(query.from) : null}
          onChange={onDateChange('from')}
        />
      </Provider>

      {/* To date picker (wrapped in Provider for theming) */}
      <Provider theme={defaultTheme} colorScheme="light" height={0}>
        <DatePicker
          label="To"
          value={query.to ? parseDate(query.to) : null}
          onChange={onDateChange('to')}
        />
      </Provider>
      <TextField
        label="Rows / page"
        select
        value={query.limit ?? 'all'}
        onChange={onChange('limit')}
        sx={{ minWidth: 140 }}
      >
        {[25, 50, 100].map((n) => (
          <MenuItem key={n} value={n}>
            {n}
          </MenuItem>
        ))}
        <MenuItem value="all">All</MenuItem>
      </TextField>
      <Button
        variant="contained"
        onClick={onApply}
        disabled={loading}
        sx={{ alignSelf: 'center' }}
      >
        Apply
      </Button>
    </Stack>
  </Paper>
);
