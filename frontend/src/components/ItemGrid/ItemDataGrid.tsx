import React from 'react';
import { Box, IconButton, MenuItem, Select, Typography } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { renderCellExpand } from './RenderCellExpand';
import { Item } from '../../types/types';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { deleteItem, fetchAllItems } from '../../slices/itemsSlice';
import { updateItemVisibility } from '../../slices/itemsSlice';
import { formatDate } from '../../utility/formatDate';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import { StyledDataGrid } from '../CustomComponents/StyledDataGrid';
import { selectAllCategories } from '../../slices/itemsSlice';
import { getCategoryName } from '../../utility/getCategoryName';

interface ItemDataGridProps {
  data: Item[];
}
const timeStampLength = 150;

export const ItemDataGrid: React.FC<ItemDataGridProps> = ({ data }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const categories = useAppSelector(selectAllCategories);
  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      dispatch(deleteItem(id)).then(() => dispatch(fetchAllItems()));
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'item_id',
      headerClassName: 'super-app-theme--header',
      headerAlign: 'left',
      headerName: 'ID',
      width: 100,
      renderCell: (params) => (
        
        String(params.value).slice(0, 8)
      ),
    },
    {
      field: 'item_name',
      headerClassName: 'super-app-theme--header',
      headerAlign: 'left',
      headerName: 'Name',
      minWidth: 150,
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
            maxHeight: 80,
            overflow: 'auto',
          }}
        >
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'visible',
      headerClassName: 'super-app-theme--header',
      headerName: 'Visibility',
      headerAlign: 'left',
      width: 120,
      renderCell: (params) => (
        <Select
          value={params.row.visible ? 'Visible' : 'Hidden'}
          size="small"
          onChange={(e) => {
            const newVisible = e.target.value === 'Visible';
            if (newVisible !== params.row.visible) {
              dispatch(
                updateItemVisibility({ id: params.row.item_id, visible: newVisible })
              );
            }
          }}
          sx={{ fontSize: '0.85rem' }}
        >
          <MenuItem value="Visible">Visible</MenuItem>
          <MenuItem value="Hidden">Hidden</MenuItem>
        </Select>
      ),
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
      headerName: 'Qty',
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
      minWidth: 150,
      renderCell: (params) => (
        getCategoryName(categories, params.value)
        ),
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
    <Box sx={{ width: '100%', mt: 2, height: 700 }}>
      <StyledDataGrid
        rows={data}
        loading={data.length === 0}
        getRowId={(row) => row.item_id}
        columns={columns}
        pageSizeOptions={[10, 25, 50, 100]}
        rowHeight={70}
        disableRowSelectionOnClick
      />
    </Box>
  );
};