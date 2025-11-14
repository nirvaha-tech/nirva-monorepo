# Quick Start Guide

Get the Nirvahatech landing page running in 5 minutes!

## 🚀 Fastest Way to Start

### Option 1: Docker Compose (Recommended)

```bash
# 1. Clone and navigate
cd /Users/liorzam/Documents/navi

# 2. Start everything with one command
docker-compose up -d

# 3. Wait 30 seconds for services to be ready, then visit:
# - Frontend: http://localhost:3000
# - Backend API: http://localhost:8000/docs
# - Health check: http://localhost:8000/health
```

That's it! 🎉

### Option 2: Local Development (No Docker)

#### Prerequisites
- Node.js 20+
- Python 3.11+
- PostgreSQL 16

#### Backend

```bash
# Terminal 1 - Start PostgreSQL (if not running)
# On macOS with Homebrew:
brew services start postgresql@16

# Create database
createdb nirvahatech

# Setup backend
cd backend
python3.11 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Run migrations
alembic upgrade head

# Start backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

#### Frontend

```bash
# Terminal 2 - Setup and start frontend
cd frontend
npm install
npm run dev
```

Visit http://localhost:3000

## 🧪 Test the Application

### Test Backend Health

```bash
curl http://localhost:8000/health
```

Expected response:
```json
{
  "status": "healthy",
  "service": "Nirvahatech API",
  "version": "1.0.0"
}
```

### Test Lead Submission

```bash
curl -X POST http://localhost:8000/api/v1/leads \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "company": "Tech Corp",
    "job_title": "CTO",
    "phone": "+1-555-0100",
    "project_description": "We need help scaling our Kubernetes infrastructure for high traffic loads."
  }'
```

### Test Frontend Form

1. Visit http://localhost:3000
2. Scroll to the contact form
3. Fill out all fields
4. Click "Request My Free Assessment"
5. You should see a success message

### View Submitted Leads

```bash
curl http://localhost:8000/api/v1/leads
```

Or visit http://localhost:8000/docs and try the interactive API.

## 📊 View Logs

```bash
# All services
docker-compose logs -f

# Just backend
docker-compose logs -f backend

# Just frontend
docker-compose logs -f frontend

# Just database
docker-compose logs -f postgres
```

## 🛑 Stop Everything

```bash
# Stop but keep data
docker-compose down

# Stop and remove all data
docker-compose down -v
```

## 🔧 Common Issues

### Port Already in Use

If you get "port already in use" errors:

```bash
# Find and kill process on port 3000 (frontend)
lsof -ti:3000 | xargs kill -9

# Find and kill process on port 8000 (backend)
lsof -ti:8000 | xargs kill -9

# Find and kill process on port 5432 (postgres)
lsof -ti:5432 | xargs kill -9
```

### Database Connection Error

```bash
# Check if PostgreSQL is running
docker-compose ps postgres

# Restart database
docker-compose restart postgres

# Check logs
docker-compose logs postgres
```

### Frontend Build Error

```bash
# Clear Next.js cache
cd frontend
rm -rf .next node_modules
npm install
npm run build
```

### Backend Import Error

```bash
# Reinstall dependencies
cd backend
source venv/bin/activate
pip install --upgrade -r requirements.txt
```

## 📝 Next Steps

Once you have it running locally:

1. ✅ Customize content in `frontend/src/components/`
2. ✅ Update branding colors in `frontend/tailwind.config.ts`
3. ✅ Configure email notifications (see backend `.env.example`)
4. ✅ Set up production deployment (see [DEPLOYMENT.md](DEPLOYMENT.md))

## 🆘 Need Help?

- Check [README.md](README.md) for detailed documentation
- See [DEPLOYMENT.md](DEPLOYMENT.md) for AWS deployment
- Check [CONTRIBUTING.md](CONTRIBUTING.md) for development guidelines
- Email: dev@nirvahatech.com

---

**Pro Tip**: Use `make dev` as a shortcut for `docker-compose up -d` and other common tasks. Run `make help` to see all available commands.

