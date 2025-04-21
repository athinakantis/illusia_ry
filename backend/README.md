<file name=1 path=/Users/s2400784/REACT24/2GroupProject2/illusia_ry/backend/README.md><p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
</p>

## Project setup

Create .env file in ✅backend/ ( ❌src/ )

```sh
SUPABASE_URL=SUPABASE_URL
SUPABASE_ANON_KEY=YourKey
SUPABASE_SERVICE_ROLE_KEY=ServiceRoleKey
```

```bash
# Install packages
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## **Endpoints**

Check these endpoints after starting the server to make sure everything is working OK.

You can access these easily by **copying the urls into your browser**.

### Using the Anon key

These endpoints are using the **Anon** key and I think you need to **authenticate** with Supabase before you would be able to see any of the tables. We probably need to set that up.

```html
http://localhost:5001

http://localhost:5001/test/supabase
```

### Using the Service Role key

These endpoints are using the **Servic Role** key and basically have access to **perform CRUD** if needed.

```html
http://localhost:5001/test-role/admins

http://localhost:5001/test-role/users
```

---

### `/items` API

These endpoints are protected and require a valid Bearer token. All responses follow the `APIResponse<T>` format.

#### `GET /items`

- **Returns**: `APIResponse<Tables<'items'>[]>`
- **Description**: Fetch all items.
- **Data**: Array of item objects.

#### `POST /items`

- **Returns**: `APIResponse<Tables<'items'>>`
- **Description**: Add a new item.
- **Data**: The inserted item object.

#### `PATCH /items/:id`

- **Returns**: `APIResponse<Tables<'items'>>`
- **Description**: Update an existing item.
- **Data**: The updated item object.

#### `DELETE /items/:id`

- **Returns**: `APIResponse<Tables<'items'>>`
- **Description**: Delete an existing item.
- **Data**: The deleted item object.

### `/views` API

These endpoints are protected and require a valid Bearer token. All responses follow the `APIResponse<T>` format.

#### `GET /frontend-items`

- **Returns**: `APIResponse<Tables<'items'>[]>`
- **Description**: Fetch all items.
- **Data**: Array of items with tags and categories

## **Bookings API**

### `/bookings` API

These routes are public and accessible **without authentication** for now so we can easily get to testing.

This is easy to switch to the authenticated version by just uncommenting certain code.

#### `GET /bookings`

- **Description**: Retrieve **all bookings** in the system.
- **Data**: Array of booking objects.

---

#### `GET /bookings/:id`

- **Description**: Retrieve a **specific booking** by its `booking_id`.
- **Params**:
  - `id` — UUID of the booking.
- **Data**: Single booking object.

---

#### `GET /bookings/user/:userId`

- **Description**: Retrieve all bookings created by a **specific user**.
- **Params**:
  - `userId` — UUID of the user.
- **Data**: Array of bookings made by the user.

---

#### `GET /bookings/item/:itemId`

- **Description**: Retrieve all bookings for a **specific item**.
- **Params**:
  - `itemId` — UUID of the item.
- **Data**: Array of bookings tied to the item.

---

#### `GET /bookings/date/:date`

- **Description**: Retrieve bookings that are **active on a specific date** (where `start_date <= date <= end_date`).
- **Params**:
  - `date` — ISO date string (`YYYY-MM-DD`)
- **Data**: Array of active bookings on that date.

#### `POST /bookings/empty`

- **Description**: Creates an empty booking to be updated later with items
- **Params**:
  - `uuid` — UUID of the user
- **Returns:**

```json
{
    "message": "Empty booking created successfully",
    "data": {
        "booking_id": "686c2879-870a-4dc0-a57c-eeeb777b8e3a",
        "user_id": "6d6b537c-e38e-4109-ae8c-2b22a56e836b",
        "status": "pending",
        "created_at": "2025-04-15T09:37:02.944561"
    }
}
```

#### `POST /bookings/rpc`

- **Description**: Adding a booking with a list of items already attached to it and checks if any item attached is still in stock during the date set in the start-end dates.
- **Note** When we get the UI set up for testing you wont have to send the user_id anymore, it will be taken from the request in the backend.

- **Post Example:**:

```json
{
  "user_id": "6d6b537c-e38e-4109-ae8c-2b22a56e836b",
  "items": [
    {
      "item_id": "07571c0b-ace8-4db4-842c-138a690dc7a3",
      "start_date": "2025-04-20",
      "end_date": "2025-04-24",
      "quantity": 1
    },
    {
      "item_id": "07571c0b-ace8-4db4-842c-138a690dc7a3",
      "start_date": "2025-04-22",
      "end_date": "2025-04-26",
      "quantity": 1
    }
  ]
}
```

- **Returns:**

```json
{
    "status": "created",
    "booking_id": "5498a4fd-d00d-41ab-a2e5-2c0a1cae7cc3"
}

