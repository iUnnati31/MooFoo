#!/bin/bash

echo "🚀 MooFoo Deployment Script"
echo "=========================="

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git repository not found. Please initialize git first:"
    echo "   git init"
    echo "   git add ."
    echo "   git commit -m 'Initial commit'"
    echo "   git remote add origin <your-github-repo-url>"
    echo "   git push -u origin main"
    exit 1
fi

# Check if there are uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  You have uncommitted changes. Please commit them first:"
    echo "   git add ."
    echo "   git commit -m 'Prepare for deployment'"
    echo "   git push"
    exit 1
fi

echo "✅ Repository is ready for deployment!"
echo ""
echo "📋 Next steps:"
echo "1. Deploy backend to Render:"
echo "   - Go to render.com"
echo "   - Create new Web Service"
echo "   - Connect your GitHub repo"
echo "   - Set root directory to: app/backend"
echo "   - Set start command to: uvicorn api:app --host 0.0.0.0 --port \$PORT"
echo ""
echo "2. Deploy frontend to Vercel:"
echo "   - Go to vercel.com"
echo "   - Create new project"
echo "   - Connect your GitHub repo"
echo "   - Set root directory to: app/frontend"
echo ""
echo "3. Set environment variables:"
echo "   - Backend: OPENAI_API_KEY"
echo "   - Frontend: NEXT_PUBLIC_API_URL (set to your Render backend URL)"
echo ""
echo "📖 See DEPLOYMENT_GUIDE.md for detailed instructions" 