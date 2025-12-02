from fastapi import APIRouter, File, UploadFile, HTTPException
from pydantic import BaseModel
from pathlib import Path
import cv2
import numpy as np
import tempfile
import fitz  # PyMuPDF

router = APIRouter()

# Lazy import for EasyOCR to avoid slow startup
_reader = None

def get_ocr_reader():
    global _reader
    if _reader is None:
        import easyocr
        _reader = easyocr.Reader(["en", "hi"], gpu=False)
    return _reader


class OCRResponse(BaseModel):
    text: str


def extract_pdf_text(pdf_path: str) -> str:
    text_out = []
    doc = fitz.open(pdf_path)
    for page in doc:
        text_out.append(page.get_text())
    return "\n".join(text_out)


@router.post("/extract", response_model=OCRResponse)
async def extract_text(file: UploadFile = File(...)):
    if not file.filename.lower().endswith((".jpg", ".jpeg", ".png", ".pdf")):
        raise HTTPException(status_code=400, detail="Invalid file format. Upload JPG, PNG, or PDF.")

    temp = tempfile.NamedTemporaryFile(delete=False)
    temp.write(await file.read())
    temp.close()

    file_path = temp.name

    try:
        # If PDF → try text extraction first
        if file.filename.lower().endswith(".pdf"):
            pdf_text = extract_pdf_text(file_path)
            if pdf_text.strip():
                return {"text": pdf_text}

        # Otherwise → OCR image
        img = cv2.imread(file_path)
        if img is None:
            raise HTTPException(status_code=500, detail="Failed to read image.")

        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        gray = cv2.threshold(gray, 0, 255, cv2.THRESH_OTSU + cv2.THRESH_BINARY)[1]

        reader = get_ocr_reader()
        result = reader.readtext(gray, detail=0)
        extracted_text = "\n".join(result)

        return {"text": extracted_text if extracted_text.strip() else "No readable text found."}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OCR failed: {str(e)}")

    finally:
        Path(file_path).unlink(missing_ok=True)
