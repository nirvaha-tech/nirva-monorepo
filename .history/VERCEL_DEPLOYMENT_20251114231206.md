# Vercel Deployment Guide

This guide will help you deploy the Nirvahatech application to Vercel.

## Prerequisites

- Vercel account (sign up at https://vercel.com)
- Vercel CLI installed: `npm i -g vercel`
- GitHub repository connected to Vercel

## Deployment Options

### Option 1: Deploy Frontend and Backend Separately (Recommended)

#### Deploy Frontend (Next.js)

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Deploy to Vercel:
```bash
vercel
```

3. Follow the prompts:
   - Set up and deploy? Y
   - Which scope? (select your account)
   - Link to existing project? N
   - What's your project's name? nirvahatech-frontend
   - In which directory is your code located? ./
   - Override settings? N

4. Set environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_API_URL`: Your backend API URL

#### Deploy Backend (FastAPI)

For the backend, you have several options:

**Option A: Vercel Serverless Functions** (Simple, but limited)
```bash
cd backend
vercel
```

Note: Vercel has 10-second timeout for serverless functions on hobby plan.

**Option B: Railway.app** (Better for FastAPI)
1. Go to https://railway.app
2. Create new project from GitHub
3. Select the repository
4. Set root directory to `backend`
5. Add environment variables:
   - `DATABASE_URL`
   - `BACKEND_CORS_ORIGINS`

**Option C: Render.com** (Free tier available)
1. Go to https://render.com
2. Create new Web Service
3. Connect your GitHub repository
4. Configure:
   - Root Directory: `backend`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

### Option 2: Monorepo Deployment (Advanced)

Deploy from root with custom configuration:

```bash
vercel
```

The root `vercel.json` is configured to handle both frontend and backend routing.

## Database Setup

### Option 1: Neon (Serverless Postgres - Recommended)

1. Create account at https://neon.tech
2. Create new project
3. Copy connection string
4. Add to Vercel environment variables as `DATABASE_URL`

### Option 2: Supabase

1. Create account at https://supabase.com
2. Create new project
3. Get connection string from Settings → Database
4. Add to Vercel environment variables

### Option 3: Railway Postgres

1. In your Railway project, add PostgreSQL
2. Copy the `DATABASE_URL` from the service
3. Add to your backend environment variables

## Environment Variables

### Frontend Environment Variables (Vercel)

```
NEXT_PUBLIC_API_URL=https://your-backend-url.com
```

### Backend Environment Variables

```
DATABASE_URL=postgresql://user:password@host:5432/database
BACKEND_CORS_ORIGINS=["https://your-frontend-url.vercel.app"]
SECRET_KEY=your-secret-key-here
ENVIRONMENT=production
```

## Post-Deployment Steps

1. **Run Database Migrations**:
   - If using Railway/Render, connect via CLI and run:
   ```bash
   alembic upgrade head
   ```

2. **Test the Deployment**:
   ```bash
   curl https://your-backend-url.com/api/v1/health
   ```

3. **Update CORS Settings**:
   - Update `BACKEND_CORS_ORIGINS` with your actual frontend URL

4. **Configure Custom Domain** (Optional):
   - In Vercel dashboard, go to your project
   - Navigate to Settings → Domains
   - Add your custom domain

## Continuous Deployment

Once connected to GitHub, Vercel will automatically:
- Deploy on every push to `main` branch
- Create preview deployments for pull requests
- Run build checks before deployment

### Branch Configuration

- `main` → Production deployment
- `develop` → Preview deployment
- Feature branches → Automatic preview URLs

## Monitoring and Logs

### View Logs in Vercel

1. Go to your project dashboard
2. Click on "Deployments"
3. Select a deployment
4. View "Build Logs" or "Function Logs"

### Set Up Monitoring

1. Enable Vercel Analytics:
   ```bash
   npm install @vercel/analytics
   ```

2. Add to your layout:
   ```typescript
   import { Analytics } from '@vercel/analytics/react';
   
   export default function RootLayout({ children }) {
     return (
       <html>
         <body>
           {children}
           <Analytics />
         </body>
       </html>
     );
   }
   ```

## Troubleshooting

### Build Failures

1. Check build logs in Vercel dashboard
2. Ensure all dependencies are in `package.json`
3. Verify Node.js version compatibility

### API Connection Issues

1. Verify `NEXT_PUBLIC_API_URL` is set correctly
2. Check CORS configuration on backend
3. Ensure backend is deployed and accessible

### Database Connection Issues

1. Verify `DATABASE_URL` format
2. Check database is accessible from Vercel
3. Ensure SSL is enabled for production databases

## Quick Deploy Commands

Deploy frontend:
```bash
cd frontend && vercel --prod
```

Deploy backend:
```bash
cd backend && vercel --prod
```

Deploy both:
```bash
vercel --prod
```

## Cost Estimates

### Vercel
- Hobby (Free): 100GB bandwidth, 100GB-Hrs compute
- Pro ($20/month): 1TB bandwidth, 1000GB-Hrs compute

### Neon (Database)
- Free: 0.5 GB storage, 1 project
- Launch ($19/month): Unlimited storage, 10 projects

### Total Monthly Cost
- Free Tier: $0
- Production Ready: ~$20-40/month

## Support

For issues or questions:
- Vercel Documentation: https://vercel.com/docs
- FastAPI on Vercel: https://vercel.com/guides/python
- Next.js Deployment: https://nextjs.org/docs/deployment

