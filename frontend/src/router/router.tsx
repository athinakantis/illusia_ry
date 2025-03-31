import { createBrowserRouter } from 'react-router-dom';
import Home from '../pages/Home';
import ItemsPage from '../pages/Items';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  }, {
    path: '/items',
    element: <ItemsPage />
  }
])