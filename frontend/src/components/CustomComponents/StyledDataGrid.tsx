import { DataGrid, DataGridProps } from '@mui/x-data-grid';
import { SxProps, Theme } from '@mui/material';

const defaultSx: SxProps<Theme> = {
    '& .MuiDataGrid-row:first-of-type': { mt: 1 },
    // Header CSS
    '& .super-app-theme--header': {
        backgroundColor: 'background.verylightgrey',
        color: 'text.primary',
        fontSize: '0.8 rem',
        fontFamily: 'Lato, sans-serif'
    },
    '& .MuiDataGrid-columnHeaderTitle': {
        fontSize: '0.8rem',
    },

    // Individual Cell CSS
    '& .MuiDataGrid-cell': {
        pl: 2,
        py: 1
    },
    // Footer CSS
    '& .MuiDataGrid-footerContainer': {
        backgroundColor: 'background.verylightgrey',
    },
    '& .MuiDataGrid-footerContainer :is(p, span, .MuiDataGrid-selectedRowCount)': {
        color: 'text.primary'
    },
    '& .MuiDataGrid-footerContainer :is(svg)': {
        fill: 'text.primary'
    },
    '& .MuiTablePagination-select': {
        color: 'text.primary'
    },
    // Hover CSS
    '& .MuiDataGrid-row:hover': {
        backgroundColor: 'background.verylightgrey',
        transition: 'background-color 0.3s ease',
    },
    // Focus CSS
    '& .MuiDataGrid-cell:focus': { outline: 'none' },
    // Selected Row CSS
    '& .MuiDataGrid-row.Mui-selected': {
        outline: 'none',
        outlineOffset: 0,
        backgroundColor: 'inherit',
    },
    // Even Row CSS
    '& .MuiDataGrid-row:nth-of-type(even)': {
        backgroundColor: 'background.default',
    },
    // Odd Row CSS
    '& .MuiDataGrid-row:nth-of-type(odd)': {
        backgroundColor: 'background.default',
        borderColor: 'secondary.main',
    },
};

export const StyledDataGrid = (props: DataGridProps) => (
    <DataGrid
        {...props}
        sx={{ ...defaultSx, ...props.sx }}
    />
);