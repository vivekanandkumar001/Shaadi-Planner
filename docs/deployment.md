# Render Deployment Guide for Shaadi Planner

This application is ready for 1-click Render web service deployment.

## Render Configuration

1. **PostgreSQL Database**:
   - Create a new PostgreSQL instance on Render.
   - Copy the internal Database URL: `DATABASE_URL`.

2. **Backend Web Service**:
   - Environment: Node
   - Build Command: `pnpm install && pnpm prisma:generate && pnpm prisma:push`
   - Start Command: `pnpm server`
   - Environment Variables:
     - `DATABASE_URL`: (Render Internal Postgres URL)
     - `PORT`: `5000`
     - `NODE_ENV`: `production`
     - `FRONTEND_URL`: `https://shaadiplanner.onrender.com`
     - `SESSION_SECRET`: (Random 32+ char secret)
     - `COOKIE_SECRET`: (Random 32+ char secret)
     - `JWT_SECRET`: (Random 32+ char secret)

3. **Frontend Static Web Service**:
   - Build Command: `pnpm install && pnpm build`
   - Publish Directory: `dist`
   - Environment Variables:
     - `VITE_API_URL`: `https://shaadiplanner-api.onrender.com/api/v1`

4. **Health Check Endpoint**:
   - Path: `/api/v1/health`
