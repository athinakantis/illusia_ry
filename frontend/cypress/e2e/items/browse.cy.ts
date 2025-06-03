describe('Item Browsing', () => {
  beforeEach(() => {
    cy.visit('/items');
  });

  it('should display a list of items', () => {
    // Using a more generic selector to find item cards
    cy.get('[class*="item"]').should('have.length.at.least', 1);
  });

  it('should filter items by category', () => {
    // Assuming there's a category filter
    // Look for elements that might be category filters
    cy.get('button, select, [role="button"]').contains(/category|filter|sort/i).first().click({force: true});
    // Select the first option
    cy.get('li, option').first().click({force: true});
    
    // Verify filtered results
    cy.get('[class*="item"]').should('exist');
  });

  it('should search for items', () => {
    // Assuming there's a search input
    cy.get('input[type="text"], input[type="search"]').first().type('item{enter}');
    
    // Verify search results
    cy.get('[class*="item"]').should('exist');
  });

  it('should navigate to item details page', () => {
    cy.get('[class*="item"]').first().click();
    cy.url().should('include', '/items/');
    // Look for elements that would be on an item details page
    cy.get('h1, h2, h3').should('be.visible');
    cy.get('img').should('be.visible');
    cy.get('button').contains(/rent|book|add to cart/i).should('exist');
  });
});
