import { Outlet } from 'react-router-dom';
import { NavBar } from '../components/NavBar';
import { Box } from '@mui/material';

export const Layout = () => {
  return (
    <Box>
      <NavBar />
      <Outlet />
    </Box>
  );
};