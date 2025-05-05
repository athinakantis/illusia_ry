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
import { useAuth } from '../hooks/useAuth';
import { useState } from 'react';
import SecuritySettings from './SecuritySettings';

const Account = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState(0); // 0 = Profile, 1 = Security
  // ──────────────────────────────   Variables  ─────────────────────────────────────

  // Determine the display name
  const displayName =
    user?.user_metadata.full_name || user?.user_metadata.name || 'User';

  // Determine if phone number is available
  const hasPhoneNumber =
    user?.user_metadata.phone !== undefined &&
    user?.user_metadata.phone !== null &&
    user?.user_metadata.phone !== '';

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
                sx={{ width: 100, height: 100, margin: 'auto', marginBottom: 2 }}
              />

              {/* Full Name */}
              <Typography gutterBottom variant="h4" component="div">
                {displayName}
              </Typography>

              {/* Email */}
              <Typography variant="body1" color="text.primary">
                {user?.email}
              </Typography>

              {/* Phone */}
              {hasPhoneNumber && (
                <Typography variant="body2" color="text.secondary">
                  {user?.user_metadata.phone}
                </Typography>
              )}
              <Typography variant="body3" color="text.primary">
                Account created on {new Date(user?.created_at).toLocaleDateString()}
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
