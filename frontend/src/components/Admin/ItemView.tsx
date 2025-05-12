import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { formatDate } from '../../utility/formatDate';
import {
  deleteItem,
  fetchAllCategories,
  fetchItemById,
  selectAllCategories,
  selectItemById,
  updateItem,
} from '../../slices/itemsSlice';
import {
  Box,
  Button,
  CardMedia,
  Grid,
  Paper,
  Typography,
  TextField,
  Select,
  MenuItem,
  SelectChangeEvent,
  Stack,
} from '@mui/material';
import { ImPencil2 } from 'react-icons/im';
import { CiTrash } from 'react-icons/ci';
import Spinner from '../Spinner';
import { useAuth } from '../../hooks/useAuth';

const SingleItem = () => {
  const { itemId } = useParams<{ itemId: string }>();
  const item = useAppSelector(selectItemById(itemId ?? ''));
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<typeof item | ''>('');
  const dispatch = useAppDispatch();
  const loading = useAppSelector((state) => state.items.loading);
  const navigate = useNavigate();
  const { role } = useAuth();
  const categories = useAppSelector(selectAllCategories);
  const itemCategory = categories.find(
    (cat) => cat.category_id === item?.category_id,
  );


  useEffect(() => {
    if (!item) {
      dispatch(fetchItemById(itemId ?? ''));
    }
    if (categories.length < 1) dispatch(fetchAllCategories());
  }, [item, itemId, dispatch, categories]);

  useEffect(() => {
    if (isEditing && item) {
      setFormData({ ...item });
    }
  }, [isEditing, item]);

  useEffect(() => {
    if (role === undefined) return;
    if (role === null) navigate('/items');
  }, [role, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!formData) return;
    const { name, value } = e.target;
    setFormData((prev) => (prev ? { ...prev, [name]: value } : ''));
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormData((prev) => (prev ? { ...prev, [name]: value } : ''));
  };

  const handleEdit = () => setIsEditing(true);

  const handleSave = () => {
    if (!formData) return;
    if (item?.item_id) {
      dispatch(updateItem({ id: item.item_id, updatedData: formData }));
    }

    setIsEditing(false);
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this item?')) {
      dispatch(deleteItem(itemId ?? '')).then(() => navigate('/items'));
    }
  };

  const handleBrokenImg = (
    e: React.SyntheticEvent<HTMLImageElement, Event>,
  ) => {
    (e.target as HTMLImageElement).src = '/src/assets/broken_img.png';
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <Paper elevation={1} sx={{ p: 3, maxWidth: 1000, margin: 'auto', mt: 2 }}>
      <Stack direction={'row'} justifyContent={'space-between'}>
        <Typography variant="heading_secondary" gutterBottom component="h1">
          {item?.item_name}
        </Typography>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => navigate(-1)}
          sx={{ height: 'fit-content' }}
        >
          Back
        </Button>
      </Stack>

      <Grid container spacing={3}>
        {/* Image Section */}
        <Grid component={Box}>
          <CardMedia
            component="img"
            onError={handleBrokenImg}
            // image={item?.image_path
            // }
            image={Array.isArray(item.image_path) ? item.image_path[0] : item.image_path}
            alt={item?.item_name}
            sx={{
              width: 400,
              objectFit: 'contain',
              borderRadius: 2,
              bgcolor: 'background.lightgrey',
            }}
          />
        </Grid>

        {/* Details Section */}
        <Stack sx={{ gap: 2, flex: 1 }}>
          <Box >
            <Typography variant="subtitle1" color="text.secondary">
              Description
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

          <Box>
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


          <Box >
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


          <Box >
            <Typography variant="subtitle1" color="text.secondary">
              Category:
            </Typography>
            {isEditing && formData ? (
              <Select
                value={formData.category_id}
                label="Category"
                name='category_id'
                onChange={handleSelectChange}
              >
                {categories.map((category) => (
                  <MenuItem key={category.category_id} value={category.category_id}>
                    {category.category_name}
                  </MenuItem>
                ))}
              </Select>
            ) : (
              <Typography variant="body1" sx={{ wordBreak: 'break-all' }}>
                {itemCategory?.category_name || '-'}
              </Typography>
            )}
          </Box>


          <Box >
            <Typography variant="subtitle1" color="text.secondary">
              Item ID:
            </Typography>
            <Typography variant="body1" sx={{ wordBreak: 'break-all' }}>
              {item?.item_id || '-'}
            </Typography>
          </Box>


          <Box >
            <Typography variant="subtitle1" color="text.secondary">
              Created At:
            </Typography>

            <Typography variant="body1">
              {item?.created_at ? formatDate(item.created_at) : '-'}
            </Typography>
          </Box>

          <Box display="flex" gap={2}>
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
        </Stack>
      </Grid>
    </Paper>
  );
};

export default SingleItem;
