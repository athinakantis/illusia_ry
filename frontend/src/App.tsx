import { Box } from '@mui/material';
import { RouterProvider } from 'react-router-dom';
import { router } from './router/router';
import './App.css';
import { NavBar } from './components/NavBar';

function App() {
  return (
    <Box>
      <NavBar />
      <RouterProvider router={router} />
    </Box>
  );
}

export default App
