# Influence Platform: Frontend

React + TypeScript + Vite + Tailwind CSS.

## Run locally

```bash
npm install
npm run dev
```

The app opens at http://localhost:3000. The backend (`influencer_backend`) must also be running on port 5000.

## How the frontend reaches the backend

The app always calls `/api/...` on its own domain, so no environment variable is needed:

- Locally, the Vite dev server proxies `/api` to `http://localhost:5000` (see `vite.config.ts`).
- On Vercel, `vercel.json` rewrites `/api/*` to `https://influencer-backend.vercel.app/api/*`.

## Folder structure

```
src/
├─ api/          axios instance (backend se baat karne ke liye)
├─ api/auth.ts   register / login / logout / me calls
├─ api/people.ts people search, profile, taxonomy calls
├─ components/   reusable UI pieces (Navbar, Footer, Layout, FormField, ProtectedRoute)
├─ pages/        full pages, one per route (Home, Search, Profile, Login, Register, Dashboard, NotFound)
├─ context/      AuthProvider (who is logged in)
├─ hooks/        custom hooks (useAuth, useTaxonomy)
├─ types/        TypeScript types (API response, User)
├─ constants/    app-wide constants (PLATFORM_NAME, signup roles)
├─ utils/        helpers (backend error messages, number / country / language formatting)
├─ App.tsx       routes
└─ main.tsx      entry point (providers)
```

## Auth

- `useAuth()` gives `user`, `isLoading`, `login`, `register`, `logout`.
- Wrap a page in `<ProtectedRoute>` (optionally `roles={['business']}`) to require login.
- Tokens are httpOnly cookies set by the backend. When the access token expires, `api/axios.ts` calls `/auth/refresh` once and retries the request.

## Pages

| URL | Page |
|---|---|
| `/` | Home: search bar, browse by industry, most followed |
| `/search?q=&profession=&industry=&topic=&country=&city=&language=&minFollowers=&status=&sort=&page=` | Search with filters. All filters live in the URL, so results can be shared and the back button works |
| `/browse` | Browse by industry, profession, topic and country |
| `/people/:slug` | Public profile (Claim button for talents) |
| `/people/:slug/claim` | Talent only: send a claim with proof |
| `/dashboard/profile/edit` | Talent only: edit the profile you own |
| `/dashboard` | Logged-in home per account type. Talent sees their profile / claim status and incoming hire requests (accept / decline). Business sees its verification status and the hire requests it sent. Admins get People and Claim requests tabs |
| `/dashboard/business` | Business only: send company details for verification (or edit them) |
| `/dashboard/people/new`, `/dashboard/people/:id/edit` | Admin only: create or edit a profile |

## Business verification and hiring

A business account fills in its company details at `/dashboard/business`. An admin verifies or rejects it at `/admin/businesses`. Only a verified business sees an active **Hire** button on a profile, and only on verified talents (claimed + verified badge). Everyone else still sees the disabled "Contact / Hire" button. The talent accepts or declines the request on their dashboard. Code lives in `src/components/business/`, `src/api/business.ts` and `src/types/business.ts`.

## Navigation

All navbar links live in `src/constants/navigation.ts` (`MAIN_NAV`, `UTILITY_NAV`, `ACCOUNT_NAV`), each with the roles that can see it. Pages that are planned but not built yet (`/inbox`, `/shortlists`, `/talents`) show a "Coming soon" page.

## Admin panel (`/admin`)

Admins only (`ProtectedRoute roles={['admin']}`). Sidebar: Dashboard, Claims, Businesses, Users, Reports, Audit log.

| URL | Page |
|---|---|
| `/admin` | Overview: claims needing action, open reports, users, profiles |
| `/admin/claims`, `/admin/claims/:id` | Claims table (status filter) and detail: evidence, code, approve/reject |
| `/admin/businesses`, `/admin/businesses/:id` | Business verification queue and detail: company details, verify / reject / revoke |
| `/admin/users` | Search, role/status filter, change role, suspend/unsuspend |
| `/admin/reports`, `/admin/reports/:id` | Reports queue and detail: status, admin note, takedown |
| `/admin/audit-logs` | Read-only audit log with filters and before/after view |
| `/people/:slug/report` | Public "Report an error or request removal" form |

The older admin dashboard at `/dashboard` (profile cards, create/edit) is unchanged.

## i18n

`react-i18next` with English, Urdu and Arabic in `src/i18n/locales/*.json`. The admin panel has a language switch; Urdu and Arabic set `dir="rtl"` on the admin area. Use `t('key')` for new strings and add the key to all three files.

## Author

Built and maintained by [Hammad Toufeeq](https://github.com/hammadtoufeeq).
