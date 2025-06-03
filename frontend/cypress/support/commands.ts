/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// Type definitions for custom commands
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      loginAsUser(): Chainable;
      loginAsAdmin(): Chainable;
      addItemToCart(itemIndex?: number, quantity?: number, startDate?: string, endDate?: string): Chainable;
    }
  }
}
export {};

// Login as a regular user
Cypress.Commands.add('loginAsUser', () => {
  cy.visit('/login');
  cy.get('input[name="email"]').type(Cypress.env('CYPRESS_USER_EMAIL'));
  cy.get('input[name="password"]').type(Cypress.env('CYPRESS_USER_PASSWORD'));
  cy.get('button[type="submit"]').click();
  // Wait for login to complete and redirect
  cy.url().should('not.include', '/login');
});

// Login as an admin
Cypress.Commands.add('loginAsAdmin', () => {
  cy.visit('/login');
  cy.get('input[name="email"]').type(Cypress.env('CYPRESS_ADMIN_EMAIL'));
  cy.get('input[name="password"]').type(Cypress.env('CYPRESS_ADMIN_PASSWORD'));
  cy.get('button[type="submit"]').click();
  // Wait for login to complete and redirect
  cy.url().should('not.include', '/login');
});

// Add item to cart with specified quantity and date range
Cypress.Commands.add('addItemToCart', (itemIndex = 0, quantity = 1, startDate = '2025-06-10', endDate = '2025-06-15') => {
  // Navigate to items page if not already there
  cy.url().then((url) => {
    if (!url.includes('/items')) {
      cy.visit('/items');
    }
  });
  
  // Click on the item at the specified index
  cy.get('[data-cy="item-card"]').eq(itemIndex).click();
  
  // Set date range
  cy.get('[data-cy="start-date"]').type(startDate);
  cy.get('[data-cy="end-date"]').type(endDate);
  
  // Set quantity
  cy.get('[data-cy="quantity-input"]').clear().type(quantity.toString());
  
  // Add to cart
  cy.get('[data-cy="add-to-cart-button"]').click();
});
