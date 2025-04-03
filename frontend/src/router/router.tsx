import { createBrowserRouter } from 'react-router-dom';
import Home from '../pages/Home';
import { AuthRedirect } from '../components/auth/AuthRedirect';
import LoginPage from '../pages/LoginPage';
import { NavBar } from '../components/NavBar';
import ItemsPage from '../pages/Items';
import { ItemManager } from '../components/ItemManager';
import { ItemTester } from '../components/ItemCRUD';

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
    path: '/login',
    element:(
      <>
      <AuthRedirect />
     <LoginPage />
      </>
    )
  },
   {
    path: '/items',
    element: (
      <>
      <NavBar/>
      <ItemsPage />
      </>
    )
   },
   {
    path: "/protected",
    element: (
      <ItemManager />
    )
   }
   ,
   {
    path: "/crud",
    element: (
      <ItemTester />
    )
   }
])