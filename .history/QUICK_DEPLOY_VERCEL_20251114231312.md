# Quick Deploy to Vercel

Fast track guide to get your app live in minutes!

## Prerequisites

- GitHub account
- Vercel account (free): https://vercel.com/signup

## Step 1: Push to GitHub (if not already)

```bash
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

## Step 2: Deploy Frontend (Easiest Method)

### Via Vercel Dashboard

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Configure project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
4. Add Environment Variable:
   - Key: `NEXT_PUBLIC_API_URL`
   - Value: `https://your-backend-url.com` (add this after backend deployment)
5. Click "Deploy"
6. ✅ Your frontend is live!

### Via CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy frontend
cd frontend
vercel

# Follow prompts, then deploy to production
vercel --prod
```

## Step 3: Deploy Backend (Recommended: Railway)

**Why Railway instead of Vercel for backend?**
- Better support for FastAPI
- No 10-second timeout limit
- Built-in PostgreSQL
- Free tier available

### Deploy to Railway.app

1. Go to https://railway.app
2. Click "Start a New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository
5. Configure:
   - **Root Directory**: `backend`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
6. Add PostgreSQL:
   - Click "New" → "Database" → "PostgreSQL"
   - Railway automatically sets `DATABASE_URL`
7. Add Environment Variables:
   ```
   BACKEND_CORS_ORIGINS=["https://your-frontend-url.vercel.app"]
   PROJECT_NAME=Nirvahatech API
   VERSION=1.0.0
   API_V1_STR=/api/v1
   ENVIRONMENT=production
   SECRET_KEY=generate-a-secure-key
   ```
8. Deploy!
9. Copy your backend URL (e.g., `https://yourapp.up.railway.app`)

## Step 4: Connect Frontend to Backend

1. Go to your Vercel project settings
2. Navigate to "Environment Variables"
3. Update `NEXT_PUBLIC_API_URL` with your Railway backend URL
4. Redeploy: Vercel → Deployments → Click "..." → "Redeploy"

## Step 5: Run Database Migrations

```bash
# Connect to Railway CLI
npm i -g @railway/cli
railway login

# Link to your project
railway link

# Run migrations
railway run alembic upgrade head
```

## Alternative: Everything on Vercel

If you want both on Vercel (has limitations):

```bash
# From project root
./deploy-to-vercel.sh
```

Choose option 3 (both), but note:
- Vercel has 10-second timeout for serverless functions
- You'll need external database (Neon, Supabase)

## Database Options

### Option 1: Railway PostgreSQL (Recommended)
- Built-in with Railway
- Automatically configured
- Free tier: 512MB storage

### Option 2: Neon (Serverless Postgres)
1. Create account: https://neon.tech
2. Create database
3. Copy connection string
4. Add as `DATABASE_URL` in Railway/Vercel

### Option 3: Supabase
1. Create account: https://supabase.com
2. Create project
3. Get connection string: Settings → Database
4. Add as `DATABASE_URL`

## Post-Deployment Checklist

- [ ] Frontend deployed and accessible
- [ ] Backend deployed and accessible
- [ ] Database connected
- [ ] Database migrations run
- [ ] CORS configured correctly
- [ ] Environment variables set
- [ ] Test contact form submission
- [ ] Check health endpoint: `https://your-backend/health`

## Testing Your Deployment

```bash
# Test backend health
curl https://your-backend-url.com/health

# Test backend API
curl https://your-backend-url.com/api/v1/health

# Visit frontend
open https://your-frontend-url.vercel.app
```

## Costs

### Free Tier (Perfect for MVP)
- Vercel Frontend: Free
- Railway Backend: Free (512MB RAM, 500 hours/month)
- Railway PostgreSQL: Free (512MB storage)
- **Total: $0/month**

### Production Ready
- Vercel Pro: $20/month
- Railway Pro: $5-20/month
- **Total: ~$25-40/month**

## Troubleshooting

### "CORS Error"
- Check `BACKEND_CORS_ORIGINS` includes your frontend URL
- Ensure URLs have no trailing slashes

### "Database Connection Error"
- Verify `DATABASE_URL` is set correctly
- Check database is accessible
- Run migrations: `railway run alembic upgrade head`

### "Build Failed on Vercel"
- Check build logs in Vercel dashboard
- Ensure all dependencies in `package.json`
- Verify Node.js version (18.17.0+)

## Getting Help

- Vercel Docs: https://vercel.com/docs
- Railway Docs: https://docs.railway.app
- Full Guide: See `VERCEL_DEPLOYMENT.md`

## One-Line Deploy (After Setup)

```bash
# Deploy frontend
cd frontend && vercel --prod

# Deploy backend (Railway)
git push origin main  # Auto-deploys via Railway GitHub integration
```

---

**Need help?** Open an issue on GitHub or check the full deployment guide.

