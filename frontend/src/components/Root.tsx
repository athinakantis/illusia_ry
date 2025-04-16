import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

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
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default Root;