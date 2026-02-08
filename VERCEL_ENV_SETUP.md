# Vercel Environment Variables Checklist

## ✅ Required Before Deployment

Your code has been updated and pushed to GitHub. **Before the deployment will work**, you MUST set these environment variables in Vercel:

---

## 🔐 Set These in Vercel Dashboard

Go to: **Vercel Dashboard → Your Project → Settings → Environment Variables**

### 1. DATABASE_URL (REQUIRED)

```
Name: DATABASE_URL
Value: postgresql://user:password@host:port/database?pgbouncer=true&connection_limit=1
```

**Where to get this:**

- **Vercel Postgres**: Dashboard → Storage → Postgres → `.env.local` tab
- **Supabase**: Project Settings → Database → Connection pooling URL
- **Neon**: Dashboard → Connection Details → Pooled connection

**Important:**

- ❌ **DO NOT** use localhost
- ✅ **MUST** use a cloud database (Vercel Postgres, Supabase, or Neon)
- ✅ **Include** connection pooling parameters

---

### 2. NEXTAUTH_SECRET (REQUIRED)

```
Name: NEXTAUTH_SECRET
Value: Z61fiyFH/DADG/Q1Fg7e0BBLJMOYX2FKzlvorVik4Uw=
```

**Use the generated secret above** (already generated for you)

Or generate a new one:

```bash
openssl rand -base64 32
```

---

### 3. NEXTAUTH_URL (REQUIRED)

```
Name: NEXTAUTH_URL
Value: https://your-app-name.vercel.app
```

**Replace** `your-app-name` with your actual Vercel deployment URL.

After first deployment, update this with your real URL.

---

### 4. APP_URL (REQUIRED)

```
Name: APP_URL
Value: https://your-app-name.vercel.app
```

**Same as NEXTAUTH_URL**

---

### 5. NODE_ENV (REQUIRED)

```
Name: NODE_ENV
Value: production
```

---

### 6. PRISMA_CLIENT_ENGINE_TYPE (OPTIONAL)

```
Name: PRISMA_CLIENT_ENGINE_TYPE
Value: library
```

---

## 📋 Quick Setup Database Options

### Option A: Vercel Postgres (Easiest)

1. In Vercel Dashboard → Storage → Create Database
2. Select "Postgres"
3. Click "Create"
4. Copy the `DATABASE_URL` from the connection details
5. Paste into Vercel environment variables

**Pros:** Automatic integration, easy setup
**Cons:** Limited free tier

---

### Option B: Supabase (Recommended)

1. Go to [supabase.com](https://supabase.com) → New Project
2. Settings → Database → Connection string
3. **Use "Connection pooling" mode** (port 6543, not 5432)
4. Format: `postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true`

**Pros:** Great free tier, full PostgreSQL features, built-in pooling
**Cons:** Requires external account

---

### Option C: Neon (Good Free Tier)

1. Go to [neon.tech](https://neon.tech) → New Project
2. Dashboard → Connection Details
3. Copy "Pooled connection" string
4. Format: `postgresql://user:password@ep-xxx.region.neon.tech/dbname?sslmode=require`

**Pros:** Generous free tier, serverless, auto-scaling
**Cons:** Requires external account

---

## 🚀 After Setting Environment Variables

1. **Redeploy** your app in Vercel (or it will auto-deploy from Git push)
2. **Run migrations** (if needed):

   ```bash
   # Set DATABASE_URL locally to production database
   export DATABASE_URL="your-production-database-url"

   # Run migrations
   npx prisma migrate deploy
   ```

3. **Test the deployment:**
   - Visit your Vercel URL
   - Try to sign up
   - Try to log in
   - Check deployment logs for any errors

---

## 🔍 Troubleshooting

### Error: "DATABASE_URL environment variable is not set"

**Solution:** Add DATABASE_URL in Vercel environment variables, then redeploy

---

### Error: "Production environment is configured with a localhost database URL"

**Solution:**

1. Check Vercel environment variables
2. Ensure DATABASE_URL does NOT contain "localhost" or "127.0.0.1"
3. Use a cloud database URL instead

---

### Error: "Can't reach database server"

**Solutions:**

1. Verify database is running and accessible
2. Check DATABASE_URL format is correct
3. For Supabase: Use **Connection pooling** URL (port 6543), **not** Direct connection
4. Ensure connection string includes `?pgbouncer=true&connection_limit=1`

---

### Build succeeds but signup/login fails

**Check:**

1. All environment variables are set in Vercel
2. DATABASE_URL points to production database (not localhost)
3. Migrations have been run on production database
4. Check Vercel function logs for error details

---

## ✅ Final Checklist

- [ ] Set DATABASE_URL in Vercel
- [ ] Set NEXTAUTH_SECRET in Vercel
- [ ] Set NEXTAUTH_URL in Vercel
- [ ] Set APP_URL in Vercel
- [ ] Set NODE_ENV=production in Vercel
- [ ] Database is accessible from Vercel
- [ ] Migrations have run on production database
- [ ] Redeployed after setting environment variables
- [ ] Tested signup on production URL
- [ ] Tested login on production URL

---

## 🎯 Current Status

✅ Code updated with strict DATABASE_URL validation
✅ Pushed to GitHub (will auto-deploy to Vercel)
⏳ **Waiting for you to set environment variables in Vercel Dashboard**

Once environment variables are set, the deployment will automatically work!
