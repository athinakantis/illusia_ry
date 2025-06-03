describe('Authentication', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('should allow a user to log in', () => {
    cy.get('input[name="email"]').type('user@cypress.com');
    cy.get('input[name="password"]').type('CreaTive1.');
    cy.contains("button", "Sign in").click();
    cy.url().should('not.include', '/login');
    
    // Check for elements that indicate successful login
    // For a regular user, they should see "My bookings" but not "Dashboard"
    cy.get('body').contains('Browse Items').should('be.visible');
    
    // Open the person menu to check for user-specific items
    cy.get('button[aria-label="Open profile menu"]').click();
    cy.contains('My bookings').should('be.visible');
    cy.contains('Dashboard').should('not.exist');
  });

  it('should allow an admin to log in', () => {
    cy.get('input[name="email"]').type('admin@cypress.com');
    cy.get('input[name="password"]').type('CreaTive1.');
    cy.contains("button", "Sign in").click();
    cy.url().should('not.include', '/login');
    
    // Check for admin-specific elements
    cy.get('body').contains('Browse Items').should('be.visible');
    
    // Open the person menu to check for admin-specific items
    cy.get('button[aria-label="Open navigation menu"]').click();
    cy.contains('My bookings').should('be.visible');
    cy.contains('Dashboard').should('be.visible');
    cy.contains('Manage Users').should('be.visible');
    cy.contains('Manage bookings').should('be.visible');
  });

  it('should show an error for invalid credentials', () => {
    cy.get('input[name="email"]').type('wrong@example.com');
    cy.get('input[name="password"]').type('wrongpassword');
    cy.contains("button", "Sign in").click();
    
    // Check for error message
    cy.contains('Invalid login credentials').should('be.visible');
  });

  it('should allow a user to log out', () => {
    // Log in first
    cy.get('input[name="email"]').type('user@cypress.com');
    cy.get('input[name="password"]').type('CreaTive1.');
    cy.contains("button", "Sign in").click();
    cy.url().should('not.include', '/login');
    
    // Find and click logout button/link in the person menu
    cy.get('button[aria-label="Open profile menu"]').click();
    cy.contains('Log out').click();
    
    // Verify redirect to login page
    cy.url().should('include', '/login');
  });
});
