# Translated Snackbar

A small utility–component pair that lets you trigger **localised** snackbars
(toast‑style notifications) with a visible **count‑down progress bar**.  
It is built on top of [notistack](https://iamhosseindhv.com/notistack) and the
MUI design system, and it is fully typed – no `any` sneaking through your
code‑base.

---

## Contents

1. [Why another snackbar?](#why-another-snackbar)
2. [Quick start](#quick-start)
3. [API](#api)
   - [`useTranslatedSnackbar`](#usetranslatedsnackbar-hook)
   - [`TranslatedSnackbarContent`](#translatedsnackbarcontent)
4. [Styling & theming](#styling--theming)
5. [i18n integration](#i18n-integration)
6. [Accessibility notes](#accessibility-notes)
7. [Troubleshooting](#troubleshooting)
8. [Examples](#examples)

---

## Why another snackbar?

- **One‑liner usage** – `showSnackbar({ message, variant?, autoHideDuration? })`.
- **Progress bar** communicates the remaining lifetime to the user.
- **Localised by default** – zero‑config `react‑i18next` integration.
- Uses your **theme’s palette** for colours (`primary.light` for _info_
  & default; semantic colours for _success_ / _warning_ / _error_).
- Strongly typed – variant, key, durations all verified by TypeScript.
- Ref‑forwarding built in so notistack’s transitions work without warnings.

---

## Quick start

```jsx
// 1. Wrap your app once
import { SnackbarProvider } from 'notistack';

root.render(
  <SnackbarProvider maxSnack={4}>
    <App />
  </SnackbarProvider>
);

// 2. Call the hook in any component
import { useTranslatedSnackbar } from 'components/CustomComponents/TranslatedSnackbar';
import { useTranslation } from 'react-i18next';

const Demo = () => {
  const { showSnackbar } = useTranslatedSnackbar();
  const { t } = useTranslation();

  return (
    <Button
      onClick={() =>
        showSnackbar({
          message: t('snackbar.bookingApproved', { defaultValue: 'Booking approved' }),
          variant: 'success',
          autoHideDuration: 4000,
        })
      }
    >
      Click me
    </Button>
  );
};
```

---

## API

### `useTranslatedSnackbar` hook

| Return value         | Description                                          |
|----------------------|------------------------------------------------------|
| `showSnackbar()`     | `({ message, variant?, autoHideDuration? }) => key` <br>• `message` — already translated message string (usually `t(...)`) <br>• `variant` — `"success" \| "warning" \| "error" \| "info" \| "default"` (default: `"default"`) <br>• `autoHideDuration` — duration in milliseconds (default: **4200 ms**) |

Example usage:

```ts
showSnackbar({
  message: t('snackbar.bookingApproved', { defaultValue: 'Booking approved' }),
  variant: 'success',
  autoHideDuration: 3000,
});
```

Internally the hook delegates to `notistack.enqueueSnackbar` and injects the
custom content component.

---

### `TranslatedSnackbarContent`

You rarely need to import this directly – it is provided to notistack for you –
but if you want to render it yourself:

```jsx
<TranslatedSnackbarContent
  id={someKey}
  message="Plain text or already‑translated string"
  autoHideDuration={5000}
  variant="info"
  onClose={() => console.log('closed')}
/>
```

Props are fully typed and correspond to the parameters described above.

---

## Styling & Theming

| Variant passed            | Background colour                           |
|---------------------------|---------------------------------------------|
| `"success"`               | `theme.palette.success.main`                |
| `"warning"`               | `theme.palette.warning.main`                |
| `"error"`                 | `theme.palette.error.main`                  |
| `"info"` **or** `"default"` | `theme.palette.primary.light` (branding) |

Modify the helper in `TranslatedSnackbar/getBgColor.ts` if you want a different
strategy.

---

## i18n integration

The hook uses **`react‑i18next`**:

When calling `showSnackbar`, pass the `message` argument as the result of `t`:

```ts
showSnackbar({
  message: t('snackbar.bookingApproved', { defaultValue: 'Booking approved' }),
  variant: 'success',
  autoHideDuration: 4000,
});
```

That means:

- The English fallback is still visible to extraction tools.

- If the key is missing at runtime the user still sees meaningful text.

Add entries like this to every locale file:

```json
{
  "snackbar": {
    "bookingApproved": "Varaus hyväksytty",
    "bookingCancelled": "Varaus peruttu"
  }
}
```

---

## Accessibility notes

- Content is rendered inside MUI’s `SnackbarContent`, which already sets
  `role="alert"` – assistive tech is notified immediately.
- The progress bar is purely visual and intentionally marked
  `aria-hidden="true"` by MUI, keeping screen‑reader output concise.
- The close button is keyboard‑focusable (`IconButton`) and has an
  `aria-label="close"`.

---

## Troubleshooting

| Symptom                                                | Fix |
|--------------------------------------------------------|-----|
| **“Custom snackbar is not refForwarding”** runtime error | Ensure you are using **`useTranslatedSnackbar()`** and **not** passing the content component directly to `enqueueSnackbar`. The hook already forwards refs. |
| Snackbar shows wrong colour                            | Confirm your theme defines `primary.light` and the semantic colours. |
| Message doesn’t translate                              | Check the key in translation files and that `<I18nextProvider>` wraps your app. |

---

## Examples

See `NotificationTest.tsx` for a minimal test page with five buttons, one for
each variant. Copy it as a template for integration tests or storybook
stories.

```jsx
<Button
  variant="contained"
  color="error"
  onClick={() =>
    showSnackbar({
      message: t('snackbar.bookingRejected', { defaultValue: 'Booking rejected' }),
      variant: 'error',
    })
  }
>
  {t('snackbarTest.error', { defaultValue: 'Error' })}
</Button>
```

### Test It Out

Copy and paste this test into a new page and you can click the buttons to see each notification.

```jsx
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
            showSnackbar({
              message: t('snackbar.bookingApproved', { defaultValue: 'Booking approved' }),
              variant: 'success',
            })
          }
        >
          {t('snackbarTest.success', { defaultValue: 'Success' })}
        </Button>

        <Button
          variant="contained"
          color="warning"
          onClick={() =>
            showSnackbar({
              message: t('snackbar.bookingWarning', { defaultValue: 'Something needs attention' }),
              variant: 'warning',
            })
          }
        >
          {t('snackbarTest.warning', { defaultValue: 'Warning' })}
        </Button>

        <Button
          variant="contained"
          color="error"
          onClick={() =>
            showSnackbar({
              message: t('snackbar.bookingRejected', { defaultValue: 'Booking rejected' }),
              variant: 'error',
            })
          }
        >
          {t('snackbarTest.error', { defaultValue: 'Error' })}
        </Button>

        <Button
          variant="contained"
          color="info"
          onClick={() =>
            showSnackbar({
              message: t('snackbar.bookingInfo', { defaultValue: 'General information' }),
              variant: 'info',
            })
          }
        >
          {t('snackbarTest.info', { defaultValue: 'Info' })}
        </Button>

        <Button
          variant="contained"
          color="secondary"
          onClick={() =>
            showSnackbar({
              message: t('snackbar.bookingDefault', { defaultValue: 'Default notification' }),
              variant: 'default',
            })
          }
        >
          {t('snackbarTest.default', { defaultValue: 'Default' })}
        </Button>
      </Stack>
    </Container>
  );
};

export default NotificationTest;
```
Happy snacking 🥨