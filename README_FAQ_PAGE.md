# ❓ FAQ Page - Complete Documentation

## 📄 Files: `frontend/index.html` (FAQ section) & `frontend/assets/js/faq.js`

### Purpose
Integrated FAQ section on home page with search, category filtering, and popular tags.

---

## 🎯 Key Features

### 1. **Smart Search**
- Real-time search across questions and answers
- Debounced search (300ms delay)
- Highlights matching FAQs
- Shows result count

### 2. **Category Filtering**
- Filter by category (General, Account, Schemes, Security, Technical)
- Combined with search
- Visual category badges
- Active filter highlighting

### 3. **Popular Tags**
- Quick access to common topics
- Click tag → Auto-search
- Auto-generated from FAQ keywords
- Visual tag pills

### 4. **Accordion UI**
- Expandable/collapsible answers
- One FAQ open at a time
- Smooth animations
- Mobile-friendly

---

## 🔧 Configuration

### Constants
```javascript
const BACKEND_URL = "http://127.0.0.1:8000";
```

### Bilingual Support
```javascript
const LANG_KEY = 'ruralasist_language';
function getCurrentLang() {
    return localStorage.getItem(LANG_KEY) || 'en';
}
```

---

## 📊 Data Flow

### Initial Load
```
1. Page loads
   ↓
2. Fetch all FAQs from /faq
   ↓
3. Store in allFAQs array
   ↓
4. Render in accordion grid
   ↓
5. Generate popular tags
   ↓
6. Attach event listeners
```

---

### Search Flow
```
1. User types in search box
   ↓
2. Wait 300ms (debounce)
   ↓
3. POST to /faq/search with query
   ↓
4. Backend returns matching FAQs
   ↓
5. Render results with highlight
   ↓
6. Update result count
```

---

### Category Filter Flow
```
1. User clicks category button
   ↓
2. Highlight active category
   ↓
3. Filter allFAQs array by category
   ↓
4. Apply search query (if any)
   ↓
5. Re-render filtered results
```

---

## 🎨 UI Components

### Search Bar
```html
<div class="faq-search-container">
    <input type="text" id="faqSearch" 
           placeholder="🔍 Search FAQs..." 
           class="faq-search-input">
    <div class="faq-search-results">
        Found <span id="faqCount">0</span> FAQs
    </div>
</div>
```

**Features:**
- 🔍 Search icon in placeholder
- Real-time result count
- Debounced typing (300ms)
- Enter key support

---

### Category Buttons
```html
<div class="faq-categories">
    <button class="faq-cat-btn active" data-category="all">All</button>
    <button class="faq-cat-btn" data-category="general">General</button>
    <button class="faq-cat-btn" data-category="account">Account</button>
    <button class="faq-cat-btn" data-category="schemes">Schemes</button>
    <button class="faq-cat-btn" data-category="security">Security</button>
    <button class="faq-cat-btn" data-category="technical">Technical</button>
</div>
```

**Categories:**
- **All** - Show all FAQs
- **General** - Basic platform questions
- **Account** - Login/profile related
- **Schemes** - Government schemes
- **Security** - Safety and privacy
- **Technical** - Technical issues

---

### Popular Tags
```html
<div class="faq-popular-tags">
    <span class="faq-tag">Login</span>
    <span class="faq-tag">Account</span>
    <span class="faq-tag">Schemes</span>
    <span class="faq-tag">Eligibility</span>
    <span class="faq-tag">Documents</span>
    <span class="faq-tag">Support</span>
</div>
```

**Behavior:**
- Click tag → Auto-fill search
- Visual hover effect
- Pill-shaped design
- Color-coded

---

### FAQ Accordion
```html
<div class="faq-grid" id="faqGrid">
    <div class="faq-item">
        <div class="faq-question">
            <span class="faq-category-badge">General</span>
            <h4>What is Rural Assist?</h4>
            <i class="bi bi-chevron-down"></i>
        </div>
        <div class="faq-answer">
            <p>Rural Assist is a platform...</p>
        </div>
    </div>
    <!-- More FAQ items -->
</div>
```

