describe('Admin Functionality', () => {
  beforeEach(() => {
    // Login as admin before testing admin functionality
    cy.visit('/login');
    cy.get('input[name="email"]').type(Cypress.env('CYPRESS_ADMIN_EMAIL'));
    cy.get('input[name="password"]').type(Cypress.env('CYPRESS_ADMIN_PASSWORD'));
    cy.get('button[type="submit"]').click();
    cy.url().should('not.include', '/login');
    
    // Navigate to admin dashboard
    cy.visit('/admin/dashboard');
    cy.url().should('include', '/admin/dashboard');
  });

  it('should display admin dashboard', () => {
    // Verify admin dashboard elements
    cy.get('h1, h2, h3').contains(/admin|dashboard/i).should('be.visible');
    
    // Check for common admin elements
    cy.get('body').contains(/bookings|users|items|categories/i).should('be.visible');
  });

  it('should manage items', () => {
    // Navigate to items management
    cy.contains(/items|manage items/i).click();
    
    // Verify items management page
    cy.url().should('include', '/items');
    
    // Check for item management elements
    cy.get('button').contains(/add|create|new/i).should('exist');
    
    // Click add new item button
    cy.get('button').contains(/add|create|new/i).click();
    
    // Verify add/edit item form
    cy.get('form').should('be.visible');
    cy.get('input[name="item_name"]').should('exist');
  });

  it('should manage bookings', () => {
    // Navigate to bookings management
    cy.contains(/bookings|manage bookings/i).click();
    
    // Verify bookings management page
    cy.url().should('include', '/bookings');
    
    // Check for booking management elements
    cy.get('table, [role="grid"]').should('be.visible');
    
    // Check if there are any bookings
    cy.get('body').then(($body) => {
      if ($body.find('table tbody tr, [role="row"]').length > 0) {
        // Click on a booking if any exist
        cy.get('table tbody tr, [role="row"]').first().click();
        
        // Verify booking details
        cy.get('button').contains(/approve|reject|cancel/i).should('exist');
      }
    });
  });

  it('should manage users', () => {
    // Navigate to users management
    cy.contains(/users|manage users/i).click();
    
    // Verify users management page
    cy.url().should('include', '/users');
    
    // Check for user management elements
    cy.get('table, [role="grid"]').should('be.visible');
    
    // Check if there are any users
    cy.get('body').then(($body) => {
      if ($body.find('table tbody tr, [role="row"]').length > 0) {
        // Verify user management actions
        cy.get('button, [role="button"]').contains(/edit|role|delete/i).should('exist');
      }
    });
  });

  it('should manage categories', () => {
    // Look for categories management - might be in items or its own section
    cy.get('body').then(($body) => {
      // Try to find and click on categories link
      if ($body.find('a, button').filter(':contains("Categories")').length > 0) {
        cy.contains(/categories/i).click();
        
        // Verify categories page
        cy.get('h1, h2, h3').contains(/categories/i).should('be.visible');
        
        // Check for category management elements
        cy.get('button').contains(/add|create|new/i).should('exist');
      } else {
        // If no direct categories link, look in items management
        cy.contains(/items|manage items/i).click();
        
        // Look for categories tab or section
        cy.get('body').then(($itemsPage) => {
          if ($itemsPage.find('a, button, tab').filter(':contains("Categories")').length > 0) {
            cy.contains(/categories/i).click();
            
            // Verify categories elements
            cy.get('button').contains(/add|create|new/i).should('exist');
          }
        });
      }
    });
  });
});
