# E-Menu — Local Setup Guide

## Prerequisites
- Node.js 18+
- PostgreSQL running locally

---

## 1. Setup Database

```bash
# Create the database (once)
psql -U postgres -c "CREATE DATABASE emenu_dev;"

# Install server deps
cd server
npm install

# Run Prisma migrations (creates all tables)
npx prisma migrate dev --name init

# (Optional) Open Prisma Studio to inspect the DB
npx prisma studio
```

---

## 2. Start the Server

```bash
cd server
npm run dev
```

Server starts at **http://localhost:5000**

---

## 3. Open the App

Open your browser → **http://localhost:5000/app.html**

All API calls go to `/api/...` (same origin — no CORS issues).

---

## 4. Full Flow

1. **Signup** → account created in PostgreSQL `users` table
2. **Onboarding Step 1** → business saved in `businesses` + `menus` tables
3. **Onboarding Step 2** → categories in `categories`, products in `products`
4. **Onboarding Step 3** → template ID saved to `menus.templateId`
5. **Onboarding Step 4** → QR generated, stored in `qr_codes`, menu published
6. **Dashboard** → load data from DB on every login

---

## 5. Public Menu URL

When a customer scans the QR code:
```
http://localhost:5000/menu/<business-slug>
```
This calls `/api/public/menu/:slug` → returns published menu data.

---

## 6. Email OTP (Dev mode)

SMTP credentials are empty in `.env` by default.  
In dev mode, OTPs print to the server console — no email needed.

To enable real email: fill `SMTP_USER` and `SMTP_PASS` in `server/.env`.

---

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/signup | Register |
| POST | /api/auth/login | Login |
| POST | /api/auth/logout | Logout |
| GET  | /api/auth/me | Current user |
| POST | /api/auth/forgot-password | Send OTP |
| POST | /api/auth/reset-password | Reset with OTP |
| GET  | /api/business/me | My business |
| POST | /api/business | Create business |
| PUT  | /api/business/:id | Update business |
| GET  | /api/menu/me | My menu + categories + products |
| POST | /api/menu/:menuId/categories | Add category |
| PUT  | /api/menu/categories/:id | Edit category |
| DELETE | /api/menu/categories/:id | Delete category |
| POST | /api/menu/categories/:catId/products | Add product |
| PUT  | /api/menu/products/:id | Edit product |
| DELETE | /api/menu/products/:id | Delete product |
| PATCH | /api/menu/:menuId/template | Set template |
| POST | /api/menu/:menuId/publish | Publish menu |
| POST | /api/qr/:menuId/generate | Generate QR code |
| GET  | /api/public/menu/:slug | Public menu (no auth) |
