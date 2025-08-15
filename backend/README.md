# Cipromart Backend (Express + MongoDB)

This backend is designed to be compatible with the older frontend that called endpoints such as `GET /api/companies` and `POST /api/activity_logs`. It provides JWT-based admin auth, company CRUD, activity logging, and CSV import.

## Quick Start

```bash
# 1) Install
npm i

# 2) Configure
cp .env.example .env
# edit .env (MONGO_URI, JWT_SECRET, etc.)

# 3) Run MongoDB locally (or use Atlas)
# e.g., brew services start mongodb-community

# 4) Start API
npm run dev
# -> http://localhost:$PORT
```

## Seed Admin

```bash
SEED_ADMIN_EMAIL=admin@cipromart.local \
SEED_ADMIN_PASSWORD=ChangeMe123! \
npm run seed:admin
```

## CSV Import

Provide a CSV with headers like:

```
name,category,phone,email,website,address,country,city,logoUrl,bannerUrl,images,featured,verified,isActive,tags
Acme Builders,Construction,+237...,info@acme.com,https://acme.com,Bonamoussadi,Cameroon,Douala,/uploads/acme.png,,"/uploads/1.jpg|/uploads/2.jpg",1,1,1,"roads,bridges"
```

Then run:

```bash
npm run import:companies -- ./data/companies.csv
```

## Auth

- `POST /api/auth/login` → { token, user }
  - Use returned **Bearer token** for admin CRUD on companies and viewing activity logs.

## Companies

- `GET /api/companies` (filters: search, country, city, category, featured, verified, isActive, page, limit, sort)
- `GET /api/companies/:id`
- `POST /api/companies` (admin) – supports file uploads for `logo`, `banner`, and `images[]`
- `PUT /api/companies/:id` (admin)
- `DELETE /api/companies/:id` (admin)

## Activity Logs

- `POST /api/activity_logs` – saves visitor activity (compatible with old frontend)
- `GET /api/activity_logs` (admin)

## Health

- `GET /api/health` → { ok: true }

## Deployment tips (VPS)

- Use `pm2` to run: `pm2 start src/server.js --name cipromart-api`
- Reverse proxy with NGINX to `localhost:PORT`
- Ensure `UPLOAD_DIR` folder is writable and served via `/uploads`

## Notes & Assumptions

- This backend is rebuilt from the frontend’s usage of endpoints. If your boss has the **company files/data**, use the CSV importer to restore quickly.
- Adjust the `Company` schema fields to match any extra fields present in your data export.
