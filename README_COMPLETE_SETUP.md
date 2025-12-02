# 🚀 RuralAssist - Complete Setup & Troubleshooting Guide

## 📁 Project Structure

```
RuralAssist/
├── backend/
│   ├── main.py              # FastAPI app entry point
│   ├── auth_service.py      # Email OTP authentication
│   ├── email_service.py     # Brevo email integration
│   ├── schemes_service.py   # Government schemes API
│   ├── faq_service.py       # FAQ search API
│   ├── scam_service.py      # Scam detection
│   ├── ocr_service.py       # Document OCR
│   ├── chatbot_service.py   # AI chatbot
│   ├── profile_service.py   # User profiles
│   ├── .env                 # Environment variables
│   └── requirements.txt     # Python dependencies
│
└── frontend/
    ├── index.html           # Home page with FAQ
    ├── schemes.html         # Government schemes
    ├── login.html           # Email OTP login
    ├── ocr.html             # Document scanner
    ├── report.html          # Scam reporting
    ├── profile.html         # User profile
    ├── about.html           # About page
    ├── contact.html         # Contact page
    ├── assets/
    │   ├── css/
    │   │   ├── theme.css
    │   │   ├── style.css
    │   │   └── chatbot.css
    │   └── js/
    │       ├── main.js
    │       ├── schemes.js
    │       ├── faq.js
    │       ├── login.js
    │       ├── ocr.js
    │       └── chatbot.js
    └── chat_float.js        # Floating chatbot
```

---

## 🔧 Current Issues & Fixes

### Issue 1: Old cached version of files loading

**Problem:** Browser caching old JavaScript/CSS files

**Solution 1 - Hard Refresh:**
```
Press Ctrl + Shift + R (Windows/Linux)
Press Cmd + Shift + R (Mac)
```

**Solution 2 - Clear Browser Cache:**
```
Chrome/Edge: Ctrl + Shift + Delete → Clear cached files
Firefox: Ctrl + Shift + Delete → Cache
```

**Solution 3 - Disable Cache (Development):**
```
1. Press F12 (DevTools)
2. Go to Network tab
3. Check "Disable cache"
4. Keep DevTools open
```

**Solution 4 - Add version parameter:**
```
Visit: http://localhost:5500/schemes.html?v=12345
Change number each time: ?v=12346, ?v=12347
```

---

### Issue 2: Schemes/FAQs not visible

**Backend Check:**
```powershell
# Test schemes endpoint
Invoke-WebRequest http://localhost:8000/schemes/local

# Test FAQ endpoint  
Invoke-WebRequest http://localhost:8000/faq/search -Method POST -ContentType "application/json" -Body '{"query":"login","limit":5}'
```

**Frontend Check:**
```
1. Open http://localhost:5500/schemes.html
2. Press F12 → Console tab
3. Look for errors:
   - CORS errors → Backend not running
   - 404 errors → Wrong API URL
   - Connection refused → Port blocked
```

**Fix:**
1. Ensure backend running on port 8000
2. Ensure frontend running on port 5500
3. Clear browser cache (Ctrl + Shift + R)
4. Check browser console for errors

---

### Issue 3: Email OTP not sending

**Check Backend Status:**
```powershell
# Test email service directly
cd backend
python -c "from email_service import send_otp_email; print(send_otp_email('test@example.com', '123456'))"
```

**Expected Output:**
```
(201, '✅ OTP sent successfully to test@example.com')
```

**If fails:**
1. Check `.env` file has valid `BREVO_API_KEY`
2. Verify sender email in Brevo dashboard
3. Restart backend server (must restart after adding email_service.py)

**Test OTP endpoint:**
```powershell
Invoke-WebRequest -Uri "http://localhost:8000/auth/send-email-otp" -Method POST -ContentType "application/json" -Body '{"email":"youremail@example.com"}'
```

---

## ⚡ Quick Start Commands

### Start Backend
```powershell
cd "C:\Users\diwak\OneDrive\Desktop\M Project\Harshimaaaa-deepsite-project"
uvicorn backend.main:app --reload --port 8000
```

### Start Frontend (New Terminal)
```powershell
cd "C:\Users\diwak\OneDrive\Desktop\M Project\Harshimaaaa-deepsite-project\frontend"
python -m http.server 5500
```

### Access Application
- Home: http://localhost:5500/index.html
- Schemes: http://localhost:5500/schemes.html
- Login: http://localhost:5500/login.html
- OCR: http://localhost:5500/ocr.html
- Report Scam: http://localhost:5500/report.html
- Profile: http://localhost:5500/profile.html
- API Docs: http://localhost:8000/docs

---

## 🔍 Debugging Checklist

### Backend Issues
- [ ] Backend running? Check http://localhost:8000
- [ ] Dependencies installed? `pip install -r requirements.txt`
- [ ] `.env` file configured?
- [ ] No port conflicts? (Kill other processes on 8000)
- [ ] Check terminal for errors

