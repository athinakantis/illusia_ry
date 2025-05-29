import React, { useEffect, useState } from 'react';
import { SnackbarKey, VariantType, useSnackbar } from 'notistack';
import SnackbarContent from '@mui/material/SnackbarContent';
import { Typography, LinearProgress, Box, IconButton, Divider, Stack } from '@mui/material';
import { Theme } from '@mui/material/styles';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import getColor from './getColor';
import './snackbar.css'

/**
 * Options accepted by showSnackbar helper.
 */
export interface TranslatedSnackbarOptions {
  /** Message text to display (fallback for extraction) */
  message: string;
  /** notistack variant (default: 'default') */
  variant?: VariantType;
  /** Auto‑hide timeout in **milliseconds** (default: 5000) */
  autoHideDuration?: number;
  /** Optional image source to display in the snackbar */
  src?: string;
  /** Optional divider below the message (default: false) */
  divider?: boolean;
  /** Optional secondary message */
  secondaryMessage?: string;
}

/**
 * Hook that exposes a strongly‑typed helper for showing
 * translated snackbars **with** a progress bar that visualises
 * the remaining display time.
 *
 * Usage:
 * ```ts
 * const { showSnackbar } = useTranslatedSnackbar();
 * showSnackbar('snackbar.bookingApproved', {
 *   message: 'Booking approved',
 *   variant: 'success',
 *   autoHideDuration: 3000,
 * });
 * ```
 */
// eslint-disable-next-line react-refresh/only-export-components
export const useTranslatedSnackbar = () => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  /**
   * Show a snackbar.
   * @type  {VariantType} variant
   * @type {TranslatedSnackbarOptions} options
   * @param options ```ts
   * { message, variant?, autoHideDuration? }
   * variant: 'default' | 'error' | 'info' | 'success' | 'warning'
   * autoHideDuration: number  
   * ```
   * message **must** be provided in options + variant & timeout
   * 
   * Usage:
   * ```ts
   * const { showSnackbar } = useTranslatedSnackbar();
   * 
    showSnackbar({
      // First part of the message is the i18n key, defaultValue sets the fallback 
      message: t('adminBookings.snackbar.bookingApproved', { defaultValue: 'Booking approved'}),
      variant: 'success',
      autoHideDuration: 3000, // Optional, default is 4200
    });
    ```
   */
  const showSnackbar = ({
    message,
    variant = 'default',
    autoHideDuration = 10000,
    divider = false,
    src = '',
    secondaryMessage = '',
  }: TranslatedSnackbarOptions): SnackbarKey => {
    return enqueueSnackbar(message, {
      variant,
      autoHideDuration,
      content: (key) => (
        <TranslatedSnackbarContent
          divider={divider}
          src={src}
          id={key}
          message={message}
          secondaryMessage={secondaryMessage}
          autoHideDuration={autoHideDuration}
          variant={variant}
          onClose={closeSnackbar}
        />
      ),
    });
  };

  return { showSnackbar };
};

interface TranslatedSnackbarProps {
  id: SnackbarKey;
  message: string;
  autoHideDuration: number;
  variant: VariantType;
  onClose: (key?: SnackbarKey) => void;
  divider: boolean;
  src?: string;
  secondaryMessage?: string;
}

/**
 * Internal component rendered by notistack’s `content` prop.
 * Shows the translated message plus a linear progress bar
 * tracking the remaining time.
 */
const TranslatedSnackbarContent = React.forwardRef<
  HTMLDivElement,
  TranslatedSnackbarProps
>(({ id, message, autoHideDuration, variant, onClose, divider, src, secondaryMessage }, ref) => {
  const [progress, setProgress] = useState<number>(100);

  //Update progress 10× per second.
  useEffect(() => {
    const started = Date.now();
    const timer = window.setInterval(() => {
      const elapsed = Date.now() - started;
      const pctLeft = Math.max(0, 100 + (elapsed / autoHideDuration) * 100);
      setProgress(pctLeft);
    }, 100);

    return () => window.clearInterval(timer);
  }, [autoHideDuration]);

  return (
    <SnackbarContent
      ref={ref}
      message={
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            flex: 1,
            gap: '12px',
            p: 0,
          }}
        >
          <Box sx={{ pr: 5 }}>
            <Typography
              variant="body2"
              fontSize={16}
              color={`${variant}.contrastText`}
            >
              {message}
            </Typography>
          </Box>

          {divider && <Divider sx={(theme: Theme) => ({ borderColor: `${getColor(theme, variant, 'main')}50` })} />}
          {src && (
            <Stack direction={'row'} gap={'16px'}>
              <img src={src} alt='' style={{ width: 116, height: 116, borderRadius: 15, objectFit: 'cover' }} />
              <Typography variant='body2' fontSize={12} sx={{ maxWidth: 120 }}>{secondaryMessage}</Typography>
            </Stack>
          )
          }

          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              mt: 0.5,
              bgcolor: `${variant}.dark`,
              '& .MuiLinearProgress-bar': {
                backgroundColor: `${variant}.progressBg`,
              },
            }}
          />
        </Box>
      }
      action={
        <IconButton
          aria-label="close"
          size="small"
          onClick={() => onClose(id)}
          sx={(theme: Theme) => ({
            '& svg': { fill: getColor(theme, variant, 'dark') },
            position: 'absolute',
            top: '10px',
            right: '10px',
            p: '3px',
          })}
        >
          <CloseRoundedIcon fontSize="small" />
        </IconButton>
      }
      sx={(theme: Theme) => ({
        position: 'relative',
        bgcolor: getColor(theme, variant, 'light'),
        minWidth: 288,
        maxWidth: 400,
        p: '14px 18px',
        border: `1px solid ${getColor(theme, variant, 'main')}`,
        '& .MuiSnackbarContent-message': { p: 0 },
      })}
    />
  );
});
TranslatedSnackbarContent.displayName = 'TranslatedSnackbarContent';

export default TranslatedSnackbarContent;
