import { GridRenderCellParams } from '@mui/x-data-grid';
import {  Typography } from '@mui/material';

// Helper function for DataGrid cell rendering
// This function is used to render the cell content in a way that allows for word wrapping
export function renderCellExpand(params: GridRenderCellParams) {
  const value = params.value;

  if (!value) return '';

  return (
    // Render the cell content with a Typography component
     // This allows for word wrapping and ensures the text is displayed correctly
      <Typography
        variant="body2"
        sx={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          height: '100%',
          whiteSpace: 'normal',// lets text wrap

        }}
      >
        {value}
      </Typography>
  
  );
}
