// Type definitions for custom commands
declare module "cypress"  {
    interface Chainable {
      loginAsUser(): Chainable;
      loginAsAdmin(): Chainable;
      addItemToCart(itemIndex?: number, quantity?: number, startDate?: string, endDate?: string): Chainable;
    }
  }
