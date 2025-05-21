import {
    Box,
    Card,
    CardHeader,
    CardContent,
    List,
    ListItem,
    ListItemText,
    IconButton,
    TextField,
    Button,
    Collapse,
    CircularProgress,
    Tooltip
  } from '@mui/material';
  import { Add, Delete, Edit, Save, Close } from '@mui/icons-material';
  import { useState, useEffect } from 'react';
  import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
  import {
    selectAllCategories,
    fetchAllCategories,
    createCategory,
    updateCategory,
    deleteCategory
  } from '../../../../slices/itemsSlice';
  
  type Category = {
    category_id: string;
    category_name: string;
    image_path: string;
  };
  
  const ManageCategory = () => {
    const dispatch = useAppDispatch();
    const categories = useAppSelector(selectAllCategories);
    const loading = useAppSelector(s => s.items.loading);
    console.log('ManageCategory', categories);
  
    /* ---------- local UI state ---------- */
    const [newName, setNewName] = useState('');
    const [newImg, setNewImg] = useState('');
    const [editId, setEditId] = useState<string | null>(null);
    const [editName, setEditName] = useState('');
    const [editImg, setEditImg] = useState('');
  
    /* ---------- initial load ---------- */
    useEffect(() => {
      if (categories.length === 0) dispatch(fetchAllCategories());
    }, [dispatch, categories.length]);
  
    /* ---------- helpers ---------- */
    const resetAddForm = () => {
      setNewName('');
      setNewImg('');
    };
  
    const handleAdd = () => {
      if (!newName.trim()) return;
      dispatch(createCategory({ category_name: newName.trim(), image_path: newImg.trim() }));
      resetAddForm();
    };
  
    const handleEdit = (cat: Category) => {
      setEditId(cat.category_id);
      setEditName(cat.category_name);
      setEditImg(cat.image_path);
    };
  
    const handleSave = () => {
      if (editId)
        dispatch(
          updateCategory({ id: editId, categoryData: { category_name: editName, image_path: editImg } })
        );
      setEditId(null);
    };
  
    const handleDelete = (id: string) => dispatch(deleteCategory(id));
  
    /* ---------- render ---------- */
    return (
      <Card elevation={2} sx={{ mt: 3, width: 420 /* tweak for your layout */ }}>
        <CardHeader title="Categories" subheader="Add / edit before attaching to item" />
        <CardContent sx={{ pt: 0 }}>
          {/* ----------- add-new form ----------- */}
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <TextField
              size="small"
              label="Name"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              sx={{ flex: 1 }}
            />
            <TextField
              size="small"
              label="Image (URL)"
              value={newImg}
              onChange={e => setNewImg(e.target.value)}
              sx={{ flex: 1 }}
            />
            <Tooltip title="Add category">
              <span>
                <IconButton onClick={handleAdd} disabled={!newName.trim()}>
                  <Add />
                </IconButton>
              </span>
            </Tooltip>
          </Box>
  
          {/* ----------- category list ----------- */}
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
              <CircularProgress size={28} />
            </Box>
          ) : (
            <List dense sx={{ maxHeight: 270, overflowY: 'auto' }}>
              {categories.map(cat => {
                const isEditing = editId === cat.category_id;
                return (
                  <ListItem
                    key={cat.category_id}
                    secondaryAction={
                      isEditing ? (
                        <>
                          <IconButton edge="end" onClick={handleSave}>
                            <Save />
                          </IconButton>
                          <IconButton edge="end" onClick={() => setEditId(null)}>
                            <Close />
                          </IconButton>
                        </>
                      ) : (
                        <>
                          <IconButton edge="end" onClick={() => handleEdit(cat)}>
                            <Edit />
                          </IconButton>
                          <IconButton edge="end" onClick={() => handleDelete(cat.category_id)}>
                            <Delete />
                          </IconButton>
                        </>
                      )
                    }
                  >
                    <Collapse in={isEditing} orientation="vertical" sx={{ width: '100%' }}>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <TextField
                          size="small"
                          value={editName}
                          onChange={e => setEditName(e.target.value)}
                          sx={{ flex: 1 }}
                        />
                        <TextField
                          size="small"
                          value={editImg}
                          onChange={e => setEditImg(e.target.value)}
                          sx={{ flex: 1 }}
                        />
                      </Box>
                    </Collapse>
  
                    {/* non-editing view */}
                    <Collapse in={!isEditing} orientation="vertical" sx={{ width: '100%' }}>
                      <ListItemText
                        primary={cat.category_name}
                        secondary={cat.image_path && (
                          <Box
                            component="img"
                            src={cat.image_path}
                            alt={cat.category_name}
                            sx={{ width: 32, height: 32, mr: 1, verticalAlign: 'middle' }}
                          />
                        )}
                      />
                    </Collapse>
                  </ListItem>
                );
              })}
              {categories.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 2, color: 'text.secondary' }}>
                  No categories yet
                </Box>
              )}
            </List>
          )}
        </CardContent>
      </Card>
    );
  };
  
  export default ManageCategory;