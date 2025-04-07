import {
  AppBar,
  Box,
  FormControlLabel,
  Switch,
  Toolbar,
  Typography,
  useTheme,
  Link as MUILink,
} from '@mui/material';
import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { lightPalette, darkPalette } from "../Theme/theme";
import { FiMoon, FiSun } from 'react-icons/fi';
import Logout from './Login/LoginOutBtn';
import { Link as RouterLink } from 'react-router-dom';

export const NavBar = () => {
  const { toggleColorMode } = useContext(ThemeContext);
  const theme = useTheme();
  const mode = theme.palette.mode;

  return (
    <AppBar
      position="fixed"
      sx={{
        background: mode === 'dark' ? darkPalette.custom.darkGradient : lightPalette.custom.lightGradient,
        color: '#000',
        boxShadow: 3,
        px: 2,
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Left side: Theme toggle and branding */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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
          />
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
            Illusia Ry Storage Solutions
          </Typography>
        </Box>
        {/* Right side: Navigation links */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <MUILink
            component={RouterLink}
            to="/crud"
            color="inherit"
            underline="none"
            sx={{ fontSize: '1rem', fontWeight: 500 }}
          >
            Crud DataGrid
          </MUILink>
          
          <Logout />
        </Box>
      </Toolbar>
    </AppBar>
  );
};