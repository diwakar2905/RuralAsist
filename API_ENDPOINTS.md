# RuralAssist API Endpoints Mapping

## Backend Routes (http://127.0.0.1:8000)

### ✅ Authentication Service (`/auth`)
- `POST /auth/send-email-otp` - Send OTP to email
- `POST /auth/verify-email-otp` - Verify OTP and login
- `POST /auth/resend-otp` - Resend OTP

### ✅ OCR Service (`/ocr`)
- `POST /ocr/extract` - Extract text from uploaded file

### ✅ Chatbot Service (`/chatbot`)
- `POST /chatbot/message` - Send message to chatbot

### ✅ Schemes Service (`/schemes`)
- `GET /schemes` - List all schemes with filters
- `GET /schemes/local` - Get schemes from local database
- `GET /schemes/online` - Get schemes from online API
- `POST /schemes/update` - Update schemes database
- `GET /schemes/search` - Search schemes
- `GET /schemes/status` - Check online status
- `GET /schemes/health` - Health check
- `GET /schemes/{scheme_id}` - Get specific scheme
- `GET /schemes/category/{category}` - Filter by category
- `GET /schemes/state/{state}` - Filter by state

### ✅ Scam Service (`/scam`)
- `POST /scam/analyze` - Analyze scam text
- `POST /scam/report` - Submit scam report
- `GET /scam/common-scams` - Get common scams list

### ✅ FAQ Service (`/faq`)
- `POST /faq/search` - Search FAQs

### ✅ Profile Service (`/profile`)
- `GET /profile/me` - Get user profile
- `POST /profile/me` - Update user profile
- `GET /profile/dashboard` - Get dashboard data
- `POST /profile/activity` - Log user activity

### ✅ Root Endpoints
- `GET /` - API status and routes list
- `GET /favicon.ico` - Favicon (returns 204)

## Frontend-Backend Connections Status

### ✅ FIXED Issues:
1. **API URL Standardization**: All files now use `http://127.0.0.1:8000`
2. **Config Centralization**: Added `config.js` for centralized configuration
3. **Language Key Consistency**: Fixed `ruralasist_language` → `ruralassist_language`
4. **Broken chatbot.html Reference**: Removed non-existent file dependency
5. **Storage Keys**: Standardized localStorage key usage
6. **Error Handling**: Added proper error handling in API calls

### ✅ File Connections:
- `login.js` → `/auth/*` endpoints
- `ocr.js` → `/ocr/extract` endpoint  
- `report.js` → `/scam/*` endpoints
- `schemes.js` → `/schemes/*` endpoints
- `faq.js` → `/faq/search` endpoint
- `profile.js` → `/profile/*` endpoints
- `chat_float.js` → `/chatbot/message` endpoint
- `main.js` → `sidebar.html` (✅ exists)

### 🔗 Internal Navigation Links:
All internal navigation links are working:
- Home (`index.html`)
- Schemes (`schemes.html`) 
- OCR (`ocr.html`)
- Report Scam (`report.html`)
- Profile (`profile.html`)
- FAQ (`faq.html`)
- About (`about.html`)
- Contact (`contact.html`)
- Privacy (`privacy.html`)
- DigiLocker (`digilocker.html`)
- Login (`login.html`)

### 📁 Asset References:
- ✅ Logo: `1.png` (root directory)
- ✅ Images: `assets/images/*.png`
- ✅ CSS: `assets/css/*.css`
- ✅ JS: `assets/js/*.js`
- ✅ External CDNs: Bootstrap, AOS, SweetAlert2

### 🚀 Ready for Testing:
1. Start backend: `cd backend && uvicorn main:app --reload`
2. Serve frontend: Use live server or Python `http.server`
3. All API endpoints should connect properly
4. All navigation should work seamlessly