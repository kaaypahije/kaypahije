# Kay Pahije - Business Directory

Production-ready Business Directory platform with:

- Public frontend (React + Vite + Tailwind)
- Admin dashboard (`/admin/*`)
- Node/Express/MySQL backend with Sequelize, JWT auth, Multer uploads

## Stack

Frontend:

- React.js + Vite
- Tailwind CSS
- React Router DOM
- React Hook Form
- Lucide Icons

Backend:

- Node.js + Express.js
- MySQL + Sequelize ORM
- JWT Authentication
- Multer (local storage)
- Express Validator

## Project Structure

- `src/` - public website + admin dashboard frontend
- `backend/` - REST API, models, controllers, middleware
- `backend/uploads/` - local images

## Local Upload Paths

- `backend/uploads/categories`
- `backend/uploads/subcategories`
- `backend/uploads/businesses`

Uploads are served through:

- `/uploads/*`

## Setup

### 1) Backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Default DB settings in `.env`:

- `DB_USER=root`
- `DB_PASSWORD=root`
- `DB_NAME=kaypahije`

Backend auto-creates the database if it does not exist.

Optional admin seed:

```bash
npm run seed:admin
```

Seed credentials:

- `admin@kaypahije.com`
- `admin123`

API base:

- `http://localhost:5000/api`

### 2) Frontend

```bash
cd ..
npm install
cp .env.example .env
npm run dev
```

Frontend env:

- `VITE_API_BASE_URL=http://localhost:5000`

## Admin Dashboard

Open:

- `http://localhost:5173/admin/login`

Modules:

- Dashboard overview (cards, charts, recent businesses)
- Category management
- Subcategory management
- Business management (full form + gallery + flags)

## API Coverage

Implemented APIs:

- `POST /api/auth/login`
- `POST /api/auth/register`
- `GET /api/auth/me`

- `POST /api/categories`
- `GET /api/categories`
- `GET /api/categories/:id`
- `PUT /api/categories/:id`
- `DELETE /api/categories/:id`

- `POST /api/subcategories`
- `GET /api/subcategories`
- `GET /api/subcategories/category/:categoryId`
- `PUT /api/subcategories/:id`
- `DELETE /api/subcategories/:id`

- `POST /api/businesses`
- `GET /api/businesses`
- `GET /api/businesses/:id` (supports numeric id or slug)
- `PUT /api/businesses/:id`
- `DELETE /api/businesses/:id`
- `GET /api/businesses/featured`
- `GET /api/businesses/verified`
- `GET /api/businesses/category/:id`
- `GET /api/businesses/subcategory/:id`
- `GET /api/businesses/search?q=...`

Extra admin analytics endpoint:

- `GET /api/dashboard/stats`

## SQL Structure

Raw SQL schema is available at:

- `backend/schema.sql`
