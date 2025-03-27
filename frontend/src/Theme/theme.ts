import { createTheme, PaletteMode } from "@mui/material";

const lightGradient = "linear-gradient(295deg, #85FFBD 0%, #FFFB7D 62%, #04ffe8 100%)";

const darkGradient = "linear-gradient(to top, #f857a6, #ff5858)";
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
    custom: {
      lightGradient,
      fallback: "#85FFBD"
    }
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
    }
  };

 export const createAppTheme = (mode: PaletteMode) => createTheme({
    palette: {
        mode,
        ...(mode === 'light' ? lightPalette : darkPalette),
    }
 }) 
