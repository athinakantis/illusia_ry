import { Box } from '@mui/material';
import { RouterProvider } from 'react-router-dom';
import { router } from './router/router';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { SnackbarProvider } from 'notistack';


function App() {
  return (
    <Box>

      <Provider store={store}>
        <SnackbarProvider
          maxSnack={3}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          autoHideDuration={3000}
        >
          <RouterProvider router={router} >
          </RouterProvider>
        </ SnackbarProvider>
      </Provider>

    </Box >
  );
}

export default App
