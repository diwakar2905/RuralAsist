from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import json
from pathlib import Path

app = FastAPI(title="RuralAssist Test Backend")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load schemes data directly
SCHEMES_DB_PATH = Path(__file__).parent / "schemes_db.json"

@app.get("/")
def root():
    return {"message": "RuralAssist Backend Running!"}

@app.get("/schemes/local")
def get_local_schemes():
    try:
        with open(SCHEMES_DB_PATH, 'r', encoding='utf-8') as f:
            schemes = json.load(f)
        
        # Add source field to each scheme
        for scheme in schemes:
            scheme['source'] = 'local'
            
        return {
            "schemes": schemes,
            "total": len(schemes),
            "source": "local"
        }
    except Exception as e:
        return {
            "schemes": [],
            "total": 0,
            "error": str(e),
            "source": "local"
        }

@app.get("/schemes/status")
def get_status():
    return {"status": "online"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)