# Shaadi Planner — Full-Stack Wedding Planning SaaS Platform

**Shaadi Planner** is a full-stack wedding planning platform designed for Indian weddings. It brings budget management, guest RSVPs, vendor bookings, ceremony timelines, seating arrangements, menu courses, shagun tracking, notes, global search, and data exports into a single cloud platform.

Repository: `vivekanandkumar001/Shaadi-Planner`

---

## 🌟 Key Features

- **Best-in-Class Landing Page**: Hero, trust badges, 10 core service cards, Excel vs Shaadi Planner matrix, interactive dashboard preview, FAQ, and legal pages.
- **Secure Authentication & Authorization**: Cookie-based HttpOnly session architecture with bcryptjs hashing, registration, login, logout, password reset, and user data isolation.
- **10 Core Wedding Modules**:
  1. **Dashboard**: Live countdown, budget utilization %, RSVP counts, vendor status, task completion %, and quick actions.
  2. **Budget**: Category-wise expense allocations, planned vs actual spend, and decimal precision.
  3. **Guests**: RSVP tracking, Bride/Groom side filtering, dietary preferences (Veg/Non-Veg/Jain), plus-ones, and seating.
  4. **Seating Planner**: Table manager with server-enforced capacity limits.
  5. **Vendors**: Quoted vs paid tracking, contact notes, and booking statuses.
  6. **Wedding Functions**: Haldi, Mehendi, Sangeet, Baraat, Vivah, and Reception timelines with dress codes and color coding.
  7. **Checklist**: Pre-loaded starter Indian wedding tasks with priority levels.
  8. **Shagun**: Log cash, gifts, and cheques with financial privacy.
  9. **Menu Builder**: Appetizers, live counters, main courses, and desserts.
  10. **Notes**: Color-coded notes, pinned items, and reminders.
- **Global Search**: Search guests, vendors, tasks, functions, and notes instantly across the active wedding.
- **Tokenized Sharing**: Generate unpredictable random share links for family and guests to view timelines without exposing private financial notes.
- **CSV Data Export**: 1-click CSV spreadsheet generation for guests, vendors, functions, and tasks.
- **Browser Data Migration**: Automatic detection of legacy `localStorage` data with a 1-click cloud sync trigger.

---

## 🛠️ Architecture & Tech Stack

- **Frontend**: React 19, TypeScript 5.7, Vite 8, Tailwind CSS v4.
- **Backend**: Node.js, Express 5, TypeScript.
- **Database**: PostgreSQL with Prisma ORM 6.
- **Validation**: Zod request schema parsing.
- **Security**: HttpOnly SameSite cookies, bcryptjs, Helmet, Rate Limiting, CORS restrictions.
- **Testing**: Vitest unit & security test suite.

---

## 🚀 Quick Setup & Local Development

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

### 3. Generate Prisma Client & Database
```bash
pnpm prisma:generate
pnpm prisma:push
```

### 4. Run Development Servers
Start frontend and backend:
```bash
# Terminal 1: Backend Express Server (Port 5000)
pnpm server

# Terminal 2: Frontend Vite Server (Port 5173 / 8443)
pnpm dev
```

---

## 🧪 Running Tests & Build Verification

```bash
# Run Vitest Unit & Security Test Suite
pnpm test

# Run TypeScript Typecheck & Production Build
pnpm exec tsc --noEmit
pnpm run build
```

---

## ☁️ Render Deployment Instructions

Refer to [docs/deployment.md](docs/deployment.md) or use `render.yaml` for 1-click Render web service deployment.

---

## 📚 Documentation
- [Architecture Overview](docs/architecture.md)
- [API Endpoint Specification](docs/api.md)
- [Database ERD & Schema](docs/database.md)
- [Render Deployment Guide](docs/deployment.md)
