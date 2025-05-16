import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth'; // adjust import path if useAuth lives elsewhere
// Creatd this hook to redirect users based on their role
// but it takes a second for role to be defined so its not working how I want

/**
 * Redirects user if their role is not in `allowedRoles`.
 *
 * @param allowedRoles  Which roles are permitted to stay (default: ['Admin', 'Head Admin'])
 * @param fallback      Where to send the user. A negative number performs
 *                      `navigate(-1)`, otherwise it navigates to the given path.
 *
 * @example
 *   // Kick everyone except Admins back one page
 *   useAdminRedirect();
 *
 *   // Allow both Admin & Editor, send others to homepage
 *   useAdminRedirect(['Admin', 'Editor'], '/');
 *   
 *   // On an admin-only page where a bookmark could land someone here:
 *   useAdminRedirect(undefined, '/');      // keep default roles, send to homepage
 * 
 *   // On a page that only Editors should see:
 *   useAdminRedirect(['Editor'], '/');         // custom roles, send elsewhere
 * 
 */
export const useAdminRedirect = (
  allowedRoles: string[] = ['Admin', 'Head Admin'],
  fallback: number | string = -1,
) => {
  const { role } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (role && !allowedRoles.includes(role)) {
      if (typeof fallback === 'number') {
        navigate(fallback);
      } else {
        navigate(fallback, { replace: true });
      }
    }
  }, [role, allowedRoles, fallback, navigate]);
};