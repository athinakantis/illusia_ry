import { createBrowserRouter } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Home from '../pages/Home';


const ProtectedRoute = ({ element }: { element: JSX.Element }) => {
  const session = useSelector((state: any) => state.auth.session);

  if (!session) return <div>Access Denied</div>;

  return element;
};

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/login',
    element: <Home />,
  },
  {
    path: '/protected',
    element: <ProtectedRoute element={<Home />} />,
  },
]);