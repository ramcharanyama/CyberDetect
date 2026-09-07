import os
import json
import requests
from typing import Dict, Any, Optional

CACHE_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "cache")
os.makedirs(CACHE_DIR, exist_ok=True)

ABUSEIPDB_API_KEY = os.getenv("ABUSEIPDB_API_KEY", "")

def get_cached_intel(key: str) -> Optional[Dict[str, Any]]:
    """Retrieve threat intel from local JSON file cache if present."""
    safe_key = key.replace("/", "_").replace(":", "_")
    cache_path = os.path.join(CACHE_DIR, f"{safe_key}.json")
    if os.path.exists(cache_path):
        try:
            with open(cache_path, "r", encoding="utf-8") as f:
                data = json.load(f)
                data["is_cached"] = True
                return data
        except Exception:
            return None
    return None

def save_cached_intel(key: str, data: Dict[str, Any]) -> None:
    """Save threat intel JSON response to local file cache."""
    safe_key = key.replace("/", "_").replace(":", "_")
    cache_path = os.path.join(CACHE_DIR, f"{safe_key}.json")
    try:
        with open(cache_path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)
    except Exception:
        pass

def mock_intel_response(ip: str) -> Dict[str, Any]:
    """Provide realistic mock threat intel data for demo fallback."""
    # Specific test IP from sample phishing/BEC emails
    if ip == "198.51.100.45":
        return {
            "ip_address": ip,
            "is_malicious": True,
            "abuse_confidence_score": 94,
            "total_reports": 87,
            "country_code": "US",
            "country_name": "United States",
            "isp": "Offshore VPS Hoster Inc",
            "domain": "vps-hoster.xyz",
            "usage_type": "Data Center / Web Hosting",
            "categories": ["Phishing", "Email Spam", "Malware Spreader"],
            "last_reported_at": "2026-09-07T10:00:00Z",
            "source": "AbuseIPDB (Mocked Demo Response)",
            "is_cached": False
        }
    elif ip.startswith("198.51.100.") or ip.startswith("209.85.") or ip == "127.0.0.1":
        return {
            "ip_address": ip,
            "is_malicious": False,
            "abuse_confidence_score": 0,
            "total_reports": 0,
            "country_code": "US",
            "country_name": "United States",
            "isp": "Google LLC / Trusted Host",
            "domain": "google.com",
            "usage_type": "Commercial / Content Delivery",
            "categories": [],
            "last_reported_at": None,
            "source": "AbuseIPDB (Mocked Demo Response)",
            "is_cached": False
        }
    else:
        # Generic suspicious response for arbitrary unrecognised IPs in demo
        return {
            "ip_address": ip,
            "is_malicious": True,
            "abuse_confidence_score": 78,
            "total_reports": 34,
            "country_code": "RO",
            "country_name": "Romania",
            "isp": "Unknown Relay Host",
            "domain": "relay-net.org",
            "usage_type": "VPN / Proxy Host",
            "categories": ["Suspicious Host", "Port Scan"],
            "last_reported_at": "2026-09-06T18:22:00Z",
            "source": "AbuseIPDB (Mocked Demo Response)",
            "is_cached": False
        }

def lookup_ip_reputation(ip: str) -> Dict[str, Any]:
    """
    Check AbuseIPDB API for IP reputation.
    Caches JSON response locally.
    Falls back to mock data if API key missing or call fails.
    """
    if not ip or ip == "127.0.0.1":
        return mock_intel_response("127.0.0.1")

    # 1. Check local file cache first
    cached = get_cached_intel(ip)
    if cached:
        return cached

    # 2. Try live AbuseIPDB API if key is available
    if ABUSEIPDB_API_KEY:
        try:
            url = "https://api.abuseipdb.com/api/v2/check"
            headers = {
                "Accept": "application/json",
                "Key": ABUSEIPDB_API_KEY
            }
            params = {
                "ipAddress": ip,
                "maxAgeInDays": "90"
            }
            response = requests.get(url, headers=headers, params=params, timeout=3.0)
            if response.status_code == 200:
                json_data = response.json().get("data", {})
                score = json_data.get("abuseConfidenceScore", 0)
                result = {
                    "ip_address": ip,
                    "is_malicious": score >= 50,
                    "abuse_confidence_score": score,
                    "total_reports": json_data.get("totalReports", 0),
                    "country_code": json_data.get("countryCode", "UNKNOWN"),
                    "country_name": json_data.get("countryName", "Unknown"),
                    "isp": json_data.get("isp", "Unknown ISP"),
                    "domain": json_data.get("domain", ""),
                    "usage_type": json_data.get("usageType", ""),
                    "categories": json_data.get("reports", []),
                    "last_reported_at": json_data.get("lastReportedAt"),
                    "source": "AbuseIPDB (Live API)",
                    "is_cached": False
                }
                save_cached_intel(ip, result)
                return result
        except Exception:
            pass

    # 3. Fall back to mock response & cache it for demo consistency
    mock_res = mock_intel_response(ip)
    save_cached_intel(ip, mock_res)
    return mock_res
