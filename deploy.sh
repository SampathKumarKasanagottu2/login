#!/bin/bash

# Cloud Deployment Script
# This script helps deploy to various cloud platforms

set -e

echo "🚀 Attendance Automation Cloud Deployment"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ .env file not found!"
    echo "Run 'pnpm run generate-keys' to create secure keys first."
    exit 1
fi

echo "✅ Environment file found"

# Check if Docker is available
if command -v docker &> /dev/null; then
    echo "✅ Docker is available"
    echo "Building Docker image..."
    docker build -t attendance-app .
    echo "✅ Docker image built successfully"
else
    echo "⚠️  Docker not found - you'll need to build manually on your cloud platform"
fi

echo ""
echo "📋 Deployment Checklist:"
echo "1. Choose a cloud platform (Railway recommended for beginners)"
echo "2. Fork this repository to your GitHub"
echo "3. Connect your forked repo to the cloud platform"
echo "4. Set these environment variables:"
echo "   - ENCRYPTION_KEY"
echo "   - SALT"
echo "   - ENABLE_AUTOMATION=true"
echo "5. Deploy!"
echo ""
echo "🔗 Recommended platforms:"
echo "   Railway: https://railway.app (easiest, free tier)"
echo "   Render: https://render.com (good free tier)"
echo "   Fly.io: https://fly.io (powerful free tier)"
echo ""
echo "📚 See README.md for detailed deployment instructions"