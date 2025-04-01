import { createBrowserRouter } from 'react-router-dom';
import Home from '../pages/Home';
<<<<<<< HEAD
import { AuthRedirect } from '../components/auth/AuthRedirect';
import LoginPage from '../pages/LoginPage';
import { NavBar } from '../components/NavBar';
import TestProtected from '../components/TestProtected';

=======
import ItemsPage from '../pages/Items';
>>>>>>> DEV

export const router = createBrowserRouter([
  {
    path: '/',
<<<<<<< HEAD
    element:(
      <>
      <NavBar/>
       <Home />
       </>
    )
  },
  {
    path: "/protected",
    element: (
      <TestProtected />
    )
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
=======
    element: <Home />,
  }, {
    path: '/items',
    element: <ItemsPage />
  }
>>>>>>> DEV
])