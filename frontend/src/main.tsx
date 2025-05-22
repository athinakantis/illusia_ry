import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './i18n';
import App from './App.tsx';
import { ThemeProvider } from './context/ThemeProvider.tsx';
import { CssBaseline } from '@mui/material';
import { AuthProvider } from './context/AuthProvider.tsx';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <I18nextProvider i18n={i18n}>
      <ThemeProvider>
        <CssBaseline />
        <AuthProvider>
          <App />
        </AuthProvider>
      </ThemeProvider>
    </I18nextProvider>
  </StrictMode>,
);
