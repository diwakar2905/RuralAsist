# 📋 Government Schemes Page - Complete Documentation

## 📄 File: `frontend/schemes.html` & `frontend/assets/js/schemes.js`

### Purpose
Displays government schemes with offline support, caching, search, and filtering capabilities.

---

## 🎯 Key Features

### 1. **Offline Support**
- Works without internet connection
- Caches schemes locally (1-hour cache)
- Online/offline status indicator
- Fallback to cached data when offline

### 2. **Smart Caching**
- Automatic caching in `localStorage`
- 1-hour cache expiration
- Manual refresh button
- Update button (fetches latest when online)

### 3. **Search & Filter**
- Real-time search across title, description, keywords
- Category filters (Agriculture, Education, Health, etc.)
- Combined search + filter functionality
- Instant results

### 4. **Beautiful UI**
- Card-based layout
- Responsive grid (3 columns → 1 column on mobile)
- Hover effects and animations
- Color-coded categories
- Status badges (Live/Cached)

---

## 🔧 Configuration

### Constants
```javascript
const BACKEND_URL = "http://127.0.0.1:8000";
const CACHE_KEY = "schemes_cache";
const CACHE_TIME = 60 * 60 * 1000; // 1 hour
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
2. Check online status
   ↓
3. Try to load from cache
   ↓
4. If cache valid (< 1 hour):
   - Display cached schemes
   - Show "Cached" badge
   ↓
5. If cache expired/missing:
   - Fetch from backend (/schemes/local)
   - Cache response
   - Display schemes
   ↓
6. If backend fails:
   - Show error message
   - Use cached data (if available)
```

---

### Search Flow
```
1. User types in search box
   ↓
2. Filter allSchemes array:
   - Match title
   - Match description
   - Match keywords
   ↓
3. Apply category filter (if selected)
   ↓
4. Re-render filtered results
   ↓
5. Update scheme count
```

---

### Update Flow (Manual)
```
1. User clicks "Update" button
   ↓
2. Check if online
   ↓
3. If offline: Show error
   ↓
4. If online:
   - POST to /schemes/update
   - Backend fetches latest from internet
   - Clear local cache
   - Reload schemes
   - Show success message
```

---

## 🎨 UI Components

### Status Indicator
```html
<div class="status-indicator">
    <span class="status-dot online"></span>
    <span>🟢 Online - Live updates available</span>
</div>
```

**States:**
- 🟢 **Online** - Green dot, can update schemes
- 🔴 **Offline** - Red dot, using cached data

---

### Search Bar
```html
<div class="search-bar">
    <input type="text" class="search-input" 
           placeholder="Search schemes by name, category, or keyword...">
    <button class="search-btn">Search</button>
    <button class="action-btn" id="updateBtn">Update</button>
    <button class="action-btn" id="refreshBtn">Refresh</button>
</div>
```

**Buttons:**
- **Search** - Triggers search
- **Update** - Fetches latest from online (disabled when offline)
- **Refresh** - Clears cache and reloads

---

### Category Filters
```html
<div class="filter-bar">
    <button class="filter-btn active" data-filter="all">All Categories</button>
    <button class="filter-btn" data-filter="agriculture">🌾 Agriculture</button>
    <button class="filter-btn" data-filter="education">📚 Education</button>
    <!-- ... more categories ... -->
</div>
```

**Categories:**
- All Categories
- 🌾 Agriculture
- 📚 Education
- 🏥 Health
- 🏠 Housing
- 💼 Employment
- ⚡ Energy
- 🧓 Pension
- 🤝 Social Welfare

---

### Scheme Card
```html
<div class="scheme-card">
    <div class="scheme-category">🌾 Agriculture</div>
    <h3 class="scheme-title">PM-Kisan Samman Nidhi</h3>
    <p class="scheme-description">Income support for farmers...</p>
    
    <div class="scheme-benefit">
        <strong>💰 Benefits:</strong><br>
        ₹6,000 per year...
    </div>
    
    <div class="scheme-tags">
        <span class="tag">Agriculture</span>
        <span class="tag">Income Support</span>
    </div>
    
    <div class="scheme-footer">
        <small class="scheme-source">🌐 Live</small>
        <a href="#" class="apply-btn">
            Apply <i class="bi bi-box-arrow-up-right"></i>
        </a>
    </div>
</div>
```

