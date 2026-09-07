import os
from fastapi import FastAPI, UploadFile, File, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any

from app.parser import parse_eml
from app.dns_verifier import verify_dns_auth
from app.url_extractor import extract_and_analyze_urls
from app.threat_intel import lookup_ip_reputation
from app.risk_engine import calculate_risk_score
from app.database import init_db, save_analysis, find_related_emails_by_ip, get_analysis_history

SAMPLES_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "samples")

app = FastAPI(
    title="CyberDetect API",
    description="Email Phishing/BEC Forensic Analyzer Hackathon Prototype",
    version="1.0.0"
)

# Enable CORS for React frontend (Vite dev server)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    init_db()
    # Pre-populate sample analyses into SQLite DB for demo correlation
    seed_samples_into_db()

def process_eml_bytes(content_bytes: bytes, sample_key: Optional[str] = None) -> Dict[str, Any]:
    """Execute complete analysis pipeline on raw EML bytes."""
    # 1. Parse EML
    parsed = parse_eml(content_bytes)
    headers = parsed["headers"]
    from_domain = headers["from_domain"]
    sender_ip = parsed["sender_ip"]
    raw_headers = parsed["raw_headers"]
    
    # 2. DNS Verification (SPF/DKIM/DMARC)
    auth_res = verify_dns_auth(from_domain, raw_headers)
    
    # 3. Extract & Analyze URLs/Domains
    url_res = extract_and_analyze_urls(parsed["body"]["text"], parsed["body"]["html"])
    
    # 4. Threat Intel Lookup (Cached JSON+Mock Fallback)
    intel_res = lookup_ip_reputation(sender_ip)
    
    # 5. Risk Engine Scoring
    risk_res = calculate_risk_score(auth_res, url_res, intel_res, headers)
    
    # 6. Save to DB
    record_id = save_analysis(
        sample_key=sample_key,
        subject=headers["subject"],
        from_address=headers["from_address"],
        sender_ip=sender_ip,
        risk_score=risk_res["score"],
        classification=risk_res["classification"],
        reasons=risk_res["reasons"],
        full_result={}
    )
    
    # 7. Check for shared infrastructure / related emails by IP
    related_emails = find_related_emails_by_ip(sender_ip, current_record_id=record_id)
    
    full_output = {
        "record_id": record_id,
        "sample_key": sample_key,
        "risk": risk_res,
        "headers": headers,
        "auth": auth_res,
        "urls": url_res,
        "intel": intel_res,
        "received_chain": parsed["received_chain"],
        "sender_ip": sender_ip,
        "related_emails": {
            "count": len(related_emails),
            "has_shared_infra": len(related_emails) > 0,
            "items": related_emails
        },
        "body_preview": {
            "text": parsed["body"]["text"][:1000],
            "has_html": bool(parsed["body"]["html"])
        }
    }
    
    return full_output

def seed_samples_into_db():
    """Seed sample emails into DB on startup if history is empty."""
    history = get_analysis_history(limit=5)
    if not history:
        sample_files = [
            ("clean_newsletter", "01_clean_newsletter.eml"),
            ("paypal_phishing", "02_paypal_phishing.eml"),
            ("ceo_bec", "03_ceo_bec_urgent.eml")
        ]
        for key, fname in sample_files:
            fpath = os.path.join(SAMPLES_DIR, fname)
            if os.path.exists(fpath):
                with open(fpath, "rb") as f:
                    process_eml_bytes(f.read(), sample_key=key)

class LoginRequest(BaseModel):
    username: str
    password: str

@app.post("/api/auth/login")
def login(credentials: LoginRequest):
    # Hardcoded single login for demo
    if credentials.username == "admin" and credentials.password == "cyberdetect2026":
        return {
            "status": "success",
            "token": "demo-soc-token-2026",
            "user": {
                "username": "admin",
                "name": "SOC Lead Analyst",
                "role": "Cybersecurity Forensics Specialist"
            }
        }
    else:
        raise HTTPException(status_code=401, detail="Invalid demo credentials. Use admin / cyberdetect2026")

@app.get("/api/samples")
def list_samples():
    """Return pre-configured seed sample emails."""
    return [
        {
            "id": "clean_newsletter",
            "name": "Legitimate Newsletter",
            "filename": "01_clean_newsletter.eml",
            "type": "CLEAN",
            "description": "Authentic tech newsletter with valid SPF/DKIM/DMARC",
            "expected_risk": "LOW"
        },
        {
            "id": "paypal_phishing",
            "name": "PayPal Credential Phishing",
            "filename": "02_paypal_phishing.eml",
            "type": "PHISHING",
            "description": "PayPal suspension scam with lookalike domain & failed DKIM",
            "expected_risk": "CRITICAL"
        },
        {
            "id": "ceo_bec",
            "name": "Urgent CEO Wire BEC",
            "filename": "03_ceo_bec_urgent.eml",
            "type": "BEC",
            "description": "Executive wire transfer scam with Reply-To mismatch & shared IP",
            "expected_risk": "HIGH"
        }
    ]

@app.post("/api/analyze/upload")
async def analyze_upload(file: UploadFile = File(...)):
    """Analyze uploaded .eml file."""
    if not file.filename.endswith((".eml", ".txt")):
        raise HTTPException(status_code=400, detail="Only .eml files are supported")
    
    content = await file.read()
    if not content:
        raise HTTPException(status_code=400, detail="Uploaded file is empty")
        
    return process_eml_bytes(content)

@app.post("/api/analyze/sample/{sample_id}")
def analyze_sample(sample_id: str):
    """Analyze pre-configured sample email by ID."""
    sample_map = {
        "clean_newsletter": "01_clean_newsletter.eml",
        "paypal_phishing": "02_paypal_phishing.eml",
        "ceo_bec": "03_ceo_bec_urgent.eml"
    }
    
    fname = sample_map.get(sample_id)
    if not fname:
        raise HTTPException(status_code=404, detail="Sample email not found")
        
    fpath = os.path.join(SAMPLES_DIR, fname)
    if not os.path.exists(fpath):
        raise HTTPException(status_code=404, detail=f"File {fname} not found in samples directory")
        
    with open(fpath, "rb") as f:
        content = f.read()
        
    return process_eml_bytes(content, sample_key=sample_id)

@app.get("/api/history")
def history():
    """Get recent analysis history."""
    return get_analysis_history(limit=20)
