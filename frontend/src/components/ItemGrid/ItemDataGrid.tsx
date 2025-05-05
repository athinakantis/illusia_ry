import { GridColDef } from '@mui/x-data-grid';
import { Box, IconButton, Typography } from '@mui/material';
import { renderCellExpand } from './RenderCellExpand';
import { Item } from '../../types/types';
import { useAppDispatch } from '../../store/hooks';
import { deleteItem, fetchAllItems } from '../../slices/itemsSlice';
import { formatDate } from '../../utility/formatDate';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import { StyledDataGrid } from '../CustomComponents/StyledDataGrid';


interface ItemDataGridProps {
  data: Item[];
}

const uuidLength = 230;
const timeStampLength = 150;

export const ItemDataGrid: React.FC<ItemDataGridProps> = ({ data }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      dispatch(deleteItem(id)).then(() => dispatch(fetchAllItems()));
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'item_name',
      headerClassName: 'super-app-theme--header',
      headerAlign: 'left',
      headerName: 'Name',
      minWidth: 150,
      renderCell: renderCellExpand,
    },
    {
      field: 'item_id',
      headerClassName: 'super-app-theme--header',
      headerAlign: 'left',
      headerName: 'ID',
      width: uuidLength,
      renderCell: renderCellExpand,
    },
    {
      field: 'description',
      headerClassName: 'super-app-theme--header',
      headerName: 'Description',
      headerAlign: 'left',
      minWidth: 240,
      flex: 1,
      renderCell: (params) => (
        <Typography
          variant="body2"
          sx={{
            whiteSpace: 'normal',
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
            lineHeight: 1.4,
            width: '100%',
            maxHeight: 80, // Optional
            overflow: 'auto', // Optional
          }}
        >
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'image_path',
      headerClassName: 'super-app-theme--header',
      headerName: 'Image Path',
      headerAlign: 'left',
      minWidth: 240,
      renderCell: renderCellExpand,
    },
    {
      field: 'location',
      headerClassName: 'super-app-theme--header',
      headerName: 'Location',
      headerAlign: 'left',
      minWidth: 120,
      renderCell: renderCellExpand,
    },
    {
      field: 'quantity',
      headerClassName: 'super-app-theme--header',
      headerName: 'Pcs',
      headerAlign: 'left',
      type: 'number',
      width: 50,
      renderCell: renderCellExpand,
    },
    {
      field: 'category_id',
      headerClassName: 'super-app-theme--header',
      headerName: 'Category',
      headerAlign: 'left',
      minWidth: uuidLength,
      renderCell: renderCellExpand,
    },
    {
      field: 'created_at',
      headerClassName: 'super-app-theme--header',
      headerName: 'Created At',
      headerAlign: 'left',
      minWidth: timeStampLength,
      renderCell: (params) => (
        <Typography variant="body2"
          sx={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            height: '100%',
          }}>
          {formatDate(params.value)}
        </Typography>
      ),
    },
    {
      field: 'actions',
      headerClassName: 'super-app-theme--header',
      headerName: 'Actions',
      width: 110,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <>
          <IconButton
            component="a"
            onClick={() => navigate(`/items/manage/${params.row.item_id}`)}
            aria-label="view"
            color="primary"
            size="medium"
          >
            <SearchIcon />
          </IconButton>
          <IconButton
            onClick={() => handleDelete(params.row.item_id)}
            aria-label="delete"
            color="error"
            size="medium"
          >
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];


  return (
    <Box sx={{ width: '100%', mt: 2 }}>
      <StyledDataGrid
        rows={data}
        loading={data.length === 0}
        getRowId={(row) => row.item_id}
        columns={columns}
        pageSizeOptions={[10, 25, 50, 100]}
        getRowHeight={() => 'auto'}
        disableRowSelectionOnClick
      />
    </Box>
  );
};