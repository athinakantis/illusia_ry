import { createTheme } from '@mui/material';

export const theme = {
  primary: {
    main: '#44195B',
    neutral: '#2c2c2c'
  },
  secondary: {
    main: '#9537C7',
    light: '#ba68c8',
    dark: '#7b1fa2',
  },
  background: {
    default: '#FFFFFF',
    paper: '#ffffff',
  },
  text: {
    primary: '#1F0A29',
    secondary: '#666666',
  },
};

export const createAppTheme = () =>
  createTheme({
    palette: {
      ...theme,
      contrastThreshold: 4.5
    },
    typography: {
      fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
      h1: { fontSize: '2rem', fontWeight: 500, fontFamily: 'Roboto Slab, sans-serif' },
      h2: { fontSize: '1.75rem', fontWeight: 500, fontFamily: 'Roboto Slab, sans-serif' },
      h3: { fontSize: '1.5rem', fontWeight: 500, fontFamily: 'Roboto Slab, sans-serif' },
      h4: { fontSize: '1.25rem', fontWeight: 500, fontFamily: 'Roboto Slab, sans-serif' },
      h5: { fontSize: '1rem', fontWeight: 500, fontFamily: 'Roboto Slab, sans-serif' },
      h6: { fontSize: '0.875rem', fontWeight: 500, fontFamily: 'Roboto Slab, sans-serif' },
      body1: { fontSize: '1rem', fontWeight: 400, fontFamily: 'Oxygen, sans-serif'},
      body2: { fontSize: '0.875rem', fontWeight: 400, fontFamily: 'Oxygen, sans-serif' },
      link: { fontSize: '0.8rem', fontWeight: 500, fontFamily: 'Roboto, sans-serif', textTransform: 'uppercase' }
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
