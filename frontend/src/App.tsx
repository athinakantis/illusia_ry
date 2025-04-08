import { Box } from '@mui/material';
import { RouterProvider } from 'react-router-dom';
import { router } from './router/router';
import { Provider } from 'react-redux';
import { store } from './store/store';

function App() {
  return (
    <Box>
      <Provider store={store}>
        <RouterProvider router={router} >
        </RouterProvider>
      </Provider>
    </Box>
  );
}

export default App
