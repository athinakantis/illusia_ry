import { DataGrid, DataGridProps } from '@mui/x-data-grid';
import { SxProps, Theme } from '@mui/material';

const defaultSx: SxProps<Theme> = {
    '& .MuiDataGrid-row:first-of-type': { mt: 1 },
    '& .super-app-theme--header': {
        backgroundColor: 'primary.main',
        color: 'text.light',
        fontSize: '1.1rem',
    },
    '& .MuiDataGrid-cell': { pl: 2 },
    '& .MuiDataGrid-footerContainer': { backgroundColor: 'primary.main' },
    '& .MuiDataGrid-footerContainer :is(p, span, .MuiDataGrid-selectedRowCount)': {
        color: 'background.default'
    },
    '& .MuiDataGrid-footerContainer :is(svg)': { fill: 'white' },
    '& .MuiDataGrid-row:hover': {
        backgroundColor: 'background.verylightgrey',
        transition: 'background-color 0.3s ease',
    },
    '& .MuiDataGrid-cell:focus': { outline: 'none' },
    '& .MuiDataGrid-row.Mui-selected': {
        outline: '2px solid #44195B',
        outlineOffset: '-2px',
    },
    '& .MuiDataGrid-row:nth-of-type(even)': {
        backgroundColor: 'background.verylightgrey',
    },
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