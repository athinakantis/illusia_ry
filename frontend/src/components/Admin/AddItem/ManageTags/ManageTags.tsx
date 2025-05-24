import { useState, useEffect, FC } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from '@mui/material';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import CloseIcon from '@mui/icons-material/Close';
import ManageTagsBody from './ManageTagsBody';

/* ------------------------------------------------------------ */
/* Dialog launcher                                              */
/* ------------------------------------------------------------ */

interface ManageTagsProps {
  /** If supplied, check‑boxes will attach/detach the tag for that item */
  itemId?: string;
  /** Open the dialog immediately (used after “item created” prompt) */
  autoOpen?: boolean;
  /** Callback fired when the dialog is closed */
  onClose?: () => void;
}

const ManageTags: FC<ManageTagsProps> = ({
  itemId,
  autoOpen = false,
  onClose,
}) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(autoOpen);
  // open automatically when the prop toggles true
  useEffect(() => {
    if (autoOpen) setOpen(true);
  }, [autoOpen]);

  const handleClose = () => {
    setOpen(false);
    onClose?.();
  };

  return (
    <>
      <Button
        variant="text"
        color="secondary"
        startIcon={<LocalOfferIcon />}
        onClick={() => setOpen(true)}
        sx={{ flex: 1 }}

      >
        {t('admin.add_product.manage_tags.title', { defaultValue: "Manage Tags" })}
      </Button>

      <Dialog
        fullWidth
        maxWidth="sm"
        open={open}
        onClose={handleClose}
        scroll="paper"
      >
        <DialogTitle sx={{ m: 0, p: 2 }}>
          {t('admin.add_product.manage_tags.title', { defaultValue: "Manage Tags" })}
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <ManageTagsBody itemId={itemId} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ManageTags;
