# Hostinger Direct Upload Guide

This project can be deployed to Hostinger **without GitHub and without Vercel** by uploading ZIP files directly in hPanel.

## Before you start

As of **June 2026**, Hostinger's newer Node.js app documentation says direct ZIP uploads are supported for Node.js apps on:

- Business Web Hosting
- Cloud Startup
- Cloud Professional
- Cloud Enterprise
- Cloud Enterprise Plus

There is also an older Hostinger help article that says Node.js needs VPS access. The newer Node.js Web App docs appear to be the correct path for ZIP-based deployments on supported plans.

If your plan does **not** have Node.js Web Apps, use a **Hostinger VPS** instead.

## Recommended setup

- Frontend domain: `https://yourdomain.com`
- Backend domain: `https://api.yourdomain.com`
- Database: Hostinger MySQL

Deploy the frontend and backend as **two separate Hostinger apps**.

## Files ready to upload

Run this from the project root:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\create-hostinger-zips.ps1
```

It creates:

- `deploy/hostinger/frontend-source.zip`
- `deploy/hostinger/backend-source.zip`

Do **not** upload `node_modules`. Hostinger installs dependencies during deployment.

## 1. Deploy the frontend

In hPanel:

1. Go to **Websites**
2. Click **Add Website**
3. Choose **Node.js Apps**
4. Choose **Upload your website files**
5. Upload `frontend-source.zip`

Suggested settings:

- Framework: `Vite` or auto-detected
- Node.js version: `22.x` or `24.x`
- Build command: `npm run build`
- Output directory: `dist`

Environment variables:

- `VITE_API_BASE_URL=https://api.yourdomain.com`

Point your main domain to this frontend app.

## 2. Deploy the backend

Create a second Node.js app in hPanel and upload `backend-source.zip`.

Suggested settings:

- Framework: `Express.js` or `Other`
- Node.js version: `22.x` or `24.x`
- Build command: leave empty if Hostinger does not require one
- Start command: `npm start`

Environment variables:

- `NODE_ENV=production`
- `PORT=3000`
- `JWT_SECRET=your-long-random-secret`
- `JWT_EXPIRES_IN=7d`
- `CORS_ORIGIN=https://yourdomain.com`
- `DB_HOST=your-mysql-host`
- `DB_PORT=3306`
- `DB_NAME=your-database-name`
- `DB_USER=your-database-user`
- `DB_PASSWORD=your-database-password`
- `UPLOADS_DIR=./uploads`

Point a subdomain such as `api.yourdomain.com` to this backend app.

## 3. Create the database

In Hostinger hPanel:

1. Open **Databases**
2. Create a MySQL database
3. Create a MySQL user
4. Copy the host, database name, username, and password into the backend environment variables

After deployment, test:

- `https://api.yourdomain.com/api/health`

## 4. Seed admin

If your Hostinger Node.js app provides a terminal, run:

```bash
cd backend
npm run seed:admin
```

If there is no terminal access on your plan, seed the admin locally against the live database or insert the admin record through phpMyAdmin.

Admin login:

- `kaaypahije@gmail.com`
- `admin123`

## 5. Important note about uploads

The backend stores uploaded files locally in `./uploads`.

That works on a server with persistent storage, but if your Hostinger Node.js app uses ephemeral deployment storage, uploaded images may disappear on redeploy. If that happens, the stronger fix is:

- move uploads to Hostinger VPS storage, or
- move uploads to object storage / CDN storage

For a first launch, test this flow:

1. Upload a banner from admin
2. Confirm it shows on the site
3. Redeploy the backend
4. Confirm the banner still exists

If step 4 fails, we should switch uploads to durable storage.

## 6. Troubleshooting

- Build fails: confirm `package.json` exists at the ZIP root
- Wrong API URL: confirm frontend env `VITE_API_BASE_URL`
- CORS error: confirm backend `CORS_ORIGIN=https://yourdomain.com`
- Images not showing: confirm `https://api.yourdomain.com/uploads/...` opens directly
- SPA routes failing: redeploy the frontend so Hostinger regenerates routing config

## Official references

- Hostinger Node.js ZIP deployment:
  - https://www.hostinger.com/support/how-to-deploy-a-nodejs-website-in-hostinger/
- Hostinger environment variables:
  - https://www.hostinger.com/support/how-to-edit-or-add-environment-variables-after-deployment/
- Hostinger Node version detection:
  - https://www.hostinger.com/support/how-to-select-the-node-js-version-for-your-application/
- Hostinger build troubleshooting:
  - https://www.hostinger.com/support/fix-failed-to-build-application-error-hostinger-node-js/
