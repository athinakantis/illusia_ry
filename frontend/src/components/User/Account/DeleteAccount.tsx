import { useState } from 'react';
import { supabase } from '../../../config/supabase';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
} from '@mui/material';
import { accountApi } from '../../../api/account';
import { useTranslation, Trans } from 'react-i18next';

export interface DeleteAccountProps {
  open: boolean;
  onClose: () => void;
}

export default function DeleteAccount({ open, onClose }: DeleteAccountProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const { t } = useTranslation();

  const handleDelete = async () => {
    setLoading(true);
    setError(undefined);

    // Retrieve current session to get the JWT
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session?.access_token) {
      setError(t('deleteAccount.error.noToken', { defaultValue: 'Failed to retrieve authentication token.' }));
      setLoading(false);
      return;
    }

    try {
      // Call your custom backend endpoint
      const res = await accountApi.deleteAccount();
      const { status  } = res;
      if (status !== 200) {
        console.error('Error deleting account:', status);
        setError(t('deleteAccount.error.deleteFailed', { defaultValue: 'Account deletion failed.' }));
      } else {
        // On success, sign out and redirect
        await supabase.auth.signOut();
        window.location.href = '/';
      }
    } catch (err) {
      const error = err as { message: string };
      setError(error.message || t('deleteAccount.error.deleteFailed', { defaultValue: 'Account deletion failed.' }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{t('deleteAccount.title', { defaultValue: 'Delete Account?' })}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <Trans
            i18nKey="deleteAccount.warning"
            defaults="Deleting your account will permanently remove <strong>all</strong> information related to your user, including profiles, settings, and data. This action <em>cannot</em> be undone."
            components={{ strong: <strong />, em: <em /> }}
          />
        </DialogContentText>
        {error && (
          <DialogContentText color="error">
            {error}
          </DialogContentText>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          {t('common.cancel', { defaultValue: 'Cancel' })}
        </Button>
        <Button
          color="error"
          onClick={handleDelete}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading
            ? t('deleteAccount.deleting', { defaultValue: 'Deleting…' })
            : t('deleteAccount.confirm', { defaultValue: 'Delete Account' })}
        </Button>
      </DialogActions>
    </Dialog>
);
}