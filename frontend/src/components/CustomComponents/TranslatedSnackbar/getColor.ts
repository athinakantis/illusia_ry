import { PaletteColor, Theme } from '@mui/material';
import { VariantType } from 'notistack';

const getColor = (
  theme: Theme,
  variant: VariantType | 'default',
  shade: keyof PaletteColor = 'main'
): string => {


  // For success | warning | error
  const palette = theme.palette[variant as Exclude<VariantType, 'default' | 'info'>];

  return (palette as typeof theme.palette.success)[shade] || palette.main;
};

export default getColor;

