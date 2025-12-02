// -----------------------------
// FAQ PAGE SCRIPT - Enhanced Version
// -----------------------------

// Use global config if available, fallback to direct values
const API_BASE_URL = window.AppConfig?.API_BASE_URL || "http://127.0.0.1:8000";
const LANG_KEY = window.AppConfig?.STORAGE_KEYS?.LANGUAGE || 'ruralassist_language';

// These will be set when DOM is ready
let searchInput = null;
let faqContainer = null;
let statusText = null;

// Get current language
function getCurrentLang() {
    return localStorage.getItem(LANG_KEY) || 'en';
}

// DEFAULT FAQS TO DISPLAY (6 FAQs) - Bilingual
const DEFAULT_FAQS = [
    {
        question_en: "How do I log in with OTP?",
        question_hi: "मैं OTP से कैसे लॉगिन करूं?",
        answer_en: "Enter your email on the Login page, click Send OTP, then enter the OTP shown in the backend console during development to verify and sign in. For production, the OTP would be sent to your email.",
        answer_hi: "लॉगिन पेज पर अपना ईमेल दर्ज करें, OTP भेजें पर क्लिक करें, फिर सत्यापित करने और साइन इन करने के लिए बैकएंड कंसोल में दिखाए गए OTP को दर्ज करें। प्रोडक्शन में, OTP आपके ईमेल पर भेजा जाएगा।",
        icon: "bi-box-arrow-in-right"
    },
    {
        question_en: "Where can I find government schemes?",
        question_hi: "सरकारी योजनाएं कहां मिलेंगी?",
        answer_en: "Go to the Schemes page to browse and search schemes. You can filter by category like Agriculture, Education, Health, Housing, Employment, and more. Each scheme shows eligibility criteria and benefits.",
        answer_hi: "योजनाएं पेज पर जाकर योजनाएं ब्राउज़ और खोजें। आप कृषि, शिक्षा, स्वास्थ्य, आवास, रोजगार जैसी श्रेणियों से फ़िल्टर कर सकते हैं। प्रत्येक योजना में पात्रता मानदंड और लाभ दिखाए गए हैं।",
        icon: "bi-building"
    },
    {
        question_en: "How do I scan a document (OCR)?",
        question_hi: "दस्तावेज़ कैसे स्कैन करें (OCR)?",
        answer_en: "Open the OCR (Document Scanner) page, upload an image or PDF document, and click 'Extract Text' to get the text content instantly. The system supports both English and Hindi text recognition.",
        answer_hi: "OCR (डॉक्यूमेंट स्कैनर) पेज खोलें, एक इमेज या PDF दस्तावेज़ अपलोड करें, और तुरंत टेक्स्ट प्राप्त करने के लिए 'टेक्स्ट निकालें' पर क्लिक करें। सिस्टम अंग्रेजी और हिंदी दोनों टेक्स्ट पहचान का समर्थन करता है।",
        icon: "bi-file-earmark-text"
    },
    {
        question_en: "How do I report a scam?",
        question_hi: "धोखाधड़ी की रिपोर्ट कैसे करें?",
        answer_en: "Use the Report Scam page to submit suspicious SMS or call details. The system uses AI to analyze the message and flag common scam patterns. Your reports help protect the community.",
        answer_hi: "संदिग्ध SMS या कॉल विवरण जमा करने के लिए धोखाधड़ी रिपोर्ट पेज का उपयोग करें। सिस्टम AI का उपयोग करके संदेश का विश्लेषण करता है और सामान्य स्कैम पैटर्न को फ्लैग करता है। आपकी रिपोर्ट समुदाय की सुरक्षा में मदद करती है।",
        icon: "bi-shield-exclamation"
    },
    {
        question_en: "How do I update my profile?",
        question_hi: "अपनी प्रोफ़ाइल कैसे अपडेट करें?",
        answer_en: "Open the Profile page while logged in, click 'Edit Profile', enter your name, and save. Your dashboard shows your activity history and usage statistics.",
        answer_hi: "लॉगिन रहते हुए प्रोफ़ाइल पेज खोलें, 'प्रोफ़ाइल संपादित करें' पर क्लिक करें, अपना नाम दर्ज करें और सेव करें। आपका डैशबोर्ड आपकी गतिविधि इतिहास और उपयोग आंकड़े दिखाता है।",
        icon: "bi-person"
    },
    {
        question_en: "Can I use RuralAssist in Hindi?",
        question_hi: "क्या मैं RuralAssist हिंदी में उपयोग कर सकता हूं?",
        answer_en: "Yes! The AI chatbot supports both English and Hindi. The OCR document scanner can also extract text from Hindi documents. Simply type your question in Hindi and the system will respond accordingly.",
        answer_hi: "हां! AI चैटबॉट अंग्रेजी और हिंदी दोनों का समर्थन करता है। OCR डॉक्यूमेंट स्कैनर हिंदी दस्तावेज़ों से भी टेक्स्ट निकाल सकता है। बस हिंदी में अपना सवाल टाइप करें और सिस्टम उसी के अनुसार जवाब देगा।",
        icon: "bi-translate"
    }
];

