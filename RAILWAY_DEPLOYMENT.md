# Railway Deployment Guide

This guide will help you deploy the Nirvahatech Backend API to Railway.

## Prerequisites

- Railway account ([railway.app](https://railway.app))
- Git repository pushed to GitHub
- Railway CLI (optional): `npm install -g @railway/cli`

## Quick Deploy (Recommended)

### 1. Create a New Railway Project

1. Go to [railway.app](https://railway.app) and sign in
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose your `nirva-monorepo` repository
5. Select the **backend** directory as the root

### 2. Add PostgreSQL Database

1. In your Railway project, click **"+ New"**
2. Select **"Database"** → **"PostgreSQL"**
3. Railway will automatically:
   - Create a PostgreSQL instance
   - Set the `DATABASE_URL` environment variable
   - Connect it to your backend service

### 3. Configure Environment Variables

Railway automatically sets `DATABASE_URL`, but you should add these additional variables:

```bash
# In Railway Dashboard → Your Backend Service → Variables
ENVIRONMENT=production
BACKEND_CORS_ORIGINS=https://your-frontend-domain.com,https://your-custom-domain.com
PROJECT_NAME=Nirvahatech API
VERSION=1.0.0
```

### 4. Configure Build & Start Commands

In Railway Dashboard → Your Backend Service → Settings:

**Root Directory:** `backend`

**Build Command:** (Auto-detected from `pyproject.toml`)
```bash
pip install poetry && poetry install --only main
```

**Start Command:**
```bash
poetry run uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

Or if Railway auto-detects Python:
```bash
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

### 5. Deploy

1. Click **"Deploy"**
2. Railway will:
   - Install dependencies
   - Build your application
   - Start the server
   - Provide a public URL

## Railway Configuration File (Optional)

Create `railway.toml` in your backend directory for more control:

```toml
[build]
builder = "NIXPACKS"
buildCommand = "pip install poetry && poetry config virtualenvs.create false && poetry install --only main"

[deploy]
startCommand = "uvicorn app.main:app --host 0.0.0.0 --port $PORT"
restartPolicyType = "ON_FAILURE"
restartPolicyMaxRetries = 10

[env]
PORT = { default = "8000" }
PYTHONUNBUFFERED = "1"
```

## Database Migrations

### Option 1: Run Migrations via Railway Shell

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link to your project
railway link

# Run migrations
railway run poetry run alembic upgrade head
```

### Option 2: Add Migration to Start Command

Update your start command to run migrations before starting:

```bash
poetry run alembic upgrade head && poetry run uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

## Verify Deployment

### Check Health Endpoint

```bash
curl https://your-app.railway.app/health
```

Expected response:
```json
{"status":"healthy","service":"Nirvahatech API","version":"1.0.0"}
```

### Check API Documentation

Visit: `https://your-app.railway.app/docs`

## Custom Domain (Optional)

1. Go to your service **Settings** → **Domains**
2. Click **"Generate Domain"** or **"Custom Domain"**
3. Add your custom domain (e.g., `api.nirvahatech.com`)
4. Update DNS records as shown by Railway
5. Update `BACKEND_CORS_ORIGINS` to include your new domain

## Troubleshooting

### SSL Connection Errors

✅ **FIXED**: Your code now automatically handles Railway's `DATABASE_URL` with SSL.

The `get_database_url()` method in `config.py` automatically:
- Detects Railway's `DATABASE_URL`
- Converts `postgres://` to `postgresql+asyncpg://`
- Railway's PostgreSQL includes SSL by default

### Port Not Found Error

Make sure your start command uses `$PORT`:
```bash
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

Railway injects the `PORT` environment variable automatically.

### Database Connection Timeout

Check that:
1. PostgreSQL service is running
2. `DATABASE_URL` is set (Railway does this automatically)
3. Your backend service is linked to the database

### Build Failures

If Poetry installation fails, try:
```bash
pip install poetry==1.7.1 && poetry install --only main
```

## Monitoring & Logs

### View Logs

In Railway Dashboard:
1. Go to your backend service
2. Click **"Deployments"**
3. Select the latest deployment
4. View **"Logs"** tab

Or via CLI:
```bash
railway logs
```

### Metrics

Railway provides:
- CPU usage
- Memory usage
- Network traffic
- Request metrics

Access them in the **"Metrics"** tab of your service.

## Environment Variables Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DATABASE_URL` | Yes | Auto-set by Railway | PostgreSQL connection string |
| `ENVIRONMENT` | Recommended | `development` | Set to `production` |
| `BACKEND_CORS_ORIGINS` | Yes | `localhost` | Comma-separated allowed origins |
| `PROJECT_NAME` | No | `Nirvahatech API` | API name |
| `VERSION` | No | `1.0.0` | API version |
| `PORT` | Auto | `8000` | Railway sets this automatically |

## Rollback

If deployment fails:

1. Go to **Deployments** tab
2. Find a previous successful deployment
3. Click **"..."** → **"Redeploy"**

## Cost Optimization

Railway offers:
- **Free tier**: $5 credit/month (suitable for testing)
- **Pro plan**: $20/month + usage

To optimize costs:
- Use the starter PostgreSQL (adequate for most use cases)
- Set appropriate resource limits
- Monitor usage in the dashboard

## Next Steps

1. ✅ Backend is deployed and running
2. 🔄 Deploy frontend to Vercel (see `VERCEL_DEPLOYMENT.md`)
3. 🔗 Update frontend API endpoint to Railway URL
4. 🌐 Set up custom domain
5. 📊 Configure monitoring and alerts

## Support

For Railway-specific issues:
- [Railway Documentation](https://docs.railway.app)
- [Railway Discord](https://discord.gg/railway)
- [Railway GitHub](https://github.com/railwayapp/cli)

For application issues:
- Check logs: `railway logs`
- Contact: engineering@nirvahatech.com

---

**Last Updated:** 2024-11-15  
**Status:** ✅ SSL Connection Issue Fixed

