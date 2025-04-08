

// Custom Typography Variant Types
declare module '@mui/material/styles' {
  interface TypographyVariants {
    link: React.CSSProperties;
  }

  interface TypographyVariantsOptions {
    link?: React.CSSProperties;
  }
}
declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    link: true;
  }
}

declare module '@mui/material/styles' {
  interface Palette {
    neutral: Palette['primary'];
  }

  interface PaletteOptions {
    neutral?: PaletteOptions['primary'];
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    neutral: true;
  }
}