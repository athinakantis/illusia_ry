import { GridRenderCellParams } from '@mui/x-data-grid';
import { Tooltip, Typography } from '@mui/material';

// Helper function for DataGrid cell rendering
// This function is used to render the cell content in a way that allows for word wrapping
export function renderCellExpand(params: GridRenderCellParams) {
  const value = params.value;

  if (!value) return '';

  return (
    <Tooltip
      title={value}
      placement="top-start"
      arrow
      enterDelay={300}
      sx={{ width: '100%', height: 250 }}
    >
      <Typography
        variant="body2"
        sx={{
          fontSize: '1rem',
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center',
          width: '100%',
          height: '100%',
          whiteSpace: 'normal',

        }}
        noWrap
      >
        {value}
      </Typography>
    </Tooltip>
  );
}
