import { Box } from '@mui/material';
import { RouterProvider } from 'react-router-dom';
import { router } from './router/router';
import './App.css';
<<<<<<< HEAD

=======
import { NavBar } from './components/NavBar';
import { Provider } from 'react-redux';
import { store } from './store/store';
>>>>>>> DEV

function App() {
  return (
    <Box>
<<<<<<< HEAD
      <RouterProvider router={router} />
=======
      <NavBar />
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
>>>>>>> DEV
    </Box>
  );
}

export default App
