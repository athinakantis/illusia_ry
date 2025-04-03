import { createBrowserRouter } from 'react-router-dom';
import Home from '../pages/Home';
import { AuthRedirect } from '../components/auth/AuthRedirect';
import LoginPage from '../pages/LoginPage';
import { NavBar } from '../components/NavBar';
import ItemsPage from '../pages/Items';
<<<<<<< Updated upstream
import { TableViewer } from '../components/Test/TableViewer';
import { ItemManager } from '../components/Test/ItemManager';
=======
import { ItemManager } from '../components/ItemManager';
import { ItemTester } from '../components/ItemCRUD';
>>>>>>> Stashed changes

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
<<<<<<< Updated upstream
    path: "/test",
    element: (
      <TableViewer endpoint='/protected-data' title="Protected Test Data" />
=======
    path: "/protected",
    element: (
      <ItemManager />
>>>>>>> Stashed changes
    )
   }
   ,
   {
<<<<<<< Updated upstream
    path: "/item-manager",
    element: (
      <ItemManager/>
=======
    path: "/crud",
    element: (
      <ItemTester />
>>>>>>> Stashed changes
    )
   }
])