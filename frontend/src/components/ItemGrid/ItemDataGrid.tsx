import { DataGrid, GridColDef, GridDeleteIcon } from '@mui/x-data-grid';
import { Box, IconButton } from '@mui/material';
import { renderCellExpand } from './RenderCellExpand';
import { Item } from '../../types/types';
import { useAppDispatch } from '../../store/hooks';
import { deleteItem, fetchAllItems } from '../../slices/itemsSlice';

interface ItemDataGridProps {
  data: Item[];
}

const uuidLength = 285;
const timeStampLength = 250;

export const ItemDataGrid: React.FC<ItemDataGridProps> = ({ data }) => {
  const dispatch = useAppDispatch();
  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      dispatch(deleteItem(id)).then(() => dispatch(fetchAllItems())); 
    }
  };

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
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <IconButton
        onClick={() => handleDelete(params.row.item_id)}
        aria-label="delete"
        color="error"
      >
        <GridDeleteIcon />
      </IconButton>
      ),
    },
  ];
  return (
    <Box sx={{ height: "700px", width: "100%", mt: 2 }}>
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
