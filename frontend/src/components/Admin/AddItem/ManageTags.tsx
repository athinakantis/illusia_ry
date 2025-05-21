import { useState, FC } from 'react';
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
  /** Optional – if supplied, check‑boxes will attach/detach the tag
      for that particular item. */
  itemId?: string;
}

const ManageTags: FC<ManageTagsProps> = ({ itemId }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="text"
        color="secondary"
        startIcon={<LocalOfferIcon />}
        onClick={() => setOpen(true)}
      >
        {t('addItem.manageTags.title', { defaultValue: "Manage Tags" })}
      </Button>

      <Dialog
        fullWidth
        maxWidth="sm"
        open={open}
        onClose={() => setOpen(false)}
        scroll="paper"
      >
        <DialogTitle sx={{ m: 0, p: 2 }}>
          {t('addItem.manageTags.title', { defaultValue: "Manage Tags" })}
          <IconButton
            aria-label="close"
            onClick={() => setOpen(false)}
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
