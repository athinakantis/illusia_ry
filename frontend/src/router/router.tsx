import { createBrowserRouter } from 'react-router-dom';
import { AuthRedirect } from '../components/auth/AuthRedirect';
import LoginPage from '../pages/LoginPage';
import ItemsPage from '../pages/Items';
import Root from '../components/Root';
import Home from '../pages/Home';
import { SingleItem } from '../components/Admin/ItemView';
import AdminAddProduct from '../components/Admin/AdminAddProduct';
import AddItemForm from '../components/Admin/TestAddItem';


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
        path: '/items/:itemId',
        element: <SingleItem />
      },
      {
        path: '/items/new',
        element: <AdminAddProduct />
      },
      {
        path: '/test',
        element: <AddItemForm />
      },
    ]
  },


])