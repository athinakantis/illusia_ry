
<!-- This is just a reminder of things the backend needs. -->

# Checklist

## ✅ Completed

- [X] Endpoint: `PATCH admin/users/:id/approve` – upgrade **Unapproved → User**
- [X] Endpoint: `PATCH admin/users/:id/promote-to-admin` – upgrade **User → Admin**
- [X] Endpoint: `PATCH admin/users/users/role` – Change **Role → Any Role**
- [X] Endpoint: `PATCH admin/users/users/status` – Change **User → 'approved' | 'rejected' | 'deactivated' | 'active'**
- [X] `GET /users` – list users

## 🛠️ In Progress / To‑Do

### 1. User & Role Management

- [ ] **Database**
  - [ ] Audit trigger for role/status changes
- [ ] **Emails**
  - [ ] Templates for account approved / rejected / deactivated
- [ ] **Tests**
  - [ ] Unit + integration tests for the above endpoints

### 2. Item Visibility

- [ ] Add `"hidden" boolean` column to `items`
- [ ] Endpoint: `PATCH /items/:id/visibility` – hide/unhide
- [ ] Unit + integration tests

### 3. Booking Management

- [ ] **Emails**
  - [ ] Templates: booking approved / rejected
  - [ ] Cron: Possibly send daily reminders for upcoming bookings
- [ ] **Tests**
  - [ ] Unit + integration

### 4. Category & Tag Management

- [ ] **Endpoints**
  - [ ] `POST /categories`
  - [ ] `DELETE /categories/:id`
  - [ ] `POST /tags`
  - [ ] `DELETE /tags/:id`
- [ ] **Tests**

### 5. System Logging & Audit

- [ ] Ensure every admin endpoint logs its action
- [ ] Ensure every Update/Insert/Delete endpoint logs its action
- [ ] Endpoint: `GET /logs` – paginated view
- [ ] Tests

## 🧩 Additional Features (low priority)

### Account Management

- [ ] Email & password registration
- [ ] OAuth with Google, GitHub
- [ ] Forgot‑password & reset flow

### Front‑end Form Handling

- [ ] Integrate React Hook Form
- [ ] Client‑side validation with Zod

### Security & Compliance

- [ ] Input sanitisation
- [ ] Rate limiting
- [ ] Encryption at rest & in transit

### Testing & CI

- [ ] > 80 % unit‑test coverage
- [ ] Supabase test instance for integration tests
- [ ] Cypress E2E tests in CI pipeline

<!-- Reminders:
Make more flexible endpoints that can filter the data through the endpoint.
-- find all categories for one item
SELECT c.*
FROM categories c
JOIN item_categories ic ON ic.category_id = c.id
WHERE ic.item_id = '3d3c…';

-- find all items that have a certain tag
SELECT i.*
FROM items i
JOIN item_tags it ON it.item_id = i.id
WHERE it.tag_id = '42fa…';
 -->