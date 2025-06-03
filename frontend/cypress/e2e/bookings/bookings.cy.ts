describe('Bookings', () => {
  beforeEach(() => {
    // Login as a user before testing bookings
    cy.visit('/login');
    cy.get('input[name="email"]').type(Cypress.env('CYPRESS_USER_EMAIL'));
    cy.get('input[name="password"]').type(Cypress.env('CYPRESS_USER_PASSWORD'));
    cy.get('button[type="submit"]').click();
    cy.url().should('not.include', '/login');
  });

  it('should display user bookings', () => {
    // Navigate to bookings page
    cy.visit('/bookings');
    
    // Verify bookings page loads
    cy.url().should('include', '/bookings');
    cy.get('h1, h2, h3').contains(/booking|reservation/i).should('be.visible');
    
    // Depending on if there are bookings, check the UI accordingly
    cy.get('body').then(($body) => {
      // If there are bookings, verify they appear
      if ($body.find('[class*="booking"], [class*="reservation"]').length > 0) {
        cy.get('[class*="booking"], [class*="reservation"]').should('be.visible');
      } else {
        // If no bookings, check for empty state
        cy.get('body').contains(/no booking|empty|haven't made/i).should('be.visible');
      }
    });
  });

  it('should create a booking from cart', () => {
    // First add an item to cart
    cy.visit('/items');
    cy.get('[class*="item"]').first().click();
    cy.get('input[type="date"], [role="textbox"]').first().type('2025-06-10');
    cy.get('input[type="date"], [role="textbox"]').eq(1).type('2025-06-15');
    cy.get('button').contains(/add|cart|book/i).click();
    
    // Go to cart
    cy.visit('/cart');
    
    // Proceed to checkout/booking
    cy.get('button').contains(/checkout|proceed|book|confirm/i).click();
    
    // Verify booking confirmation or redirect
    cy.url().should('include', '/bookings');
    
    // Verify success message
    cy.get('body').contains(/success|confirmed|created/i).should('be.visible');
  });

  it('should view booking details', () => {
    // Go to bookings page
    cy.visit('/bookings');
    
    // Click on a booking if any exist
    cy.get('body').then(($body) => {
      if ($body.find('[class*="booking"], [class*="reservation"]').length > 0) {
        // Click on the first booking
        cy.get('[class*="booking"], [class*="reservation"]').first().click();
        
        // Verify booking details page
        cy.url().should('include', '/bookings/');
        
        // Check for booking details
        cy.get('body').contains(/item|date|status/i).should('be.visible');
      }
    });
  });

  it('should cancel a booking', () => {
    // Go to bookings page
    cy.visit('/bookings');
    
    // Click on a booking if any exist
    cy.get('body').then(($body) => {
      if ($body.find('[class*="booking"], [class*="reservation"]').length > 0) {
        // Click on the first booking
        cy.get('[class*="booking"], [class*="reservation"]').first().click();
        
        // Look for cancel button and click if exists
        cy.get('body').then(($details) => {
          if ($details.find('button').filter(':contains("Cancel")').length > 0) {
            cy.get('button').contains(/cancel/i).click();
            
            // Confirm cancellation if a confirmation dialog appears
            cy.get('body').then(($dialog) => {
              if ($dialog.find('button').filter(':contains("Confirm")').length > 0) {
                cy.get('button').contains(/confirm|yes|ok/i).click();
              }
            });
            
            // Verify cancellation success
            cy.get('body').contains(/cancel|success/i).should('be.visible');
          }
        });
      }
    });
  });
});
