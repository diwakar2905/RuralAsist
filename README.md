# 🌾 Rural Assist - Digital Empowerment Platform

> **Empowering rural communities through digital access, government schemes, and AI-powered assistance**

[![Python](https://img.shields.io/badge/Python-3.9%2B-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104%2B-green.svg)](https://fastapi.tiangolo.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Production%20Ready-success.svg)](https://github.com/diwakar2905/RuralAsist)

---

## 📖 Overview

Rural Assist is a comprehensive full-stack web application designed to bridge the digital divide for rural communities in India. It provides easy access to government schemes, document management, scam detection, and AI-powered assistance - all in one platform.

### 🎯 Key Features

#### 🏛️ **Government Scheme Discovery**
- **100+ Schemes**: Browse central and state government schemes (PM-Kisan, Ayushman Bharat, etc.)
- **Smart Search**: Search by name, category, keywords, or state
- **Category Filters**: Agriculture, Health, Education, Housing, Employment, etc.
- **Offline Support**: Local caching with 1-hour refresh for offline access
- **Bilingual**: English & Hindi support

#### 🔐 **Email OTP Authentication**
- **Passwordless Login**: Secure email-based OTP authentication (no passwords!)
- **Brevo Integration**: Professional email delivery with HTML templates
- **Security Features**: 
  - SHA256 OTP hashing
  - 3-attempt limit
  - 30-second rate limiting
  - 5-minute OTP expiry
- **User Profiles**: Save preferences, activity history, and favorites

#### 📸 **Document Digitization (OCR)**
- **Tesseract OCR**: Extract text from images and PDFs
- **Supported Documents**: Aadhaar, PAN, bills, certificates, land records
- **Format Support**: JPG, PNG, PDF (up to 10MB)
- **Text Extraction**: Copy-paste extracted text instantly

#### 🛡️ **Scam Detection & Reporting**
- **Report Scams**: Submit suspected fraudulent activities
- **Keyword Detection**: AI-powered scam keyword analysis
- **Database Storage**: All reports stored for analysis
- **Community Protection**: Help others avoid scams

#### 🤖 **AI-Powered Chatbot**
- **Bilingual Support**: Chat in English or Hindi
- **Context-Aware**: Understands greetings, schemes, documents, scams
- **24/7 Availability**: Always ready to help
- **Quick Responses**: Instant answers to common questions

#### ❓ **FAQ System**
- **50+ FAQs**: Answers to common questions
- **Real-time Search**: Debounced search with instant results
- **Category Filtering**: General, Account, Schemes, Security, Technical
- **Popular Tags**: Quick access to trending topics

## 🛠️ Tech Stack

### Backend
| Component | Technology | Version |
|-----------|-----------|---------|
| **Framework** | FastAPI | 0.104+ |
| **Language** | Python | 3.9+ |
| **Validation** | Pydantic | 2.0+ |
| **Email Service** | Brevo API v3 | Latest |
| **OCR Engine** | Tesseract | 4.0+ |
| **PDF Processing** | PyMuPDF (fitz) | 1.23+ |
| **Authentication** | JWT (python-jose) | Latest |
| **Password Hashing** | Passlib + bcrypt | Latest |
| **Environment** | python-dotenv | Latest |

### Frontend
| Component | Technology | Version |
|-----------|-----------|---------|
| **HTML** | HTML5 | - |
| **CSS** | CSS3 + Custom | - |
| **JavaScript** | Vanilla JS (ES6+) | - |
| **Icons** | Bootstrap Icons | 1.11+ |
| **Fonts** | Google Fonts (Inter) | - |

### Database
- **JSON-based**: `schemes_db.json`, `faq_db.json`, `profiles_db.json`, `activity_db.json`
- **In-memory**: OTP storage with TTL

### Communication
- **REST API**: JSON-based endpoints
- **CORS**: Enabled for cross-origin requests
- **WebSockets**: (Planned for real-time chatbot)

## 📁 Project Structure

```
rural-assist/
├── 📂 backend/
│   ├── __init__.py
│   ├── main.py                 # FastAPI app, CORS, startup events
│   ├── auth_service.py         # ⭐ Email OTP authentication (NEW)
│   ├── email_service.py        # ⭐ Brevo email integration (NEW)
│   ├── profile_service.py      # ⭐ User profile management (NEW)
│   ├── schemes_service.py      # Government schemes API
│   ├── faq_service.py          # ⭐ FAQ search & retrieval (NEW)
│   ├── chatbot_service.py      # AI chatbot (bilingual)
│   ├── ocr_service.py          # Document OCR processing
│   ├── scam_service.py         # Scam reporting & detection
│   ├── models.py               # Pydantic data models
│   ├── schemas.py              # Request/response schemas
│   ├── .env                    # ⭐ Environment variables (NEW)
│   │
│   ├── 📄 Data Files:
│   ├── schemes_db.json         # 100+ government schemes
│   ├── faq_db.json             # ⭐ 50+ FAQs (NEW)
│   ├── common_scams.json       # Scam patterns database
│   ├── scam_keywords.json      # Scam detection keywords
│   ├── profiles_db.json        # ⭐ User profiles (NEW)
│   ├── activity_db.json        # ⭐ User activity logs (NEW)
│   │
│   ├── 📂 chatbot_language/    # ⭐ Bilingual chatbot (NEW)
│   │   ├── en.json             # English responses
│   │   └── hi.json             # Hindi responses
│   │
│   └── 📂 uploads/
│       └── ocr_temp/           # Temporary OCR file storage
│
├── 📂 frontend/
│   ├── index.html              # Homepage with FAQ section
│   ├── login.html              # ⭐ Email OTP login page (NEW)
│   ├── profile.html            # ⭐ User profile page (NEW)
│   ├── schemes.html            # Browse government schemes
│   ├── faq.html                # FAQ redirect (now on homepage)
│   ├── chatbot_new.html        # ⭐ Enhanced chatbot UI (NEW)
│   ├── ocr.html                # Document OCR upload
│   ├── report.html             # Scam reporting
│   ├── about.html              # About page
│   ├── contact.html            # Contact page
│   ├── privacy.html            # Privacy policy
│   ├── digilocker.html         # DigiLocker integration
│   │
│   └── 📂 assets/
│       ├── 📂 css/
│       │   ├── style.css       # Main stylesheet
│       │   ├── theme.css       # Color themes
│       │   └── chatbot.css     # ⭐ Chatbot styling (NEW)
│       │
│       ├── 📂 js/
│       │   ├── main.js         # Common utilities
│       │   ├── login.js        # ⭐ OTP login logic (NEW)
│       │   ├── profile.js      # ⭐ Profile management (NEW)
│       │   ├── schemes.js      # Schemes search & filter
│       │   ├── faq.js          # ⭐ FAQ search (NEW)
│       │   ├── chatbot.js      # ⭐ Enhanced chatbot (NEW)
│       │   ├── ocr.js          # OCR upload & display
│       │   ├── report.js       # Scam reporting
│       │   └── page-specific.js # Page initialization
│       │
│       └── 📂 images/          # Logo, icons, illustrations
│
├── 📄 Documentation:
├── README.md                   # This file
├── DEPLOYMENT_GUIDE.md         # ⭐ Complete deployment guide (NEW)
├── README_COMPLETE_SETUP.md    # ⭐ Setup & troubleshooting (NEW)
├── README_AUTH_SERVICE.md      # ⭐ Auth documentation (NEW)
├── README_EMAIL_SERVICE.md     # ⭐ Email service docs (NEW)
├── README_SCHEMES_PAGE.md      # ⭐ Schemes page docs (NEW)
├── README_FAQ_PAGE.md          # ⭐ FAQ page docs (NEW)
│
├── requirements.txt            # Python dependencies
├── .gitignore                  # Git ignore rules
└── PROJECT_STATUS.txt          # Development status
```

**Legend:**
- ⭐ = New features added in latest update
- 📂 = Directory
- 📄 = File

## 📋 Prerequisites

### Required Software

1. **Python 3.9 or higher**
   ```bash
   python --version  # Should show 3.9 or higher
   ```

2. **Tesseract OCR Engine** (for document scanning)
   - **Windows**: Download from [Tesseract at UB Mannheim](https://github.com/UB-Mannheim/tesseract/wiki)
     - ⚠️ **Important**: Check "Add to PATH" during installation
   - **macOS**: `brew install tesseract`
   - **Linux (Ubuntu/Debian)**: `sudo apt-get install tesseract-ocr`
   
   Verify installation:
   ```bash
   tesseract --version
   ```

3. **Git** (for cloning repository)
   ```bash
   git --version
   ```

### Required Accounts

- **Brevo Account** (for email OTP)
  - Sign up at: https://www.brevo.com/
  - Get API key from Settings → API Keys
  - Verify sender email address

### Optional (for deployment)
- GitHub account
- Railway/Render/Vercel account (see [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md))

## 🚀 Quick Start Guide

### 1. Clone the Repository

```bash
git clone https://github.com/diwakar2905/RuralAsist.git
cd RuralAsist
```

### 2. Backend Setup

```bash
# Navigate to backend
cd backend

# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Configure Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# Email Service (Brevo)
BREVO_API_KEY=your-brevo-api-key-here
SENDER_EMAIL=your-verified-email@example.com
SENDER_NAME=Rural Assist Team

# Security (generate random 32+ character strings)
JWT_SECRET=your-super-secret-jwt-key-min-32-characters
SECRET_KEY=another-random-secret-key-for-sessions

# Environment
ENVIRONMENT=development
DEBUG=True
```

**Get your Brevo API key:**
1. Sign up at https://www.brevo.com/
2. Go to Settings → API Keys
3. Create new API key
4. Verify your sender email address

**Generate secure secrets:**
```python
# Run in Python
import secrets
print(secrets.token_urlsafe(32))
```

### 4. Start Backend Server

```bash
# From backend directory
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Backend will be available at: **http://localhost:8000**

API Documentation: **http://localhost:8000/docs**

### 5. Start Frontend Server

**Open a new terminal:**

```bash
# Navigate to frontend directory
cd frontend

# Start simple HTTP server
python -m http.server 5500
```

Frontend will be available at: **http://localhost:5500**

### 6. Access the Application

Open your browser and visit:
- **Homepage**: http://localhost:5500/
- **Login**: http://localhost:5500/login.html
- **Schemes**: http://localhost:5500/schemes.html
- **API Docs**: http://localhost:8000/docs

---

## 🎮 Usage Guide

### First-Time User Flow

1. **Visit Homepage** → http://localhost:5500/
2. **Click "Login"** → Enter your email
3. **Check Email** → Receive 6-digit OTP
4. **Enter OTP** → Verify and login
5. **Browse Schemes** → View 100+ government schemes
6. **Search FAQs** → Find answers instantly
7. **Upload Documents** → Use OCR to extract text
8. **Report Scams** → Help protect community

## 🔧 Development Workflow

### Running Both Servers

You need **2 terminal windows**:

**Terminal 1 - Backend (Port 8000):**
```bash
cd backend
uvicorn main:app --reload --port 8000
```

**Terminal 2 - Frontend (Port 5500):**
```bash
cd frontend
python -m http.server 5500
```

### Auto-Reload

- **Backend**: `--reload` flag auto-restarts on code changes
- **Frontend**: Refresh browser (Ctrl+R) to see changes
- **Hard Refresh**: Ctrl+Shift+R to clear cache

### Environment Setup

**Development (.env):**
```env
ENVIRONMENT=development
DEBUG=True
```

**Production (.env):**
```env
ENVIRONMENT=production
DEBUG=False
JWT_SECRET=<strong-random-secret>
ALLOWED_ORIGINS=https://your-domain.com
```

### Testing Email Service

```python
# From backend directory
python -c "from email_service import send_otp_email; print(send_otp_email('your-email@example.com', '123456', 'Test User'))"
```

Expected output: `(201, '✅ OTP sent successfully to your-email@example.com')`

## 📡 API Endpoints

**Base URL**: `http://localhost:8000`

**Full API Documentation**: http://localhost:8000/docs (Interactive Swagger UI)

---

### 🔐 Authentication (`/auth`)

#### Send Email OTP
```http
POST /auth/send-email-otp
Content-Type: application/json

{
  "email": "user@example.com"
}

Response: 200 OK
{
  "message": "OTP sent successfully",
  "email": "user@example.com"
}
```

#### Verify Email OTP
```http
POST /auth/verify-email-otp
Content-Type: application/json

{
  "email": "user@example.com",
  "otp": "123456"
}

Response: 200 OK
{
  "access_token": "eyJhbGci...",
  "token_type": "bearer",
  "user": {
    "email": "user@example.com",
    "name": "User"
  }
}
```

#### Resend OTP
```http
POST /auth/resend-otp
Content-Type: application/json

{
  "email": "user@example.com"
}
```

---

### 📋 Government Schemes (`/schemes`)

#### Get All Schemes
```http
GET /schemes/local

Response: 200 OK
{
  "count": 100,
  "schemes": [...]
}
```

#### Search Schemes
```http
GET /schemes/search?q=farmer&category=agriculture

Response: 200 OK
{
  "count": 5,
  "results": [...]
}
```

#### Update Schemes (Fetch from Internet)
```http
POST /schemes/update
Content-Type: application/json

{
  "query": "government schemes india",
  "limit": 50
}
```

---

### ❓ FAQ (`/faq`)

#### Get All FAQs
```http
GET /faq?lang=en

Response: 200 OK
{
  "count": 50,
  "faqs": [...]
}
```

#### Search FAQs
```http
POST /faq/search
Content-Type: application/json

{
  "query": "login",
  "lang": "en"
}

Response: 200 OK
{
  "count": 3,
  "results": [...]
}
```

---

### 🤖 Chatbot (`/chatbot`)

#### Send Message
```http
POST /chatbot/message
Content-Type: application/json

{
  "message": "Hello",
  "language": "en"
}

Response: 200 OK
{
  "reply": "Hello! How can I help you today?",
  "language": "en"
}
```

---

### 📸 OCR (`/ocr`)

#### Extract Text from Document
```http
POST /ocr/extract
Content-Type: multipart/form-data

file: [uploaded_file.jpg]

Response: 200 OK
{
  "filename": "aadhaar.jpg",
  "extracted_text": "AADHAAR\n1234 5678 9012..."
}
```

---

### 🛡️ Scam Reporting (`/scam`)

#### Submit Scam Report
```http
POST /scam/report
Content-Type: application/json

{
  "reporter_name": "John Doe",
  "contact": "9876543210",
  "incident_type": "phone_call",
  "description": "Received suspicious call asking for OTP"
}

Response: 200 OK
{
  "id": "scam_001",
  "status": "submitted",
  "timestamp": "2025-12-02T10:30:00"
}
```

#### Check Scam Keywords
```http
POST /scam/check
Content-Type: application/json

{
  "text": "Share your bank account password"
}

Response: 200 OK
{
  "is_suspicious": true,
  "matched_keywords": ["bank account", "password"],
  "risk_level": "high"
}
```

---

### 👤 Profile (`/profile`)

#### Get User Profile
```http
GET /profile/{email}

Response: 200 OK
{
  "email": "user@example.com",
  "name": "John Doe",
  "phone": "9876543210",
  "preferences": {...}
}
```

#### Update Profile
```http
PUT /profile/{email}
Content-Type: application/json

{
  "name": "Jane Doe",
  "phone": "9876543211",
  "language": "hi"
}
```

---

**For complete API documentation with interactive testing**, visit: **http://localhost:8000/docs**

## 🐛 Troubleshooting

### Common Issues & Solutions

#### Issue 1: Emails Not Sending

**Symptoms:**
- OTP not received in inbox
- Error: "Email service failed"

**Solutions:**
1. **Check .env file**:
   ```bash
   cd backend
   cat .env  # Linux/Mac
   type .env  # Windows
   ```
   Verify `BREVO_API_KEY` and `SENDER_EMAIL` are set

2. **Test email service**:
   ```python
   python -c "from email_service import send_otp_email; print(send_otp_email('test@example.com', '123456', 'Test'))"
   ```
   Expected: `(201, '✅ OTP sent successfully')`

3. **Check Brevo dashboard**: https://app.brevo.com/
   - Verify sender email is confirmed
   - Check API key is active
   - View email logs

4. **Restart backend**:
   ```bash
   # Ctrl+C to stop, then restart
   uvicorn main:app --reload --port 8000
   ```

---

#### Issue 2: CORS Errors in Browser

**Symptoms:**
```
Access to fetch at 'http://localhost:8000/...' from origin 'http://localhost:5500' 
has been blocked by CORS policy
```

**Solutions:**
1. **Verify ports**:
   - Backend: http://localhost:8000
   - Frontend: http://localhost:5500

2. **Check backend CORS settings** (`backend/main.py`):
   ```python
   allow_origins=[
       "http://localhost:5500",
       "http://127.0.0.1:5500",
   ]
   ```

3. **Hard refresh browser**: Ctrl+Shift+R

---

#### Issue 3: Tesseract Not Found

**Symptoms:**
```
TesseractNotFoundError: tesseract is not installed or it's not in your PATH
```

**Solutions:**

**Windows:**
```bash
# Check if installed
tesseract --version

# If not found, download from:
# https://github.com/UB-Mannheim/tesseract/wiki

# Add to PATH or specify in backend/ocr_service.py:
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
```

**Mac:**
```bash
brew install tesseract
tesseract --version
```

**Linux:**
```bash
sudo apt-get install tesseract-ocr
tesseract --version
```

---

#### Issue 4: Schemes/FAQs Not Visible

**Symptoms:**
- Empty scheme cards
- "No FAQs found" message

**Solutions:**

1. **Check backend is running**:
   ```bash
   # Test API endpoints
   curl http://localhost:8000/schemes/local
   curl http://localhost:8000/faq
   ```

2. **Clear browser cache**:
   - Press **Ctrl+Shift+R** (hard refresh)
   - Or clear cache in DevTools (F12 → Network → Disable cache)

3. **Check browser console** (F12):
   - Look for red errors
   - Check Network tab for failed requests

4. **Verify JSON files exist**:
   ```bash
   ls backend/schemes_db.json
   ls backend/faq_db.json
   ```

---

#### Issue 5: Module Not Found Errors

**Symptoms:**
```
ModuleNotFoundError: No module named 'fastapi'
```

**Solutions:**

1. **Activate virtual environment**:
   ```bash
   # Windows
   venv\Scripts\activate
   
   # Mac/Linux
   source venv/bin/activate
   ```

2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Verify installation**:
   ```bash
   pip list | grep fastapi
   ```

---

#### Issue 6: Port Already in Use

**Symptoms:**
```
OSError: [Errno 48] Address already in use
```

**Solutions:**

**Windows:**
```powershell
# Find process using port 8000
netstat -ano | findstr :8000

# Kill process (replace PID)
taskkill /PID <PID> /F
```

**Mac/Linux:**
```bash
# Find and kill process
lsof -ti:8000 | xargs kill -9
```

Or use different port:
```bash
uvicorn main:app --port 8001
```

---

### Getting Help

1. **Check documentation**:
   - [README_COMPLETE_SETUP.md](README_COMPLETE_SETUP.md) - Detailed setup guide
   - [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) - Deployment instructions
   - Service-specific READMEs in root directory

2. **API Documentation**: http://localhost:8000/docs

3. **GitHub Issues**: https://github.com/diwakar2905/RuralAsist/issues

4. **Browser Console** (F12) - Check for JavaScript errors

## 🚀 Deployment

Deploy to production using any of these platforms:

### Option 1: Railway (Recommended)
- ⭐ Easiest deployment
- 🔒 Automatic HTTPS
- 💰 $5-20/month
- 📚 [Step-by-step guide](DEPLOYMENT_GUIDE.md#option-1-deploy-to-railway-recommended)

### Option 2: Render
- 🆓 Free tier available
- 🔒 Auto HTTPS
- 💰 Free-$20/month
- 📚 [Step-by-step guide](DEPLOYMENT_GUIDE.md#option-2-deploy-to-render)

### Option 3: Vercel + Railway
- ⚡ Best performance
- 🆓 Free frontend hosting
- 💰 Free-$10/month
- 📚 [Step-by-step guide](DEPLOYMENT_GUIDE.md#option-3-deploy-to-vercel--railway)

### Option 4: AWS EC2
- 🎛️ Full control
- 📈 Highly scalable
- 💰 $10-50/month
- 📚 [Step-by-step guide](DEPLOYMENT_GUIDE.md#option-4-deploy-to-aws-ec2)

**Complete deployment instructions**: [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [README.md](README.md) | This file - Project overview |
| [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) | Complete deployment guide (5 platforms) |
| [README_COMPLETE_SETUP.md](README_COMPLETE_SETUP.md) | Detailed setup & troubleshooting |
| [README_AUTH_SERVICE.md](README_AUTH_SERVICE.md) | Authentication system docs |
| [README_EMAIL_SERVICE.md](README_EMAIL_SERVICE.md) | Brevo email integration |
| [README_SCHEMES_PAGE.md](README_SCHEMES_PAGE.md) | Schemes page documentation |
| [README_FAQ_PAGE.md](README_FAQ_PAGE.md) | FAQ system documentation |

---

## 🔮 Future Enhancements

### Planned Features
- [ ] **SMS OTP**: Alternative to email OTP using Twilio
- [ ] **Push Notifications**: Real-time alerts for new schemes
- [ ] **Bookmark System**: Save favorite schemes
- [ ] **Scheme Comparison**: Compare multiple schemes side-by-side
- [ ] **Eligibility Calculator**: AI-powered eligibility checker
- [ ] **Multi-language Support**: Add more Indian languages
- [ ] **Voice Assistant**: Voice-based navigation for accessibility
- [ ] **Mobile App**: React Native/Flutter mobile application
- [ ] **Admin Dashboard**: Manage users, schemes, and reports
- [ ] **Analytics Dashboard**: User behavior and scheme popularity

### Technical Improvements
- [ ] **PostgreSQL Migration**: Replace JSON with proper database
- [ ] **Redis Caching**: Faster scheme/FAQ retrieval
- [ ] **WebSocket Support**: Real-time chatbot responses
- [ ] **Unit Tests**: pytest + coverage reports
- [ ] **CI/CD Pipeline**: GitHub Actions for auto-deploy
- [ ] **Docker Support**: Containerization for easy deployment
- [ ] **API Rate Limiting**: Prevent abuse
- [ ] **Logging System**: Structured logging with ELK stack

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Contribution Guidelines
- Follow existing code style
- Add comments for complex logic
- Update documentation
- Test thoroughly before submitting

---

## 📄 License

This project is licensed under the **MIT License** - see [LICENSE](LICENSE) file for details.

---

## 👥 Team

**Developer**: [Diwakar Dwivedi](https://github.com/diwakar2905)

**Contact**: 
- Email: diwakarika12@gmail.com
- GitHub: [@diwakar2905](https://github.com/diwakar2905)

---

## 🙏 Acknowledgments

- **FastAPI** - Modern, fast web framework
- **Brevo** - Reliable email delivery service
- **Tesseract OCR** - Open-source OCR engine
- **Bootstrap Icons** - Beautiful icon library
- **Government of India** - Scheme data sources

---

## 📊 Project Stats

- **Lines of Code**: 10,000+
- **API Endpoints**: 20+
- **Government Schemes**: 100+
- **FAQs**: 50+
- **Documentation Pages**: 7
- **Languages Supported**: 2 (English, Hindi)

---

## 🌟 Star History

If you find this project helpful, please give it a ⭐ on GitHub!

[![Star History](https://img.shields.io/github/stars/diwakar2905/RuralAsist?style=social)](https://github.com/diwakar2905/RuralAsist)

---

**Made with ❤️ for Rural India** 🇮🇳
