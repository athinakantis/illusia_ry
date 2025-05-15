import React from 'react';
import { Box } from '@mui/material';
import { DataGrid, GridPaginationModel, DataGridProps } from '@mui/x-data-grid';
import { styled } from '@mui/material/styles';
import { SystemLog } from '../../../api/system-logs';
import { systemLogColumns } from './columns';

interface SystemLogsTableProps {
  rows: SystemLog[];
  loading: boolean;
  rowCount: number;
  paginationModel: GridPaginationModel;
  onPaginationModelChange: (model: GridPaginationModel) => void;
}

const StripedDataGrid = styled(
  DataGrid as React.ComponentType<DataGridProps<SystemLog>>
)(({ theme }) => ({
  '& .even': {
    backgroundColor: theme.palette.action.hover,
  },
  '& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within': {
    outline: 'none',
  },
}));

export const SystemLogsTable: React.FC<SystemLogsTableProps> = ({
  rows,
  loading,
  rowCount,
  paginationModel,
  onPaginationModelChange,
}) => (
  <Box sx={{ flexGrow: 1 }}>
    <StripedDataGrid
      rows={rows}
      columns={systemLogColumns}
      loading={loading}
      getRowId={(row) => row.log_id}
      getRowClassName={(params) =>
        params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
      }
      getRowHeight={() => 'auto'}
      rowCount={rowCount}
      pageSizeOptions={[25, 50, 100]}
      paginationMode="server"
      paginationModel={paginationModel}
      onPaginationModelChange={onPaginationModelChange}
      initialState={{
        sorting: { sortModel: [{ field: 'created_at', sort: 'desc' }] },
      }}
    />
  </Box>
);
