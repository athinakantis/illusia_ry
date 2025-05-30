import React from 'react';
import { Box, IconButton, MenuItem, Select, Typography } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { Item } from '../../types/types';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  const handleDelete = (id: string) => {
    if (confirm(t('admin.items.dataGrid.deleteConfirm'))) {
      dispatch(deleteItem(id)).then(() => dispatch(fetchAllItems()));
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'item_id',
      headerClassName: 'super-app-theme--header',
      headerAlign: 'center',
      align: 'center',
      headerName: t('admin.items.dataGrid.columns.id'),
      width: 100,
      renderCell: (params) => (
        String(params.value).slice(0, 8)
      ),
    },
    {
      field: 'item_name',
      headerClassName: 'super-app-theme--header',
      headerAlign: 'center',
      align: 'center',
      headerName: t('admin.items.dataGrid.columns.name'),
      minWidth: 150,
      renderCell: (params) => (
        <Typography variant="body2"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            textAlign: 'center',
          }}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'description',
      headerClassName: 'super-app-theme--header',
      headerName: t('admin.items.dataGrid.columns.description'),
      headerAlign: 'center',
      align: 'center',
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
            textAlign: 'center',
          }}
        >
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'visible',
      headerClassName: 'super-app-theme--header',
      headerName: t('admin.items.dataGrid.columns.visibility'),
      headerAlign: 'center',
      align: 'center',
      width: 120,
      renderCell: (params) => (
        <Select
          value={params.row.visible ? t('admin.items.dataGrid.visibility.visible') : t('admin.items.dataGrid.visibility.hidden')}
          size="small"
          onChange={(e) => {
            const newVisible = e.target.value === t('admin.items.dataGrid.visibility.visible');
            if (newVisible !== params.row.visible) {
              dispatch(
                updateItemVisibility({ id: params.row.item_id, visible: newVisible })
              );
            }
          }}
          sx={{ fontSize: '0.85rem' }}
        >
          <MenuItem value={t('admin.items.dataGrid.visibility.visible')}>{t('admin.items.dataGrid.visibility.visible')}</MenuItem>
          <MenuItem value={t('admin.items.dataGrid.visibility.hidden')}>{t('admin.items.dataGrid.visibility.hidden')}</MenuItem>
        </Select>
      ),
    },
    {
      field: 'location',
      headerClassName: 'super-app-theme--header',
      headerName: t('admin.items.dataGrid.columns.location'),
      headerAlign: 'center',
      align: 'center',
      minWidth: 120,
      renderCell: (params) => (
        <Typography variant="body2"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            textAlign: 'center',
          }}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'quantity',
      headerClassName: 'super-app-theme--header',
      headerName: t('admin.items.dataGrid.columns.quantity'),
      headerAlign: 'center',
      align: 'center',
      type: 'number',
      width: 70,
      renderCell: (params) => (
        <Typography variant="body2"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            textAlign: 'center',
          }}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'category_id',
      headerClassName: 'super-app-theme--header',
      headerName: t('admin.items.dataGrid.columns.category'),
      headerAlign: 'center',
      align: 'center',
      minWidth: 150,
      renderCell: (params) => (
        getCategoryName(categories, params.value)
      ),
    },
    {
      field: 'tags',
      headerClassName: 'super-app-theme--header',
      headerName: t('admin.items.tags_column_header'),
      headerAlign: 'center',
      align: 'center',
      minWidth: 120,
      renderCell: (params) => {
        const tags = params.row.tags;
        if (Array.isArray(tags) && tags.length > 0) {
          return (
            <Typography variant="body2"
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
                textAlign: 'center',
              }}>
              {tags.join(', ')}
            </Typography>
          );
        }
        return '';
      },
    },
    {
      field: 'created_at',
      headerClassName: 'super-app-theme--header',
      headerName: t('admin.items.dataGrid.columns.createdAt'),
      headerAlign: 'center',
      align: 'center',
      minWidth: timeStampLength,
      renderCell: (params) => (
        <Typography variant="body2"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
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
      headerName: t('admin.items.dataGrid.columns.actions'),
      headerAlign: 'center',
      align: 'center',
      width: 110,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <>
          <IconButton
            component="a"
            onClick={() => navigate(`/items/manage/${params.row.item_id}`)}
            aria-label={t('admin.items.dataGrid.aria.view')}
            color="primary"
            size="medium"
          >
            <SearchIcon />
          </IconButton>
          <IconButton
            onClick={() => handleDelete(params.row.item_id)}
            aria-label={t('admin.items.dataGrid.aria.delete')}
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
        initialState={{
          pagination: { paginationModel: { pageSize: 10, page: 0 } },
          sorting: {
            sortModel: [{ field: 'item_name', sort: "asc" }],
          },
        }}
        getRowHeight={() => 'auto'}
        disableRowSelectionOnClick
      />
    </Box>
  );
};
