
// Custom Typography Variant Types
declare module '@mui/material/styles' {
  interface TypographyVariants {
    link: React.CSSProperties;
    body3: React.CSSProperties;
    heading_secondary: React.CSSProperties;
    heading_secondary_bold: React.CSSProperties;
    subheading: React.CSSProperties;
  }

  interface TypographyVariantsOptions {
    link?: React.CSSProperties;
    body3?: React.CSSProperties;
    heading_secondary: React.CSSProperties;
    heading_secondary_bold: React.CSSProperties;
    subheading: React.CSSProperties;
  }
}
declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    link: true;
    body3: true;
    heading_secondary: true;
    heading_secondary_bold: true;
    subheading: true;
  }
}

// Custom colors
declare module '@mui/material/styles' {
  interface Palette {
    neutral: Palette['primary'];
    accent: Palette['primary'];
  }
  
  interface TypeBackground { // Added this so we can properly use the background colors
    lightgrey: string;
    verylightgrey: string;
    grey03: string;
  }
  // Added type the new text colors we had. This way we can use them without type errors.
  // Also autocompletes them in the IDE
  interface TypeText {
    main: string;
    light: string;
    secondary: string;
  }

  interface PaletteOptions {
    neutral?: PaletteOptions['primary'];
   
  }
}

// Custom  Components
declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    neutral: true;
    grey: true;
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsVariantOverrides {
    rounded: true;
    outlined_rounded: true;
    text_contained: true;
  }
}