OR

{
    "message": "Not enough stock for item 07571c0b-ace8-4db4-842c-138a690dc7a3, only 0 left during selected dates",
    "error": "Bad Request",
    "statusCode": 400
}
```

---

#### `POST /bookings/:id/review`

- **Description**: Reviews all item reservations in a booking and checks for availability conflicts. Returns a list of issues if any item is overbooked during the selected date ranges.
- **Params**:
  - `id` — UUID of the booking to be reviewed.
- **Returns:**

```json
{
  "message": "Availability review completed",
  "data": {
    "booking_id": "686c2879-870a-4dc0-a57c-eeeb777b8e3a",
    "status": "fail",
    "issues": [
      "Reservation f9ac2...: Item 07571... only has -3 left during 2025-05-01 - 2025-05-04"
    ]
  }
}
```

If no issues:

```json
{
  "message": "Availability review completed",
  "data": {
    "booking_id": "abc123",
    "status": "ok",
    "issues": []
  }
}
```

#### `PATCH /bookings/:id`

- **Description**: Update the **status** field of an existing booking.  
- **Body**  

  ```json
  { "status": "approved" }
  ```

- **Params**:
  - `id` — UUID of the booking to be updated.
  
  Accepted values depend on what we decide together. (e.g. `pending`, `approved`, `cancelled`).  
- **Returns** `APIResponse<Tables<'bookings'>>` with the updated booking row.

## **Reservations API**

### `/reservations` API

#### `POST /reservations`

- **Description**: Create a new reservation for a given booking.
- **Params**:
  - `booking_id` — UUID of the booking.
  - `item_id` — UUID of the item.
  - `start_date` — Start date of the reservation.
  - `end_date` — End date of the reservation.
  - `quantity` — Quantity of items to reserve.
- **Returns:**

```json
{
    "message": "Reservation created successfully",
    "data": {
        "booking_id": "some-booking-id",
        "item_id": "some-item-id",
        "start_date": "2025-04-20",
        "end_date": "2025-04-24",
        "quantity": 1
    }
}
```

#### `PATCH /reservations/booking/:bookingId/:reservationId`

- **Description**: Update an existing item reservation that belongs to a specific booking.
- **URL params**  
  - `bookingId` — UUID of the parent booking  
  - `reservationId` — UUID of the reservation row to update  
- **Headers**  
  - `Authorization: Bearer <JWT>`  
  - `Content‑Type: application/json`
- **Body** – any combination of the editable fields  

  ```json5
  {
    "item_id":    "07571c0b-ace8-4db4-842c-138a690dc7a3", // optional
    "start_date": "2025-09-01",                           // optional
    "end_date":   "2025-09-10",                           // optional
    "quantity":    2                                      // optional, min 1
  }
  ```

- **Validation rules**  
  - If `start_date` **and** `end_date` are present, the period must not exceed **14 days**.  
  - `quantity` must be ≥ 1.  
- **Returns** `APIResponse<Tables<'item_reservations'>>`  
 
  ```json
  {
    "message": "Reservation updated successfully",
    "data": {
      "id": "...",
      "booking_id": "...",
      "item_id": "07571c0b-ace8-4db4-842c-138a690dc7a3",
      "start_date": "2025-09-01",
      "end_date":   "2025-09-10",
      "quantity":    2,
      "created_at":  "2025-04-22T12:34:56.000Z"
    }
  }
  ```

- **Errors**  
  - `400 Bad Request` – empty payload, period > 14 days, or RLS/validation failure  
  - `404 Not Found` – reservation or booking does not exist / not accessible

---

#### `DELETE /reservations/booking/:bookingId`

- **Description**: Delete one or more reservations that belong to the specified booking.
- **URL params**  
  - `bookingId` — UUID of the booking  
- **Headers**  
  - `Authorization: Bearer <JWT>`  
  - `Content‑Type: application/json`
- **Body** – list of reservation IDs to remove  
  
  ```json
  {
    "reservationIds": [
      "123e4567-e89b-12d3-a456-426614174001",
      "123e4567-e89b-12d3-a456-426614174002"
    ]
  }
  ```

- **Returns**

  ```json
  {
    "message": "Reservations deleted successfully",
    "data": {
      "deleted": 2,
      "deletedItems": [
        { "id": "123e4567-e89b-12d3-a456-426614174001", "...": "..." },
        { "id": "123e4567-e89b-12d3-a456-426614174002", "...": "..." }
      ]
    }
  }
  ```

- **Errors**  
  - `400 Bad Request` – body missing `reservationIds`, not all rows deleted  
  - `404 Not Found` – booking not found or reservations don’t belong to booking

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).


## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
</file>
