import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box } from '@mui/material';
import { Tables } from '../../types/supabase';
import { renderCellExpand } from './RenderCellExpand';

interface ItemDataGridProps {
  data: Tables<'items'>[];
}

const uuidLength = 285;
const timeStampLength = 250;

export const CustomItemDataGrid: React.FC<ItemDataGridProps> = ({ data }) => {
  const columns: GridColDef[] = [
    {
      field: 'item_id',
      headerName: 'ID',
      width: uuidLength,
      renderCell: renderCellExpand,
    },
    {
      field: 'item_name',
      headerName: 'Name',
      minWidth: 150,
      renderCell: renderCellExpand,
    },
    {
      field: 'description',
      headerName: 'Description',
      minWidth: 240,
      flex: 1,
      renderCell: renderCellExpand,
    },
    {
      field: 'image_path',
      headerName: 'Image Path',
      minWidth: 200,
      renderCell: renderCellExpand,
    },
    {
      field: 'location',
      headerName: 'Location',
      minWidth: 120,
      renderCell: renderCellExpand,
    },
    {
      field: 'quantity',
      headerName: 'Pcs',
      type: 'number',
      minWidth: 80,
      renderCell: renderCellExpand,
    },
    {
      field: 'category_id',
      headerName: 'Category',
      minWidth: uuidLength,
      renderCell: renderCellExpand,
    },
    {
      field: 'created_at',
      headerName: 'Created At',
      minWidth: timeStampLength,
      renderCell: renderCellExpand,
    },
  ];
  return (
    <Box sx={{ height: 600, width: '100%', mt: 2 }}>
      <DataGrid
        rows={data}
        getRowId={(row) => row.item_id}
        columns={columns}
        initialState={{
          pagination: { paginationModel: { pageSize: 10, page: 0 } },
        }}
        pageSizeOptions={[10, 25, 50]}
        // getRowHeight={()=> "auto"}
        rowHeight={80}
        sx={{
          borderRadius: 2,
          border: '1px solid rgb(0, 0, 0)',
          fontSize: '0.95rem',
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: 'red',
            fontWeight: 'bold',
          },
          '& .MuiDataGrid-cell': {
            padding: '15px',
            m: 0.5,
          },
          '& .MuiDataGrid-row:hover': {
            backgroundColor:"white",
          },
          '& .MuiDataGrid-row:nth-of-type(even)': {
            color: 'blacksmoke',
            backgroundColor: '#04ffe8', // alternate row color
          },
          '& .MuiDataGrid-row:nth-of-type(odd)': {
            backgroundColor: '#85FFBD', // alternate row color
          },
          // Custom scrollbar styles
          '& .MuiDataGrid-scrollbar': {
            scrollbarColor: 'black #377051',
          },
          // Scrollbar hover styles
          '& .MuiDataGrid-scrollbar:hover': {
            scrollbarColor: 'black #85FFBD',
          },
          // Header Container
          '& .MuiDataGrid-columnHeaderTitleContainer': {
            justifyContent: 'center', // center the header text
            backgroundColor: '#f0f0f0',
          },
          // Header Text
          '& .MuiDataGrid-columnHeaderTitle': {
            fontSize: '1rem',
            fontWeight: 'thin',
            color: 'blacksmoke',
          },
         // Footer Container
          '& .MuiDataGrid-footerContainer': {
            backgroundColor: '#f0f0f0',
            borderTop: '1px solid rgb(0, 0, 0)',
          },
        }}
      />
    </Box>
  );
};
