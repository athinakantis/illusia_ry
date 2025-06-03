describe('Shopping Cart', () => {
  beforeEach(() => {
    // Clear localStorage to ensure clean state
    cy.clearLocalStorage();
    // Login as a regular user before testing cart functionality
    cy.visit('/login');
    cy.get('input[name="email"]').type(Cypress.env('CYPRESS_USER_EMAIL'));
    cy.get('input[name="password"]').type(Cypress.env('CYPRESS_USER_PASSWORD'));
    cy.get('button[type="submit"]').click();
    cy.url().should('not.include', '/login');
  });

  it('should add an item to the cart', () => {
    // Navigate to items page
    cy.visit('/items');
    
    // Click on the first item
    cy.get('[class*="item"]').first().click();
    
    // Select dates - using a more generic approach
    cy.get('input[type="date"], [role="textbox"]').first().type('2025-06-10');
    cy.get('input[type="date"], [role="textbox"]').eq(1).type('2025-06-15');
    
    // Set quantity - looking for any input that might be quantity
    cy.get('input[type="number"], [aria-label*="quantity"]').clear().type('2');
    
    // Add to cart - looking for any button that might add to cart
    cy.get('button').contains(/add|cart|book/i).click();
    
    // Verify item was added - look for indicators in the UI
    cy.get('[class*="badge"], [class*="counter"]').should('exist');
    
    // Go to cart
    cy.visit('/cart');
    
    // Verify item is in the cart
    cy.get('[class*="cart-item"], [class*="item"]').should('have.length.at.least', 1);
    
    // Verify quantity
    cy.get('[class*="quantity"]').should('contain', '2');
  });

  it('should remove an item from the cart', () => {
    // First navigate to items and add an item to cart
    cy.visit('/items');
    cy.get('[class*="item"]').first().click();
    cy.get('input[type="date"], [role="textbox"]').first().type('2025-06-10');
    cy.get('input[type="date"], [role="textbox"]').eq(1).type('2025-06-15');
    cy.get('button').contains(/add|cart|book/i).click();
    
    // Go to cart
    cy.visit('/cart');
    
    // Remove the item - look for any button that might remove items
    cy.get('button').contains(/remove|delete|trash/i).first().click();
    
    // Verify cart is empty - look for empty state indicators
    cy.get('[class*="empty"], [class*="no-items"]').should('exist');
    // Alternative check: verify no items exist
    cy.get('[class*="cart-item"], [class*="item"]').should('not.exist');
  });

  it('should persist cart items after page reload', () => {
    // First navigate to items and add an item to cart
    cy.visit('/items');
    cy.get('[class*="item"]').first().click();
    cy.get('input[type="date"], [role="textbox"]').first().type('2025-06-10');
    cy.get('input[type="date"], [role="textbox"]').eq(1).type('2025-06-15');
    cy.get('button').contains(/add|cart|book/i).click();
    
    // Reload the page
    cy.reload();
    
    // Go to cart and verify item still exists
    cy.visit('/cart');
    cy.get('[class*="cart-item"], [class*="item"]').should('have.length.at.least', 1);
  });

  it('should update item quantity in the cart', () => {
    // First navigate to items and add an item to cart
    cy.visit('/items');
    cy.get('[class*="item"]').first().click();
    cy.get('input[type="date"], [role="textbox"]').first().type('2025-06-10');
    cy.get('input[type="date"], [role="textbox"]').eq(1).type('2025-06-15');
    cy.get('button').contains(/add|cart|book/i).click();
    
    // Go to cart
    cy.visit('/cart');
    
    // Look for any element that might increase quantity
    cy.get('button').contains(/\+|add|increase/i).first().click();
    
    // Verify quantity updated - looking for any element that might show quantity
    cy.get('[class*="quantity"]').should('contain', '2');
  });
});
