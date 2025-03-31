import { Box } from '@mui/material';
import { RouterProvider } from 'react-router-dom';
import { router } from './router/router';
import './App.css';


function App() {
  return (
    <Box>
      <RouterProvider router={router} />
    </Box>
  );
}

export default App
