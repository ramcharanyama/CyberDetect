# CyberDetect — Email Phishing & BEC Forensic Analyzer

CyberDetect is a SOC-grade email forensic analysis platform built for cybersecurity hackathon demonstrations. It analyzes `.eml` files in real-time, performing header tracing, SPF/DKIM/DMARC DNS authentication verification, Levenshtein brand lookalike detection, threat intelligence IP reputation lookups (with local caching), and a weighted rule-based risk scoring engine.

---

## Quick Start (Demo Mode)

### Option 1: One-Command Launcher
Run the single Python script to start both backend & frontend servers simultaneously:
```bash
python start.py
```
Open **http://localhost:5173** in your browser.

### Option 2: Manual Start

**1. Start Backend (FastAPI)**:
```bash
cd backend
python -m uvicorn app.main:app --port 8000
```

**2. Start Frontend (React + Vite)**:
```bash
cd frontend
npm run dev
```

---

## Demo Credentials
- **Username**: `admin`
- **Password**: `cyberdetect2026`

---

## Pipeline Architecture & Scoring Rules

1. **EML Parsing (`parser.py`)**: Hop-by-hop `Received` header trace, address extraction (`From`, `To`, `Reply-To`, `Return-Path`), and domain mismatch detection.
2. **SPF/DKIM/DMARC Verification (`dns_verifier.py`)**: Uses `dnspython` to query live DNS records for SPF (`v=spf1`) and DMARC (`_dmarc.domain`), alongside DKIM signature validation.
3. **URL & Domain Extraction (`url_extractor.py`)**: Extracts embedded links and calculates Levenshtein distance metrics against major target brands (`paypal`, `microsoft`, `google`, `amazon`, `bankofamerica`, etc.) without initiating external network requests.
4. **Threat Intelligence (`threat_intel.py`)**: Queries AbuseIPDB for sender IP reputation. Caches JSON responses to `backend/cache/{ip}.json` and falls back to structured mock data to prevent rate limits or demo breakages offline.
5. **Weighted Rule-Based Risk Engine (`risk_engine.py`)**:
   - Auth Failure (SPF / DKIM / DMARC fail): **30 points**
   - Lookalike Brand Domain Detected: **20 points**
   - Suspicious Link / Raw IP / TLD: **20 points**
   - Bad IP Reputation (AbuseIPDB): **20 points**
   - Header Address Mismatch (Reply-To / Return-Path): **10 points**
   - *Classifications*: `0-29 LOW` | `30-59 MEDIUM` | `60-79 HIGH` | `80-100 CRITICAL`
6. **Shared Infrastructure Correlation**: Detects if a sender IP matches past analyzed emails in SQLite database and displays a **"Related emails found: X — possible shared infrastructure"** banner.

---

## Seed Demo Data
Pre-loaded seed emails available in UI:
- **Clean Newsletter**: Legitimate newsletter with passing SPF/DKIM/DMARC (`0 / 100 LOW`).
- **PayPal Phishing**: Phishing email targeting credentials with typo-squatted domain `paypa1-security-check.com` (`100 / 100 CRITICAL`).
- **Urgent CEO BEC**: Executive wire transfer request sharing sender IP `198.51.100.45` with the PayPal phishing email, triggering the shared infrastructure correlation alert.
