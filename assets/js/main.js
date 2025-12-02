// --- TOKEN EXPIRY AND LOGIN STATE ---
function isTokenExpired() {
    const token = localStorage.getItem("ruralassist_token");
    if (!token) return true;
    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const now = Date.now() / 1000;
        if (typeof payload.exp === "number") {
            return payload.exp < now;
        }
        return false;
    } catch {
        // If decode fails, treat as non-expired to avoid locking out
        return false;
    }
}

function isLoggedIn() {
    const token = localStorage.getItem("ruralassist_token");
    return !!token && !isTokenExpired();
}

function ensureLoggedIn() {
  if (!isLoggedIn()) {
    localStorage.clear();
    window.location.href = "login.html";
  }
}

function logout() {
  localStorage.clear();
  window.location.href = "login.html";
}

// --- LANGUAGE TOGGLE FUNCTIONALITY ---
const LANG_KEY = 'ruralasist_language';
let currentLang = localStorage.getItem(LANG_KEY) || 'en';

function toggleLanguage() {
    currentLang = currentLang === 'en' ? 'hi' : 'en';
    localStorage.setItem(LANG_KEY, currentLang);
    applyLanguage();
    updateLangToggleUI();
}

function applyLanguage() {
    // Update text content
    const elements = document.querySelectorAll('[data-lang-en], [data-lang-hi]');
    elements.forEach(el => {
        const text = el.getAttribute(`data-lang-${currentLang}`);
        if (text) {
            el.textContent = text;
        }
    });
    
    // Update placeholders
    const placeholderElements = document.querySelectorAll('[data-lang-en-placeholder], [data-lang-hi-placeholder]');
    placeholderElements.forEach(el => {
        const placeholder = el.getAttribute(`data-lang-${currentLang}-placeholder`);
        if (placeholder) {
            el.placeholder = placeholder;
        }
    });
}

function updateLangToggleUI() {
    const enEl = document.getElementById('langEn');
    const hiEl = document.getElementById('langHi');
    if (enEl && hiEl) {
        if (currentLang === 'en') {
            enEl.classList.add('active');
            hiEl.classList.remove('active');
        } else {
            hiEl.classList.add('active');
            enEl.classList.remove('active');
        }
    }
}

// Make toggleLanguage globally accessible
window.toggleLanguage = toggleLanguage;

