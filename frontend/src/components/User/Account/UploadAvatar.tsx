import React, { useState, useEffect, ChangeEvent } from 'react';
import { Avatar, Box, IconButton, CircularProgress, Typography, Skeleton } from '@mui/material';
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
    console.log('⚙️ handleFileChange called, files:', e.target.files);
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    console.log('⚙️ Starting upload for file:', file);

    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;
    console.log('⚙️ Generated filePath:', filePath);

    // upload to Supabase Storage
    const { error: uploadError } = await supabase
      .storage
      .from('avatars')
      .upload(filePath, file, { upsert: true });
    console.log('⚙️ Upload response – error:', uploadError);

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
    console.log('⚙️ Retrieved publicUrl:', publicUrl);

    // Bust browser cache by appending a timestamp query param
    const publicUrlWithTimestamp = `${publicUrl}?updated_at=${Date.now()}`;
    setAvatarUrl(publicUrlWithTimestamp);
    console.log('⚙️ Set avatarUrlWithTimestamp:', publicUrlWithTimestamp);

    // Persist to users table
    console.log('⚙️ Persisting avatar URL to users table:', publicUrl);
    const {data, error: updateError } = await supabase
      .from('users')
      .update({ profile_image_url: publicUrl })
      .eq('user_id', userId)
      .select('profile_image_url')
      .single();
    if (data) {
      console.log('User avatar URL updated in users table:', data.profile_image_url);
      console.log('⚙️ update response data:', data);
      // No need to setAvatarUrl here; keep using the timestamped URL.
    } else {
      console.error('Error updating user avatar URL in users table:', updateError?.message);
      console.log('⚙️ update response error:', updateError);
    }
    
    
    console.log('⚙️ handleFileChange complete.');
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
            boxShadow: 2
          }}
        />
        <IconButton
          component="label"
          htmlFor="avatar-upload-input"
          sx={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            bgcolor: 'background.paper'
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
      <Typography variant="caption" color="textSecondary">
        {uploading ? 'Uploading...' : 'Change avatar'}
      </Typography>
    </Box>
  );
};

export default UploadAvatar;