---

## 💾 Caching System

### Cache Structure
```javascript
{
    schemes: [
        { id: "pm_kisan", title: "...", category: "agriculture", ... },
        { id: "ayushman", title: "...", category: "health", ... },
        // ... more schemes
    ],
    timestamp: 1701518400000  // Unix timestamp
}
```

### Cache Management
```javascript
// Get cached schemes
function getCachedSchemes() {
    const cached = localStorage.getItem(CACHE_KEY);
    const { schemes, timestamp } = JSON.parse(cached);
    
    // Check if expired (> 1 hour)
    if (Date.now() - timestamp > CACHE_TIME) {
        localStorage.removeItem(CACHE_KEY);
        return null;
    }
    
    return schemes;
}

// Save to cache
function setCachedSchemes(schemes) {
    localStorage.setItem(CACHE_KEY, JSON.stringify({
        schemes,
        timestamp: Date.now()
    }));
}
```

---

## 🔍 Search Algorithm

### Text Matching
```javascript
function searchSchemes() {
    const query = document.getElementById("searchInput").value.trim().toLowerCase();
    const activeFilter = document.querySelector(".filter-btn.active").dataset.filter;
    
    let filtered = allSchemes;
    
    // 1. Apply category filter
    if (activeFilter !== "all") {
        filtered = filtered.filter(s => s.category === activeFilter);
    }
    
    // 2. Apply search query
    if (query) {
        filtered = filtered.filter(scheme => {
            const searchText = `
                ${scheme.title} 
                ${scheme.description} 
                ${scheme.category}
                ${(scheme.keywords || []).join(" ")}
            `.toLowerCase();
            
            return searchText.includes(query);
        });
    }
    
    renderSchemes(filtered);
}
```

**Searches in:**
- Scheme title
- Description
- Category
- Keywords array
- Tags

**Case-insensitive:** All text converted to lowercase

---

## 🌐 API Integration

### Get All Schemes
```javascript
const response = await fetch(`${BACKEND_URL}/schemes/local`);
const data = await response.json();
const schemes = data.schemes || [];
```

**Endpoint:** `GET /schemes/local`  
**Returns:** Array of scheme objects

---

### Update Schemes (Online)
```javascript
const response = await fetch(`${BACKEND_URL}/schemes/update`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: "scheme", limit: 50 })
});
```

**Endpoint:** `POST /schemes/update`  
**Body:** `{ query: "scheme", limit: 50 }`  
**Returns:** `{ message: "Updated X schemes" }`

---

## 📱 Responsive Design

### Desktop (≥992px)
- 3-column grid
- Full search bar
- Side-by-side filters
- Larger cards

### Tablet (768px - 991px)
- 2-column grid
- Compact search bar
- Wrapped filters

### Mobile (<768px)
- 1-column grid
- Stacked search bar
- Centered filters
- Touch-optimized buttons

---

## 🎨 Styling Details

### Colors
```css
--brand-primary: #34A853;     /* Green */
--brand-secondary: #2E8E46;   /* Dark green */
--surface-light: #f8fafc;     /* Background */
--text-muted: #6b7280;        /* Secondary text */
```

### Card Hover Effect
```css
.scheme-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 12px 32px rgba(0,0,0,0.1);
}
```

### Category Formatting
```javascript
function formatCategory(cat) {
    const categories = {
        agriculture: { emoji: "🌾", en: "Agriculture", hi: "कृषि" },
        education: { emoji: "📚", en: "Education", hi: "शिक्षा" },
        // ... more
    };
    
    const data = categories[cat];
    return data.emoji + " " + data.en;
}
```

---

## 🔔 Notifications

### Success Notification
```javascript
showNotification("🎉 Schemes updated successfully!", "success");
```

