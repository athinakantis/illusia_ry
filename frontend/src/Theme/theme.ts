import { createTheme, PaletteMode } from '@mui/material';
// Needed to allow MUI X DataGrid theming

import type {} from '@mui/x-data-grid/themeAugmentation';
import type {} from '@mui/x-data-grid-pro/themeAugmentation';
import type {} from '@mui/x-data-grid-premium/themeAugmentation';

const theme = createTheme({
  components: {
    // Use `MuiDataGrid` on DataGrid, DataGridPro and DataGridPremium
    MuiDataGrid: {
      styleOverrides: {
        root: {
          backgroundColor: 'red',
        },
      },
    },
  },
});
const lightGradient =
  'linear-gradient(295deg, #85FFBD 0%, #FFFB7D 62%, #04ffe8 100%)';

const darkGradient = 'linear-gradient(to top, #f857a6, #ff5858)';
export const lightPalette = {
  primary: {
    main: '#1976d2',
  },
  secondary: {
    main: '#9c27b0',
    light: '#ba68c8',
    dark: '#7b1fa2',
  },
  background: {
    default: '#f5f5f5',
    paper: '#ffffff',
  },
  text: {
    primary: '#1c1c1c',
    secondary: '#666666',
  },
  typography: {},
  custom: {
    lightGradient,
    fallback: '#85FFBD',
  },
};

export const darkPalette = {
  primary: {
    main: '#9c27b0',
    light: '#e3f2fd',
    dark: '#42a5f5',
  },
  secondary: {
    main: '#ce93d8',
    light: '#f3e5f5',
    dark: '#ab47bc',
  },
  background: {
    default: '#121212',
    paper: '#1e1e1e',
  },
  text: {
    primary: '#ffffff',
    secondary: '#b3b3b3',
  },
  custom: {
    darkGradient,
  },
};

export const createAppTheme = (mode: PaletteMode) =>
  createTheme({
    palette: {
      mode,
      ...(mode === 'light' ? lightPalette : darkPalette),
    },
    typography: {
      fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
      h1: { fontSize: '2rem', fontWeight: 500 },
      h2: { fontSize: '1.75rem', fontWeight: 500 },
      h3: { fontSize: '1.5rem', fontWeight: 500 },
      h4: { fontSize: '1.25rem', fontWeight: 500 },
      h5: { fontSize: '1rem', fontWeight: 500 },
      h6: { fontSize: '0.875rem', fontWeight: 500 },
      body1: { fontSize: '1rem', fontWeight: 400 },
      body2: { fontSize: '0.875rem', fontWeight: 400 },
    },/* I tried to put less shadows but it makes you put a minimum of 25 because MUI has them that way */
    shadows: [
      'none',
      '0px 1px 3px rgba(0,0,0,0.2)',
      '0px 1px 5px rgba(0,0,0,0.2)',
      '0px 1px 8px rgba(0,0,0,0.2)',
      '0px 1px 10px rgba(0,0,0,0.2)',
      '0px 1px 14px rgba(0,0,0,0.2)',
      '0px 1px 18px rgba(0,0,0,0.2)',
      '0px 2px 4px rgba(0,0,0,0.2)',
      '0px 2px 6px rgba(0,0,0,0.2)',
      '0px 2px 8px rgba(0,0,0,0.2)',
      '0px 2px 10px rgba(0,0,0,0.2)',
      '0px 2px 12px rgba(0,0,0,0.2)',
      '0px 2px 14px rgba(0,0,0,0.2)',
      '0px 2px 16px rgba(0,0,0,0.2)',
      '0px 2px 18px rgba(0,0,0,0.2)',
      '0px 2px 20px rgba(0,0,0,0.2)',
      '0px 2px 22px rgba(0,0,0,0.2)',
      '0px 2px 24px rgba(0,0,0,0.2)',
      '0px 2px 26px rgba(0,0,0,0.2)',
      '0px 2px 28px rgba(0,0,0,0.2)',
      '0px 2px 30px rgba(0,0,0,0.2)',
      '0px 2px 32px rgba(0,0,0,0.2)',
      '0px 2px 34px rgba(0,0,0,0.2)',
      '0px 2px 36px rgba(0,0,0,0.2)',
      '0px 2px 38px rgba(0,0,0,0.2)',
    ],
  });
