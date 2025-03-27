import { Box } from '@mui/material';
import { RouterProvider } from 'react-router-dom';
import './App.css';

function App() {
  return (
    <Box>
      <NavBar />
      <RouterProvider router={router} />
    </Box>
  );
}

export default App
