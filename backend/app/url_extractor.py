import re
from urllib.parse import urlparse
from bs4 import BeautifulSoup
from typing import Dict, Any, List, Set

TARGET_BRANDS = [
    "paypal", "microsoft", "google", "amazon", 
    "bankofamerica", "apple", "chase", "wellsfargo", 
    "netflix", "linkedin", "facebook", "twitter"
]

SUSPICIOUS_TLDS = {".xyz", ".top", ".tk", ".club", ".online", ".site", ".work", ".click", ".info", ".net", ".org"}

def levenshtein_distance(s1: str, s2: str) -> int:
    """Standard Levenshtein distance calculation."""
    if len(s1) < len(s2):
        return levenshtein_distance(s2, s1)

    if len(s2) == 0:
        return len(s1)

    previous_row = range(len(s2) + 1)
    for i, c1 in enumerate(s1):
        current_row = [i + 1]
        for j, c2 in enumerate(s2):
            insertions = previous_row[j + 1] + 1
            deletions = current_row[j] + 1
            substitutions = previous_row[j] + (c1 != c2)
            current_row.append(min(insertions, deletions, substitutions))
        previous_row = current_row

    return previous_row[-1]

def extract_domain_from_url(url: str) -> str:
    """Extract hostname/domain from URL."""
    try:
        if not url.startswith(("http://", "https://")):
            url = "http://" + url
        parsed = urlparse(url)
        netloc = parsed.netloc.split(":")[0].lower()
        return netloc
    except Exception:
        return ""

def check_lookalike_domain(domain: str) -> Dict[str, Any]:
    """
    Check if domain is a lookalike of target brands using Levenshtein distance.
    Handles hyphenated subdomains/SLDs (e.g. paypa1-security-check.com -> paypa1 vs paypal).
    """
    if not domain:
        return {"is_lookalike": False, "matched_brand": None, "distance": None}

    # Split domain into subdomains and main domain
    parts = domain.split(".")
    # Take main SLD (second-level domain)
    sld = parts[-2] if len(parts) >= 2 else parts[0]
    
    # 1. Exact match with brand on full SLD -> Not a lookalike (it's the genuine brand)
    for brand in TARGET_BRANDS:
        if sld == brand:
            return {"is_lookalike": False, "matched_brand": brand, "distance": 0, "reason": f"Genuine domain for {brand}"}

    # Tokenize SLD by hyphens and underscores
    tokens = re.split(r'[-_]', sld)

    for token in tokens:
        if not token:
            continue
            
        # Check exact token match (e.g. paypal in paypal-login-verify.com -> suspicious combo)
        for brand in TARGET_BRANDS:
            if token == brand and sld != brand:
                return {
                    "is_lookalike": True,
                    "matched_brand": brand,
                    "distance": len(sld) - len(brand),
                    "reason": f"Impersonates brand '{brand}' in domain '{domain}'"
                }

        # Check Levenshtein distance on token
        for brand in TARGET_BRANDS:
            dist = levenshtein_distance(token, brand)
            if 1 <= dist <= 2:
                return {
                    "is_lookalike": True,
                    "matched_brand": brand,
                    "distance": dist,
                    "reason": f"Typo-squatted brand '{brand}' (token '{token}' vs '{brand}', edit distance: {dist})"
                }

    return {"is_lookalike": False, "matched_brand": None, "distance": None}

def extract_and_analyze_urls(text_body: str, html_body: str) -> Dict[str, Any]:
    """Extract URLs from text and HTML bodies, analyze for lookalikes and threats."""
    raw_urls: Set[str] = set()

    # Regex search across text and html
    url_regex = re.compile(r'https?://[^\s<>"\'()]+')
    
    if text_body:
        for match in url_regex.findall(text_body):
            raw_urls.add(match)
            
    if html_body:
        for match in url_regex.findall(html_body):
            raw_urls.add(match)
            
        # Parse HTML href attributes
        try:
            soup = BeautifulSoup(html_body, 'html.parser')
            for a_tag in soup.find_all('a', href=True):
                href = a_tag['href'].strip()
                if href.startswith(('http://', 'https://')):
                    raw_urls.add(href)
        except Exception:
            pass

    analyzed_urls = []
    lookalike_detected = False
    suspicious_url_detected = False
    flagged_domains = []

    for url in raw_urls:
        domain = extract_domain_from_url(url)
        lookalike_info = check_lookalike_domain(domain)
        
        is_suspicious = False
        reasons = []

        if lookalike_info["is_lookalike"]:
            lookalike_detected = True
            is_suspicious = True
            reasons.append(lookalike_info["reason"])
            if domain not in flagged_domains:
                flagged_domains.append(domain)

        # Check for raw IP in URL
        if re.match(r'^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$', domain):
            is_suspicious = True
            suspicious_url_detected = True
            reasons.append("Raw IP address used in URL")

        # Check for suspicious TLD
        for tld in SUSPICIOUS_TLDS:
            if domain.endswith(tld) and not lookalike_info.get("reason", "").startswith("Genuine"):
                is_suspicious = True
                suspicious_url_detected = True
                reasons.append(f"Suspicious TLD '{tld}'")
                break

        if is_suspicious:
            suspicious_url_detected = True

        analyzed_urls.append({
            "url": url,
            "domain": domain,
            "is_suspicious": is_suspicious,
            "lookalike": lookalike_info,
            "reasons": reasons
        })

    return {
        "url_count": len(analyzed_urls),
        "urls": analyzed_urls,
        "lookalike_detected": lookalike_detected,
        "suspicious_url_detected": suspicious_url_detected,
        "flagged_domains": flagged_domains
    }
