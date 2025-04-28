import { Outlet } from 'react-router-dom';
import Header from './Header/Header';
import Footer from './Footer';
import { Snackbar } from './Snackbar';
import ScrollToTop from '../utility/ScrollToTop';

function Root() {

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh', // Ensure the layout takes the full viewport height
      }}
    >
      <Header />
      <main
        style={{
          flexGrow: 1, // Allow the main content to grow and fill available space
          paddingTop: '3rem',
          paddingBottom: '3rem',
        }}
      >
        {/* Component that scrolls to top of page when navigating */}
        <ScrollToTop />
        <Outlet />
      </main>
      <Footer />
      <Snackbar />
    </div>
  )
}

export default Root;