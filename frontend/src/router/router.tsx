import { createBrowserRouter } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Home from '../pages/Home';
import ProtectedPage from '../pages/ProtectedPage';

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
    path: '/protected',
    element: <ProtectedRoute element={<ProtectedPage />} />,
  },
]);