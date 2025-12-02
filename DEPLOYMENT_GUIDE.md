# 🚀 Deployment Guide - Rural Assist Platform

## Complete guide for deploying to production

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Deployment Options](#deployment-options)
3. [Option 1: Deploy to Railway (Recommended)](#option-1-deploy-to-railway-recommended)
4. [Option 2: Deploy to Render](#option-2-deploy-to-render)
5. [Option 3: Deploy to Vercel + Railway](#option-3-deploy-to-vercel--railway)
6. [Option 4: Deploy to AWS EC2](#option-4-deploy-to-aws-ec2)
7. [Option 5: Deploy to DigitalOcean](#option-5-deploy-to-digitalocean)
8. [Domain Configuration](#domain-configuration)
9. [Environment Variables](#environment-variables)
10. [Post-Deployment Checklist](#post-deployment-checklist)
11. [Monitoring & Maintenance](#monitoring--maintenance)

---

## 📦 Prerequisites

### Required Accounts
- [ ] **GitHub Account** - For code repository
- [ ] **Brevo Account** - For email service (already have API key)
- [ ] **Domain Name** (Optional) - For custom domain
- [ ] **Deployment Platform Account** - Choose from Railway, Render, Vercel, AWS, or DigitalOcean

### Required Files
- [ ] All project files from this workspace
- [ ] `.env` file with valid credentials
- [ ] `requirements.txt` with all dependencies

---

## 🎯 Deployment Options

| Platform | Cost | Difficulty | Best For |
|----------|------|------------|----------|
| **Railway** | $5-20/mo | ⭐ Easy | Full-stack (Backend + Frontend) |
| **Render** | Free-$20/mo | ⭐ Easy | Backend + Static Frontend |
| **Vercel + Railway** | Free-$10/mo | ⭐⭐ Medium | Frontend on Vercel, Backend on Railway |
| **AWS EC2** | $10-50/mo | ⭐⭐⭐ Hard | Full control, scalable |
| **DigitalOcean** | $6-20/mo | ⭐⭐ Medium | VPS with good docs |

**Recommendation:** Start with Railway (easiest) or Render (free tier available)

---

## 🚂 Option 1: Deploy to Railway (Recommended)

### Why Railway?
- ✅ Easiest deployment
- ✅ Automatic HTTPS
- ✅ Built-in monitoring
- ✅ Free trial ($5 credit)
- ✅ Handles both backend & frontend

### Step-by-Step Guide

#### 1. Prepare Repository
```bash
# Navigate to project folder
cd "c:\Users\diwak\OneDrive\Desktop\M Project\Harshimaaaa-deepsite-project"

# Initialize git (if not already)
git init

# Create .gitignore
echo "__pycache__/
*.pyc
.env
*.log
uploads/ocr_temp/*
!uploads/ocr_temp/.gitkeep
node_modules/" > .gitignore

# Create .gitkeep for uploads folder
New-Item -ItemType File -Path "backend/uploads/ocr_temp/.gitkeep" -Force

# Commit all files
git add .
git commit -m "Initial commit - Rural Assist Platform"

# Create GitHub repository (via GitHub website)
# Then push:
git remote add origin https://github.com/YOUR_USERNAME/rural-assist.git
git branch -M main
git push -u origin main
```

---

#### 2. Create Railway Project

1. **Go to Railway:** https://railway.app/
2. **Sign up** with GitHub
3. **Click "New Project"**
4. **Select "Deploy from GitHub repo"**
5. **Choose your `rural-assist` repository**

---

#### 3. Configure Backend Service

**Add Service:**
1. Click **"+ New"** → **"Service"**
2. Select your repository
3. Configure:

**Root Directory:** `/backend`

**Build Command:**
```bash
pip install -r requirements.txt
```

**Start Command:**
```bash
uvicorn main:app --host 0.0.0.0 --port $PORT
```

**Environment Variables:**
```env
BREVO_API_KEY=your_brevo_api_key_here
SENDER_EMAIL=your_verified_sender_email@example.com
SENDER_NAME=Rural Assist Team
JWT_SECRET=your-super-secret-jwt-key-change-in-production-min-32-chars
ENVIRONMENT=production
ALLOWED_ORIGINS=https://your-frontend-url.railway.app
```

**Port:** Railway auto-assigns (uses `$PORT`)

---

#### 4. Configure Frontend Service

**Add Another Service:**
1. Click **"+ New"** → **"Service"**
2. Select same repository
3. Configure:

**Root Directory:** `/frontend`

**Build Command:**
```bash
# No build needed for static files
echo "Static files ready"
```

**Start Command:**
```bash
python -m http.server $PORT
```

**Environment Variables:**
```env
BACKEND_URL=https://your-backend-url.railway.app
```

---

#### 5. Update Frontend API URLs

Railway will give you URLs like:
- Backend: `https://rural-assist-backend.up.railway.app`
- Frontend: `https://rural-assist-frontend.up.railway.app`

**Update these files with your Railway backend URL:**

**frontend/assets/js/login.js:**
```javascript
const BACKEND_URL = "https://rural-assist-backend.up.railway.app";
```

**frontend/assets/js/schemes.js:**
```javascript
const BACKEND_URL = "https://rural-assist-backend.up.railway.app";
```

**frontend/assets/js/faq.js:**
```javascript
const BACKEND_URL = "https://rural-assist-backend.up.railway.app";
```

**frontend/assets/js/chatbot.js:**
```javascript
const BACKEND_URL = "https://rural-assist-backend.up.railway.app";
```

**frontend/assets/js/ocr.js:**
```javascript
const BACKEND_URL = "https://rural-assist-backend.up.railway.app";
```

**frontend/assets/js/report.js:**
```javascript
const BACKEND_URL = "https://rural-assist-backend.up.railway.app";
```

---

#### 6. Configure CORS

**Update backend/main.py:**
```python
# Add your Railway frontend URL
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5500",
        "http://127.0.0.1:5500",
        "https://rural-assist-frontend.up.railway.app",  # Add this
        "*"  # Remove in production, specify exact domains
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

#### 7. Deploy Updates

```bash
# Commit changes
git add .
git commit -m "Configure for Railway deployment"
git push origin main
```

Railway will **auto-deploy** on every push! 🎉

---

#### 8. Verify Deployment

**Test Backend:**
```
https://your-backend-url.railway.app/
https://your-backend-url.railway.app/schemes/local
https://your-backend-url.railway.app/faq
```

**Test Frontend:**
```
https://your-frontend-url.railway.app/
https://your-frontend-url.railway.app/login.html
https://your-frontend-url.railway.app/schemes.html
```

---

## 🎨 Option 2: Deploy to Render

### Why Render?
- ✅ **Free tier** available
- ✅ Auto HTTPS
- ✅ Easy setup
- ❌ Slower cold starts on free tier

### Step-by-Step Guide

#### 1. Push to GitHub
```bash
# Same as Railway step 1
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/rural-assist.git
git push -u origin main
```

---

#### 2. Deploy Backend

1. **Go to Render:** https://render.com/
2. **Sign up** with GitHub
3. **Click "New +"** → **"Web Service"**
4. **Connect repository:** `rural-assist`
5. **Configure:**

**Name:** `rural-assist-backend`
**Root Directory:** `backend`
**Environment:** `Python 3`
**Build Command:** `pip install -r requirements.txt`
**Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
**Plan:** Free (or Starter $7/mo for always-on)

**Environment Variables:**
```env
BREVO_API_KEY=your_brevo_api_key_here
SENDER_EMAIL=your_verified_sender_email@example.com
SENDER_NAME=Rural Assist Team
JWT_SECRET=your-super-secret-jwt-key-change-in-production-min-32-chars
ENVIRONMENT=production
PYTHON_VERSION=3.11.0
```

6. **Click "Create Web Service"**

---

#### 3. Deploy Frontend

1. **Click "New +"** → **"Static Site"**
2. **Connect repository:** `rural-assist`
3. **Configure:**

**Name:** `rural-assist-frontend`
**Root Directory:** `frontend`
**Build Command:** `echo "Static site ready"`
**Publish Directory:** `.` (current directory)
**Plan:** Free

4. **Click "Create Static Site"**

---

#### 4. Update Frontend URLs

Render gives URLs like:
- Backend: `https://rural-assist-backend.onrender.com`
- Frontend: `https://rural-assist-frontend.onrender.com`

Update all `BACKEND_URL` in frontend JS files (same as Railway step 5)

---

#### 5. Configure CORS

Add Render frontend URL to `backend/main.py`:
```python
allow_origins=[
    "https://rural-assist-frontend.onrender.com",
    # ...
]
```

---

#### 6. Deploy Updates
```bash
git add .
git commit -m "Configure for Render deployment"
git push origin main
```

Render auto-deploys on push!

---

## ⚡ Option 3: Deploy to Vercel + Railway

### Why This Combo?
- ✅ **Vercel:** Best for frontend (free, fast CDN)
- ✅ **Railway:** Best for backend (easy Python hosting)
- ✅ **Combined:** Fast frontend + reliable backend

### Step-by-Step Guide

#### 1. Deploy Backend to Railway
Follow **Option 1, Steps 1-3** (Backend only)

---

#### 2. Deploy Frontend to Vercel (Detailed Steps)

**Why Vercel for Frontend?**
- ⚡ **Global CDN** - Lightning-fast page loads worldwide
- 🆓 **Free tier** - Generous limits for personal projects
- 🚀 **Zero config** - Works with static HTML/CSS/JS
- 🔄 **Auto-deploy** - Every git push triggers deployment
- 🌐 **Free HTTPS** - SSL certificate included
- 📊 **Analytics** - Built-in performance monitoring

---

**Step 1: Create Vercel Account**

1. **Navigate to Vercel:** https://vercel.com/
2. **Click "Sign Up"**
3. **Choose "Continue with GitHub"** 
   - This connects your GitHub account
   - Vercel will request permissions to access repositories
4. **Authorize Vercel** - Click "Authorize Vercel"
5. **Complete profile setup** - Add username/team name

---

**Step 2: Import Your Repository**

1. **From Vercel Dashboard:**
   - Click **"Add New..."** button (top right)
   - Select **"Project"** from dropdown

2. **Import Git Repository:**
   - You'll see list of your GitHub repositories
   - Find **"rural-assist"** (or your repository name)
   - Click **"Import"** button next to it
   
   > **Note:** If you don't see your repo, click "Adjust GitHub App Permissions" to grant Vercel access

---

**Step 3: Configure Project Settings**

Vercel will show a configuration screen. Here's what each field means:

**🔧 Framework Preset:**
- **Select:** `Other`
- **Why:** We're using plain HTML/CSS/JS, not a framework like Next.js or React
- **Impact:** Vercel won't run any framework-specific build processes

**📁 Root Directory:**
- **Enter:** `frontend`
- **Why:** Your frontend files are in the `frontend` folder, not root
- **How:** Click "Edit" next to Root Directory → Type `frontend` → Click "Continue"
- **Impact:** Vercel will only deploy files from this folder

**🏗️ Build Command:**
- **Leave EMPTY** (or enter: `echo "Static files - no build needed"`)
- **Why:** Static HTML doesn't need compilation/bundling
- **Alternative:** If you had TypeScript/Sass, you'd add build commands here

**📦 Output Directory:**
- **Enter:** `.` (just a dot)
- **Why:** `.` means "current directory" - use all files in `frontend/` folder
- **Impact:** All your HTML, CSS, JS files will be served directly

**Example Configuration Visual:**
```
┌─────────────────────────────────────────┐
│ Configure Project                       │
├─────────────────────────────────────────┤
│ Framework Preset: [Other            ▼] │
│ Root Directory:   [frontend         ▼] │
│ Build Command:    [                  ] │ ← Leave empty
│ Output Directory: [.                 ] │
│ Install Command:  [                  ] │ ← Auto-detected
└─────────────────────────────────────────┘
```

---

**Step 4: Add Environment Variables (Optional but Recommended)**

1. **Click "Environment Variables"** section (before deploying)

2. **Add BACKEND_URL variable:**
   ```
   Key:   BACKEND_URL
   Value: https://your-backend-url.up.railway.app
   ```
   
   > **Replace** `your-backend-url.up.railway.app` with your actual Railway backend URL
   
3. **Why add this?**
   - Although static sites can't use server-side env vars
   - Useful for documentation and future build process
   - Can be accessed via Vercel CLI for build-time replacement

**Alternative Approach (What we'll actually do):**
- We'll **hardcode** the Railway backend URL directly in JavaScript files
- This is simpler for static sites
- Environment variables are more useful for Next.js/React apps

---

**Step 5: Deploy!**

1. **Click "Deploy"** button (bottom of config page)

2. **Watch the build process:**
   ```
   ✓ Cloning repository...
   ✓ Analyzing source code...
   ✓ Installing dependencies... (if any)
   ✓ Building project... (skipped for static sites)
   ✓ Uploading to CDN...
   ✓ Deployment ready!
   ```
   
3. **Deployment time:** Usually 30-60 seconds

4. **Success screen shows:**
   - 🎉 **Congratulations** message
   - 🔗 **Production URL:** `https://rural-assist-xxxx.vercel.app`
   - 🖼️ **Preview screenshot** of your site
   - 📊 **Deployment details** (build time, size, etc.)

---

**Step 6: Get Your Vercel URLs**

After deployment, Vercel provides multiple URLs:

1. **Production URL (Primary):**
   ```
   https://rural-assist.vercel.app
   ```
   - This is your main URL
   - Automatically updated on every `main` branch push
   - Use this for sharing

2. **Preview URLs (Automatic):**
   ```
   https://rural-assist-git-feature-branch.vercel.app
   ```
   - Created for every branch/PR
   - Great for testing before merging

3. **Deployment URLs (Unique):**
   ```
   https://rural-assist-abc123.vercel.app
   ```
   - Each deployment gets unique URL
   - Never changes, great for rollback

**Copy your production URL** - you'll need it for the next steps!

---

#### 3. Update Frontend JavaScript Files (Critical Step)

**Why this is needed:**
- Your JavaScript files currently have: `const BACKEND_URL = "http://127.0.0.1:8000"`
- This only works locally!
- We need to change it to your Railway backend URL

**Files to update:** (6 files total)

1. **frontend/assets/js/login.js**
2. **frontend/assets/js/schemes.js**
3. **frontend/assets/js/faq.js**
4. **frontend/assets/js/chatbot.js**
5. **frontend/assets/js/ocr.js**
6. **frontend/assets/js/report.js**

---

**Method 1: Manual Update (Recommended for learning)**

Open each file and change:

**Before:**
```javascript
const BACKEND_URL = "http://127.0.0.1:8000";
```

**After:**
```javascript
const BACKEND_URL = "https://rural-assist-backend.up.railway.app";  // Your Railway URL
```

**Example for login.js:**
```javascript
// frontend/assets/js/login.js
const BACKEND_URL = "https://rural-assist-backend.up.railway.app";  // ✅ Production URL

async function sendOTP() {
    const email = document.getElementById("email").value;
    
    const response = await fetch(`${BACKEND_URL}/auth/send-email-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
    });
    // ... rest of code
}
```

---

**Method 2: PowerShell Bulk Update (Faster)**

```powershell
# Navigate to frontend/assets/js folder
cd "c:\Users\diwak\OneDrive\Desktop\M Project\Harshimaaaa-deepsite-project\frontend\assets\js"

# Replace in all JS files (update YOUR_RAILWAY_URL)
Get-ChildItem *.js | ForEach-Object {
    (Get-Content $_.FullName) -replace 'http://127.0.0.1:8000', 'https://rural-assist-backend.up.railway.app' | 
    Set-Content $_.FullName
}

# Verify changes
Get-ChildItem *.js | Select-String "BACKEND_URL"
```

**Output should show:**
```
login.js:1:const BACKEND_URL = "https://rural-assist-backend.up.railway.app";
schemes.js:1:const BACKEND_URL = "https://rural-assist-backend.up.railway.app";
faq.js:1:const BACKEND_URL = "https://rural-assist-backend.up.railway.app";
...
```

---

**Method 3: Git Bash (Mac/Linux/WSL)**

```bash
# Navigate to frontend/assets/js
cd frontend/assets/js

# Replace in all JS files
sed -i 's|http://127.0.0.1:8000|https://rural-assist-backend.up.railway.app|g' *.js

# Verify
grep "BACKEND_URL" *.js
```

---

**Important URLs to Update:**

| File | Current (Local) | Update To (Production) |
|------|----------------|------------------------|
| `login.js` | `http://127.0.0.1:8000` | `https://your-backend.up.railway.app` |
| `schemes.js` | `http://127.0.0.1:8000` | `https://your-backend.up.railway.app` |
| `faq.js` | `http://127.0.0.1:8000` | `https://your-backend.up.railway.app` |
| `chatbot.js` | `http://127.0.0.1:8000` | `https://your-backend.up.railway.app` |
| `ocr.js` | `http://127.0.0.1:8000` | `https://your-backend.up.railway.app` |
| `report.js` | `http://127.0.0.1:8000` | `https://your-backend.up.railway.app` |

---

**After updating, commit and push:**

```bash
git add frontend/assets/js/*.js
git commit -m "Update API URLs for Vercel deployment"
git push origin main
```

Vercel will **auto-deploy** within 30 seconds! 🚀

---

#### 4. Configure CORS on Backend (Essential for Security)

**What is CORS?**
- **CORS** = Cross-Origin Resource Sharing
- **Purpose:** Prevents unauthorized websites from accessing your API
- **Problem:** Without CORS, your Vercel site can't call Railway backend
- **Solution:** Add Vercel URL to allowed origins

---

**Step-by-Step CORS Configuration:**

**1. Open backend/main.py**

**2. Find the CORS middleware section:**
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5500",
        "http://127.0.0.1:5500",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

**3. Add your Vercel URL:**
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        # Local development
        "http://localhost:5500",
        "http://127.0.0.1:5500",
        
        # Production - Vercel frontend
        "https://rural-assist.vercel.app",              # ✅ Add this
        "https://rural-assist-git-main.vercel.app",    # ✅ Git branch URLs
        "https://*.vercel.app",                         # ✅ All preview URLs (optional)
        
        # If you have custom domain later
        # "https://www.yourdomain.com",
        # "https://yourdomain.com",
    ],
    allow_credentials=True,
    allow_methods=["*"],  # Allows GET, POST, PUT, DELETE, etc.
    allow_headers=["*"],  # Allows all headers
)
```

---

**Understanding CORS Parameters:**

| Parameter | Value | Meaning |
|-----------|-------|---------|
| `allow_origins` | List of URLs | Which websites can access your API |
| `allow_credentials` | `True` | Allow cookies/auth headers |
| `allow_methods` | `["*"]` | Allow all HTTP methods (GET, POST, etc.) |
| `allow_headers` | `["*"]` | Allow all request headers |

---

**Security Best Practices:**

**❌ Don't do this in production:**
```python
allow_origins=["*"]  # Allows ANY website to access your API!
```

**✅ Do this instead:**
```python
allow_origins=[
    "https://rural-assist.vercel.app",  # Only your sites
    "https://yourdomain.com",
]
```

---

**4. Commit and push changes:**

```bash
# From project root
git add backend/main.py
git commit -m "Add Vercel URL to CORS allowed origins"
git push origin main
```

**5. Railway auto-deploys:**
- Railway detects the push
- Rebuilds backend (30-60 seconds)
- New CORS settings active!

---

**6. Verify CORS is working:**

**Test in browser console (F12):**
```javascript
// Visit https://rural-assist.vercel.app
// Open DevTools Console (F12)
// Run this:

fetch('https://your-backend.up.railway.app/schemes/local')
    .then(r => r.json())
    .then(d => console.log('✅ CORS working!', d))
    .catch(e => console.error('❌ CORS blocked:', e));
```

**Expected result:**
```
✅ CORS working! {schemes: Array(100+), ...}
```

**If you see this error:**
```
❌ Access to fetch at 'https://...' from origin 'https://rural-assist.vercel.app' 
   has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header
```

**Fix:** Double-check your Vercel URL is in `allow_origins` list, then redeploy Railway.

---

**Complete Deployment Flow Diagram:**

```
┌─────────────────┐
│  Push to GitHub │
└────────┬────────┘
         │
    ┌────┴─────┐
    │          │
    ▼          ▼
┌────────┐  ┌────────┐
│Railway │  │Vercel  │
│Backend │  │Frontend│
└───┬────┘  └────┬───┘
    │            │
    │  ┌─────────┘
    │  │
    ▼  ▼
┌──────────────────────┐
│  Frontend calls API  │
│  with CORS headers   │
└──────────────────────┘
         │
         ▼
    ┌─────────┐
    │ Success │
    │   🎉    │
    └─────────┘
```

---

**Testing Your Deployment:**

**1. Test Frontend:**
```
Visit: https://rural-assist.vercel.app/
Expected: Homepage loads with all styles/images
```

**2. Test Login:**
```
Visit: https://rural-assist.vercel.app/login.html
Action: Enter email → Click "Send OTP"
Expected: ✅ OTP sent message (check email inbox)
```

**3. Test Schemes:**
```
Visit: https://rural-assist.vercel.app/schemes.html
Expected: 100+ scheme cards visible
Action: Click "Update" button
Expected: Schemes refresh from backend
```

**4. Test FAQ:**
```
Visit: https://rural-assist.vercel.app/#faq
Action: Search "login"
Expected: Login-related FAQs appear
```

**5. Check Browser Console:**
```
Press F12 → Console tab
Expected: No red errors (especially no CORS errors)
```

---

**Troubleshooting Common Issues:**

**Issue 1: 404 Not Found on page refresh**

**Symptom:** `https://rural-assist.vercel.app/schemes.html` works first time, but refresh gives 404

**Fix:** Add `vercel.json` in frontend folder:
```json
{
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ]
}
```

**Issue 2: API calls showing 'localhost'**

**Symptom:** Network tab shows requests to `http://localhost:8000`

**Fix:** You forgot to update `BACKEND_URL` in JS files (see Step 3)

**Issue 3: CORS errors persist**

**Symptom:** "blocked by CORS policy" in console

**Fix Checklist:**
- [ ] Vercel URL added to `allow_origins` in `backend/main.py`
- [ ] Railway backend redeployed after CORS change
- [ ] Correct Vercel URL (check for typos)
- [ ] Clear browser cache (Ctrl+Shift+R)

---

**Automatic Redeployment:**

Every time you push to GitHub:
1. **Vercel** automatically redeploys frontend (30s)
2. **Railway** automatically redeploys backend (60s)
3. Both services send email notifications
4. Changes live within 1-2 minutes!

No manual redeployment needed! 🎉

---

## 🖥️ Option 4: Deploy to AWS EC2

### Why AWS?
- ✅ Full control
- ✅ Scalable
- ✅ Industry standard
- ❌ Complex setup
- ❌ Requires server management

### Step-by-Step Guide

#### 1. Launch EC2 Instance

1. **Go to AWS Console:** https://console.aws.amazon.com/
2. **Navigate to EC2**
3. **Click "Launch Instance"**
4. **Configure:**

**Name:** `rural-assist-server`
**AMI:** Ubuntu Server 22.04 LTS
**Instance Type:** t2.micro (free tier) or t2.small
**Key Pair:** Create new (download .pem file)
**Security Group:** 
   - SSH (22) - Your IP
   - HTTP (80) - Anywhere
   - HTTPS (443) - Anywhere
   - Custom TCP (8000) - Anywhere

5. **Click "Launch Instance"**

---

#### 2. Connect to Instance

```bash
# Windows (use Git Bash or WSL)
ssh -i "your-key.pem" ubuntu@your-ec2-public-ip

# Or use PuTTY on Windows
```

---

#### 3. Install Dependencies

```bash
# Update system
sudo apt update
sudo apt upgrade -y

# Install Python
sudo apt install python3 python3-pip python3-venv -y

# Install Nginx
sudo apt install nginx -y

# Install Git
sudo apt install git -y
```

---

#### 4. Clone Repository

```bash
cd /home/ubuntu
git clone https://github.com/YOUR_USERNAME/rural-assist.git
cd rural-assist
```

---

#### 5. Setup Backend

```bash
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
nano .env
# Paste your environment variables
# Ctrl+X, Y, Enter to save

# Test backend
uvicorn main:app --host 0.0.0.0 --port 8000
```

---

#### 6. Setup Systemd Service

```bash
sudo nano /etc/systemd/system/rural-assist.service
```

**Paste:**
```ini
[Unit]
Description=Rural Assist Backend
After=network.target

[Service]
User=ubuntu
WorkingDirectory=/home/ubuntu/rural-assist/backend
Environment="PATH=/home/ubuntu/rural-assist/backend/venv/bin"
ExecStart=/home/ubuntu/rural-assist/backend/venv/bin/uvicorn main:app --host 0.0.0.0 --port 8000
Restart=always

[Install]
WantedBy=multi-user.target
```

**Enable and start:**
```bash
sudo systemctl daemon-reload
sudo systemctl enable rural-assist
sudo systemctl start rural-assist
sudo systemctl status rural-assist
```

---

#### 7. Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/rural-assist
```

**Paste:**
```nginx
server {
    listen 80;
    server_name your-domain.com;  # Or EC2 public IP

    # Frontend
    location / {
        root /home/ubuntu/rural-assist/frontend;
        index index.html;
        try_files $uri $uri/ =404;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:8000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**Enable site:**
```bash
sudo ln -s /etc/nginx/sites-available/rural-assist /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

#### 8. Update Frontend URLs

**SSH to server:**
```bash
cd /home/ubuntu/rural-assist/frontend/assets/js

# Update all BACKEND_URL to use /api/ prefix
sed -i 's|http://127.0.0.1:8000|/api|g' *.js
```

Or manually edit each JS file:
```javascript
const BACKEND_URL = "/api";  // Nginx will proxy to backend
```

---

#### 9. Setup SSL (HTTPS)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo certbot renew --dry-run
```

---

#### 10. Verify Deployment

Visit:
- `http://your-ec2-ip/` - Frontend
- `http://your-ec2-ip/api/` - Backend API
- `https://your-domain.com/` - With SSL

---

## 🌊 Option 5: Deploy to DigitalOcean

### Why DigitalOcean?
- ✅ Simple VPS (Droplet)
- ✅ Good documentation
- ✅ $6/month entry tier
- ✅ One-click apps

### Step-by-Step Guide

#### 1. Create Droplet

1. **Go to DigitalOcean:** https://www.digitalocean.com/
2. **Click "Create"** → **"Droplets"**
3. **Configure:**

**Image:** Ubuntu 22.04 LTS
**Plan:** Basic ($6/mo or $12/mo)
**Datacenter:** Closest to users
**Authentication:** SSH Key (recommended) or Password
**Hostname:** `rural-assist`

4. **Click "Create Droplet"**

---

#### 2. Connect & Setup

```bash
# SSH to droplet
ssh root@your-droplet-ip

# Follow AWS EC2 steps 3-10
# (Installation, Nginx, Systemd, SSL)
```

The process is **identical to AWS EC2** from step 3 onwards!

---

## 🌐 Domain Configuration

### Option A: Use Railway/Render Domain
- Free subdomain: `rural-assist.up.railway.app`
- No setup needed!

---

### Option B: Custom Domain (Recommended)

#### 1. Buy Domain
- **Namecheap:** https://www.namecheap.com/
- **GoDaddy:** https://www.godaddy.com/
- **Google Domains:** https://domains.google/

**Cost:** $10-15/year

---

#### 2. Configure DNS

**For Railway/Render:**
1. Go to your domain registrar
2. Add DNS records:

```
Type    Name    Value
A       @       Your-Railway-IP (or CNAME to Railway URL)
CNAME   www     rural-assist.up.railway.app
```

3. In Railway/Render, add custom domain
4. Wait 5-60 minutes for DNS propagation

---

**For AWS/DigitalOcean:**
```
Type    Name    Value
A       @       Your-Server-IP
CNAME   www     your-domain.com
```

---

## 🔐 Environment Variables

### Production .env Template

```env
# Email Service (Brevo)
BREVO_API_KEY=your_brevo_api_key_here
SENDER_EMAIL=your_verified_sender_email@example.com
SENDER_NAME=Rural Assist Team

# Security
JWT_SECRET=CHANGE-THIS-TO-RANDOM-32-CHAR-STRING-IN-PRODUCTION
SECRET_KEY=ANOTHER-RANDOM-SECRET-KEY-FOR-SESSION-MANAGEMENT

# Environment
ENVIRONMENT=production
DEBUG=False

# CORS
ALLOWED_ORIGINS=https://your-frontend-url.com,https://www.your-frontend-url.com

# Database (if using PostgreSQL in future)
# DATABASE_URL=postgresql://user:pass@host:5432/dbname

# Optional
LOG_LEVEL=INFO
MAX_UPLOAD_SIZE=10485760  # 10MB
```

### Generate Secure Secrets

**Python:**
```python
import secrets
print(secrets.token_urlsafe(32))
```

**PowerShell:**
```powershell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```

---

## ✅ Post-Deployment Checklist

### Functionality Tests
- [ ] **Homepage loads** - Visit root URL
- [ ] **Email OTP login works** - Test with real email
- [ ] **Schemes page loads** - Check all 100+ schemes visible
- [ ] **FAQ search works** - Search for "login"
- [ ] **Chatbot responds** - Send test message
- [ ] **OCR upload works** - Upload test image
- [ ] **Scam reporting works** - Submit test report
- [ ] **Profile updates work** - Edit user profile
- [ ] **Mobile responsive** - Test on phone
- [ ] **All links work** - Click every navigation link

---

### Security Checks
- [ ] **HTTPS enabled** - Green padlock in browser
- [ ] **CORS configured** - Only allow your domains
- [ ] **API key hidden** - Not in frontend code
- [ ] **JWT secret changed** - Not default value
- [ ] **Rate limiting active** - Test rapid requests
- [ ] **File upload restricted** - Max 10MB, images only
- [ ] **SQL injection safe** - Using parameterized queries
- [ ] **XSS protected** - HTML escaped in templates

---

### Performance Checks
- [ ] **Page load < 3s** - Use Google PageSpeed
- [ ] **API response < 500ms** - Test with browser DevTools
- [ ] **Images optimized** - Compressed and WebP format
- [ ] **Caching enabled** - Check scheme cache works
- [ ] **CDN configured** - If using Vercel/Cloudflare
- [ ] **Gzip enabled** - Check response headers
- [ ] **Database indexed** - If using PostgreSQL

---

### Monitoring Setup
- [ ] **Error logging** - Setup Sentry or LogRocket
- [ ] **Uptime monitoring** - UptimeRobot or Pingdom
- [ ] **Analytics** - Google Analytics or Plausible
- [ ] **Email delivery** - Check Brevo dashboard
- [ ] **Server monitoring** - Railway/Render dashboard

---

## 📊 Monitoring & Maintenance

### 1. Uptime Monitoring

**UptimeRobot (Free):**
1. Go to https://uptimerobot.com/
2. Add monitors for:
   - `https://your-domain.com/` (every 5 min)
   - `https://your-domain.com/api/` (every 5 min)
3. Set alert email

---

### 2. Error Tracking

**Sentry (Free tier):**
```bash
# Install
pip install sentry-sdk

# Add to backend/main.py
import sentry_sdk
sentry_sdk.init(
    dsn="your-sentry-dsn",
    environment="production"
)
```

---

### 3. Analytics

**Google Analytics:**
```html
<!-- Add to frontend/index.html <head> -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

---

### 4. Backup Strategy

**Daily Backups:**
```bash
#!/bin/bash
# backup.sh

# Backup database files
tar -czf backup-$(date +%Y%m%d).tar.gz \
    backend/*.json \
    backend/uploads/

# Upload to cloud storage
# aws s3 cp backup-$(date +%Y%m%d).tar.gz s3://your-bucket/
```

**Cron job:**
```bash
crontab -e
# Add: 0 2 * * * /home/ubuntu/backup.sh
```

---

### 5. Update Workflow

```bash
# SSH to server
ssh user@your-server

# Pull latest code
cd rural-assist
git pull origin main

# Update dependencies
cd backend
source venv/bin/activate
pip install -r requirements.txt

# Restart service
sudo systemctl restart rural-assist

# Check status
sudo systemctl status rural-assist
```

---

## 🆘 Common Issues

### Issue: 502 Bad Gateway
**Cause:** Backend not running

**Fix:**
```bash
sudo systemctl status rural-assist
sudo systemctl restart rural-assist
sudo journalctl -u rural-assist -n 50
```

---

### Issue: CORS errors
**Cause:** Frontend URL not in allowed origins

**Fix:** Add frontend URL to `backend/main.py`:
```python
allow_origins=["https://your-frontend-url.com"]
```

---

### Issue: Emails not sending
**Cause:** Invalid API key or environment variables

**Fix:**
```bash
# Check environment variables
echo $BREVO_API_KEY

# Test email manually
python -c "from email_service import send_otp_email; print(send_otp_email('test@example.com', '123456', 'Test'))"
```

---

### Issue: Slow cold starts (Render free tier)
**Cause:** Server sleeps after 15 min inactivity

**Fix:**
1. Upgrade to paid tier ($7/mo)
2. Or use external ping service (UptimeRobot every 5 min)

---

## 💰 Cost Comparison

| Platform | Setup | Monthly Cost | Effort | Best For |
|----------|-------|--------------|--------|----------|
| **Railway** | 10 min | $5-20 | ⭐ Easy | Quick deployment |
| **Render** | 15 min | Free-$20 | ⭐ Easy | Testing/low budget |
| **Vercel+Railway** | 20 min | Free-$10 | ⭐⭐ Medium | Fast frontend |
| **AWS EC2** | 60 min | $10-50 | ⭐⭐⭐ Hard | Production scale |
| **DigitalOcean** | 45 min | $6-20 | ⭐⭐ Medium | Good balance |

---

## 📚 Additional Resources

- **Railway Docs:** https://docs.railway.app/
- **Render Docs:** https://render.com/docs
- **Vercel Docs:** https://vercel.com/docs
- **AWS EC2 Tutorial:** https://docs.aws.amazon.com/ec2/
- **Nginx Guide:** https://nginx.org/en/docs/
- **SSL/HTTPS Setup:** https://letsencrypt.org/
- **Domain DNS Guide:** https://www.cloudflare.com/learning/dns/what-is-dns/

---

## 🎉 Success!

Your Rural Assist platform is now live! 🚀

**Share your deployment:**
- Frontend: `https://your-domain.com/`
- API Docs: `https://your-domain.com/api/docs`

**Next steps:**
1. Monitor uptime and errors
2. Collect user feedback
3. Add new features
4. Scale as needed

---

**Last Updated:** December 2, 2025  
**Maintained by:** Rural Assist Team  
**Questions?** Open an issue on GitHub!
