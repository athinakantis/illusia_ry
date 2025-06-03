describe('Protected Routes', () => {
  it('should redirect unauthenticated users from protected routes to login', () => {
    // Try to access a protected route
    cy.visit('/bookings');
    // Should redirect to login
    cy.url().should('include', '/login');
  });

  it('should allow authenticated users to access user routes', () => {
    // Login first using credentials directly
    cy.visit('/login');
    cy.get('input[name="email"]').type('user@cypress.com');
    cy.get('input[name="password"]').type('CreaTive1.');
    cy.contains("button", "Sign in").click();
    
    // Visit bookings page
    cy.visit('/bookings');
    // Should stay on bookings page
    cy.url().should('include', '/bookings');
  });

  it('should prevent regular users from accessing admin routes', () => {
    // Login as regular user
    cy.visit('/login');
    cy.get('input[name="email"]').type('user@cypress.com');
    cy.get('input[name="password"]').type('CreaTive1.');
    cy.contains("button", "Sign in").click();
    
    // Try to access admin dashboard
    cy.visit('/admin/dashboard');
    // Should redirect away from admin page
    cy.url().should('not.include', '/admin/dashboard');
  });

  it('should allow admins to access admin routes', () => {
    // Login as admin
    cy.visit('/login');
    cy.get('input[name="email"]').type('admin@cypress.com');
    cy.get('input[name="password"]').type('CreaTive1.');
    cy.contains("button", "Sign in").click();
    
    // Visit admin dashboard
    cy.visit('/admin/dashboard');
    // Should stay on admin dashboard
    cy.url().should('include', '/admin/dashboard');
  });
});
