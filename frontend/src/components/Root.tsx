import { Outlet } from 'react-router-dom';
import Header from './Header';

function Root() {
  return (
    <>
      <Header />
      <main
        style={{ minHeight: 'calc(100vh - 70px)', paddingTop: '3rem' }}>
        <Outlet />
      </main>
    </>
  )
}

export default Root;