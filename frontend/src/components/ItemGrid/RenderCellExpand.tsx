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
      enterDelay={500}
      sx={{ width: '100%', height: 250 }}
      slotProps={{
        tooltip: {
          sx: {
            height: "auto",
            maxWidth: 300,
            backgroundColor: "WindowText",
            color: '#000',
            fontSize: '1.1rem',
            borderRadius: '4px',
            padding: '8px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
          },
        },
      }}
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
