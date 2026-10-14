<div align="center">

# ◆ Blackline

### A full-stack booking platform for a tattoo studio

Clients browse artists and book a slot. Artists run their own calendar, profile and portfolio. Admins keep everything in order.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-7-CA4245?logo=reactrouter&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white)

[Live demo](#live-demo) · [Features](#features) · [Getting started](#getting-started) · [Architecture](#architecture) · [API](#api-overview)

</div>

---

## Table of contents

- [◆ Blackline](#-blackline)
    - [A full-stack booking platform for a tattoo studio](#a-full-stack-booking-platform-for-a-tattoo-studio)
  - [Table of contents](#table-of-contents)
  - [About the project](#about-the-project)
  - [Screenshots](#screenshots)
  - [Live demo](#live-demo)
  - [Features](#features)
    - [For visitors](#for-visitors)
    - [For clients](#for-clients)
    - [For artists](#for-artists)
    - [For admins](#for-admins)
    - [Under the hood](#under-the-hood)
  - [Tech stack](#tech-stack)
  - [Getting started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [1. Clone the repository](#1-clone-the-repository)
    - [2. Set up the server](#2-set-up-the-server)
    - [3. Set up the client](#3-set-up-the-client)
  - [Try it out: a typical flow](#try-it-out-a-typical-flow)
  - [Architecture](#architecture)
    - [Authentication](#authentication)
    - [Routing and layouts](#routing-and-layouts)
    - [Booking lifecycle](#booking-lifecycle)
    - [Frontend data fetching](#frontend-data-fetching)
  - [Technical decisions](#technical-decisions)
  - [Design system](#design-system)
  - [API overview](#api-overview)
  - [Project structure](#project-structure)
  - [Roadmap](#roadmap)
  - [Author](#author)

---

## About the project

Blackline is a complete booking system for a tattoo studio, built as a **solo full-stack project**. Instead of endless direct messages, a client picks an artist, chooses a free slot inside the artist's working hours and sends a request. The artist confirms it, and after the session the client can leave a review.

The project covers the whole chain a real business needs:

- a public marketing site (landing page, artist profiles, gallery, reviews),
- an account system with three roles,
- a booking engine that **can't be double-booked**,
- and two dashboards: one for artists, one for admins.

It is also a portfolio piece for [MCCreative Studio](https://www.mccreativestudio.de), showing what a custom build for a local business can look like: no template, no UI kit, every component and every line of CSS written by hand.

## Screenshots

> Add your own screenshots to `docs/screenshots/` and keep the file names below, then they show up here.

| | |
|---|---|
| ![Landing page](docs/screenshots/landing.png) | ![Artist profile](docs/screenshots/artist-detail.png) |
| **Landing page** | **Artist profile with portfolio and reviews** |
| ![Booking form](docs/screenshots/booking.png) | ![My bookings](docs/screenshots/my-bookings.png) |
| **Booking form** | **Client: my bookings** |
| ![Artist panel](docs/screenshots/artist-panel.png) | ![Admin panel](docs/screenshots/admin-panel.png) |
| **Artist panel** | **Admin panel** |

<p align="center">
  <img src="docs/screenshots/mobile.png" alt="Mobile view" width="280" />
</p>

## Live demo

- ## Live demo

- **App:** https://blacklinetattoostudioproject.vercel.app/
- **API health check:** https://mccreative-blackline-api.onrender.com/api/health

> The API runs on a free Render instance that sleeps when idle, so the very first
> request can take up to a minute. After that, everything is fast.


## Features

### For visitors

- Landing page with the latest work, featured artists, how-it-works guide and recent reviews
- **Artist directory** and detailed artist pages with bio, specialties, working days and hours, portfolio and reviews with an average rating
- **Studio gallery** with style filters and a "Load more" button
- Public reviews page
- Fully responsive from 375px phones up to large desktops

### For clients

- Sign up and log in (session stays alive across page reloads)
- **Booking form** that shows the artist's working days and hours, and blocks past dates
- **My bookings** with upcoming and past tabs, cancel with confirmation
- **Write a review** after a completed session, with a clickable 1-5 star rating
- Profile page: update details, change password, close the account

### For artists

- **Bookings** inbox with Requests, Confirmed and History tabs. Confirm, decline, complete or cancel, with client name and phone
- **Profile editor**: bio, specialties, working days and hours, photo
- **Portfolio manager**: add and remove images, with live preview

### For admins

- **Users**: search, filter by role, give or remove the `artist` and `admin` roles (a person can be both), close and reopen accounts
- **Artists**: create artist profiles for users with the artist role
- **Bookings**: every booking across all artists, filter by status, step in on any of them
- **Reviews**: read everything, filter by rating, delete inappropriate reviews

### Under the hood

- Role-based access on the server **and** in the UI
- Closed accounts are locked out **immediately**, even if they still hold a valid token
- Booking rules enforced on the server: working days, working hours, no past dates, **no overlapping slots**, strict status transitions
- Loading skeletons, error states and empty states on every data-driven section
- Keyboard-friendly controls, `aria-*` attributes, and `prefers-reduced-motion` support

## Tech stack

| Area | Technology |
|---|---|
| **Frontend** | React 19, Vite, React Router 7, Axios, react-icons |
| **Styling** | Hand-written CSS: custom properties, native nesting, `color-mix()`, grid and flexbox. No CSS framework |
| **Backend** | Node.js (ES modules), Express |
| **Database** | MongoDB with Mongoose |
| **Auth** | JSON Web Tokens in an HTTP-only cookie, bcrypt for passwords |
| **Tooling** | ESLint, nodemon, dotenv |

## Getting started
git clone https://github.com/ilkckn/Blackline-Studio.git
cd Blackline-Studio

### Prerequisites

- Node.js 18 or newer
- A MongoDB database (local, or a free cluster on MongoDB Atlas)

### 1. Clone the repository

```bash
git clone <repository-url>
cd blackline
```

### 2. Set up the server

```bash
cd server
npm install
```

Create a `.env` file (you can copy `.env.example`):

```
PORT=3000
MONGO_URI=mongodb://localhost:27017/blackline
JWT_SECRET=replace-this-with-a-long-random-string
CLIENT_URL=http://localhost:5173
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=choose-a-strong-password
```

| Variable | Description |
|---|---|
| `PORT` | Port of the API |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Long random secret used to sign tokens |
| `CLIENT_URL` | Address of the frontend. Needed for CORS and cookies, must match exactly (no trailing slash) |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Credentials of the first admin, used by the seed script |

Create the first admin account and start the server:

```bash
npm run seed:admin
npm run dev
```

The API runs at `http://localhost:3000/api`. The seed script is safe to run more than once: if the user already exists, it is promoted to admin.

### 3. Set up the client

In a second terminal:

```bash
cd client
npm install
```

Create `client/.env`:

```
VITE_API_URL=http://localhost:3000/api
```

Start the app:

```bash
npm run dev
```

Open **http://localhost:5173**.

## Try it out: a typical flow

The app starts empty, so here is a quick path to see everything working:

1. **Log in as the admin** you created with the seed script.
2. In **Admin panel → Users**, register two more accounts first (via the normal sign-up page), then give one of them the **Artist** role.
3. In **Admin panel → Artists**, create an artist profile for that user.
4. Log in as the **artist** and open **Artist panel → Profile** to add a bio and specialties, and **Portfolio** to add a few image URLs.
5. Log in as a **client**, open the artist's page and **book a slot** inside their working hours.
6. As the **artist**, open **Bookings** and **confirm** the request. After the session, mark it as **completed**.
7. As the **client**, open **My bookings → Past** and **write a review**. It now appears on the artist's page and on the landing page.

## Architecture

```
┌────────────────────┐   HTTP + cookie    ┌───────────────────┐        ┌──────────┐
│  React (Vite)      │ ─────────────────▶ │  Express API      │ ─────▶ │ MongoDB  │
│  client/           │ ◀───────────────── │  server/          │ ◀───── │          │
└────────────────────┘      JSON          └───────────────────┘        └──────────┘
```

### Authentication

- On login the server signs a JWT and sends it in an **HTTP-only cookie**. JavaScript in the browser can't read it, which protects it from XSS.
- The Axios instance is created with `withCredentials: true`, so the browser attaches the cookie to every request. The server's CORS setup allows exactly the configured `CLIENT_URL` with credentials.
- On every protected request the `auth` middleware verifies the token **and loads the user from the database**, checking that the account still exists and is active. Deactivating an account therefore takes effect on the very next request.
- In the client, `AuthContext` restores the session on page load (`GET /users/me`) and shares `user`, `login`, `register` and `logout` with the whole app.

### Routing and layouts

Three layouts keep the route table simple:

| Layout | Used for | Contains |
|---|---|---|
| `MainLayout` | Public and client pages | Navbar, page, Footer |
| `AuthLayout` | Login and register | Logo and a centered card |
| `DashboardLayout` | Artist and admin panels | Sidebar (top bar on small screens) and page |

`ProtectedRoute` wraps pages that need a login (and optionally specific roles). Logged-out visitors are sent to `/login` and returned to the page they wanted, **including the query string** (`/booking?artist=…`).

### Booking lifecycle

```
              confirm                  complete
  pending ───────────────▶ confirmed ───────────────▶ completed
     │                         │
     │ cancel / decline        │ cancel
     ▼                         ▼
 cancelled ◀───────────────────┘
```

- Clients can only cancel their own bookings. Artists and admins can move bookings along the flow.
- `completed` and `cancelled` are final.
- Only a `completed` booking can be reviewed, and only once.

### Frontend data fetching

Every data-driven section follows the same small pattern, so behavior is predictable: a `status` of `loading`, `done` or `error`, skeleton placeholders while loading, a clear message on errors, and an empty state with a next step. Requests are cancelled-by-ignore with a cleanup flag, so a late response can never overwrite newer state.

## Technical decisions

A few choices worth explaining:

- **Server-side rules, client-side comfort.** Every booking rule (working hours, overlap, past dates, status transitions) is enforced on the server. The client repeats some checks only to give instant feedback and never relies on them.
- **Roles are an array.** A user can be a customer, an artist and an admin at the same time. Every account keeps the `user` role, and `artist` or `admin` are added on top. Checks use `includes`, not equality.
- **Overlap detection in one query.** A new booking conflicts with an existing one when `existing.start < new.end` and `existing.end > new.start`. Cancelled bookings are ignored.
- **Dates as `YYYY-MM-DD` strings and times as `HH:MM`.** This avoids time-zone shifts for a business that lives in one place, and string comparison works correctly for both formats.
- **Public vs. private data.** Public endpoints only return what visitors need. For example, public reviews show "Nursel B." while admins see the full name, and artists see a client's phone number but not their email.
- **One place for server errors.** A custom error class and a central error middleware turn validation errors, bad ids and duplicate keys into consistent `{ message }` responses that the client shows directly.
- **No UI library.** Components, layouts, form controls and the whole design system are hand-built, which keeps the bundle small and the look unique.

## Design system

Dark interface with a warm-to-violet gradient identity.

| Token | Value |
|---|---|
| Coral | `#ff5733` |
| Pink | `#ff2e7e` |
| Violet | `#9d4edd` |
| Amber | `#ffb020` |
| Background scale | `#0d0d11` to `#2d2d3b` |
| Display font | Big Shoulders |
| Text font | Instrument Sans |

- Layout built on `rem` units with `html { font-size: 62.5% }` (1rem = 10px)
- Fluid type and spacing with `clamp()`
- Designed and checked at 375, 390, 393, 414, 430, 560, 768, 820, 960, 1024, 1280 and wider
- Reusable motifs (sun, dagger, eye, moon, heart, flower, spiral, bolt, sparkles) drawn as inline SVG

## API overview

All routes are prefixed with `/api`. A full reference with request examples lives in [`server/README.md`](server/README.md).

| Area | Base path | Highlights |
|---|---|---|
| Auth | `/auth` | register, login, logout, change password |
| Users | `/users` | current user, update profile, roles, deactivate and reactivate (admin) |
| Artists | `/artists` | list, detail, create profile (admin), update profile |
| Bookings | `/bookings` | create, my bookings, artist bookings, all bookings (admin), status updates |
| Reviews | `/reviews` | create, artist reviews with average, latest, all (admin), delete |
| Portfolio | `/portfolio` | gallery with style filter and pagination, per-artist gallery, add, delete |

Errors are plain JSON with a matching status code:

```json
{ "message": "This time slot is already booked" }
```

## Project structure

```
blackline/
├── client/                     React app (Vite)
│   └── src/
│       ├── api/                Axios instance and one file per resource
│       ├── components/         Navbar, Footer, ArtistCard, Stars, RatingInput, …
│       ├── contexts/           AuthContext
│       ├── hooks/              useMyArtistProfile
│       ├── layouts/            MainLayout, AuthLayout, DashboardLayout
│       ├── pages/              One folder per page
│       │   ├── Landing/  Artists/  ArtistDetail/  Gallery/  Reviews/  HowItWorks/
│       │   ├── Booking/  MyBookings/  Profile/  SignIn/  SignUp/
│       │   ├── ArtistBookings/  ArtistProfile/  ArtistPortfolio/
│       │   └── AdminUsers/  AdminArtists/  AdminBookings/  AdminReviews/
│       └── utils/              Small shared helpers
└── server/                     Express API
    ├── config/                 Database connection
    ├── controller/             Request handlers
    ├── middlewares/            auth, admin, async handler, error handler
    ├── models/                 Mongoose schemas
    ├── routes/                 Route definitions
    ├── scripts/                seedAdmin.js
    ├── utils/                  Token and error helpers
    └── server.js               Entry point
```

## Roadmap

- [ ] Deployment (frontend on Vercel, API on a Node host, MongoDB Atlas)
- [ ] Real image uploads (Cloudinary or similar) instead of image URLs
- [ ] E-mail notifications for new, confirmed and cancelled bookings
- [ ] Calendar view for artists
- [ ] Pagination for the public reviews page
- [ ] Automated tests (API integration tests and component tests)
- [ ] German translation

## Author

Built by **Musa Çekcen**, founder of [MCCreative Studio](https://www.mccreativestudio.de), a web design and development studio for local businesses.

If you run a local business and want a site built the same way, get in touch through the studio website.