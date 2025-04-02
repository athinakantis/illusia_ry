import { createBrowserRouter } from 'react-router-dom';
import Home from '../pages/Home';
import { AuthRedirect } from '../components/auth/AuthRedirect';
import LoginPage from '../pages/LoginPage';
import { NavBar } from '../components/NavBar';

import ItemsPage from '../pages/Items';
import { TableViewer } from '../components/Test/TableViewer';
import { ItemManager } from '../components/Test/ItemManager';

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
    path: "/test",
    element: (
      <TableViewer endpoint='/protected-data' title="Protected Test Data" />
    )
   }
   ,
   {
    path: "/item-manager",
    element: (
      <ItemManager/>
    )
   }
])