import { DataGrid, GridColDef, GridDeleteIcon } from '@mui/x-data-grid';
import { Box, IconButton, Typography } from '@mui/material';
import { renderCellExpand } from './RenderCellExpand';
import { Item } from '../../types/types';
import { useAppDispatch } from '../../store/hooks';
import { deleteItem, fetchAllItems } from '../../slices/itemsSlice';
import { GiMagnifyingGlass } from 'react-icons/gi';
import { AiTwotoneDelete } from 'react-icons/ai';
import { formatDate } from '../../utility/formatDate';

interface ItemDataGridProps {
  data: Item[];
}

const uuidLength = 230;
const timeStampLength = 150;

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
      headerClassName: 'super-app-theme--header',
      headerName: 'ID',
      width: uuidLength,
      renderCell: renderCellExpand,
    },
    {
      field: 'item_name',
      headerClassName: 'super-app-theme--header',
      headerName: 'Name',
      minWidth: 150,
      renderCell: renderCellExpand,
    },
    {
      field: 'description',
      headerClassName: 'super-app-theme--header',
      headerName: 'Description',
      minWidth: 240,
      flex: 1,
      renderCell: renderCellExpand,
    },
    {
      field: 'image_path',
      headerClassName: 'super-app-theme--header',
      headerName: 'Image Path',
      minWidth: 240,
      renderCell: renderCellExpand,
    },
    {
      field: 'location',
      headerClassName: 'super-app-theme--header',
      headerName: 'Location',
      minWidth: 120,
      renderCell: renderCellExpand,
    },
    {
      field: 'quantity',
      headerClassName: 'super-app-theme--header',
      headerName: 'Pcs',
      type: 'number',
      width: 50,
      renderCell: renderCellExpand,
    },
    {
      field: 'category_id',
      headerClassName: 'super-app-theme--header',
      headerName: 'Category',
      minWidth: uuidLength,
      renderCell: renderCellExpand,
    },
    {
      field: 'created_at',
      headerClassName: 'super-app-theme--header',
      headerName: 'Created At',
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
            href={`/items/${params.row.item_id}`}
            aria-label="view"
            color="primary"
            size="medium"
          >
            <GiMagnifyingGlass />
          </IconButton>
          <IconButton
            onClick={() => handleDelete(params.row.item_id)}
            aria-label="delete"
            color="error"
            size="medium"
          >
            <AiTwotoneDelete />
          </IconButton>
        </>
      ),
    },
  ];
  return (
    <Box sx={{ height: '700px', width: '100%', mt: 2 }}>
      <DataGrid
        rows={data}
        getRowId={(row) => row.item_id}
        columns={columns}
        pageSizeOptions={[10, 25, 50, 100]}
        // getRowHeight={()=> "auto"}
        rowHeight={110}
        sx={{
          // Header CSS
          '& .super-app-theme--header': {
          backgroundColor: 'secondary.light',
          color: 'text.light',
          fontSize: '1.1rem',
        },
        // Individual Cell CSS
          '& .MuiDataGrid-cell': {
            pl: 2,// padding left
            
          },
          // Footer CSS
          '& .MuiDataGrid-footerContainer': {
            backgroundColor: 'secondary.light',
            
          },
          // Hover CSS
          '& .MuiDataGrid-row:hover': {
            backgroundColor: 'background.lightgrey',
            transition: 'background-color 0.3s ease',
          },
          // Focus CSS
          '& .MuiDataGrid-cell:focus': {
            outline: 'none',
          },
          // Selected Row CSS
          '& .MuiDataGrid-row.Mui-selected': {
            outline: '2px solid #7b1fa2', 
            outlineOffset: '-2px',
          },
          // Even Row CSS
          '& .MuiDataGrid-row:nth-of-type(even)': {
            backgroundColor: 'background.lightgrey',
          },
          // Odd Row CSS
          '& .MuiDataGrid-row:nth-of-type(odd)': {
            backgroundColor: 'background.default',
            border: '1px solid',
            borderColor: 'secondary.main',
          },
        }}
      />
    </Box>
  );
};
