# 📧 Email Service - Complete Documentation

## 📄 File: `backend/email_service.py`

### Purpose
Send OTP and welcome emails using Brevo API v3 with HTML templates.

---

## 🎯 Key Features

### 1. **OTP Email**
- Clean HTML template
- 6-digit OTP in large font
- 5-minute validity warning
- Security tips included
- Professional branding

### 2. **Welcome Email**
- Sent after successful login
- Personalized greeting
- Platform introduction
- Quick links to features
- Support information

### 3. **Robust Error Handling**
- API connection failures
- Invalid email addresses
- Rate limiting
- HTTP status validation
- Detailed error messages

---

## 🔧 Configuration

### Environment Variables
```env
# .env file
BREVO_API_KEY=your_brevo_api_key_here
SENDER_EMAIL=your_verified_sender_email@example.com
SENDER_NAME=Rural Assist Team
```

**Required:**
- `BREVO_API_KEY` - API key from Brevo account
- `SENDER_EMAIL` - Verified sender email in Brevo

**Optional:**
- `SENDER_NAME` - Sender display name (default: "Rural Assist Team")

---

### Constants
```python
BREVO_API_URL = "https://api.brevo.com/v3/smtp/email"
EMAIL_ENABLED = True  # Set False to disable emails
```

---

## 📊 Data Flow

### Send OTP Email
```
1. User requests OTP
   ↓
2. Backend generates 6-digit OTP
   ↓
3. Call send_otp_email(email, otp, username)
   ↓
4. Build HTML template with OTP
   ↓
5. POST to Brevo API
   ↓
6. Return (status_code, message)
   ↓
7. Frontend shows success/error
```

---

### Send Welcome Email
```
1. User verifies OTP successfully
   ↓
2. Call send_welcome_email(email, username)
   ↓
3. Build HTML template with user info
   ↓
4. POST to Brevo API
   ↓
5. Return (status_code, message)
   ↓
6. Log result (don't show to user)
```

---

## 🎨 Email Templates

### OTP Email Template
```html
<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 40px auto;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .header {
            background: linear-gradient(135deg, #34A853 0%, #2E8E46 100%);
            padding: 30px;
            text-align: center;
            border-radius: 8px 8px 0 0;
        }
        .otp-box {
            background: #f0f9ff;
            border: 2px dashed #34A853;
            padding: 20px;
            text-align: center;
            font-size: 36px;
            font-weight: bold;
            color: #34A853;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Rural Assist</h1>
            <p>Your OTP Code</p>
        </div>
        <div class="content">
            <p>Hello {username},</p>
            <p>Your OTP for login is:</p>
            <div class="otp-box">{otp}</div>
            <p><strong>Valid for 5 minutes only.</strong></p>
            <div class="security-note">
                🔒 Never share this OTP with anyone.
            </div>
        </div>
    </div>
</body>
</html>
```

**Template Variables:**
- `{username}` - User's name
- `{otp}` - 6-digit OTP code

---

### Welcome Email Template
```html
<!DOCTYPE html>
<html>
<head>
    <style>
        /* Similar styling as OTP email */
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Welcome to Rural Assist! 🎉</h1>
        </div>
        <div class="content">
            <p>Hello {username},</p>
            <p>Welcome to Rural Assist! We're excited to have you.</p>
            
            <div class="feature-box">
                <h3>What you can do:</h3>
                <ul>
                    <li>📋 Browse 100+ government schemes</li>
                    <li>🔍 Search FAQs instantly</li>
                    <li>📸 OCR for document scanning</li>
                    <li>🤖 AI Chatbot assistance</li>
                    <li>🛡️ Scam detection & reporting</li>
                </ul>
            </div>
            
            <div class="support-note">
                Need help? Contact us at support@ruralassist.com
            </div>
        </div>
    </div>
</body>
</html>
```

**Template Variables:**
- `{username}` - User's name

---

## 🌐 API Integration

### Brevo API Configuration
```python
def get_brevo_headers():
    """Returns headers for Brevo API requests"""
    api_key = os.getenv("BREVO_API_KEY")
    return {
        "accept": "application/json",
        "api-key": api_key,
        "content-type": "application/json"
    }
```

---

