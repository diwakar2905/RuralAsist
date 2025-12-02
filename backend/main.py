from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
import os

import models
from database import engine

# Routers
from ocr_service import router as ocr_router
from chatbot_service import router as chatbot_router
from schemes_service import router as schemes_router
from scam_service import router as scam_router
from faq_service import router as faq_router
from auth_service import router as auth_router
from profile_service import router as profile_router


BASE_DIR = Path(__file__).resolve().parent

# Create DB tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="RuralAssist Backend", version="1.0.0")

# Upload directory
UPLOADS_DIR = BASE_DIR / "uploads"
os.makedirs(UPLOADS_DIR, exist_ok=True)

# CORS
origins = [
    "*",  # Allow all for development
    "https://*.vercel.app",  # Vercel deployments
    "https://*.onrender.com",  # Render deployments
    "http://localhost:3000",  # Local development
    "http://127.0.0.1:5500",  # Live Server
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include all routers with prefixes
app.include_router(ocr_router, prefix="/ocr")
app.include_router(chatbot_router, prefix="/chatbot")
app.include_router(schemes_router, prefix="/schemes")
app.include_router(scam_router, prefix="/scam")
app.include_router(auth_router, prefix="/auth")
app.include_router(faq_router, prefix="/faq")
app.include_router(profile_router, prefix="/profile")


@app.get("/")
def root():
    return {
        "message": "RuralAssist Backend Running Successfully!",
        "routes": [
            "/ocr",
            "/chatbot",
            "/schemes",
            "/scam",
            "/auth",
            "/faq",
            "/profile",
        ]
    }


@app.get("/favicon.ico", include_in_schema=False)
def favicon():
    return Response(status_code=204)
