describe('Smoke Tests', () => {
  it('should load the home page', () => {
    cy.visit('/');
    cy.contains('h1').should('be.visible');
  });

  it('should navigate to items page', () => {
    cy.visit('/');
    cy.contains('Items').click();
    cy.url().should('include', '/items');
  });

  it('should load the login page', () => {
    cy.visit('/login');
    cy.get('form').should('be.visible');
  });

  it('should show footer information', () => {
    cy.visit('/');
    cy.get('footer').should('be.visible');
  });
});
