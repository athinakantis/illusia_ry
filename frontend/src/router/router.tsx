import { createBrowserRouter } from 'react-router-dom';
import { AuthRedirect } from '../components/auth/AuthRedirect';
import LoginPage from '../pages/LoginPage';
import ItemsPage from '../pages/Items';
import Root from '../components/Root';
import Home from '../pages/Home';
import Cart from '../pages/Cart';
import ItemsWithGenericTable from '../pages/ItemsWithGenericTable';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        path: '/',
        element: <Home />
      },
      {
        path: '/login',
        element: (
          <>
            <AuthRedirect />
            <LoginPage />
          </>
        )
      },
      {
        path: '/items',
        element: <ItemsPage />
      },
      {
        path: '/cart',
        element: <Cart />
      },
      {
        path: '/itemsWithGenericTable',
        element: <ItemsWithGenericTable />
      }

    ]
  },


])