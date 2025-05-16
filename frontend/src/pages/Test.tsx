import { Stack, Button, Container, Typography } from '@mui/material';
import { useTranslatedSnackbar } from '../components/CustomComponents/TranslatedSnackbar';
import { useTranslation } from 'react-i18next';

const NotificationTest = () => {
  const { showSnackbar } = useTranslatedSnackbar();
  const { t } = useTranslation();

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="heading_secondary" gutterBottom>
        {t('snackbarTest.title', { defaultValue: 'Translated Snackbar Test' })}
      </Typography>

      <Stack direction="row" spacing={2} flexWrap="wrap">
        <Button
          variant="contained"
          onClick={() =>
            showSnackbar(
              'snackbar.bookingApproved',
              'Booking approved',
              { variant: 'success' }
            )
          }
        >
          {t('snackbarTest.success', { defaultValue: 'Success' })}
        </Button>

        <Button
          variant="contained"
          color="warning"
          onClick={() =>
            showSnackbar(
              'snackbar.bookingWarning',
              'Something needs attention',
              { variant: 'warning' }
            )
          }
        >
          {t('snackbarTest.warning', { defaultValue: 'Warning' })}
        </Button>

        <Button
          variant="contained"
          color="error"
          onClick={() =>
            showSnackbar(
              'snackbar.bookingRejected',
              'Booking rejected',
              { variant: 'error' }
            )
          }
        >
          {t('snackbarTest.error', { defaultValue: 'Error' })}
        </Button>

        <Button
          variant="contained"
          color="info"
          onClick={() =>
            showSnackbar(
              'snackbar.bookingInfo',
              'General information',
              { variant: 'info' }
            )
          }
        >
          {t('snackbarTest.info', { defaultValue: 'Info' })}
        </Button>

        <Button
          variant="contained"
          color="secondary"
          onClick={() =>
            showSnackbar(
              'snackbar.bookingDefault',
              'Default notification',
              { variant: 'default' }
            )
          }
        >
          {t('snackbarTest.default', { defaultValue: 'Default' })}
        </Button>
      </Stack>
    </Container>
  );
};

export default NotificationTest;