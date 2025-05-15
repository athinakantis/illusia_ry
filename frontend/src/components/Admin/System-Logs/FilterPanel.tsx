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

interface FilterPanelProps {
  query: SystemLogQuery;
  onChange: (field: keyof SystemLogQuery) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDateChange: (field: 'from' | 'to') => (value: CalendarDate | null) => void;
  onApply: () => void;
  loading: boolean;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  query,
  onChange,
  onDateChange,
  onApply,
  loading,
}) => (
  <Paper sx={{ p: 2, mb: 3 }}>
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      spacing={2}
      useFlexGap
      flexWrap="wrap"
    >
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
      <TextField
        label="User ID"
        value={query.user_id ?? ''}
        onChange={onChange('user_id')}
        sx={{ minWidth: 240 }}
      />
      <TextField
        label="Search Metadata"
        value={query.search ?? ''}
        onChange={onChange('search')}
        sx={{ flexGrow: 1, minWidth: 200 }}
      />
      <Provider theme={defaultTheme} colorScheme="light">
        <DatePicker
          label="From"
          value={query.from ? parseDate(query.from) : null}
          onChange={onDateChange('from')}
        />
      </Provider>
      <Provider theme={defaultTheme} colorScheme="light">
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