// Get FAQ text based on language
function getFAQText(faq) {
    const lang = getCurrentLang();
    return {
        question: lang === 'hi' ? faq.question_hi : faq.question_en,
        answer: lang === 'hi' ? faq.answer_hi : faq.answer_en,
        icon: faq.icon
    };
}

// Quick search function for hint tags
function quickSearch(term) {
    if (searchInput) {
        searchInput.value = term;
        searchFAQ();
    }
}

// Get status text based on language
function getStatusText(type, count, query) {
    const lang = getCurrentLang();
    const texts = {
        'popular': {
            en: 'Showing popular FAQs. Type to search for specific topics.',
            hi: 'लोकप्रिय FAQ दिखाए जा रहे हैं। विशेष विषयों के लिए टाइप करें।'
        },
        'searching': {
            en: 'Searching...',
            hi: 'खोज रहे हैं...'
        },
        'found': {
            en: `<strong>${count}</strong> FAQ(s) found for "<em>${query}</em>"`,
            hi: `"<em>${query}</em>" के लिए <strong>${count}</strong> FAQ मिले`
        },
        'notfound': {
            en: `No results found for "<em>${query}</em>". Try different keywords.`,
            hi: `"<em>${query}</em>" के लिए कोई परिणाम नहीं मिला। अलग कीवर्ड आज़माएं।`
        }
    };
    return texts[type][lang];
}

// INITIAL LOAD - Initialize FAQs
function initFAQs() {
    console.log('Initializing FAQs...');
    
    // Get DOM elements now that DOM is ready
    searchInput = document.getElementById("faq-search");
    faqContainer = document.getElementById("faq-results");
    statusText = document.getElementById("faq-status");
    
    console.log('FAQ container found:', !!faqContainer);
    console.log('Status text found:', !!statusText);
    console.log('Search input found:', !!searchInput);
    
    if (statusText) {
        statusText.innerHTML = '<i class="bi bi-lightbulb me-2"></i>' + getStatusText('popular');
    }
    
    // Render defaults on first load
    if (faqContainer) {
        try {
            console.log('Rendering', DEFAULT_FAQS.length, 'FAQs');
            renderFAQs(DEFAULT_FAQS.map(getFAQText));
        } catch (e) {
            console.error('Error rendering FAQs:', e);
        }
    } else {
        console.log('FAQ container not found - cannot render FAQs');
    }
    
    // Set up search input listener
    if (searchInput) {
        let debounceTimer;
        searchInput.addEventListener("keyup", (e) => {
            clearTimeout(debounceTimer);
            if (e.key === 'Enter') {
                searchFAQ();
            } else {
                debounceTimer = setTimeout(searchFAQ, 300);
            }
        });
    }
}

// Run on DOMContentLoaded or immediately if already loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFAQs);
} else {
    // DOM already loaded, run immediately
    initFAQs();
}

