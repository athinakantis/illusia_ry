import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box } from '@mui/material';
import { Tables } from '../../types/supabase.types';
import { renderCellExpand } from './RenderCellExpand';

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
        pageSizeOptions={[10, 25, 50,100]}
        // getRowHeight={()=> "auto"}
        rowHeight={80}
        />
    </Box>
  );
};
