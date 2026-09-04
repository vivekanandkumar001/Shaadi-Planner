# Shaadi Planner System Architecture

## Architecture Overview

Shaadi Planner is designed as a high-performance full-stack SaaS platform built specifically for Indian wedding planning.

### Frontend Layer
- **Tech Stack**: React 19, TypeScript 5.7, Vite 8, Tailwind CSS v4.
- **State Management**: Centralized API Client layer with optimism, loading skeletons, error toasts, and local-to-cloud migration triggers.
- **Routing & Views**: Responsive Landing Page, Onboarding Wizard, Auth pages, 10 Planning Modules, Public Share view, Legal pages.

### Backend Layer
- **Tech Stack**: Node.js, Express 5, TypeScript.
- **Security**: HttpOnly SameSite cookie sessions, bcryptjs password hashing, Helmet security headers, CORS origin restrictions, Express Rate Limiting.
- **Validation**: Zod request schema parsing for body, query, and path parameters.
- **Calculations**: Server-side recalculated financial totals using PostgreSQL decimal types.

### Database Layer
- **Database Engine**: PostgreSQL with Prisma ORM 6.
- **Entities**: User, Session, EmailVerificationToken, PasswordResetToken, Wedding, Guest, TableData, Vendor, WeddingFunction, ChecklistItem, ShagunEntry, MenuCourse, MenuItem, Note, ShareLink, ActivityLog.
