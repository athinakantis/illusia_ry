import { GridRenderCellParams } from '@mui/x-data-grid';
import { Typography } from '@mui/material';

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
        height: '50px',
        whiteSpace: 'normal',// lets text wrap
      }}
    >
      {value}
    </Typography>

  );
}
