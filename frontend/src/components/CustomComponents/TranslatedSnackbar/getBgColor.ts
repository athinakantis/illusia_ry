import { Theme } from '@mui/material';
import { VariantType } from 'notistack';

const getBgColor = (theme: Theme, variant: VariantType | 'default'): string => {
  // Use brand colour for generic / info notifications
  if (variant === 'default' || variant === 'info') {
    return theme.palette.primary.light;
  }

  // Palette has strong typing for success | warning | error
  const palette = theme.palette[variant as Exclude<VariantType, 'default' | 'info'>];
  return (palette as typeof theme.palette.success).main;
};

export default getBgColor;
