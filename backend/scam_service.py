from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
import json
from pathlib import Path

router = APIRouter()

BASE_DIR = Path(__file__).resolve().parent
SCAM_KEYWORDS_PATH = BASE_DIR / "scam_keywords.json"
COMMON_SCAMS_PATH = BASE_DIR / "common_scams.json"


# --- Request/Response Models ---
class ScamReportRequest(BaseModel):
    description: str
    scam_type: Optional[str] = None
    location: Optional[str] = None
    anonymous: bool = False


class ScamAnalysisResponse(BaseModel):
    risk_level: str
    risk_score: float
    keywords_detected: List[str]
    analysis_text: str


class ScamReportResponse(BaseModel):
    report_id: str
    risk_level: str
    message: str


# --- Risk Keywords & Patterns ---
SCAM_KEYWORDS_CACHE = None
SAFE_KEYWORDS = {
    "official",
    "verified",
    "secure",
    "trusted",
    "legitimate",
    "government",
    "authentic",
    "real",
    "valid",
}


def load_scam_keywords():
    global SCAM_KEYWORDS_CACHE
    if SCAM_KEYWORDS_CACHE is not None:
        return SCAM_KEYWORDS_CACHE

    if not SCAM_KEYWORDS_PATH.exists():
        SCAM_KEYWORDS_CACHE = {"high_risk": [], "medium_risk": [], "low_risk": []}
        return SCAM_KEYWORDS_CACHE

    with SCAM_KEYWORDS_PATH.open("r", encoding="utf-8") as f:
        SCAM_KEYWORDS_CACHE = json.load(f)
        return SCAM_KEYWORDS_CACHE


# --- Risk Scoring Function ---
def calculate_risk_score(description: str):
    text = description.lower()
    score = 0
    detected = []

    data = load_scam_keywords()

    for item in data.get("high_risk", []):
        for pat in item.get("patterns", []):
            if item["keyword"].lower() in text or pat.lower().strip(".*") in text:
                score += item.get("risk_score", 85) / 5
                detected.append(item["keyword"])
                break

    for item in data.get("medium_risk", []):
        for pat in item.get("patterns", []):
            if item["keyword"].lower() in text or pat.lower().strip(".*") in text:
                score += item.get("risk_score", 55) / 10
                detected.append(item["keyword"])
                break

    for keyword in SAFE_KEYWORDS:
        if keyword in text:
            score -= 10

    word_count = len(text.split())
    if word_count < 10:
        score -= 10
    elif word_count > 50:
        score += 5

    if any(pattern in text for pattern in ["http://", "https://", ".com", ".in"]):
        score += 10
    if any(char.isdigit() for char in text) and len(text) > 20:
        score += 5

    score = max(0, min(100, score))

    if score >= 70:
        risk_level = "High"
        analysis_text = "🚨 HIGH-RISK SCAM — Do NOT share OTP, passwords, or bank details. Do NOT click any links. Contact your bank immediately if money was involved."
    elif score >= 40:
        risk_level = "Medium"
        analysis_text = "⚠️ MEDIUM-RISK — Be cautious. Verify by contacting official sources directly. Never share personal/financial information via unsolicited messages."
    else:
        risk_level = "Low"
        analysis_text = "✅ LOW-RISK — Appears low risk, but stay cautious. Always verify unexpected requests."

    return risk_level, score, list(set(detected)), analysis_text


# --- Endpoints ---
@router.post("/analyze", response_model=ScamAnalysisResponse)
def analyze_scam(request: ScamReportRequest):
    risk_level, risk_score, keywords, analysis_text = calculate_risk_score(request.description)

    return ScamAnalysisResponse(
        risk_level=risk_level,
        risk_score=risk_score,
        keywords_detected=keywords[:5],
        analysis_text=analysis_text,
    )


@router.post("/report", response_model=ScamReportResponse)
def submit_scam_report(request: ScamReportRequest):
    risk_level, risk_score, _, _ = calculate_risk_score(request.description)
    report_id = f"SCAM-{datetime.utcnow().strftime('%Y%m%d%H%M%S')}"

    return ScamReportResponse(
        report_id=report_id,
        risk_level=risk_level,
        message=f"Report submitted successfully! Risk Level: {risk_level}",
    )


@router.get("/common-scams")
def get_common_scams():
    if not COMMON_SCAMS_PATH.exists():
        raise HTTPException(status_code=404, detail="Common scams data not found")

    with COMMON_SCAMS_PATH.open("r", encoding="utf-8") as f:
        data = json.load(f)

    adapted = []
    for item in data:
        adapted.append(
            {
                "type": item.get("title", "Scam"),
                "description": item.get("description", ""),
                "warning": "Be cautious and verify through official channels.",
                "examples": item.get("examples", []),
            }
        )

    return {"common_scams": adapted}