**Features:**
- Category badge
- Expandable answers
- Chevron rotation
- Smooth transitions

---

## 🔍 Search Algorithm

### Backend Search
```javascript
async function searchFAQ() {
    const query = document.getElementById("faqSearch").value.trim();
    
    if (!query) {
        renderFAQ(allFAQs);  // Show all
        return;
    }
    
    const response = await fetch(`${BACKEND_URL}/faq/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, lang: getCurrentLang() })
    });
    
    const data = await response.json();
    renderFAQ(data.results || []);
}
```

**API:** `POST /faq/search`  
**Body:** `{ query: "login", lang: "en" }`  
**Returns:** `{ count: 5, results: [...] }`

**Backend searches:**
- Question text (fuzzy match)
- Answer text (fuzzy match)
- Keywords (exact match)
- Category (exact match)

---

### Debounced Search
```javascript
let debounceTimer;
document.getElementById("faqSearch").addEventListener("keyup", (e) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(searchFAQ, 300);  // Wait 300ms
});
```

**Why debounce?**
- Reduces API calls (waits for user to finish typing)
- Improves performance
- Better user experience

---

## 🎨 Styling Details

### Colors
```css
--brand-primary: #34A853;     /* Green */
--brand-secondary: #2E8E46;   /* Dark green */
--surface-light: #f8fafc;     /* Background */
--text-muted: #6b7280;        /* Secondary text */
```

### Category Badge Colors
```javascript
const categoryColors = {
    general: "#3b82f6",      // Blue
    account: "#8b5cf6",      // Purple
    schemes: "#22c55e",      // Green
    security: "#ef4444",     // Red
    technical: "#f59e0b"     // Orange
};
```

### Accordion Animation
```css
.faq-answer {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease;
}

.faq-item.active .faq-answer {
    max-height: 500px;
}

