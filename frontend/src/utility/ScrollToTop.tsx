import { FC, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
// Helper component to scroll to the top of the page when the route changes

const ScrollToTop: FC = () => {
    // Grabs the current pathname from React Router's useLocation hook
    const { pathname } = useLocation();
    useEffect(() => {
        // On route change, it scrolls the window to the top
        window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

export default ScrollToTop;