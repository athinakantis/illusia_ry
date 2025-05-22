import { useState } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton
} from '@mui/material';
import CategoryIcon from '@mui/icons-material/Category';
import CloseIcon from '@mui/icons-material/Close';
import ManageCategoryBody from './ManageCategoryBody';


const ManageCategory = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      {/* Launch button — place this wherever you need it */}
      <Button
        variant="text"
        color="secondary"
        startIcon={<CategoryIcon />}
        onClick={handleOpen}
        sx={{ flex: 1 }}

      >
        Manage Categories
      </Button>

      {/* Modal overlay */}
      <Dialog
        fullWidth
        maxWidth="sm"
        open={open}
        onClose={handleClose}
        scroll="paper"
      >
        <DialogTitle>
          Manage Categories
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <ManageCategoryBody />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ManageCategory;