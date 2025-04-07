import { createBrowserRouter } from 'react-router-dom';
import Home from '../pages/Home';
import { AuthRedirect } from '../components/auth/AuthRedirect';
import LoginPage from '../pages/LoginPage';
import ItemsPage from '../pages/Items';
import { Layout } from '../pages/Layout';

export const router = createBrowserRouter([
  {
    path: '/',
    element:<Layout />,
    children: [
     {index: true, element : <Home />},
     { path: '/items', element: <ItemsPage /> },
    ]
  },

  {
    path: '/login',
    element:(
      <>
      <AuthRedirect />
     <LoginPage />
      </>
    )
  },
  
])