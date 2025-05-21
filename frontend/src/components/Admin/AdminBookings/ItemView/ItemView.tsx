import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { formatDate } from '../../../../utility/formatDate';
import {
  deleteItem,
  fetchAllCategories,
  fetchItemById,
  selectAllCategories,
  selectItemById,
  updateItem,
} from '../../../../slices/itemsSlice';
import {
  Box,
  Button,
  CardMedia,
  Typography,
  TextField,
  Select,
  MenuItem,
  SelectChangeEvent,
  Stack,
} from '@mui/material';
import { ImPencil2 } from 'react-icons/im';
import { CiTrash } from 'react-icons/ci';
import { ArrowBack } from '@mui/icons-material';
import Spinner from '../../../Spinner';
import { useAuth } from '../../../../hooks/useAuth';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import broken_img from '../../../../assets/broken_img.png'

import { NextArrow, PrevArrow } from './Arrows';

const SingleItem = () => {
  /* ———————————————————————  Constants  ——————————————————————————————— */
  const { itemId } = useParams<{ itemId: string }>();
  const item = useAppSelector(selectItemById(itemId ?? ''));
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<typeof item | ''>('');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { role } = useAuth();
  const categories = useAppSelector(selectAllCategories);
  const itemCategory = categories.find(
    (cat) => cat.category_id === item?.category_id,
  );

  /* ———————————————————————  Side-Effects  ——————————————————————————————— */
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
  /* ———————————————————————— Handlers —————————————————————————————————————*/
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
    (e.target as HTMLImageElement).src = broken_img;
  };
  /* —————————————————————————————— Conditional Renders ———————————————————————— */
  if (!item || typeof item !== 'object' || !('image_path' in item)) {
    return <Spinner />;
  }

  if (item === null) {
    return <div>Item not found</div>;
  }
  if (item === undefined) {
    return <div>Item not found</div>;
  }
  return (
    <Box sx={{ p: 3, maxWidth: 1300, margin: 'auto' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, px: 1, pb: 3 }}>
        <Button
          component={Link}
          to="/items"
          startIcon={<ArrowBack />}
          variant="text"
          sx={{
            backgroundColor: 'primary.black',
            color: 'text.main',
            borderRadius: 10, height: 40, paddingLeft: 3, paddingRight: 3,

            '&:hover': {
              color: 'text.main',
              bgcolor: 'primary.light',
              borderRadius: 10,
            },
          }}
        >
          Back
        </Button>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          maxWidth: 1200,
          margin: '0 auto',
          justifyContent: 'center',
          gap: 4
        }}
      >
        {/* Left Column: Image */}
        <Box
          sx={{
            width: { xs: '100%', sm: '50%' },
            maxWidth: 500
          }}
        >
          <Box
            sx={{
              width: '100%',
              minHeight: 400,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'sticky',
              top: 20,
              height: 'fit-content'
            }}
          >
            {item && Array.isArray(item.image_path) && item.image_path.some(imgUrl => typeof imgUrl === 'string' && imgUrl.trim() !== '') ? (
              <Box sx={{ width: '100%' }}>
                <Slider
                  dots={item.image_path.length > 1}
                  infinite={item.image_path.length > 1}
                  speed={500}
                  slidesToShow={1}
                  slidesToScroll={1}
                  arrows={item.image_path.length > 1}
                  nextArrow={<NextArrow />}
                  prevArrow={<PrevArrow />}
                >
                  {item.image_path
                    .filter((imgUrl): imgUrl is string => typeof imgUrl === 'string' && imgUrl.trim() !== '')
                    .map((imgUrl, idx) => (
                      <div key={idx} style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%'
                      }}>
                        <CardMedia
                          component="img"
                          onError={handleBrokenImg}
                          image={imgUrl}
                          alt={`${item.item_name} image ${idx + 1}`}
                          sx={{
                            width: '100%',
                            maxWidth: '100%',
                            maxHeight: 400,
                            objectFit: 'cover',
                            borderRadius: 2,
                            bgcolor: 'background.lightgrey',
                            margin: '0 auto',
                          }}
                        />
                      </div>
                    ))}
                </Slider>
              </Box>
            ) : (
              <Box
                component="img"
                sx={{
                  width: '100%',
                  maxWidth: '100%',
                  maxHeight: 400,
                  // height: 200,
                  objectFit: 'cover',
                  borderRadius: 2,
                  bgcolor: 'background.verylightgrey',
                }}
                src={broken_img}
                alt={item?.item_name || 'Item'}
              />
            )}
          </Box>
        </Box>

        {/* Right Column: Details */}
        <Box
          sx={{
            width: { xs: '100%', sm: '50%' },
            maxWidth: 500
          }}
        >
          <Box sx={{ height: '100%' }}>
            <Typography variant="heading_secondary" gutterBottom component="h1">
              {item?.item_name}
            </Typography>
            <Stack sx={{ gap: 2, flex: 1 }}>
              <div>
                <Typography variant="subtitle1" color="text.secondary">
                  Description
                </Typography>
                {isEditing && formData ? (
                  <TextField
                    fullWidth
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    multiline
                    rows={4}
                  />
                ) : (
                  <Typography
                    variant="body1"
                    sx={{
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                      maxHeight: '200px',
                      overflowY: 'auto'
                    }}
                  >
                    {item?.description || '-'}
                  </Typography>
                )}
              </div>
              <div>
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
              </div>
              <div>
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
              </div>
              <div>
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
              </div>
              <div>
                <Typography variant="subtitle1" color="text.secondary">
                  Item ID:
                </Typography>
                <Typography variant="body1" sx={{ wordBreak: 'break-all' }}>
                  {item?.item_id || '-'}
                </Typography>
              </div>
              <div>
                <Typography variant="subtitle1" color="text.secondary">
                  Created At:
                </Typography>
                <Typography variant="body1">
                  {item?.created_at ? formatDate(item.created_at) : '-'}
                </Typography>
              </div>
              <div style={{ display: 'flex', gap: 16 }}>
                {isEditing ? (
                  <Button variant="contained" color="primary" onClick={handleSave}>
                    Save
                  </Button>
                ) : (
                  <>
                    <Button
                      startIcon={<ImPencil2 />}
                      variant="contained"
                      sx={{
                        borderRadius: 10,
                        height: 40,
                        paddingLeft: 3,
                        paddingRight: 3,
                        bgcolor: 'primary.black',
                        '&:hover': {
                          color: 'text.main',
                          bgcolor: 'primary.light',
                          borderRadius: 10,
                        },
                      }}

                      onClick={handleEdit}
                    >
                      Edit
                    </Button>
                    <Button
                      startIcon={<CiTrash />}
                      variant="outlined"
                      color="error"
                      sx={{ borderRadius: 10, height: 40, paddingLeft: 3, paddingRight: 3 }}
                      onClick={handleDelete}
                    >
                      Delete
                    </Button>
                  </>
                )}
              </div>
            </Stack>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default SingleItem;
