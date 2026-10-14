# Tattoo Studio – Backend API

REST API for a tattoo studio: customers can browse artists, book appointments, and review completed sessions. Artists manage their own bookings, profile and portfolio, and admins manage everything.

Built with **Node.js, Express and MongoDB (Mongoose)**.

## Features

- **Authentication** with JWT stored in an HTTP-only cookie, passwords hashed with bcrypt
- **Role-based access** for `user`, `artist` and `admin`
- **Account deactivation** that takes effect immediately, even for tokens that were already issued
- **Artist profiles** with bio, specialties, working days and working hours
- **Bookings** with validation for working days and hours, past dates, and **overlapping time slots**
- **Booking status flow** with enforced transitions (`pending` → `confirmed` → `completed`, or `cancelled`)
- **Reviews** that only customers with a `completed` booking can write (one review per booking), including an average rating per artist
- **Portfolio gallery** per artist (image URLs)
- Centralized error handling with consistent JSON error responses

## Tech Stack

| Area | Technology |
|---|---|
| Runtime | Node.js (ES modules) |
| Framework | Express |
| Database | MongoDB with Mongoose |
| Auth | jsonwebtoken, bcrypt, cookie-parser |
| Other | cors, dotenv |

## Getting Started

### Prerequisites

- Node.js 18 or newer
- A MongoDB database (local or MongoDB Atlas)

### Installation

```bash
git clone <repository-url>
cd server
npm install
```

### Environment variables

Copy `.env.example` to `.env` and fill in the values:

```
PORT=3000
MONGO_URI=
JWT_SECRET=
CLIENT_URL=http://localhost:5173
ADMIN_EMAIL=
ADMIN_PASSWORD=
```

| Variable | Description |
|---|---|
| `PORT` | Port the server runs on |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Long, random secret used to sign tokens |
| `CLIENT_URL` | Address of the frontend (needed for CORS and cookies) |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Credentials for the first admin account, used by the seed script |

### Create the first admin

```bash
npm run seed:admin
```

If a user with `ADMIN_EMAIL` already exists, that user is promoted to admin. Otherwise a new admin account is created. The script is safe to run more than once.

### Run the server

```bash
npm run dev
```

The API is available at `http://localhost:3000/api`.

## Roles and Typical Flow

1. A customer registers and logs in.
2. An admin gives the user the `artist` role (`PUT /api/users/update-role/:id`) and creates the artist profile (`POST /api/artists/create-profile`).
3. A customer books a time slot with an artist. The booking starts as `pending`.
4. The artist (or an admin) confirms the booking and later marks it as `completed`.
5. The customer can now write a review for that booking.

### Booking rules

- Date format is `YYYY-MM-DD`, times are `HH:MM`
- The date can not be in the past
- The artist must work on that weekday and within their working hours
- A time slot can not overlap with another booking of the same artist (cancelled bookings do not count)
- Customers can only **cancel** their own bookings; artists and admins can change the status of their bookings
- `completed` and `cancelled` are final states

## API Reference

All routes are prefixed with `/api`. Routes marked with a lock require a logged-in user (cookie or `Authorization: Bearer <token>`).

### Auth – `/api/auth`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/register` | Public | Create an account |
| POST | `/login` | Public | Log in and receive the auth cookie |
| POST | `/logout` | Public | Clear the auth cookie |
| PUT | `/change-password/:id` | 🔒 Own account | Change password |

### Users – `/api/users`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/me` | 🔒 User | Current user |
| GET | `/all-users` | 🔒 Admin | List all users |
| GET | `/user/:id` | 🔒 Own account or admin | Get a user |
| PUT | `/update-profile/:id` | 🔒 Own account | Update name, username, email, phone |
| PUT | `/update-role/:id` | 🔒 Admin | Set role (`user`, `artist`, `admin`) |
| PUT | `/deactivate/:id` | 🔒 Own account or admin | Deactivate an account |
| PUT | `/reactivate/:id` | 🔒 Admin | Reactivate an account |

### Artists – `/api/artists`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/create-profile` | 🔒 Admin | Create an artist profile for a user with the `artist` role |
| GET | `/all-artists` | Public | List active artists |
| GET | `/artist/:id` | Public | Get one artist |
| PUT | `/update-profile/:id` | 🔒 Profile owner or admin | Update bio, specialties, working days and hours, image |

`:id` is the ID of the **artist profile**, not of the user account.

### Bookings – `/api/bookings`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/create-booking` | 🔒 User | Book a time slot |
| GET | `/my-bookings` | 🔒 User | Own bookings, including a `hasReview` flag |
| GET | `/artist-bookings/:id` | 🔒 Artist (own) or admin | Bookings of an artist |
| GET | `/all-bookings` | 🔒 Admin | All bookings |
| PUT | `/update-booking-status/:id/status` | 🔒 Customer, artist or admin | Change the booking status |

Example request body for `POST /api/bookings/create-booking`:

```json
{
  "artist": "<artist profile id>",
  "date": "2026-11-09",
  "startTime": "14:00",
  "endTime": "16:00",
  "description": "Small compass tattoo on the left arm"
}
```

### Reviews – `/api/reviews`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/create-review` | 🔒 Customer of a completed booking | Write a review (`bookingId`, `rating` 1–5, `comment`) |
| GET | `/artist-reviews/:id` | Public | Reviews and average rating of an artist |
| GET | `/all-reviews` | 🔒 Admin | All reviews |
| DELETE | `/delete-review/:id` | 🔒 Admin | Delete a review |

### Portfolio – `/api/portfolio`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/artist-portfolio/:id` | Public | Gallery of an artist |
| POST | `/add-item` | 🔒 Artist (own gallery) or admin | Add an image URL (admins also send `artistId`) |
| DELETE | `/delete-item/:id` | 🔒 Item owner or admin | Remove an item |

## Error Responses

Errors are returned as JSON with a matching HTTP status code:

```json
{ "message": "This time slot is already booked" }
```

| Status | Meaning |
|---|---|
| 400 | Invalid input or a rule was violated |
| 401 | Not logged in or token invalid |
| 403 | Logged in, but not allowed to do this |
| 404 | Resource or route not found |
| 500 | Unexpected server error |

## Project Structure

```
server/
├── config/         Database connection
├── controller/     Request handlers
├── middlewares/    Auth, async handler, error handler
├── models/         Mongoose schemas
├── routes/         Route definitions
├── scripts/        seedAdmin.js
├── utils/          Token and error helpers
└── server.js       App entry point
```

## Author

Built by **Musa Çekcen** – [MCCreative Studio](https://www.mccreativestudio.de)