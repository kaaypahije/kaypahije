# Deployment Guide

Recommended stack for this repo:

- Frontend: Vercel
- Backend API: Railway
- Database: Railway MySQL
- Upload storage: Railway Volume mounted to backend

## 1. Frontend on Vercel

- Import the `kaypahije` repository/project into Vercel
- Root directory: `kaypahije`
- Build command: `npm run build`
- Output directory: `dist`
- Environment variable:
  - `VITE_API_BASE_URL=https://your-backend-domain`

The existing `vercel.json` already matches the Vite frontend.

## 2. Backend on Railway

- Create a Railway project
- Add a `MySQL` service
- Add a new service from this repo
- Set the service root directory to `backend`
- Start command: `npm start`

### Backend environment variables

Set these in Railway:

- `NODE_ENV=production`
- `JWT_SECRET=your-long-random-secret`
- `JWT_EXPIRES_IN=7d`
- `CORS_ORIGIN=https://your-frontend-domain`
- `UPLOADS_DIR=/data/uploads`

Notes:

- This backend now supports Railway MySQL variables automatically:
  - `MYSQLHOST`
  - `MYSQLPORT`
  - `MYSQLUSER`
  - `MYSQLPASSWORD`
  - `MYSQLDATABASE`
- You do not need to manually copy those into `DB_HOST`, `DB_PORT`, etc. on Railway.

## 3. Persistent uploads

This app uses Multer local file uploads, so production needs persistent storage.

On Railway:

- Add a Volume to the backend service
- Mount path: `/data`
- Keep `UPLOADS_DIR=/data/uploads`

Without a persistent volume, uploaded banners, category images, and business images can disappear on redeploy.

## 4. Optional seed

After the backend is live, run:

```bash
cd backend
npm run seed:admin
```

Admin login:

- `kaaypahije@gmail.com`
- `admin123`

## 5. Update frontend API URL

After Railway gives you the backend URL, set:

- `VITE_API_BASE_URL=https://your-backend-domain`

Then redeploy the frontend on Vercel.

## 6. Go-live checklist

- Frontend opens successfully
- Backend `/api/health` returns success
- Admin login works
- Uploading images works after a redeploy
- `CORS_ORIGIN` includes the live frontend domain