.faq-item.active .bi-chevron-down {
    transform: rotate(180deg);
}
```

---

## 🌐 API Integration

### Get All FAQs
```javascript
const response = await fetch(`${BACKEND_URL}/faq`);
const data = await response.json();
const faqs = data.faqs || [];
```

**Endpoint:** `GET /faq`  
**Returns:** 
```json
{
    "count": 50,
    "faqs": [
        {
            "id": "faq_001",
            "category": "general",
            "question": "What is Rural Assist?",
            "answer": "Rural Assist is...",
            "keywords": ["platform", "rural", "help"]
        }
    ]
}
```

---

### Search FAQs
```javascript
const response = await fetch(`${BACKEND_URL}/faq/search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ 
        query: "login", 
        lang: "en",
        limit: 10  // Optional
    })
});
```

**Endpoint:** `POST /faq/search`  
**Body:** `{ query: string, lang: string, limit?: number }`  
**Returns:** 
```json
{
    "count": 3,
    "results": [
        {
            "id": "faq_022",
            "category": "account",
            "question": "How do I login?",
            "answer": "Use email OTP...",
            "keywords": ["login", "otp", "email"]
        }
    ]
}
```

---

## 📱 Responsive Design

### Desktop (≥992px)
- 2-column FAQ grid
- Full-width search
- Side-by-side categories
- Larger text

### Tablet (768px - 991px)
- 2-column FAQ grid
- Wrapped categories
- Compact tags

### Mobile (<768px)
- 1-column FAQ grid
- Stacked categories
- Scrollable tags
- Touch-optimized accordions

---

## 🧪 Testing

### Test Search
```
1. Load page → See all FAQs
2. Type "login" → See login-related FAQs
3. Type "scheme" → See scheme FAQs
4. Clear search → See all again
```

---

### Test Categories
```
1. Click "Account" → See only account FAQs
2. Type "password" → See account + password FAQs
3. Click "All" → See all FAQs again
```

---

### Test Tags
```
1. Click "Login" tag → Search auto-fills "Login"
2. Results show login FAQs
3. Click another tag → Search updates
```

---

### Test Accordion
```
1. Click FAQ question → Answer expands
2. Click another FAQ → Previous closes, new opens
3. Click same FAQ → Answer collapses
```

---

## 🐛 Troubleshooting

### Issue: FAQs not loading
**Debug:**
```javascript
// Check in browser console (F12)
console.log(allFAQs);
console.log(allFAQs.length);
```

**Solutions:**
1. Check backend running: `http://localhost:8000/faq`
2. Check browser console for errors
3. Hard refresh: Ctrl + Shift + R

---

### Issue: Search not working
**Debug:**
```javascript
// Check search query
console.log(document.getElementById("faqSearch").value);

// Check API response
fetch("http://localhost:8000/faq/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: "test", lang: "en" })
})
.then(r => r.json())
.then(d => console.log(d));
```

**Solutions:**
1. Ensure backend is running
2. Check network tab in DevTools (F12)
3. Verify `/faq/search` endpoint works
4. Check for CORS errors

---

### Issue: Categories not filtering
**Debug:**
```javascript
// Check active category
console.log(document.querySelector(".faq-cat-btn.active").dataset.category);

// Check filtered array
console.log(filteredFAQs);
```

**Solution:**
- Ensure category names match backend data
- Check `data-category` attributes
- Verify filter logic in `faq.js`

---

## 📊 Backend Integration

### FAQ Database Schema
```json
{
    "faqs": [
        {
            "id": "faq_001",
            "category": "general",
            "question": {
                "en": "What is Rural Assist?",
                "hi": "रूरल असिस्ट क्या है?"
            },
            "answer": {
                "en": "Rural Assist is a platform...",
                "hi": "रूरल असिस्ट एक मंच है..."
            },
            "keywords": ["platform", "rural", "help", "assistance"]
        }
    ]
}
```

**File:** `backend/faq_db.json`

---

### FAQ Service Functions

#### Get All FAQs
```python
# backend/faq_service.py
def get_all_faqs(lang="en"):
    faqs = load_faq_db()["faqs"]
    return [
        {
            "id": faq["id"],
            "category": faq["category"],
            "question": faq["question"].get(lang, faq["question"]["en"]),
            "answer": faq["answer"].get(lang, faq["answer"]["en"]),
            "keywords": faq.get("keywords", [])
        }
        for faq in faqs
    ]
```

---

#### Search FAQs
```python
def search_faqs(query, lang="en", limit=None):
    faqs = get_all_faqs(lang)
    results = []
    
    for faq in faqs:
        # Search in question
        if query.lower() in faq["question"].lower():
            results.append(faq)
            continue
            
        # Search in answer
        if query.lower() in faq["answer"].lower():
            results.append(faq)
            continue
            
        # Search in keywords
        if any(query.lower() in kw.lower() for kw in faq["keywords"]):
            results.append(faq)
    
    if limit:
        results = results[:limit]
    
    return results
```

---

## ✅ Feature Checklist

**Implemented:**
- [x] Real-time search
- [x] Category filtering
- [x] Popular tags
- [x] Accordion UI
- [x] Bilingual support (en, hi)
- [x] Debounced search
- [x] Result count
- [x] Responsive design
- [x] Error handling
- [x] Loading states
- [x] Empty states
- [x] Smooth animations

**Potential Enhancements:**
- [ ] FAQ ratings (helpful/not helpful)
- [ ] Related FAQs section
- [ ] FAQ suggestions (autocomplete)
- [ ] Print FAQ option
- [ ] Share FAQ link
- [ ] Video tutorials for complex FAQs
- [ ] FAQ history (recently viewed)
- [ ] AI-powered FAQ recommendations
- [ ] Live chat if FAQ not found

---

## 🔗 Related Files

- `backend/faq_service.py` - Backend FAQ logic
- `backend/faq_db.json` - FAQ database
- `frontend/assets/css/style.css` - Styling
- `frontend/assets/js/main.js` - Common utilities

---

**Last Updated:** December 2, 2025  
**Status:** ✅ Fully Functional  
**Integration:** Embedded in home page (`index.html#faq`)
