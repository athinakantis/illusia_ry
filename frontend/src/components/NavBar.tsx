import {
  AppBar,
  Box,
  FormControlLabel,
  Switch,
  Toolbar,
  useTheme,
} from '@mui/material';

import { useContext} from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { lightPalette, darkPalette } from '../theme/theme';
import { FiMoon, FiSun } from 'react-icons/fi';

export const NavBar = () => {
  const { toggleColorMode } = useContext(ThemeContext);

  const theme = useTheme();

  const mode = theme.palette.mode;

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
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
};
