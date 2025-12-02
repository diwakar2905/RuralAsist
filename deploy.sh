#!/bin/bash
# RuralAssist Deployment Helper Script

echo "🚀 RuralAssist Deployment Helper"
echo "================================="
echo ""

# Check if git repo is clean
if [[ -n $(git status --porcelain) ]]; then
    echo "⚠️  Warning: You have uncommitted changes"
    echo "📝 Please commit your changes before deploying:"
    echo "   git add ."
    echo "   git commit -m 'Ready for deployment'"
    echo "   git push origin main"
    echo ""
fi

# Check for required files
echo "✅ Checking deployment files..."
files_to_check=("render.yaml" "Procfile" "vercel.json" ".env.example" "requirements.txt")

for file in "${files_to_check[@]}"; do
    if [[ -f "$file" ]]; then
        echo "   ✅ $file"
    else
        echo "   ❌ $file (missing)"
    fi
done

echo ""
echo "📋 Deployment Checklist:"
echo "========================"
echo ""
echo "Backend (Render):"
echo "  [ ] Create account at render.com"
echo "  [ ] Connect GitHub repository"
echo "  [ ] Create new Web Service"
echo "  [ ] Set build command: pip install -r requirements.txt"
echo "  [ ] Set start command: uvicorn backend.main:app --host 0.0.0.0 --port \$PORT"
echo "  [ ] Add environment variables (BREVO_API_KEY, JWT_SECRET_KEY, etc.)"
echo ""
echo "Frontend (Vercel):"
echo "  [ ] Create account at vercel.com"
echo "  [ ] Import Git repository"
echo "  [ ] Set root directory to 'frontend'"
echo "  [ ] Deploy and get URL"
echo "  [ ] Update config.production.js with Render backend URL"
echo "  [ ] Redeploy frontend"
echo ""
echo "🎉 Your RuralAssist app will be live!"
echo ""
echo "📖 For detailed instructions, see: READY_FOR_DEPLOYMENT.md"