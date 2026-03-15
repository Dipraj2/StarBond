# StarBond

StarBond is a Next.js + TypeScript web app that combines:

- Pastebin (with visibility, expiry, password lock, burn-after-read, raw view)
- URL shortener (with custom alias, 301/302 redirect, expiry, click limit, analytics)

## Stack

- Next.js (App Router) + TypeScript
- Prisma ORM + PostgreSQL (Neon/Supabase)
- Zod validation
- Cookie-based sessions

## Quick start

```bash
npm install
cp .env.example .env
npx prisma generate
npx prisma db push
npm run dev
```

Open `http://localhost:3000`.

## Environment variables

See `.env.example`.

Required:

- `DATABASE_URL`
- `BASE_URL`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `JWT_SECRET`
- `SESSION_SECRET`

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run test
```

## API routes

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

### Pastes

- `GET /api/pastes?mine=1&q=search`
- `POST /api/pastes`
- `PATCH /api/pastes`
- `DELETE /api/pastes?id=:id`
- `GET /api/pastes/slug/:slug?password=...`
- `GET /api/pastes/raw/:slug?password=...`

### URLs

- `GET /api/urls?mine=1`
- `POST /api/urls`
- `PATCH /api/urls`
- `DELETE /api/urls?id=:id`
- `GET /s/:slug` (redirect endpoint)

## Seed data

```bash
npx ts-node prisma.seed.ts
```

## Free deployment (Vercel + Neon)

1. Push repo to GitHub.
2. Import repo in Vercel.
3. Add env vars in Vercel project settings.
4. Deploy.

This project runs `prisma generate` in both `postinstall` and `build` to avoid stale Prisma Client on Vercel cache.

## Production checklist

- Set strong secrets in env vars.
- Use production `BASE_URL` and `NEXTAUTH_URL`.
- Confirm redirect route `/s/:slug` works.
- Confirm paste protection (private/password/burn-after-read).
- Monitor Neon limits and Vercel logs.