### Error Notification
```javascript
showNotification("❌ Failed to load schemes", "error");
```

### Info Notification
```javascript
showNotification("🔄 Cache cleared! Reloading...", "info");
```

**Display Duration:** 4 seconds  
**Position:** Top-right corner  
**Animation:** Slide in from right

---

## 🧪 Testing

### Test Cache
```javascript
// Check if cache exists
console.log(localStorage.getItem('schemes_cache'));

// Clear cache manually
localStorage.removeItem('schemes_cache');

// Check cache age
const cached = JSON.parse(localStorage.getItem('schemes_cache'));
const age = Date.now() - cached.timestamp;
console.log('Cache age:', age / 1000 / 60, 'minutes');
```

---

### Test Search
```
1. Load page → See all schemes
2. Type "farmer" → See farming schemes
3. Click "Agriculture" filter → See only agriculture
4. Type "kisan" → See PM-Kisan
5. Clear search → See all again
```

---

### Test Online/Offline
```
1. Open page (online) → Green dot
2. Stop backend → Still works (cache)
3. Click "Update" → Error (offline)
4. Start backend → Green dot returns
5. Click "Update" → Success
```

---

## 🐛 Troubleshooting

### Issue: No schemes visible
**Debug:**
```javascript
// Check in browser console (F12)
console.log(allSchemes);  // Should show array
console.log(allSchemes.length);  // Should be > 0
```

**Solutions:**
1. Check backend running (`http://localhost:8000/schemes/local`)
2. Clear cache: Click "Refresh" button
3. Check browser console for errors
4. Hard refresh: Ctrl + Shift + R

---

### Issue: Old schemes showing
**Cause:** Cache not cleared

**Solution:**
1. Click "Refresh" button (clears cache)
2. Or manually: `localStorage.removeItem('schemes_cache')`
3. Hard refresh: Ctrl + Shift + R

---

### Issue: Search not working
**Debug:**
```javascript
// Check search query
console.log(document.getElementById("searchInput").value);

// Check filtered results
console.log(filtered.length);
```

**Solution:**
- Ensure backend has scheme data
- Check category filter is not too restrictive
- Try clearing all filters first

---

### Issue: Update button disabled
**Cause:** Offline mode

**Solution:**
1. Check internet connection
2. Ensure backend is running
3. Wait for status check (30 seconds)
4. Refresh page

---

## 📊 Performance Optimizations

### 1. Lazy Rendering
- Only render visible schemes
- Use document fragments
- Batch DOM updates

### 2. Debounced Search
```javascript
let debounceTimer;
searchInput.addEventListener("keyup", (e) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(searchFAQ, 300);  // 300ms delay
});
```

### 3. Efficient Caching
- Store in localStorage (no server requests)
- 1-hour expiry (balance freshness vs performance)
- Automatic cleanup on expiry

---

## 🔗 Related Files

- `backend/schemes_service.py` - Backend API
- `backend/schemes_db.json` - Scheme database
- `frontend/assets/css/style.css` - Styling
- `frontend/assets/js/main.js` - Common utilities

---

## ✅ Feature Checklist

**Implemented:**
- [x] Offline support
- [x] Local caching (1-hour)
- [x] Search functionality
- [x] Category filtering
- [x] Online/offline indicator
- [x] Update button (fetch latest)
- [x] Refresh button (clear cache)
- [x] Responsive design
- [x] Beautiful cards
- [x] Bilingual ready
- [x] Error handling
- [x] Loading states
- [x] Empty states
- [x] Notifications

**Potential Enhancements:**
- [ ] Saved schemes (bookmarks)
- [ ] Scheme comparisons
- [ ] Eligibility calculator
- [ ] Share functionality
- [ ] Print/PDF export
- [ ] Advanced filters (state, eligibility)
- [ ] Sort options (A-Z, latest)
- [ ] Infinite scroll
- [ ] Scheme ratings/reviews

---

**Last Updated:** December 2, 2025  
**Status:** ✅ Fully Functional  
**Browser Support:** Chrome, Firefox, Edge, Safari (modern versions)
