import { createBrowserRouter } from 'react-router-dom';
import Home from '../pages/Home';
import { AuthRedirect } from '../components/auth/AuthRedirect';
import LoginPage from '../pages/LoginPage';
import ItemsPage from '../pages/Items'
import { ItemTester } from '../components/ItemCRUD';
import { MainLayout } from '../layout/MainLayout';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/items', element: <ItemsPage /> },
      { path: '/crud', element: <ItemTester /> },
    ],
  },
  {
    path: '/login',
    element: (
      <>
        <AuthRedirect />
        <LoginPage />
      </>
    ),
  },
]);
