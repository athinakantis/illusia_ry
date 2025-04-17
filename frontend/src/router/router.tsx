import { createBrowserRouter } from 'react-router-dom';
import { AuthRedirect } from '../components/Auth/AuthRedirect';
import LoginPage from '../pages/LoginPage';
import ItemsPage from '../pages/Items';
import Root from '../components/Root';
import Home from '../pages/Home';
import EditItem from '../components/Admin/ItemView';
import AdminAddProduct from '../components/Admin/AdminAddProduct';
import Cart from '../pages/Cart';
import ItemDetail from '../components/User/ItemDetail';

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
        path: '/items/edit/:itemId',
        element: <EditItem />
      },
      {
        path: '/items/:itemId',
        element: <ItemDetail />
      },
      {
        path: '/items/new',
        element: <AdminAddProduct />
      },

    ]
  },


])