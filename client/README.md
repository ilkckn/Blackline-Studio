# ◆ Blackline – Client

The React frontend of the [Blackline](../README.md) tattoo studio booking platform. It talks to the Express API in [`../server`](../server/README.md).

Built with **React 19, Vite, React Router 7 and Axios**. All styling is hand-written CSS, no component library or CSS framework.

## Getting started

```bash
npm install
npm run dev
```

The app runs at **http://localhost:5173**. The API must be running as well, see the [main README](../README.md#getting-started) for the full setup.

### Environment

Create a `.env` file in this folder:

```
VITE_API_URL=http://localhost:3000/api
```

| Variable | Description |
|---|---|
| `VITE_API_URL` | Base address of the API, including `/api`, without a trailing slash |

> Vite only exposes variables that start with `VITE_`, and it reads `.env` when the dev server starts. Restart `npm run dev` after changing it.

### Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server with hot reload |
| `npm run build` | Create an optimized production build in `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint |

## Pages and access

| Route | Page | Access |
|---|---|---|
| `/` | Landing page | Public |
| `/artists` | Artist directory | Public |
| `/artists/:id` | Artist profile with portfolio and reviews | Public |
| `/gallery` | Studio gallery with style filters and "Load more" | Public |
| `/reviews` | Latest reviews | Public |
| `/how-it-works` | Step-by-step guide, booking statuses, FAQ | Public |
| `/login`, `/register` | Sign in and sign up | Public (logged-in users are redirected) |
| `/booking` | Booking form (accepts `?artist=<id>`) | Logged in |
| `/my-bookings` | Own bookings, cancel, write a review | Logged in |
| `/profile` | Update details, change password, close account | Logged in |
| `/artist` | Bookings inbox: confirm, decline, complete, cancel | Artist |
| `/artist/profile` | Edit bio, specialties, working days and hours, photo | Artist |
| `/artist/portfolio` | Add and remove portfolio images | Artist |
| `/admin` | Users: roles, close and reopen accounts | Admin |
| `/admin/artists` | Create artist profiles | Admin |
| `/admin/bookings` | All bookings, filter by status | Admin |
| `/admin/reviews` | Review moderation | Admin |

Access is enforced by the server. The client only mirrors it so people land on the right page instead of seeing an error.

## How it is organized

```
src/
├── api/            Axios instance and one file per resource
├── components/     Reusable pieces (Navbar, Footer, ArtistCard, Stars, …)
├── contexts/       AuthContext
├── hooks/          Custom hooks (useMyArtistProfile)
├── layouts/        MainLayout, AuthLayout, DashboardLayout
├── pages/          One folder per page: Page.jsx next to Page.css
├── utils/          Small shared helpers
├── App.jsx         Route table
├── main.jsx        Entry point (Router and AuthProvider)
└── index.css       Design tokens, reset and shared classes
```

Each component or page lives in its own folder with its `.jsx` and `.css` side by side.

## Key concepts

### API layer

`api/axiosInstance.js` creates one Axios instance with the base URL and `withCredentials: true`, so the browser sends the HTTP-only auth cookie on every request. A response interceptor turns every error into a readable `error.message` (the server's own message when there is one), which the UI shows directly.

Each resource has its own small file (`artists.js`, `bookings.js`, `portfolio.js`, `reviews.js`, `users.js`). Components never build URLs themselves, they call functions like `getArtistById(id)`.

### Authentication

`AuthContext` restores the session on page load by asking the server who the cookie belongs to. It exposes:

```js
const { user, loading, login, register, logout, updateCurrentUser } = useAuth();
```

While `loading` is `true`, components that depend on the login state render a neutral placeholder, so nothing flickers between "logged out" and "logged in".

### Layouts and route guards

| Layout | Contains |
|---|---|
| `MainLayout` | Navbar, the page, Footer |
| `AuthLayout` | Logo and a centered card (login, register) |
| `DashboardLayout` | Sidebar (a top bar on small screens) and the page, for the artist and admin panels |

`ProtectedRoute` guards pages that need a login, optionally for specific roles. A logged-out visitor is sent to `/login` and brought back afterwards, including the query string.

### Data fetching pattern

Every section that loads data follows the same shape:

```jsx
const [state, setState] = useState({ status: "loading", items: [] });
// status is "loading", "done" or "error"
```

- **loading:** skeleton placeholders
- **error:** a short message (and a retry button where it makes sense)
- **empty:** a friendly message with a next step
- **done:** the content

Effects use an `ignore` flag in their cleanup, so a slow response can never overwrite newer state. Lists are updated in place after a change (cancel, delete, confirm) instead of reloading everything.

## Styling

- Plain CSS with **native nesting**, custom properties and `color-mix()`
- Design tokens (colors, gradients, radii, fonts, layout) live in `index.css`
- `html { font-size: 62.5% }`, so `1rem = 10px` and all sizes are written in `rem`
- Fluid type and spacing with `clamp()`
- Each page and component scopes its styles under its own root class (for example `.artist-detail { … }`), so names never clash
- Responsive and checked at 375, 390, 393, 414, 430, 560, 768, 820, 960, 1024, 1280 and wider
- `prefers-reduced-motion` is respected

### Fonts

[Big Shoulders](https://fonts.google.com/specimen/Big+Shoulders) for display text and [Instrument Sans](https://fonts.google.com/specimen/Instrument+Sans) for everything else, loaded from Google Fonts in `index.html`.

## Conventions

- **Fast refresh:** a file exports either components or helpers, never both (ESLint's `react-refresh/only-export-components` enforces it). Shared constants and functions go in separate `.js` files, for example `pages/AdminUsers/roles.js`.
- **Server first:** validation that matters (booking rules, permissions) is done on the server. The client repeats checks only for instant feedback.
- **Accessibility:** buttons that toggle state use `aria-pressed`, forms use real labels, messages use `role="alert"` or `role="status"`, and focus rings stay visible.

## Deployment notes

- Set `VITE_API_URL` to the production API address in the hosting provider's environment settings before building.
- The app uses `BrowserRouter`, so the host must serve `index.html` for every path. On Vercel that means a rewrite rule, otherwise a page refresh on `/artists` returns a 404.
- Cookies are cross-site in production (frontend and API on different domains), so the API must be served over HTTPS and its `CLIENT_URL` must match the frontend address exactly.