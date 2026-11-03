# E-Menu production readiness

## Current architecture

The live service is a single Render Docker web service. The root `Dockerfile`
builds the TypeScript Express API and copies `app.html` into the image; Express
then serves that file and the API from the same origin. PostgreSQL is accessed
through Prisma using `DATABASE_URL`, which is intended to point at Supabase.
Password-reset email is sent with Zoho SMTP. QR codes resolve to
`MENU_BASE_URL/<business-slug>` and are generated and stored in PostgreSQL.

`client/` is a separate Vite/React prototype. It is **not** used by the Render
deployment configured in `render.yaml`; several of its pages are placeholders.
Do not deploy `client/Dockerfile` until that frontend is completed and a client
lockfile is committed.

## Required Render environment variables

Set these values in the Render dashboard, with the actual public service URL
shown below (no trailing slash):

| Variable | Required production value |
| --- | --- |
| `NODE_ENV` | `production` |
| `DATABASE_URL` | Supabase **direct** PostgreSQL connection string, with SSL required |
| `APP_URL` | `https://emenu-x75b.onrender.com` |
| `MENU_BASE_URL` | `https://emenu-x75b.onrender.com/menu` |
| `JWT_ACCESS_SECRET` | unique, cryptographically random 64-byte secret |
| `JWT_REFRESH_SECRET` | a different cryptographically random 64-byte secret |
| `SMTP_HOST` | `smtp.zoho.in` (or the Zoho regional SMTP hostname for the mailbox) |
| `SMTP_PORT` | `465` |
| `SMTP_USER` | the verified Zoho sender mailbox |
| `SMTP_PASS` | a Zoho app password, not the normal mailbox password |

Use Supabase's direct connection string for Render migrations. If a pooled
connection is used for runtime traffic, configure a separate direct URL for
Prisma migrations before changing the Docker start command.

## What UptimeRobot is for

Render's free service can sleep after inactivity. Create an UptimeRobot HTTP(s)
monitor for:

```text
https://emenu-x75b.onrender.com/api/health
```

Use a 5-minute interval. The endpoint returns a small JSON response and does
not require login. This keeps the service warm and reports availability; it is
not a replacement for database backups or error monitoring.

## Pre-launch checklist

1. In Render, check the latest deploy log: `prisma migrate deploy` must finish
   before the application starts.
2. Open `/api/health` and confirm HTTP 200.
3. Create a disposable account, complete onboarding, add a category and item,
   generate a QR code, and open the QR URL in a private browser window.
4. Run the forgot-password flow with a real mailbox and confirm the Zoho email
   arrives. Delete the disposable account/data afterwards.
5. In Supabase, enable backups/point-in-time recovery appropriate for the
   plan, and retain the database password and JWT/SMTP secrets in a password
   manager.
6. Add the UptimeRobot monitor above and configure an alert recipient.

## Issues to resolve before a broader public launch

### High priority

- The repository currently tracks `server/node_modules`. This makes commits
  platform-specific and causes unrelated working-tree changes when dependencies
  are installed on another operating system. Remove those tracked files from
  Git in a dedicated cleanup change; `.gitignore` already excludes them for new
  files.
- The server currently falls back to hard-coded JWT secrets when production
  secrets are absent. Production startup should fail fast if either JWT secret
  is missing or uses a development placeholder.
- Business and product strings are interpolated into `innerHTML` in `app.html`.
  They need HTML escaping (or DOM-node rendering) before untrusted restaurant
  content is publicly displayed, otherwise stored XSS is possible.

### Important

- The `client/` React application is incomplete and has no `package-lock.json`;
  `npm ci` in its Dockerfile cannot succeed. The active Render deployment does
  not use it, but this needs resolving before switching frontend architecture.
- The Docker startup command runs database migrations in every web-service
  boot. That is workable for a single service, but use a deploy/release step
  before scaling to multiple instances.
- The health endpoint verifies only that Express is running. Add a lightweight
  Prisma database query if availability monitoring must detect a disconnected
  Supabase database.
- QR URLs are saved when generated. If the Render hostname changes, regenerate
  all QR codes after updating `MENU_BASE_URL`; a custom domain avoids this.

## Local verification

```bash
cd server
DATABASE_URL='postgresql://…' npm run build
DATABASE_URL='postgresql://…' npx prisma validate
DATABASE_URL='postgresql://…' npx prisma migrate status
```

Do not put a real production connection string in a committed `.env` file.