// -----------------------------
// SEARCH FAQs
// -----------------------------
async function searchFAQ() {
    const q = (searchInput?.value || "").trim();

    if (q.length < 2) {
        if (statusText) statusText.innerHTML = '<i class="bi bi-lightbulb me-2"></i>' + getStatusText('popular');
        renderFAQs(DEFAULT_FAQS.map(getFAQText));
        return;
    }

    if (statusText) statusText.innerHTML = '<i class="bi bi-hourglass-split me-2"></i>' + getStatusText('searching');
    if (faqContainer) faqContainer.innerHTML = `
        <div class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
    `;

    try {
        const res = await fetch(`${API_BASE_URL}/faq/search`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query: q, limit: 20 })
        });

        const data = await res.json();
        const results = data.results || [];

        if (results.length > 0) {
            if (statusText) statusText.innerHTML = `<i class="bi bi-check-circle me-2 text-success"></i>` + getStatusText('found', results.length, q);
            renderFAQs(results);
        } else {
            // Search in local defaults too
            const localFAQs = DEFAULT_FAQS.map(getFAQText);
            const localResults = localFAQs.filter(faq => 
                faq.question.toLowerCase().includes(q.toLowerCase()) ||
                faq.answer.toLowerCase().includes(q.toLowerCase())
            );
            
            if (localResults.length > 0) {
                if (statusText) statusText.innerHTML = `<i class="bi bi-check-circle me-2 text-success"></i>` + getStatusText('found', localResults.length, q);
                renderFAQs(localResults);
            } else {
                if (statusText) statusText.innerHTML = `<i class="bi bi-info-circle me-2"></i>` + getStatusText('notfound', 0, q);
                renderFAQs([]);
            }
        }
    } catch (error) {
        console.error('FAQ search error:', error);
        // Fallback to local search
        const localFAQs = DEFAULT_FAQS.map(getFAQText);
        const localResults = localFAQs.filter(faq => 
            faq.question.toLowerCase().includes(q.toLowerCase()) ||
            faq.answer.toLowerCase().includes(q.toLowerCase())
        );
        
        if (localResults.length > 0) {
            if (statusText) statusText.innerHTML = `<i class="bi bi-check-circle me-2 text-success"></i>` + getStatusText('found', localResults.length, q);
            renderFAQs(localResults);
        } else {
            if (statusText) statusText.innerHTML = `<i class="bi bi-info-circle me-2"></i>` + getStatusText('notfound', 0, q);
            renderFAQs([]);
        }
    }
}

// -----------------------------
// RENDER FAQ CARDS
// -----------------------------
function renderFAQs(list) {
    if (!faqContainer) return;
    faqContainer.innerHTML = "";
    
    const lang = getCurrentLang();
    const noResultsTexts = {
        en: {
            title: 'No FAQs found',
            desc: 'Try searching with different keywords or browse our popular FAQs above.',
            btn: 'Show All FAQs'
        },
        hi: {
            title: 'कोई FAQ नहीं मिला',
            desc: 'अलग कीवर्ड से खोजें या ऊपर दिए गए लोकप्रिय FAQ देखें।',
            btn: 'सभी FAQ दिखाएं'
        }
    };
    const texts = noResultsTexts[lang];

    if (!list || list.length === 0) {
        faqContainer.innerHTML = `
            <div class="faq-no-results" style="grid-column: 1 / -1;">
                <i class="bi bi-search d-block"></i>
                <h5>${texts.title}</h5>
                <p>${texts.desc}</p>
                <button class="btn btn-outline-primary btn-sm mt-2" onclick="resetFAQSearch()">
                    <i class="bi bi-arrow-counterclockwise me-2"></i>${texts.btn}
                </button>
            </div>
        `;
        return;
    }

    list.forEach((faq, index) => {
        const card = document.createElement("div");
        card.className = "faq-card";
        card.setAttribute('data-aos', 'fade-up');
        card.setAttribute('data-aos-delay', (index * 50).toString());

        const icon = faq.icon || 'bi-question-circle';

        card.innerHTML = `
            <div class="faq-question">
                <span>${faq.question}</span>
                <div class="faq-question-icon">
                    <i class="bi bi-chevron-down"></i>
                </div>
            </div>
            <div class="faq-answer hidden">
                <p>${faq.answer}</p>
            </div>
        `;

        card.addEventListener("click", () => {
            const ans = card.querySelector(".faq-answer");
            const isExpanded = card.classList.contains('expanded');
            
            // Close all other expanded cards
            document.querySelectorAll('.faq-card.expanded').forEach(c => {
                if (c !== card) {
                    c.classList.remove('expanded');
                    c.querySelector('.faq-answer').classList.add('hidden');
                }
            });
            
            // Toggle current card
            if (isExpanded) {
                card.classList.remove('expanded');
                ans.classList.add('hidden');
            } else {
                card.classList.add('expanded');
                ans.classList.remove('hidden');
            }
        });

        faqContainer.appendChild(card);
    });
}

// Reset search
function resetFAQSearch() {
    if (searchInput) searchInput.value = '';
    if (statusText) statusText.innerHTML = '<i class="bi bi-lightbulb me-2"></i>' + getStatusText('popular');
    renderFAQs(DEFAULT_FAQS.map(getFAQText));
}
