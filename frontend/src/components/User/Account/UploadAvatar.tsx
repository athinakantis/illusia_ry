import React, { useState, useEffect, ChangeEvent } from 'react';
import { Avatar, Box, IconButton, CircularProgress, Skeleton } from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { supabase } from '../../../config/supabase';
import { useAuth } from '../../../hooks/useAuth';
import { useCurrentUserImage } from '../../../hooks/use-current-user-image';
// UploadAvatar now manages its own avatar URL state and user fetching.

export const UploadAvatar: React.FC = () => {
  const [uploading, setUploading] = useState(false);
  const { user } = useAuth();
  const userId = user?.id;
  const initialUrl = useCurrentUserImage();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    if (initialUrl) {
      // Bust cache on initial load
      setAvatarUrl(`${initialUrl}?updated_at=${Date.now()}`);
    } else {
      setAvatarUrl(null);
    }
  }, [initialUrl]);

  if (!userId) {
    console.error('You must be logged in to upload an avatar');
    return null;
  }

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


    // Bust browser cache by appending a timestamp query param
    const publicUrlWithTimestamp = `${publicUrl}?updated_at=${Date.now()}`;
    setAvatarUrl(publicUrlWithTimestamp);


    // Persist to users table

    const { data, error: updateError } = await supabase
      .from('users')
      .update({ profile_image_url: publicUrl })
      .eq('user_id', userId)
      .select('profile_image_url')
      .single();
    if (data) {
      // No need to setAvatarUrl here; keep using the timestamped URL.
    } else {
      console.error('Error updating user avatar URL in users table:', updateError?.message);
    }

    setUploading(false);
  };
  // If image is still loading, show skeleton
  if (avatarUrl === undefined) {
    return <Skeleton variant="circular" width={200} height={200} />;
  }
  return (
    <Box display="flex" alignItems="center" flexDirection="column">
      <Box position="relative" display="inline-flex" sx={{ mb: 2 }}>
        <Avatar
          src={avatarUrl || undefined}
          alt="User avatar"
          sx={{
            width: 200,
            height: 200,
            border: '2px solid',
            borderColor: 'primary.light',
          }}
        />
        <IconButton
          disableRipple
          component="label"
          htmlFor="avatar-upload-input"
          sx={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            bgcolor: 'background.paper',
            '&:hover': { zIndex: 5, bgcolor: 'background.verylightgrey' }
          }}
          color="primary"
          disabled={uploading}
        >
          <input
            hidden
            id="avatar-upload-input"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
          />
          <PhotoCamera />
        </IconButton>
      </Box>
      {uploading && <CircularProgress size={24} />}
    </Box>
  );
};

export default UploadAvatar;
