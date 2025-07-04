import { createBrowserRouter } from 'react-router-dom';
import { AuthRedirect } from '../components/Auth/AuthRedirect';
import LoginPage from '../pages/LoginPage';
import ItemsPage from '../pages/Items';
import Root from '../components/Root';
import Home from '../pages/Home';
import SingleItem from '../components/Admin/ItemView/ItemView';
import AdminAddProduct from '../components/Admin/AddItem/AdminAddProduct';
import Cart from '../pages/Cart';
import ItemDetail from '../components/User/ItemDetail';
import UserBookings from '../components/User/UserBookings';
import AdminDashboard from '../components/Admin/AdminDashboard';
import AdminBookings from '../components/Admin/AdminBookings/AdminBookings';
import Account from '../components/User/Account/Account';
import SingleBooking from '../components/Booking';
import ManageUsers from '../components/Admin/ManageUsers';
import AuthCallbackHandler from '../components/CallbackHandler';
import SystemLogsPage from '../pages/SystemLogs';
import PhoneLogin from '../components/Auth/PhoneLogin';

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