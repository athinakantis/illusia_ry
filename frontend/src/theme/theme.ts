import { createTheme } from '@mui/material';

export const theme = {
  primary: {
    main: '#44195B',
    light: '#9339C9',
    dark: '#1F0A29',
    neutral: '#2c2c2c',
    black: '#2A2A2A',
  },
  secondary: {
    main: '#9537C7',
    light: '#ba68c8',
    dark: '#7b1fa2',
  },
  background: {
    default: '#FFFFFF',
    lightgrey: 'lightgrey',
    verylightgrey: '#ededed',
    grey03: '#A6A6A6',
  },
  text: {
    primary: '#1F0A29',
    main: '#FFF',
    secondary: '#666666',
    light: '#FAFAFA',
  },
  accent: {
    main: '#3CC5BC',
    light: '#C1FDF9',
    dark: '#27847E',
  },
};

declare module '@mui/material/styles' {
  interface BreakpointOverrides {
    xs: true;
    sm: true;
    md: true;
    lg: true;
    xl: true;
    // You can add custom breakpoints if needed
    // tablet: true;
    // laptop: true;
  }
}

export const createAppTheme = () =>
  createTheme({
    breakpoints: {
      values: {
        xs: 0, // Mobile phones (portrait)
        sm: 600, // Tablets (portrait)
        md: 900, // Tablets (landscape), small laptops
        lg: 1200, // Desktop
        xl: 1536, // Large desktop
        // Custom breakpoints if needed:
        // tablet: 640,
        // laptop: 1024,
      },
    },
    palette: {
      ...theme,
      contrastThreshold: 4.5,
    },
    typography: {
      fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
      h1: {
        fontSize: 45,
        fontWeight: 500,
        fontFamily: 'Roboto Slab, sans-serif',
        color: '#FFF',
      },
      h2: {
        fontSize: '1.75rem',
        fontWeight: 500,
        fontFamily: 'Lato, sans-serif',
        color: '#282828',
      },
      h3: {
        fontSize: '1.5rem',
        fontWeight: 500,
        fontFamily: 'Roboto Slab, sans-serif',
        color: '#282828',
      },
      h4: {
        fontSize: '1.25rem',
        fontWeight: 500,
        fontFamily: 'Roboto Slab, sans-serif',
        color: '#282828',
      },
      h5: {
        fontSize: '1rem',
        fontWeight: 500,
        fontFamily: 'Roboto Slab, sans-serif',
        color: '#282828',
      },
      h6: {
        fontSize: '0.875rem',
        fontWeight: 500,
        fontFamily: 'Roboto Slab, sans-serif',
        color: '#282828',
      },
      body1: {
        fontSize: 16,
        fontWeight: 400,
        fontFamily: 'Oxygen, sans-serif',
        color: '#282828',
      },
      body2: {
        fontSize: '0.875rem',
        fontWeight: 400,
        fontFamily: 'Lato, sans-serif',
        color: '#282828',
      },
      body3: {
        fontFamily: 'Lato, sans-serif',
        fontSize: 16,
        fontWeight: 300,
        color: '#282828',
      },
      link: {
        fontSize: '1 rem',
        fontWeight: 500,
        fontFamily: 'Roboto, sans-serif',
        textTransform: 'uppercase',
        color: '#282828',
      },
      heading_secondary: {
        fontSize: 40,
        fontFamily: 'Lato, sans-serif',
        color: '#282828',
      },
      heading_secondary_bold: {
        fontSize: 36,
        fontWeight: 700,
        fontFamily: 'Lato, sans-serif',
        color: '#282828',
      },
      subheading: {
        fontFamily: 'Lato, sans-serif',
        fontWeight: 400,
        fontSize: 18,
        color: '#282828',
      },
    },
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
    components: {
      MuiButton: {
        defaultProps: {
          disableRipple: true,
        },
        styleOverrides: {
          root: {
            variants: [
              {
                props: { variant: 'rounded' },
                style: {
                  height: 59,
                  borderRadius: '64px',
                  backgroundColor: '#282828',
                  fontFamily: 'Exo, sans-serif',
                  fontWeight: 600,
                  fontSize: 'clamp(14px, 2vw, 20px)',
                  color: '#FFF',
                  width: 'fit-content',
                  padding: '16px 24px',
                  '&:hover': { backgroundColor: '#464646' },
                },
              },
              {
                props: { variant: 'rounded', size: 'small' },
                style: {
                  textTransform: 'capitalize',
                  height: 54,
                  width: '100%',
                },
              },
              {
                props: { variant: 'contained', color: 'grey' },
                style: {
                  backgroundColor: '#282828',
                  color: 'white',
                  '&:hover': { backgroundColor: '#3f3f3f' },
                },
              },
              {
                props: { variant: 'outlined_rounded' },
                style: {
                  border: '1px solid #E2E2E2',
                  borderRadius: '100px',
                  fontFamily: 'Lato, sans-serif',
                  height: '40px',
                  textTransform: 'capitalize',
                  fontSize: 16,
                  '&:hover': { backgroundColor: 'rgba(68, 25, 91, 0.04)' },
                },
              },
            ],
          },
        },
      },
      MuiTabs: {
        styleOverrides: {
          root: {},
        },
      },
      MuiTab: {
        defaultProps: {
          disableRipple: true,
        },
        styleOverrides: {
          root: {
            fontSize: 20,
          },
        },
      },
      MuiDialogTitle: {
        styleOverrides: {
          root: {
            fontSize: 21,
            fontWeight: 400,
            fontFamily: 'Oxygen, sans-serif',
            color: '#282828',
            padding: 0,
          }
        }
      },
      MuiDialog: {
        styleOverrides: {
          root: {
            '& .MuiBackdrop-root': {
              backgroundColor: 'rgba(0,0,0,0.1)',
              boxShadow: 'none', filter: 'none',
              borderRadius: '3px', 
            },
            '& .MuiPaper-root': {
              boxShadow: 'none',
              filter: 'none',
              padding: '2rem',
              gap: '2rem',
              /* maxWidth removed so MUI’s own `maxWidth="sm" | "md" | …` works */
            }

          }
        }
      },
      MuiDialogActions: {
        styleOverrides: {
          root: {
            padding: 0,
            justifyContent: 'start',
          }
        }
      }
    },
  });
