import { Box } from '@mui/material';
import { RouterProvider } from 'react-router-dom';
import { router } from './router/router';
import './App.css';
import { NavBar } from './components/NavBar';
import { Provider } from 'react-redux';
import { store } from './store/store';

function App() {
  return (
    <Box>
      <NavBar />
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </Box>
  );
}

export default App
