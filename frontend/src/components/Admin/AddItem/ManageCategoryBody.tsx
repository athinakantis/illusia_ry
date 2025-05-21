import {
  Box,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Collapse,
  IconButton,
  List,
  ListItem,
  ListItemText,
  TextField,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import { Add, Close, Delete, Edit, Save } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import {
  createCategory,
  deleteCategory,
  fetchAllCategories,
  selectAllCategories,
  updateCategory,
} from "../../../slices/itemsSlice";
import Spinner from "../../Spinner";

type Category = {
  category_id: string;
  category_name: string;
  image_path: string;
};

const ManageCategoryBody = () => {
  const dispatch = useAppDispatch();
  const categories = useAppSelector(selectAllCategories);
  const loading = useAppSelector((s) => s.items.loading);

  /* local UI state … (unchanged) */
  const [newName, setNewName] = useState("");
  const [newImg, setNewImg] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editImg, setEditImg] = useState("");

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  const handleDeleteClick = (cat: Category) => {
    setCategoryToDelete(cat);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (categoryToDelete) {
      dispatch(deleteCategory(categoryToDelete.category_id));
    }
    setConfirmOpen(false);
    setCategoryToDelete(null);
  };

  const handleCancelDelete = () => {
    setConfirmOpen(false);
    setCategoryToDelete(null);
  };

  useEffect(() => {
    if (!categories.length) dispatch(fetchAllCategories());
  }, [dispatch, categories.length]);

  const resetAddForm = () => {
    setNewName("");
    setNewImg("");
  };
  const handleAdd = () => {
    if (!newName.trim()) return;
    dispatch(
      createCategory({
        category_name: newName.trim(),
        image_path: newImg.trim(),
      }),
    );
    resetAddForm();
  };
  const handleEdit = (cat: Category) => {
    setEditId(cat.category_id);
    setEditName(cat.category_name);
    setEditImg(cat.image_path);
  };
  const handleSave = () => {
    if (editId) {
      dispatch(
        updateCategory({
          id: editId,
          categoryData: { category_name: editName, image_path: editImg },
        }),
      );
    }
    setEditId(null);
  };

  /* -------- render -------- */
  return (
    <Card elevation={0} sx={{ width: 600, maxWidth: "100%", mb: 2 }}>
      <CardHeader
        title="Categories"
        subheader="Add / edit before attaching to an item"
      />
      <CardContent sx={{ pt: 0 }}>
        {/* add-new row */}
        <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
          <TextField
            size="small"
            label="Name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            sx={{ flex: 1 }}
          />
          <TextField
            size="small"
            label="Image (URL)"
            value={newImg}
            onChange={(e) => setNewImg(e.target.value)}
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

        {/* list */}
        {loading
          ? (
            <Box sx={{ display: "flex", justifyContent: "center", my: 3 }}>
              <Spinner />
            </Box>
          )
          : (
            <List>
              {categories.map((cat) => {
                const isEditing = editId === cat.category_id;
                return (
                  <ListItem
                    key={cat.category_id}
                    secondaryAction={isEditing
                      ? (
                        <>
                          <IconButton onClick={handleSave}>
                            <Save />
                          </IconButton>
                          <IconButton onClick={() => setEditId(null)}>
                            <Close />
                          </IconButton>
                        </>
                      )
                      : (
                        <>
                          <IconButton onClick={() => handleEdit(cat)}>
                            <Edit />
                          </IconButton>
                          <Tooltip title={cat.category_name === 'Uncategorized' ? "Cannot delete Uncategorized" : "Delete category"}>
                            <span>
                              <IconButton
                                onClick={() => handleDeleteClick(cat)}
                                disabled={cat.category_name === 'Uncategorized'}
                              >
                                <Delete />
                              </IconButton>
                            </span>
                          </Tooltip>
                        </>
                      )}
                  >
                    {/* edit vs view */}
                    <Collapse in={isEditing} sx={{ width: "100%" }}>
                      <Box sx={{ display: "flex", gap: 1  }}>
                        <TextField
                          size="small"
                          label="Name"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          sx={{ flex: 1, width: 220 }}
                        />
                        <TextField
                          size="small"
                          label="Image (URL)"
                          value={editImg}
                          onChange={(e) =>
                            setEditImg(e.target.value)}
                          sx={{ flex: 1 }}
                        />
                      </Box>
                    </Collapse>

                    {/* -------- view mode -------- */}
                    <Collapse in={!isEditing} sx={{ width: "100%" }}>
                      <ListItemText
                        primary={cat.category_name}
                        secondary={cat.image_path && (
                          <Box
                            component="img"
                            src={cat.image_path}
                            alt={cat.category_name}
                            sx={{
                              width: 50,
                              height: 50,
                              borderRadius: "5px",
                              objectFit: "cover",
                              mr: 1,
                            }}
                          />
                        )}
                        sx={{ width: 300}}
                      />
                    </Collapse>
                  </ListItem>
                );
              })}

              {/* empty state */}
              {!categories.length && (
                <Box
                  sx={{ textAlign: "center", py: 2, color: "text.secondary" }}
                >
                  No categories yet
                </Box>
              )}
            </List>
          )}
      </CardContent>
      <Dialog open={confirmOpen} onClose={handleCancelDelete} maxWidth="sm">
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the category "{categoryToDelete?.category_name}"?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="secondary">Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default ManageCategoryBody;
