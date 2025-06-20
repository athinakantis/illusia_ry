import { useMediaQuery, useTheme } from '@mui/material';

export function useMobileSize() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));

  return { isMobile };
}
