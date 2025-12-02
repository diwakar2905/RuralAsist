// Production Configuration for RuralAssist
// This file overrides API_BASE_URL for production deployment

window.APP_CONFIG = {
    API_BASE_URL: "https://ruralasist.onrender.com",
    ENVIRONMENT: "production",
    FRONTEND_URL: "https://rural-asist-lovat.vercel.app"
};

console.log("🚀 Production config loaded - API:", window.APP_CONFIG.API_BASE_URL);