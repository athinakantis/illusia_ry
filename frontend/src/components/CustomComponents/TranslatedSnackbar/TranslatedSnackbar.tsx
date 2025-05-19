import React, { useEffect, useState } from 'react';
import { SnackbarKey, VariantType, useSnackbar } from 'notistack';
import SnackbarContent from '@mui/material/SnackbarContent';
import { Typography, LinearProgress, Box, IconButton } from '@mui/material';
import { Theme } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation, Trans } from 'react-i18next';
import getBgColor from './getBgColor';

/**
 * Options accepted by showSnackbar helper.
 */
export interface TranslatedSnackbarOptions {
  /** Fallback text – required so the extractor can pick up the key */
  defaultValue: string;
  /** notistack variant (default: 'default') */
  variant?: VariantType;
  /** Auto‑hide timeout in **milliseconds** (default: 5000) */
  autoHideDuration?: number;
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
 *   defaultValue: 'Booking approved',
 *   variant: 'success',
 *   autoHideDuration: 3000,
 * });
 * ```
 */
// eslint-disable-next-line react-refresh/only-export-components
export const useTranslatedSnackbar = () => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { t } = useTranslation();

  /**
   * Show a snackbar.
   *
   * @param messageKey i18n key
   * @param options    defaultValue **must** be provided in options + variant & timeout
   * @returns snackbar key
   */
  const showSnackbar = (
    messageKey: string,
    {
      defaultValue,
      variant = 'default',
      autoHideDuration = 4200,
    }: TranslatedSnackbarOptions,
  ): SnackbarKey => {
    // `content` gives full control to render a custom component.
    return enqueueSnackbar(t(messageKey, { defaultValue }), {
      variant,
      autoHideDuration,
      content: (key) => (
        <TranslatedSnackbarContent
          id={key}
          messageKey={messageKey}
          defaultValue={defaultValue}
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
  messageKey: string;
  defaultValue: string;
  autoHideDuration: number;
  variant: VariantType;
  onClose: (key?: SnackbarKey) => void;
}

/**
 * Internal component rendered by notistack’s `content` prop.
 * Shows the translated message plus a linear progress bar
 * tracking the remaining time.
 */
const TranslatedSnackbarContent = React.forwardRef<HTMLDivElement, TranslatedSnackbarProps>(
  (
    {
      id,
      messageKey,
      defaultValue,
      autoHideDuration,
      variant,
      onClose,
    },
    ref,
  ) => {
    const [progress, setProgress] = useState<number>(100);

    // Update progress 10× per second.
    useEffect(() => {
      const started = Date.now();
      const timer = window.setInterval(() => {
        const elapsed = Date.now() - started;
        const pctLeft = Math.max(0, 100 - (elapsed / autoHideDuration) * 100);
        setProgress(pctLeft);
      }, 100);

      return () => window.clearInterval(timer);
    }, [autoHideDuration]);

    return (
      <SnackbarContent
        ref={ref}
        message={
          <Box sx={{ display: 'flex', alignItems: 'center', pr: 1 }}>
            <Box sx={{ flexGrow: 1, pr: 1 }}>
              <Typography variant="body2" color="inherit">
                <Trans i18nKey={messageKey} defaultValue={defaultValue} />
              </Typography>
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{
                  mt: 0.5,
                  bgcolor: 'rgba(255,255,255,0.3)',
                  '& .MuiLinearProgress-bar': { backgroundColor: 'white' },
                }}
              />
            </Box>
          </Box>
        }
        action={
          <IconButton
            aria-label="close"
            size="small"
            color="inherit"
            onClick={() => onClose(id)}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
        sx={(theme: Theme) => ({
          bgcolor: getBgColor(theme, variant),
          color: theme.palette.common.white,
          px: 2,
          py: 1,
          minWidth: 288,
        })}
      />
    );
  },
);
TranslatedSnackbarContent.displayName = 'TranslatedSnackbarContent';

export default TranslatedSnackbarContent;