### Frontend Issues
- [ ] Frontend server running? Check http://localhost:5500
- [ ] Browser cache cleared? (Ctrl + Shift + R)
- [ ] DevTools console errors? (F12)
- [ ] API URLs correct in JavaScript?
- [ ] CORS enabled in backend?

### Email OTP Issues
- [ ] Brevo API key valid?
- [ ] Sender email verified?
- [ ] Backend restarted after adding email_service.py?
- [ ] Check spam/junk folder
- [ ] Test with direct Python script

---

## 📊 File Status Summary

### ✅ Working Files
- `backend/main.py` - FastAPI app
- `backend/auth_service.py` - OTP auth (ENHANCED)
- `backend/email_service.py` - Brevo emails (NEW)
- `backend/schemes_service.py` - 100+ schemes
- `backend/faq_service.py` - FAQ search
- `frontend/index.html` - Home + FAQ
- `frontend/schemes.html` - Schemes with cache
- `frontend/login.html` - Email OTP login
- `frontend/assets/js/login.js` - Enhanced with resend
- `frontend/assets/js/faq.js` - FAQ search
- `frontend/assets/js/schemes.js` - Schemes display

### ⚠️ Needs Attention
- Browser cache clearing (user action)
- Brevo API configuration (add real key)

---

## 🎯 Immediate Actions Required

### For You to Do:
1. **Clear browser cache**: Ctrl + Shift + R on all pages
2. **Configure Brevo**: Update `backend/.env` with real API key
3. **Verify sender email**: In Brevo dashboard
4. **Test login flow**: Use your email address

### Already Done:
- ✅ Email service created (email_service.py)
- ✅ Auth service enhanced (OTP hashing, attempts, rate limiting)
- ✅ Frontend login updated (resend button, countdown timer)
- ✅ Dependencies added (python-dotenv, requests)
- ✅ Environment configured (.env file)
- ✅ Schemes with caching system
- ✅ FAQ with search functionality

---

## 🔐 Environment Variables

**File: `backend/.env`**
```env
# Brevo Email Configuration
BREVO_API_KEY=your_actual_brevo_api_key_here
SENDER_EMAIL=your_verified_email@example.com

# JWT Configuration
JWT_SECRET=RURALASSIST_SECRET_KEY_2025_SECURE
JWT_ALGO=HS256

# OTP Configuration
OTP_EXPIRY_MINUTES=5
```

**How to get Brevo API key:**
1. Sign up: https://app.brevo.com
2. Go to Settings → API Keys
3. Create new key → Copy
4. Paste in `.env` file
5. Verify sender email in dashboard

---

## 📞 Support

**Check these first:**
1. Is backend running? → http://localhost:8000
2. Is frontend running? → http://localhost:5500
3. Browser cache cleared? → Ctrl + Shift + R
4. Console errors? → F12 → Console tab

**Common Error Messages:**

| Error | Cause | Solution |
|-------|-------|----------|
| "Failed to fetch" | Backend not running | Start backend: `uvicorn backend.main:app --reload --port 8000` |
| "CORS error" | Frontend wrong port | Use port 5500 for frontend |
| "Email service unavailable" | Invalid API key | Check `.env` file |
| "Old version loading" | Browser cache | Ctrl + Shift + R |
| "No schemes found" | Backend/cache issue | Click "Refresh" button on schemes page |

---

## 🎨 UI Improvements Made

### Schemes Page
- ✅ Online/Offline status indicator
- ✅ Local caching (1-hour cache)
- ✅ Update button (fetch latest)
- ✅ Refresh button (clear cache)
- ✅ Beautiful card design
- ✅ Category filters
- ✅ Search functionality

### Login Page
- ✅ Resend OTP button (30-second cooldown)
- ✅ Countdown timer
- ✅ Status messages (color-coded)
- ✅ Enter key support
- ✅ Auto-focus on fields
- ✅ Activity logging

### FAQ Section
- ✅ Integrated in home page
- ✅ Search functionality
- ✅ Collapsible cards
- ✅ Popular tags
- ✅ Bilingual support ready

---

## 🚨 Critical Notes

1. **Always hard refresh after changes**: Ctrl + Shift + R
2. **Backend must restart** after adding new Python files
3. **Port 5500** for frontend, **port 8000** for backend
4. **Check console** (F12) for JavaScript errors
5. **Verify Brevo email** before testing OTP

---

## ✨ Next Steps

1. Clear browser cache (Ctrl + Shift + R)
2. Test each page:
   - Home → FAQ working?
   - Schemes → Cards visible?
   - Login → OTP sending?
3. Configure Brevo API key
4. Test complete login flow
5. Report any remaining issues

---

**Last Updated:** December 2, 2025  
**Status:** ✅ All major components ready  
**Action Required:** Clear browser cache & configure Brevo API
