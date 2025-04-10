import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { formatDate } from '../../utility/formatDate';
import {
  deleteItem,
  fetchItemById,
  selectItemById,
  updateItem,
} from '../../slices/itemsSlice';
import {
  Box,
  Button,
  CardMedia,
  Divider,
  Grid,
  Paper,
  Typography,
  TextField,
} from '@mui/material';
import './pyramid-loader.css';
import { ImPencil2 } from 'react-icons/im';
import { CiTrash } from 'react-icons/ci';

export const SingleItem = () => {
  const { itemId } = useParams<{ itemId: string }>();
  const item = useAppSelector(selectItemById(itemId ?? ''));
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<typeof item | ''>('');
  const dispatch = useAppDispatch();
  const loading = useAppSelector((state) => state.items.loading);
  const navigate = useNavigate();

  useEffect(() => {
    if (!item) {
      dispatch(fetchItemById(itemId ?? ''));
    }
  }, [item, itemId, dispatch]);

  useEffect(() => {
    if (isEditing && item) {
      setFormData({ ...item });
    }
  }, [isEditing, item]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!formData) return;
    const { name, value } = e.target;
    setFormData((prev) => (prev ? { ...prev, [name]: value } : ''));
  };

  const handleEdit = () => setIsEditing(true);

  const handleSave = () => {
    if (!formData) return;
    if (item?.item_id) {
      dispatch(updateItem({ id: item.item_id, updatedData: formData }))
    }

    setIsEditing(false);
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this item?')) {
      dispatch(deleteItem(itemId ?? ''))
      .then(() => navigate('/items'));
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <div className="pyramid-loader">
          <div className="wrapper">
            <span className="side side1"></span>
            <span className="side side2"></span>
            <span className="side side3"></span>
            <span className="side side4"></span>
            <span className="shadow"></span>
          </div>
        </div>
      </Box>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 1000, margin: 'auto', mt: 2 }}>
      <Grid container justifyContent="flex-end">
        <Button variant='outlined' color='primary' onClick={() => navigate('/items')}>Back</Button>
      </Grid>
      <Typography variant="h4" gutterBottom component="h1">
        {item?.item_name}
      </Typography>
      <Divider sx={{ mb: 2 }} />

      <Grid container spacing={3}>
        {/* Image Section */}
        <Grid component={Box}>
          <CardMedia
            component="img"
            image={
              item?.image_path || 'https://placehold.co/400x400?text=No+Image'
            }
            alt={item?.item_name}
            sx={{
              width: '100%',
              maxHeight: 400,
              minHeight: 400,
              minWidth: 400,
              objectFit: 'contain',
              borderRadius: 2,
              bgcolor: 'background.lightgrey',
            }}
          />
        </Grid>

        {/* Details Section */}
        <Grid component={Box} sx={{ flex: 1 }}>
          <Typography variant="h5" gutterBottom>
            {item?.item_name}
          </Typography>

          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" color="text.secondary">
              Description:
            </Typography>
            {isEditing && formData ? (
              <TextField
                fullWidth
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            ) : (
              <Typography variant="body1">
                {item?.description || '-'}
              </Typography>
            )}
          </Box>

          <Divider sx={{ my: 1 }} />

          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" color="text.secondary">
              Location:
            </Typography>
            {isEditing && formData ? (
              <TextField
                fullWidth
                name="location"
                value={formData.location}
                onChange={handleChange}
              />
            ) : (
              <Typography variant="body1">{item?.location || '-'}</Typography>
            )}
          </Box>

          <Divider sx={{ my: 1 }} />

          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" color="text.secondary">
              Quantity:
            </Typography>
            {isEditing && formData ? (
              <TextField
                fullWidth
                name="quantity"
                type="number"
                InputProps={{ inputProps: { min: 1 } }}
                value={formData.quantity}
                onChange={handleChange}
              />
            ) : (
              <Typography variant="body1">{item?.quantity ?? '-'}</Typography>
            )}
          </Box>

          <Divider sx={{ my: 1 }} />

          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" color="text.secondary">
              Category ID:
            </Typography>
            <Typography variant="body1" sx={{ wordBreak: 'break-all' }}>
              {item?.category_id || '-'}
            </Typography>
          </Box>

          <Divider sx={{ my: 1 }} />

          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" color="text.secondary">
              Item ID:
            </Typography>
            <Typography variant="body1" sx={{ wordBreak: 'break-all' }}>
              {item?.item_id || '-'}
            </Typography>
          </Box>

          <Divider sx={{ my: 1 }} />

          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" color="text.secondary">
              Created At:
            </Typography>

            <Typography variant="body1">
              {item?.created_at ? formatDate(item.created_at) : '-'}
            </Typography>
          </Box>
          <Divider sx={{ my: 2 }} />

          <Box display="flex" gap={10} justifyContent="center">
            {isEditing ? (
              <Button variant="contained" color="success" onClick={handleSave}>
                Save
              </Button>
            ) : (
              <>
                <Button
                  startIcon={<ImPencil2 />}
                  variant="contained"
                  color="primary"
                  onClick={handleEdit}
                >
                  Edit
                </Button>
                <Button
                  startIcon={<CiTrash />}
                  color="error"
                  onClick={handleDelete}
                >
                  Delete
                </Button>
              </>
            )}
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};
