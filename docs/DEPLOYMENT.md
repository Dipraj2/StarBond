# StarBond Free Deployment Guide

## 1) Services

- App hosting: Vercel (free)
- Database: Neon PostgreSQL (free)

## 2) Neon setup

1. Create a Neon project.
2. Copy the pooled connection string.
3. Set it as `DATABASE_URL`.

## 3) Vercel setup

1. Import GitHub repo in Vercel.
2. Add environment variables:
   - `DATABASE_URL`
   - `BASE_URL=https://<your-app>.vercel.app`
   - `NEXTAUTH_URL=https://<your-app>.vercel.app`
   - `NEXTAUTH_SECRET`
   - `JWT_SECRET`
   - `SESSION_SECRET`
3. Deploy.

## 4) Commands for local validation

```bash
npm install
npx prisma generate
npx prisma db push
npm run build
```

## 5) Post-deploy checks

1. Register a user.
2. Create a paste and open its raw link.
3. Create a short URL and open `/s/<slug>`.
4. Verify click count updates.
