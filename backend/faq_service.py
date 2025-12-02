from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
import json
from pathlib import Path

router = APIRouter()

BASE_DIR = Path(__file__).resolve().parent
FAQ_DB_PATH = BASE_DIR / "faq_db.json"


class FAQSearchRequest(BaseModel):
    query: str
    limit: int = 10


def load_faqs() -> List[dict]:
    if not FAQ_DB_PATH.exists():
        raise HTTPException(status_code=404, detail="FAQ database not found")
    with FAQ_DB_PATH.open("r", encoding="utf-8") as f:
        return json.load(f)


def match_score(query: str, item: dict) -> int:
    q = query.lower().strip()
    score = 0
    fields = [
        item.get("question", ""),
        item.get("answer", ""),
        " ".join(item.get("keywords", [])),
    ]
    for field in fields:
        text = field.lower()
        if not q:
            continue
        if q in text:
            score += 50
        q_tokens = set(q.split())
        t_tokens = set(text.split())
        overlap = len(q_tokens & t_tokens)
        score += overlap * 10
    return score


@router.post("/search")
def search_faqs(req: FAQSearchRequest):
    faqs = load_faqs()
    ranked = []
    for faq in faqs:
        s = match_score(req.query, faq)
        if s > 0:
            ranked.append((s, faq))
    ranked.sort(key=lambda x: x[0], reverse=True)
    results = [faq for _, faq in ranked[: req.limit]]
    return {"count": len(results), "results": results}
