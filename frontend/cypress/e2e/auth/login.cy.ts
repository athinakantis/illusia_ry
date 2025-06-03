describe('Authentication', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('should allow a user to log in', () => {
    cy.get('input[name="email"]').type(Cypress.env('CYPRESS_USER_EMAIL'));
    cy.get('input[name="password"]').type(Cypress.env('CYPRESS_USER_PASSWORD'));
    cy.contains("button", "Sign in").click()   
    cy.url().should('not.include', '/login');
    cy.contains("a", "Browse Items").should('be.visible');
    // Check for elements that indicate successful login
   
  });

  it('should allow an admin to log in', () => {
    cy.get('input[name="email"]').type(Cypress.env('CYPRESS_ADMIN_EMAIL'));
    cy.get('input[name="password"]').type(Cypress.env('CYPRESS_ADMIN_PASSWORD'));
      cy.contains("button", "Sign in").click()   
    cy.url().should('not.include', '/login');
    // Check for admin-specific elements
    cy.contains('Admin').should('be.visible');
  });

  it('should show an error for invalid credentials', () => {
    cy.get('input[name="email"]').type('wrong@example.com');
    cy.get('input[name="password"]').type('wrongpassword');
      cy.contains("button", "Sign in").click()   
    // Check for error message
    cy.contains('Invalid login credentials').should('be.visible');
  });

  it('should allow a user to log out', () => {
    // Log in first
    cy.get('input[name="email"]').type(Cypress.env('CYPRESS_USER_EMAIL'));
    cy.get('input[name="password"]').type(Cypress.env('CYPRESS_USER_PASSWORD'));
        cy.contains("button", "Sign in").click()   
    cy.url().should('not.include', '/login');
    
    // Find and click logout button/link
    cy.contains('Logout').first().click();
    // Verify redirect to login page or home page for guests
    cy.url().should('include', '/login');
  }); 
});
