import { createBrowserRouter } from 'react-router-dom';
import Home from '../pages/Home';
import { AuthRedirect } from '../components/auth/AuthRedirect';
import LoginPage from '../pages/LoginPage';
import { NavBar } from '../components/NavBar';
import TestProtected from '../components/TestProtected';


export const router = createBrowserRouter([
  {
    path: '/',
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
])