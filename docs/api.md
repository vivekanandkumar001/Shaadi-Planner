# Shaadi Planner REST API Documentation (`/api/v1`)

## Authentication (`/api/v1/auth`)

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/api/v1/auth/register` | Register new user account | Public |
| `POST` | `/api/v1/auth/login` | Authenticate user and issue HttpOnly cookie | Public |
| `POST` | `/api/v1/auth/logout` | Invalidate current session and clear cookie | Cookie |
| `GET` | `/api/v1/auth/me` | Fetch authenticated user profile | Cookie |
| `POST` | `/api/v1/auth/forgot-password` | Send password reset instructions | Public |
| `POST` | `/api/v1/auth/reset-password` | Reset password using secret token | Public |
| `DELETE` | `/api/v1/auth/account` | Permanently delete user account | Cookie |

## Weddings (`/api/v1/weddings`)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/weddings` | List all user weddings |
| `POST` | `/api/v1/weddings` | Create a new wedding and seed default data |
| `GET` | `/api/v1/weddings/:id` | Fetch wedding details and dashboard metrics |
| `PUT` | `/api/v1/weddings/:id` | Update wedding configuration |
| `DELETE` | `/api/v1/weddings/:id` | Delete wedding |

## Planning Modules (`/api/v1/...`)

- `/api/v1/guests/:weddingId`: Guest list CRUD, RSVP tracking, side filters.
- `/api/v1/events/:weddingId`: Ceremony function timelines (Haldi, Sangeet, Vivah).
- `/api/v1/budget/:weddingId`: Financial summary and category allocation recalculation.
- `/api/v1/vendors/:weddingId`: Vendor directory and quoted vs paid payments.
- `/api/v1/tasks/:weddingId`: Checklist items with priorities and completion toggles.
- `/api/v1/seating/:weddingId`: Tables and seat assignment with server capacity validation.
- `/api/v1/menu/:weddingId`: Multi-course meal options and dietary tags.
- `/api/v1/shagun/:weddingId`: Private gift and cash tracking.
- `/api/v1/notes/:weddingId`: Wedding notes and pinned items.
- `/api/v1/shares/:weddingId`: Unpredictable random token share link creation and public view API.
- `/api/v1/exports/:weddingId/csv/:type`: CSV spreadsheet downloader.
- `/api/v1/search/:weddingId?q=...`: Global search across all entities.
- `/api/v1/migration/import`: Sync legacy localStorage data to PostgreSQL.
