# Cypress Tests for Illusia Frontend

This directory contains end-to-end tests for the Illusia frontend application using Cypress.

## Test Structure

The tests are organized into the following categories:

- `smoke.cy.ts`: Basic smoke tests to verify critical pages load correctly
- `auth/`: Authentication-related tests (login, logout, protected routes)
- `items/`: Tests for item browsing and filtering
- `cart/`: Tests for shopping cart functionality
- `bookings/`: Tests for booking creation and management
- `admin/`: Tests for admin functionality

## Setup

1. Make sure you have the following environment variables set in your `.env` file:

```
VITE_CYPRESS_USER_EMAIL=user@cypress.com
VITE_CYPRESS_USER_PASSWORD=CreaTive1.
VITE_CYPRESS_ADMIN_EMAIL=admin@cypress.com
VITE_CYPRESS_ADMIN_PASSWORD=CreaTive1.
```

2. Ensure you have set up test accounts in Supabase with these credentials and appropriate roles.

## Running Tests

### Opening Cypress Test Runner

```bash
npx cypress open
```

This will open the Cypress Test Runner, where you can select which tests to run.

### Running Tests Headlessly

```bash
npx cypress run
```

This will run all tests headlessly in the terminal.

### Running Specific Tests

```bash
npx cypress run --spec "cypress/e2e/smoke.cy.ts"
```

Replace the path with the specific test file you want to run.

## Test Selectors

These tests use a combination of:

1. Data attributes (like `[data-cy="item-card"]`) - these are recommended for your components
2. Generic selectors as fallbacks (like `[class*="item"]`)
3. Text content selectors (like `contains(/login/i)`)

For better test reliability, consider adding `data-cy` attributes to your key UI elements.

## Custom Commands

The following custom commands are available:

- `cy.loginAsUser()`: Logs in as a regular user
- `cy.loginAsAdmin()`: Logs in as an admin user
- `cy.addItemToCart(itemIndex, quantity, startDate, endDate)`: Adds an item to the cart

## Adding New Tests

When adding new tests:

1. Create a new `.cy.ts` file in the appropriate directory
2. Use the existing test files as templates
3. Consider adding custom commands for repetitive tasks

## Debugging Tips

1. Use `cy.debug()` to pause test execution at a specific point
2. Use `cy.log('message')` to add debugging information to the test output
3. Check the Cypress screenshot and video recordings after test failures
