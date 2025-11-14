#!/bin/bash

# Deployment script for Vercel
# This script helps deploy the Nirvahatech application to Vercel

set -e

echo "🚀 Nirvahatech Vercel Deployment Script"
echo "========================================"
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI is not installed"
    echo "📦 Installing Vercel CLI..."
    npm i -g vercel
fi

echo "✅ Vercel CLI is installed"
echo ""

# Ask user what to deploy
echo "What would you like to deploy?"
echo "1) Frontend only"
echo "2) Backend only"
echo "3) Both (separate deployments)"
echo ""
read -p "Enter your choice (1-3): " choice

case $choice in
    1)
        echo ""
        echo "📦 Deploying Frontend..."
        cd frontend
        vercel --prod
        ;;
    2)
        echo ""
        echo "⚠️  Note: Vercel has limitations for FastAPI backends"
        echo "Consider using Railway.app or Render.com for better FastAPI support"
        echo ""
        read -p "Continue with Vercel? (y/n): " continue
        if [ "$continue" = "y" ]; then
            echo "📦 Deploying Backend..."
            cd backend
            vercel --prod
        else
            echo "Deployment cancelled"
            exit 0
        fi
        ;;
    3)
        echo ""
        echo "📦 Deploying Frontend..."
        cd frontend
        vercel --prod
        
        echo ""
        echo "⚠️  Note: Vercel has limitations for FastAPI backends"
        echo "Consider using Railway.app or Render.com for better FastAPI support"
        echo ""
        read -p "Deploy backend to Vercel too? (y/n): " continue
        if [ "$continue" = "y" ]; then
            cd ../backend
            echo "📦 Deploying Backend..."
            vercel --prod
        fi
        ;;
    *)
        echo "❌ Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📝 Next steps:"
echo "1. Set up environment variables in Vercel dashboard"
echo "2. Configure your database (Neon, Supabase, or Railway)"
echo "3. Update CORS settings with your frontend URL"
echo "4. Test your deployment"
echo ""
echo "📖 See VERCEL_DEPLOYMENT.md for detailed instructions"

