from typing import Dict, Any, List

def calculate_risk_score(
    auth_data: Dict[str, Any],
    url_data: Dict[str, Any],
    intel_data: Dict[str, Any],
    headers_data: Dict[str, Any]
) -> Dict[str, Any]:
    """
    Weighted sum risk scoring engine:
    - Auth failure (SPF/DKIM/DMARC fail): 30 points
    - Lookalike domain detected: 20 points
    - Suspicious/flagged URL: 20 points
    - Bad IP reputation from threat intel: 20 points
    - Reply-To/Return-Path mismatch: 10 points
    
    Classifications:
    - 0-29: LOW
    - 30-59: MEDIUM
    - 60-79: HIGH
    - 80-100: CRITICAL
    """
    score = 0
    reasons: List[str] = []
    breakdown: Dict[str, int] = {}

    # 1. Auth failure (30 points)
    auth_failed = auth_data.get("auth_failed", False)
    spf_status = auth_data.get("spf", {}).get("status")
    dkim_status = auth_data.get("dkim", {}).get("status")
    dmarc_status = auth_data.get("dmarc", {}).get("status")

    if auth_failed or spf_status == "FAIL" or dkim_status == "FAIL" or dmarc_status == "FAIL":
        score += 30
        breakdown["Authentication Failures"] = 30
        failed_auths = []
        if spf_status == "FAIL":
            failed_auths.append("SPF")
        if dkim_status == "FAIL":
            failed_auths.append("DKIM")
        if dmarc_status == "FAIL":
            failed_auths.append("DMARC")
        if not failed_auths:
            failed_auths.append("Domain Alignment")
        reasons.append(f"Authentication failure: {', '.join(failed_auths)} verification failed")

    # 2. Lookalike domain detected (20 points)
    if url_data.get("lookalike_detected", False):
        score += 20
        breakdown["Lookalike Domain"] = 20
        flagged_domains = url_data.get("flagged_domains", [])
        if flagged_domains:
            reasons.append(f"Lookalike domain impersonation detected: {', '.join(flagged_domains)}")
        else:
            reasons.append("Lookalike domain impersonating genuine brand detected")

    # 3. Suspicious/flagged URL (20 points)
    if url_data.get("suspicious_url_detected", False):
        score += 20
        breakdown["Suspicious URLs"] = 20
        reasons.append("Suspicious URL patterns detected in email body (suspicious TLDs or raw IPs)")

    # 4. Bad IP reputation from threat intel (20 points)
    abuse_score = intel_data.get("abuse_confidence_score", 0)
    is_malicious_ip = intel_data.get("is_malicious", False) or abuse_score >= 50
    if is_malicious_ip:
        score += 20
        breakdown["Malicious Sender IP"] = 20
        sender_ip = intel_data.get("ip_address", "Unknown")
        reasons.append(f"Sender IP ({sender_ip}) flagged by AbuseIPDB with {abuse_score}% threat confidence score")

    # 5. Reply-To / Return-Path mismatch (10 points)
    reply_to_mismatch = headers_data.get("reply_to_mismatch", False)
    return_path_mismatch = headers_data.get("return_path_mismatch", False)
    if reply_to_mismatch or return_path_mismatch:
        score += 10
        breakdown["Address Mismatch"] = 10
        mismatch_details = []
        if reply_to_mismatch:
            mismatch_details.append(f"Reply-To ({headers_data.get('reply_to_domain')}) != From ({headers_data.get('from_domain')})")
        if return_path_mismatch:
            mismatch_details.append(f"Return-Path ({headers_data.get('return_path_domain')}) != From ({headers_data.get('from_domain')})")
        reasons.append(f"Header address mismatch: {'; '.join(mismatch_details)}")

    # Ensure score capped at 100
    score = min(100, score)

    # Classify
    if score >= 80:
        classification = "CRITICAL"
        risk_level = "Critical Threat"
        badge_color = "red"
    elif score >= 60:
        classification = "HIGH"
        risk_level = "High Risk"
        badge_color = "orange"
    elif score >= 30:
        classification = "MEDIUM"
        risk_level = "Medium Risk"
        badge_color = "amber"
    else:
        classification = "LOW"
        risk_level = "Low Risk / Authentic"
        badge_color = "emerald"
        if not reasons:
            reasons.append("No critical email security anomalies detected. SPF, DKIM, and domain alignment passed.")

    return {
        "score": score,
        "classification": classification,
        "risk_level": risk_level,
        "badge_color": badge_color,
        "reasons": reasons,
        "score_breakdown": breakdown,
        "ai_label": "AI-assisted evidence scoring"
    }
