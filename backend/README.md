# ModernTech Backend — Setup

## 1. Install dependencies

```bash
cd backend
npm install
```

## 2. Set up your environment file

```bash
cp .env.example .env
```

Then fill in your real MySQL credentials and a random `JWT_SECRET` in `.env`.

## 3. Create the database

Make sure MySQL is running locally, then:

```bash
mysql -u root -p < db/schema.sql
mysql -u root -p moderntech < db/seed.sql
```

`schema.sql` creates the `moderntech` database and all tables.
`seed.sql` adds a few sample employees and a placeholder admin login — see the note below on generating a real password hash before using it.

## 4. Generate a real admin password hash

```bash
node scripts/hash-password.js "admin123"
```

Copy the printed hash into `db/seed.sql` (replacing the placeholder) before running the seed file, or update the `users` row directly with:

```sql
UPDATE users SET password_hash = '<paste hash here>' WHERE email = 'admin@moderntech.com';
```

## 5. Run the server

```bash
npm run dev
```

You should see:

```
✅ MySQL connected
🚀 Server running at http://localhost:3000
```

Test it: `GET http://localhost:3000/api/v1/health` → `{ "status": "ok" }`

Then: `GET http://localhost:3000/api/v1/employees` (requires a valid Bearer token once Wendy's auth routes are merged in — for now you can temporarily comment out `router.use(authMiddleware)` in `employees.routes.js` to test the DB connection end-to-end).

## What's built so far

- ✅ Express server (`server.js`)
- ✅ MySQL connection pool (`config/db.js`)
- ✅ Database schema + seed data (`db/`)
- ✅ Auth + role middleware (`middleware/`) — ready for Wendy's auth routes to use
- ✅ Employees CRUD (`routes/`, `controllers/`, `models/`) — full working example to copy for other features

## What everyone else adds

Each teammate creates their own `routes/*.routes.js`, `controllers/*.controller.js`, and `models/*.js`, following the exact same pattern as `employees.routes.js` / `employees.controller.js` / `Employee.js`. Then in `server.js`, uncomment the matching `require(...)` and `app.use(...)` lines for your route.
