import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
  Tabs,
  Tab,
} from '@mui/material';
import { useAuth } from '../../../hooks/useAuth';
import { useState } from 'react';
import SecuritySettings from './SecuritySettings';
import AddPhone from './AddPhone';

const Account = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState(0); // 0 = Profile, 1 = Security
  const [showPhoneEditor, setShowPhoneEditor] = useState(false);
  // ──────────────────────────────   Variables  ─────────────────────────────────────

  // Determine the display name
  const displayName =
    user?.user_metadata.full_name || user?.user_metadata.name || 'User';

  // Resolve the current phone number from any location Supabase might store it
  const phoneNumber =
    user?.phone ||
    user?.user_metadata?.phone ||
    user?.app_metadata?.phone ||
    '';

  const hasPhoneNumber = phoneNumber !== '';

  // ──────────────────────────────   Conditial Renders  ─────────────────────────────────────
  // Check if user is logged in
  if (!user) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 'calc(100vh - 3rem - 64px)',
          p: 3,
          pb: 12,
        }}
      >
        <Typography variant="h4" component="div" sx={{ textAlign: 'center' }}>
          You are not logged in.
        </Typography>
      </Box>
    );
  }
  // ──────────────────────────────   Main Render  ─────────────────────────────────────
console.log("user", user);
  console.log("user_metadata", user.user_metadata);
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 'calc(100vh - 3rem - 64px)',
        p: 3,
        pb: 12,
      }}
    >
      <Card sx={{ maxWidth: 500, width: '100%', p: 3 }}>
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          textColor="primary"
          indicatorColor="primary"
          centered
          sx={{ mb: 2 }}
        >
          <Tab label="Profile" />
          <Tab label="Security" />
        </Tabs>
        <CardContent
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: 1,
          }}
        >
          {tab === 0 && (
            <>
              {/* Avatar */}
              <Avatar
                alt={displayName}
                src={user?.user_metadata.avatar_url}
                sx={{
                  width: 100,
                  height: 100,
                  margin: 'auto',
                  marginBottom: 2,
                }}
              />

              {/* Full Name */}
              <Typography gutterBottom variant="h4" component="div">
                {displayName}
              </Typography>

              {/* Email */}
              <Typography variant="body1" color="text.primary">
                {user?.email}
              </Typography>

    
              {/* Phone section */}
              {hasPhoneNumber ? (
                <>
                  <Typography variant="body2" color="text.secondary">
                    {phoneNumber}
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{ textTransform: 'none', mt: 1 }}
                    onClick={() => setShowPhoneEditor(true)}
                  >
                    Change phone
                  </Button>
                </>
              ) : (
                <Button
                  variant="outlined"
                  size="small"
                  sx={{ textTransform: 'none', mt: 1 }}
                  onClick={() => setShowPhoneEditor(true)}
                >
                  Add phone number
                </Button>
              )}

              {showPhoneEditor && (
                <AddPhone
                  initialPhone={
                    hasPhoneNumber ? phoneNumber : undefined
                  }
                  onDone={() => {
                    setShowPhoneEditor(false);
                    window.location.reload(); // refresh profile after verification
                  }}
                />
              )}
              <Typography variant="body3" color="text.primary">
                Account created on{' '}
                {new Date(user?.created_at).toLocaleDateString()}
              </Typography>
              {/* Card Actions */}
              <CardActions
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: 2,
                  mt: 2,
                }}
              >
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  sx={{ textTransform: 'none' }}
                  onClick={() => {
                    // Placeholder for delete account action
                    console.log('Delete account clicked');
                  }}
                >
                  Delete Account
                </Button>
              </CardActions>
            </>
          )}
          {tab === 1 && <SecuritySettings />}
        </CardContent>
      </Card>
    </Box>
  );
};

export default Account;
