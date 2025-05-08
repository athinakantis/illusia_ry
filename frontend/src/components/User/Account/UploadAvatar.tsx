import React, { useState, useEffect, ChangeEvent } from 'react';
import { Avatar, Box, IconButton, CircularProgress, Typography } from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { supabase } from '../../../config/supabase';

interface UploadAvatarProps {
  userId: string;
  currentUrl?: string | null;
  onUpload?: (url: string) => void;
}

export const UploadAvatar: React.FC<UploadAvatarProps> = ({ userId, currentUrl, onUpload }) => {
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(currentUrl || null);

  useEffect(() => {
    setAvatarUrl(currentUrl || null);
  }, [currentUrl]);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);

    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;

    // upload to Supabase Storage
    const { error: uploadError } = await supabase
      .storage
      .from('avatars')
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      console.error('Error uploading avatar:', uploadError.message);
      setUploading(false);
      return;
    }

    // get public URL
    const { data: { publicUrl } } = supabase
      .storage
      .from('avatars')
      .getPublicUrl(filePath);

    setAvatarUrl(publicUrl);
    onUpload?.(publicUrl);
    setUploading(false);
  };

  return (
    <Box display="flex" alignItems="center" flexDirection="column">
      <Avatar
        src={avatarUrl || undefined}
        alt="User avatar"
        sx={{ width: 100, height: 100, mb: 1 }}
      />
      <label htmlFor="avatar-upload-input">
        <input
          style={{ display: 'none' }}
          id="avatar-upload-input"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
        />
        <IconButton
          color="primary"
          aria-label="upload avatar"
          component="span"
          disabled={uploading}
        >
          <PhotoCamera />
        </IconButton>
      </label>
      {uploading && <CircularProgress size={24} />}
      <Typography variant="caption" color="textSecondary">
        {uploading ? 'Uploading...' : 'Change avatar'}
      </Typography>
    </Box>
  );
};

export default UploadAvatar;
