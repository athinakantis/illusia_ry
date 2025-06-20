import { createBrowserRouter } from 'react-router-dom';
import { AuthRedirect } from '../components/Auth/AuthRedirect';
import PhoneLogin from '../components/Auth/PhoneLogin';
import SingleBooking from '../pages/User/Booking'
import AuthCallbackHandler from '../components/CallbackHandler';
import Root from '../components/Root';
import Account from '../components/User/Account/Account';
import ItemDetail from '../components/User/ItemDetail';
import AdminAddProduct from '../pages/Admin/AdminAddProduct';
import AdminBookings from '../pages/Admin/AdminBookings';
import AdminDashboard from '../pages/Admin/AdminDashboard';
import ManageItems from '../pages/Admin/Items';
import ManageUsers from '../pages/Admin/ManageUsers';
import Cart from '../pages/Cart';
import Contacts from '../pages/Contact';
import Home from '../pages/Home';
import ItemsPage from '../pages/Items';
import LoginPage from '../pages/LoginPage';
import SingleItem from '../pages/Admin/ItemDetail';
import SystemLogsPage from '../pages/Admin/SystemLogs';
import UserBookings from '../pages/User/Bookings';


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
        path: "/auth/callback",
        element: <AuthCallbackHandler />
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
        path: '/manage/items',
        element: <ManageItems />
      },
      {
        path: '/cart',
        element: <Cart />
      },
      { // Admins view of single item
        path: '/items/manage/:itemId',
        element: <SingleItem />
      },
      { // Users view of single item
        path: '/items/:itemId',
        element: <ItemDetail />
      },
      {
        path: '/items/new',
        element: <AdminAddProduct />
      },
      {
        path: '/contacts',
        element: <Contacts />
      },
      {
        path: "/bookings",
        element: <UserBookings />
      }, {
        path: '/bookings/:booking_id',
        element: <SingleBooking />
      },
      {
        path: "/admin/dashboard",
        element: <AdminDashboard />
      },
      {
        path: "/admin/bookings",
        element: <AdminBookings />
      },
      {
        path: "/admin/users",
        element: <ManageUsers />
      },
      {
        path: "/admin/logs",
        element: <SystemLogsPage />
      },
      {
        path: "/account",
        element: <Account />
      },
      {
        path: "/phone-login",
        element: <PhoneLogin />
      }

    ]
  },


])