# PDFDecor v8 — Complete Project

## What's New in v8
- ✅ **Razorpay FIXED** — real serverless API (`api/razorpay/create-order.ts` + `api/razorpay/verify-payment.ts`)
- ✅ **Admin Panel** — full `/admin/*` area with login, dashboard, users, documents, templates, subscriptions, bulk jobs, analytics, activity logs, ads, settings
- ✅ **Supabase migration** — `payment_orders` table + subscription fields on users
- ✅ **vercel.json** — SPA routing fix (no 404 on deep routes)
- ✅ **robots.txt, sitemap.xml, ads.txt** in `/public`

## Quick Start (Local)

```bash
# 1. Install deps
npm install
npm i -D @vercel/node
npm i -g vercel

# 2. Create .env (copy from .env.example)
cp .env.example .env
# Edit .env and fill in RAZORPAY_KEY_SECRET

# 3. Run with Vercel Dev (required for /api endpoints)
vercel dev
```

## Vercel Deployment

1. Push to GitHub
2. Import project on Vercel
3. Add Environment Variables in Vercel dashboard:
   - `RAZORPAY_KEY_ID` = `rzp_test_SQCQwcV9oZv024`
   - `RAZORPAY_KEY_SECRET` = `<your secret key>`
4. Deploy

## Admin Panel
- URL: `/admin/login`
- First visit: creates superadmin account (bootstrap)
- Routes: `/admin/dashboard`, `/admin/users`, `/admin/documents`, `/admin/templates`, `/admin/subscriptions`, `/admin/bulk-jobs`, `/admin/analytics`, `/admin/activity`, `/admin/ads`, `/admin/settings`

## Razorpay Fix Explanation
The old code used a fake `order_demo_XXX` ID → Razorpay rejected it.
Now: frontend calls `/api/razorpay/create-order` → serverless creates real order → checkout uses real `order_id` → payment works.