document.addEventListener("DOMContentLoaded", () => {
    // Apply saved language preference to page content immediately
    applyLanguage();
    
    // Feature flags
    const CHATBOT_ENABLED = false; // Set to true to re-enable chatbot
    // --- 0. SERVICE WORKER REGISTRATION ---
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js')
            .then((registration) => {
                console.log('✅ Service Worker registered successfully:', registration);
            })
            .catch((error) => {
                console.log('⚠️ Service Worker registration failed:', error);
            });
    }

    // --- 1. SIDEBAR INJECTION ---
    const sidebarPlaceholder = document.getElementById('sidebar-placeholder');
    if (sidebarPlaceholder) {
        fetch('sidebar.html') // Assuming you create sidebar.html
            .then(response => response.text())
            .then(data => { 
                sidebarPlaceholder.innerHTML = data;
                
                // Apply saved language preference after sidebar loads
                updateLangToggleUI();
                applyLanguage();
                
                // Navbar login/avatar toggle
                try {
                    const loginLink = document.getElementById('nav-login-link');
                    const legacyLogoutLink = document.getElementById('nav-logout-link');
                    const userDropdown = document.getElementById('nav-user-dropdown');
                    const dropdownLogout = document.getElementById('nav-dropdown-logout');
                    const nameEl = document.getElementById('nav-dropdown-name');
                    const emailEl = document.getElementById('nav-dropdown-email');
                    const topNameEl = document.getElementById('nav-user-name');
                    const userName = localStorage.getItem('ruralassist_name') || '';
                    const userEmail = localStorage.getItem('user_email') || '';
                    const avatarTextEl = document.getElementById('nav-user-avatar-text');

                    const getInitials = (name) => {
                        if (!name) return 'UA';
                        const parts = name.trim().split(/\s+/);
                        const first = parts[0]?.[0] || '';
                        const second = parts.length > 1 ? parts[1]?.[0] : '';
                        const initials = (first + second).toUpperCase();
                        return initials || 'UA';
                    };

                    if (isLoggedIn()) {
                        if (loginLink) loginLink.classList.add('d-none');
                        if (legacyLogoutLink) legacyLogoutLink.classList.add('d-none');
                        if (userDropdown) userDropdown.classList.remove('d-none');
                        if (nameEl) nameEl.textContent = userName || 'User';
                        if (emailEl) emailEl.textContent = userEmail || '';
                        if (topNameEl) topNameEl.textContent = userName || '';
                        if (avatarTextEl) avatarTextEl.textContent = getInitials(userName);
                    } else {
                        if (userDropdown) userDropdown.classList.add('d-none');
                        if (loginLink) loginLink.classList.remove('d-none');
                        if (legacyLogoutLink) legacyLogoutLink.classList.add('d-none');
                    }

                    const attachLogout = (el) => {
                        if (!el) return;
                        el.addEventListener('click', (e) => { e.preventDefault(); logout(); });
                    };
                    attachLogout(legacyLogoutLink);
                    attachLogout(dropdownLogout);
                } catch (e) { console.warn('Navbar toggle error:', e); }
            })
            .catch(error => console.error('Error loading sidebar:', error));
    }

    // --- 2. CHATBOT INJECTION ---
    const chatbotPlaceholder = document.getElementById('chatbot-placeholder');
    if (chatbotPlaceholder && CHATBOT_ENABLED) {
        fetch('chatbot.html')
            .then(response => response.text())
            .then(data => {
                if (chatbotPlaceholder) {
                    chatbotPlaceholder.innerHTML = data;

                    // Wire up basic toggle behavior so the card pops up
                    const toggleBtn = chatbotPlaceholder.querySelector('#chatbot-toggle-button');
                    const chatWindow = chatbotPlaceholder.querySelector('#chatbot-window');
                    const closeBtn = chatbotPlaceholder.querySelector('#chatbot-close-button');
                    if (toggleBtn && chatWindow) {
                        toggleBtn.addEventListener('click', () => {
                            chatWindow.classList.toggle('hidden');
                        });
                    }
                    if (closeBtn && chatWindow) {
                        closeBtn.addEventListener('click', () => {
                            chatWindow.classList.add('hidden');
                        });
                    }

                    // Notify potential listeners the chatbot has mounted
                    document.dispatchEvent(new Event('chatbot:mount'));

                    // Load chatbot logic script once (optional, for full features)
                    if (!document.querySelector('script[data-chatbot-script]')) {
                        const s = document.createElement('script');
                        s.src = 'assets/js/chatbot.js';
                        s.defer = true;
                        s.setAttribute('data-chatbot-script', 'true');
                        document.body.appendChild(s);
                    }
                }
            })
            .catch(error => console.error('Error loading chatbot:', error));
    }

    // --- 3. LOGIN GATING FOR PROTECTED PAGES ---
    function ensureLoginModal() {
        if (document.getElementById('quickLoginModal')) return;
        const modalHtml = `
<div class="modal fade" id="quickLoginModal" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Login required</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <p>Login to access personalized schemes, OCR tools, and scam reporting. Quick OTP login takes just a moment.</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancel</button>
        <button type="button" class="btn btn-primary" id="quickLoginConfirmBtn">Quick Login</button>
      </div>
    </div>
  </div>
</div>`;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    }

    function openLoginModal(targetHref) {
        ensureLoginModal();
        const modalEl = document.getElementById('quickLoginModal');
        try {
            const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
            const confirmBtn = document.getElementById('quickLoginConfirmBtn');
            if (confirmBtn) {
                confirmBtn.onclick = () => {
                    try { localStorage.setItem('login_redirect_target', targetHref); } catch {}
                    window.location.href = 'login.html';
                };
            }
            modal.show();
        } catch (e) {
            // Fallback if Bootstrap not available
            if (confirm('Login is required to continue. Proceed to quick login?')) {
                try { localStorage.setItem('login_redirect_target', targetHref); } catch {}
                window.location.href = 'login.html';
            }
        }
    }
    // use top-level isLoggedIn()
    function gateOrAllow(e, href) {
        if (!isLoggedIn()) {
            e.preventDefault();
            openLoginModal(href);
        } else {
            window.location.href = href;
        }
    }
    // Defer attaching until sidebar is injected
    document.addEventListener('click', (e) => {
        const target = e.target.closest('a[href]');
        if (!target) return;
        const href = target.getAttribute('href');
        if (!href) return;
        // Protect Schemes, Report Scam, and OCR pages (all links, not just navbar)
        if (href.includes('schemes.html') || href.includes('report.html') || href.includes('ocr.html') || href.includes('profile.html')) {
            gateOrAllow(e, href);
        }
    });

    // --- 4. ACTIVE LINK HIGHLIGHTING ---
    const currentPage = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.navbar .nav-link').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // --- 5. BREADCRUMBS INJECTION ---
    const breadcrumbPages = {
        'schemes.html': 'Schemes',
        'ocr.html': 'OCR',
        'report.html': 'Report',
        'faq.html': 'FAQ'
    };
    if (breadcrumbPages[currentPage]) {
        const navHost = document.getElementById('sidebar-placeholder');
        if (navHost) {
            const bc = document.createElement('nav');
            bc.setAttribute('aria-label', 'breadcrumb');
            bc.className = 'container-fluid mt-2';
            bc.innerHTML = `
<ol class="breadcrumb mb-0">
  <li class="breadcrumb-item"><a href="index.html">Home</a></li>
  <li class="breadcrumb-item active" aria-current="page">${breadcrumbPages[currentPage]}</li>
</ol>`;
            navHost.insertAdjacentElement('afterend', bc);
        }
    }
});