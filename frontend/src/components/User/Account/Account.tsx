import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
  Tabs,
  Tab,
  useTheme,
} from '@mui/material';
import { IconButton, TextField } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { showCustomSnackbar } from '../../CustomSnackbar';
import { accountApi } from '../../../api/account';
import { useAuth } from '../../../hooks/useAuth';
import { useState, useEffect } from 'react';
import SecuritySettings from './SecuritySettings';
import AddPhone from './AddPhone';
import ChangeEmail from './ChangeEmail';
import DeleteAccount from './DeleteAccount';
import { Link } from 'react-router-dom';
import UploadAvatar from './UploadAvatar';
import { usersApi } from '../../../api/users';

const Account = () => {
   // ──────────────────────────────   Variables  ───────────────────────────────────────────
   const theme = useTheme()
   const pallete = theme.palette
   const { user } = useAuth();

  // Local state for name and input
  const [name, setName] = useState('');
  const [nameInput, setNameInput] = useState('');

  // Resolve the current phone number from any location Supabase might store it
  const phoneNumber =
    user?.phone ||
    user?.user_metadata?.phone ||
    user?.app_metadata?.phone ||
    '';

  const hasPhoneNumber = phoneNumber !== '';

  
  // ──────────────────────────────   State  ─────────────────────────────────────────
  const [tab, setTab] = useState(0); // 0 = Profile, 1 = Security
  const [showPhoneEditor, setShowPhoneEditor] = useState(false);
  const [showEmailEditor, setShowEmailEditor] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editingName, setEditingName] = useState(false);

  // ──────────────────────────────   Effects  ───────────────────────────────────────────
  useEffect(() => {
    (async () => {
      if (!user) return;
      const { data } = await usersApi.getUserById(user.id);
      const dbName = data?.display_name;
      const initial = dbName ?? user.user_metadata.full_name ?? user.email?.split('@')[0] ?? '';
      setName(initial);
      setNameInput(initial);
    })();
  }, [user]);
  
 // ──────────────────────────────   Handlers  ───────────────────────────────────────────
  const handleNameChange = async () => {
    try {
      await accountApi.updateName(nameInput);
      setName(nameInput);
      showCustomSnackbar(`You're name has been updated to ${nameInput}.`, 'success');
      setEditingName(false);
    } catch (error) {
      console.error('Error updating name:', error);
      showCustomSnackbar('Error updating name', 'error');
    }
  };
 
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
        {/*                    Message and links if user is not signed in                     */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h4" component="div" sx={{ mb: 2 }}>
            You are either not logged in or you don't have an account yet.
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Please{' '}
            <Link to="/login?view=sign_in" style={{ textDecoration: 'none', color: pallete.primary.light, fontWeight: 300 }}>
              log in
            </Link>{' '}
            or{' '}
            <Link to="/login?view=sign_up" style={{ textDecoration: 'none', color: pallete.primary.light, fontWeight: 300 }}>
              sign up
            </Link>{' '}
            to access your account.
          </Typography>
        </Box>
      </Box>
    );
  }
  // ──────────────────────────────   Main Render  ────────────────────────────────────────────
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

        {/*                          Tabs                               */}
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

        {/*                       Card Content                          */}
        {/* The content of the card changes based on the selected tab */}
        {/* Tab 0 = Profile, Tab 1 = Security */}
        <CardContent
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: 1,
          }}
        >
            {/*                          Profile Tab                        */}
          {tab === 0 && (
            <>
              {/*                      Avatar Component                      */}
            <Box sx={{ margin: '0 auto', mt: 2 }}>
              <UploadAvatar  />
              </Box>
              {/*                       Editing Name                          */}
              
              {editingName ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TextField
                    size="small"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                  />
                  <Button
                    size="small"
                    variant="contained"
                    onClick={handleNameChange}
                  >
                    Save
                  </Button>
                  <IconButton size="small" onClick={() => setEditingName(false)}>
                    <EditIcon />
                  </IconButton>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography gutterBottom variant="h4">
                    {name}
                  </Typography>
                  <IconButton size="small" onClick={() => setEditingName(true)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Box>
              )}

              {/*                     Email Section                        */}
              <Typography variant="body1" color="text.primary">
                {user?.email}
              </Typography>
              <Button
                variant="outlined"
                size="small"
                sx={{ textTransform: 'none', mt: 1 }}
                onClick={() => setShowEmailEditor(true)}
              >
                Change email
              </Button>
              {showEmailEditor && (
            //                     Change Email Component
                <ChangeEmail
                  initialEmail={user?.email}
                  onDone={() => {
                    setShowEmailEditor(false);
                   
                  }}
                />
              )}

    
              {/*                     Phone Section                        */}
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

              {/*                       Card Actions                        */}
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
                  onClick={() => setShowDeleteDialog(true)}
                >
                  Delete Account
                </Button>
                {/*                 DELETE ACCOUNT COMPONENT                 */}
                <DeleteAccount
                  open={showDeleteDialog}
                  onClose={() => setShowDeleteDialog(false)}
                />
              </CardActions>
            </>
          )}
          {/*                   Security Settings Tab                    */}
          {tab === 1 && <SecuritySettings />}
        </CardContent>
      </Card>
    </Box>
  );
};

export default Account;
