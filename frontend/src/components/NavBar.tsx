import {
  AppBar,
  Box,
  FormControlLabel,
  Switch,
  Toolbar,
  Typography,
  useTheme,
  Button,
} from '@mui/material';

import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { lightPalette, darkPalette } from '../theme/theme';
import { FiMoon, FiSun } from 'react-icons/fi';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';

export const NavBar = () => {
  const { toggleColorMode } = useContext(ThemeContext);

  const theme = useTheme();

  const mode = theme.palette.mode;

  const dispatch = useDispatch();
  const session = useSelector((state: any) => state.auth.session);

  return (
    <>
      <AppBar
        role="banner"
        aria-label="navigation"
        position="absolute"
        sx={{
          background:
            mode === 'dark'
              ? darkPalette.custom.darkGradient
              : lightPalette.custom.lightGradient,
          color: '#000',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
          top: 0,
          left: 0,
          zIndex: (theme) => theme.zIndex.drawer + 10,
        }}
      >
        <Toolbar aria-label="navigation" role="navigation">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* Light/Dark mode */}
            <FormControlLabel
              control={
                <Switch
                  checked={mode === 'dark'}
                  onChange={toggleColorMode}
                  icon={<FiSun />}
                  checkedIcon={<FiMoon />}
                />
              }
              label=""
              aria-label="toggle-dark-mode"
            />
            {/* Testing Theme font. */}
            <Typography variant="h1" boxShadow={theme.shadows[2]}>
              Illusia Ry Storage Solutions(Font Test)
            </Typography>
            {session ? (
              <Button onClick={() => dispatch(logout())} color="inherit">
                Logout
              </Button>
            ) : (
              <Button href="/login" color="inherit">
                Login
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
};
