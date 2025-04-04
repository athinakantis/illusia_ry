import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box } from '@mui/material';
import { Tables } from '../../types/supabase';

interface ItemDataGridProps {
  data: Tables<'items'>[];
}

const uuidLength = 285;
const timeStampLength = 250;

export const ItemDataGrid: React.FC<ItemDataGridProps> = ({ data }) => {
  const columns: GridColDef[] = [
    {
      field: 'item_id',
      headerName: 'ID',
      width: uuidLength,
    },
    {
      field: 'item_name',
      headerName: 'Name',
      minWidth: 150,
    },
    {
      field: 'description',
      headerName: 'Description',
      minWidth: 240,
      flex: 1,
    },
    {
      field: 'image_path',
      headerName: 'Image Path',
      minWidth: 200,
    },
    {
      field: 'location',
      headerName: 'Location',
      minWidth: 120,
    },
    {
      field: 'quantity',
      headerName: 'Pcs',
      type: 'number',
      minWidth: 80,
    },
    {
      field: 'category_id',
      headerName: 'Category',
      minWidth: uuidLength,
    },
    {
      field: 'created_at',
      headerName: 'Created At',
      minWidth: timeStampLength,
    },
  ];
  return (
    <Box sx={{ height: 600, width: '100%', mt: 2 }}>
      <DataGrid
        rows={data}
        getRowId={(row) => row.item_id}
        columns={columns}
        pageSizeOptions={[10, 25, 50,100]}
        // getRowHeight={()=> "auto"}
        rowHeight={80}
        />
    </Box>
  );
};
