

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

export interface DeleteAccountProps {
  open: boolean;
  onClose: () => void;
}

export default function DeleteAccount({ open, onClose }: DeleteAccountProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  const handleDelete = async () => {
    setLoading(true);
    setError(undefined);
    // Delete the current user
    const { error } = await supabase.auth.deleteUser();
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      // Optionally sign out or redirect
      await supabase.auth.signOut();
      window.location.href = '/'; 
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Delete Account?</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Deleting your account will permanently remove <strong>all</strong> information 
          related to your user, including profiles, settings, and data. This action 
          <em>cannot</em> be undone.
        </DialogContentText>
        {error && (
          <DialogContentText color="error">
            {error}
          </DialogContentText>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          color="error"
          onClick={handleDelete}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? 'Deleting…' : 'Delete Account'}
        </Button>
      </DialogActions>
    </Dialog>
);
}