### Send OTP Email Function
```python
def send_otp_email(email: str, otp: str, username: str = "User"):
    """
    Send OTP email via Brevo API
    
    Args:
        email (str): Recipient email address
        otp (str): 6-digit OTP code
        username (str): User's display name
        
    Returns:
        tuple: (status_code, message)
        - (201, "✅ OTP sent successfully") on success
        - (500, "❌ Error message") on failure
    """
    
    if not EMAIL_ENABLED:
        return (200, "📧 Email disabled (dev mode)")
    
    # Build HTML template
    html_content = get_otp_email_template(otp, username)
    
    # Prepare payload
    payload = {
        "sender": {
            "name": os.getenv("SENDER_NAME", "Rural Assist Team"),
            "email": os.getenv("SENDER_EMAIL")
        },
        "to": [{"email": email, "name": username}],
        "subject": f"Your Rural Assist OTP: {otp}",
        "htmlContent": html_content
    }
    
    # Send via Brevo
    response = requests.post(
        BREVO_API_URL,
        json=payload,
        headers=get_brevo_headers()
    )
    
    if response.status_code == 201:
        return (201, f"✅ OTP sent successfully to {email}")
    else:
        return (500, f"❌ Failed: {response.text}")
```

---

### Send Welcome Email Function
```python
def send_welcome_email(email: str, username: str = "User"):
    """
    Send welcome email after successful login
    
    Args:
        email (str): User's email
        username (str): User's display name
        
    Returns:
        tuple: (status_code, message)
    """
    
    if not EMAIL_ENABLED:
        return (200, "📧 Email disabled (dev mode)")
    
    html_content = get_welcome_email_template(username)
    
    payload = {
        "sender": {
            "name": os.getenv("SENDER_NAME", "Rural Assist Team"),
            "email": os.getenv("SENDER_EMAIL")
        },
        "to": [{"email": email, "name": username}],
        "subject": "Welcome to Rural Assist! 🎉",
        "htmlContent": html_content
    }
    
    response = requests.post(
        BREVO_API_URL,
        json=payload,
        headers=get_brevo_headers()
    )
    
    if response.status_code == 201:
        return (201, f"✅ Welcome email sent to {email}")
    else:
        return (500, f"❌ Failed: {response.text}")
```

---

## 🧪 Testing

### Test OTP Email
```python
# From backend directory
python -c "from email_service import send_otp_email; print(send_otp_email('test@example.com', '123456', 'Test User'))"
```

**Expected Output:**
```
(201, '✅ OTP sent successfully to test@example.com')
```

---

### Test Welcome Email
```python
python -c "from email_service import send_welcome_email; print(send_welcome_email('test@example.com', 'Test User'))"
```

**Expected Output:**
```
(201, '✅ Welcome email sent to test@example.com')
```

---

### Test Error Handling
```python
# Invalid email
send_otp_email('invalid-email', '123456', 'Test')
# Expected: (500, '❌ Failed: ...')

# Missing API key
os.environ["BREVO_API_KEY"] = ""
send_otp_email('test@example.com', '123456', 'Test')
# Expected: (500, '❌ API key not configured')
```

---

## 🐛 Troubleshooting

### Issue: Emails not sending
**Check:**
```python
import os
from dotenv import load_dotenv

load_dotenv()

print("API Key:", os.getenv("BREVO_API_KEY"))
print("Sender:", os.getenv("SENDER_EMAIL"))
print("Enabled:", EMAIL_ENABLED)
```

**Solutions:**
1. Verify `.env` file exists in `backend/`
2. Check `BREVO_API_KEY` is valid (login to Brevo)
3. Verify `SENDER_EMAIL` is verified in Brevo account
4. Restart backend after editing `.env`

---

### Issue: 401 Unauthorized
**Cause:** Invalid API key

**Solution:**
1. Login to Brevo dashboard
2. Go to Settings → API Keys
3. Generate new API key
4. Update `.env` file
5. Restart backend

---

### Issue: 400 Bad Request
**Cause:** Invalid email format or missing fields

**Debug:**
```python
# Check payload
import json
print(json.dumps(payload, indent=2))
```

**Solution:**
- Verify email format is valid
- Check sender email is verified in Brevo
- Ensure all required fields are present

---

### Issue: Emails go to spam
**Solutions:**
1. **SPF Record:** Add SPF record to your domain DNS
   ```
   v=spf1 include:spf.brevo.com ~all
   ```

2. **DKIM:** Enable DKIM in Brevo settings

3. **Domain Authentication:** Verify domain in Brevo

4. **Sender Reputation:** 
   - Use verified sender email
   - Avoid spam trigger words
   - Include unsubscribe link

---

## 📊 Error Codes

