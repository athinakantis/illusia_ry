describe('Protected Routes', () => {
  it('should redirect unauthenticated users from protected routes to login', () => {
    // Try to access a protected route
    cy.visit('/bookings');
    // Should redirect to login
    cy.url().should('include', '/login');
  });

  it('should allow authenticated users to access user routes', () => {
    // Login first using custom command
    cy.loginAsUser();
    cy.visit('/bookings');
    // Should stay on bookings page
    cy.url().should('include', '/bookings');
  });

  it('should prevent regular users from accessing admin routes', () => {
    cy.loginAsUser();
    cy.visit('/admin/dashboard');
    // Should redirect away from admin page
    cy.url().should('not.include', '/admin/dashboard');
  });

  it('should allow admins to access admin routes', () => {
    cy.loginAsAdmin();
    cy.visit('/admin/dashboard');
    // Should stay on admin dashboard
    cy.url().should('include', '/admin/dashboard');
  });
});