### HTTP Status Codes
- **201 Created** - Email sent successfully ✅
- **400 Bad Request** - Invalid email or payload ❌
- **401 Unauthorized** - Invalid API key 🔒
- **429 Too Many Requests** - Rate limit exceeded ⏱️
- **500 Internal Server Error** - Brevo server error 🔥

---

### Custom Return Codes
```python
# Success
(201, "✅ OTP sent successfully to email@example.com")
(200, "📧 Email disabled (dev mode)")

# Errors
(500, "❌ Failed: API key not configured")
(500, "❌ Failed: Invalid email format")
(500, "❌ Failed: {brevo_error_message}")
```

---

## 🔒 Security Best Practices

### 1. **Environment Variables**
```python
# ✅ GOOD: Use .env file
BREVO_API_KEY = os.getenv("BREVO_API_KEY")

# ❌ BAD: Hardcoded key
BREVO_API_KEY = "your_brevo_api_key_here"
```

---

### 2. **Email Validation**
```python
import re

def is_valid_email(email: str) -> bool:
    """Validate email format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

# Use before sending
if not is_valid_email(email):
    return (400, "❌ Invalid email format")
```

---

### 3. **Rate Limiting**
```python
from datetime import datetime, timedelta

email_send_times = {}

def check_rate_limit(email: str, limit_seconds=30):
    """Prevent spam (max 1 email per 30 seconds)"""
    now = datetime.now()
    
    if email in email_send_times:
        last_sent = email_send_times[email]
        if (now - last_sent).seconds < limit_seconds:
            return False
    
    email_send_times[email] = now
    return True

# Use before sending
if not check_rate_limit(email):
    return (429, "⏱️ Please wait 30 seconds before resending")
```

---

### 4. **Content Security**
```python
import html

def sanitize_username(username: str) -> str:
    """Prevent XSS in email templates"""
    return html.escape(username)

# Use in templates
html_content = f"<p>Hello {sanitize_username(username)},</p>"
```

---

## 📈 Performance Optimizations

### 1. **Async Email Sending**
```python
import asyncio
import aiohttp

async def send_otp_email_async(email: str, otp: str, username: str):
    """Non-blocking email send"""
    async with aiohttp.ClientSession() as session:
        async with session.post(
            BREVO_API_URL,
            json=payload,
            headers=get_brevo_headers()
        ) as response:
            return response.status, await response.text()

# Usage
asyncio.create_task(send_otp_email_async(email, otp, username))
```

---

### 2. **Email Queueing**
```python
from queue import Queue
from threading import Thread

email_queue = Queue()

def email_worker():
    """Background worker for email queue"""
    while True:
        task = email_queue.get()
        send_otp_email(**task)
        email_queue.task_done()

# Start worker thread
Thread(target=email_worker, daemon=True).start()

# Add to queue
email_queue.put({
    "email": "user@example.com",
    "otp": "123456",
    "username": "User"
})
```

---

### 3. **Template Caching**
```python
from functools import lru_cache

@lru_cache(maxsize=2)
def get_otp_email_template(otp: str, username: str):
    """Cache template generation"""
    # Build HTML template (cached)
    return html_content
```

---

## ✅ Feature Checklist

**Implemented:**
- [x] OTP email sending
- [x] Welcome email sending
- [x] HTML email templates
- [x] Brevo API integration
- [x] Error handling
- [x] Environment variables
- [x] Professional styling
- [x] Security warnings
- [x] Email validation
- [x] Status codes

**Potential Enhancements:**
- [ ] Async email sending
- [ ] Email queueing system
- [ ] Template caching
- [ ] Email analytics tracking
- [ ] Unsubscribe functionality
- [ ] Email preferences
- [ ] Multi-language templates
- [ ] Email retry logic
- [ ] Webhook for delivery status
- [ ] Email attachments support

---

## 🔗 Related Files

- `backend/.env` - Environment configuration
- `backend/auth_service.py` - Uses email service
- `backend/main.py` - FastAPI endpoints
- `README_AUTH_SERVICE.md` - Auth documentation

---

## 📚 External Resources

- **Brevo API Docs:** https://developers.brevo.com/reference/sendtransacemail
- **Brevo Dashboard:** https://app.brevo.com/
- **Email Best Practices:** https://www.brevo.com/blog/email-deliverability/

---

**Last Updated:** December 2, 2025  
**Status:** ✅ Fully Functional  
**Tested:** Confirmed 201 status codes for OTP & welcome emails
