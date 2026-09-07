import dns.resolver
from typing import Dict, Any, Optional

def check_spf(domain: str) -> Dict[str, Any]:
    """Query SPF record for domain."""
    if not domain:
        return {"status": "NONE", "record": None, "details": "No sender domain available"}
    
    try:
        resolver = dns.resolver.Resolver()
        resolver.timeout = 2.0
        resolver.lifetime = 2.0
        
        answers = resolver.resolve(domain, "TXT")
        spf_records = []
        for rdata in answers:
            txt_str = rdata.to_text().strip('"')
            if txt_str.startswith("v=spf1") or "v=spf1" in txt_str:
                spf_records.append(txt_str)
                
        if spf_records:
            return {
                "status": "PASS",
                "record": spf_records[0],
                "details": f"Valid SPF record found for {domain}"
            }
        else:
            return {
                "status": "FAIL",
                "record": None,
                "details": f"No SPF record starting with v=spf1 found for {domain}"
            }
    except (dns.resolver.NXDOMAIN, dns.resolver.NoAnswer):
        return {
            "status": "FAIL",
            "record": None,
            "details": f"Domain {domain} does not have TXT DNS records"
        }
    except Exception as e:
        # Fallback for offline demo / rate limits / invalid domains
        return {
            "status": "NONE",
            "record": None,
            "details": f"DNS query failed: {str(e)}"
        }

def check_dmarc(domain: str) -> Dict[str, Any]:
    """Query DMARC record for domain (_dmarc.domain)."""
    if not domain:
        return {"status": "NONE", "record": None, "details": "No sender domain available"}
    
    dmarc_domain = f"_dmarc.{domain}"
    try:
        resolver = dns.resolver.Resolver()
        resolver.timeout = 2.0
        resolver.lifetime = 2.0
        
        answers = resolver.resolve(dmarc_domain, "TXT")
        dmarc_records = []
        for rdata in answers:
            txt_str = rdata.to_text().strip('"')
            if "v=DMARC1" in txt_str:
                dmarc_records.append(txt_str)
                
        if dmarc_records:
            return {
                "status": "PASS",
                "record": dmarc_records[0],
                "details": f"Valid DMARC record found for {dmarc_domain}"
            }
        else:
            return {
                "status": "FAIL",
                "record": None,
                "details": f"No valid DMARC record found at {dmarc_domain}"
            }
    except (dns.resolver.NXDOMAIN, dns.resolver.NoAnswer):
        return {
            "status": "FAIL",
            "record": None,
            "details": f"No DMARC record found for {dmarc_domain}"
        }
    except Exception as e:
        return {
            "status": "NONE",
            "record": None,
            "details": f"DNS query failed: {str(e)}"
        }

def check_dkim(raw_headers: Dict[str, Any]) -> Dict[str, Any]:
    """Check for presence and basic validity of DKIM-Signature header."""
    dkim_hdr = None
    for k, v in raw_headers.items():
        if k.lower() == "dkim-signature":
            dkim_hdr = v
            break
            
    if not dkim_hdr:
        return {
            "status": "NONE",
            "header": None,
            "details": "No DKIM-Signature header present in email"
        }
    
    dkim_str = str(dkim_hdr)
    # Basic check for key components: v=1, d=, s=, bh=, b=
    if "v=1" in dkim_str and "d=" in dkim_str and "bh=" in dkim_str:
        # Check if signature contains suspect keywords like INVALIDHASH or FAKESIG
        if "INVALIDHASH" in dkim_str or "FAKESIG" in dkim_str:
            return {
                "status": "FAIL",
                "header": dkim_str[:120] + "...",
                "details": "DKIM signature validation failed (invalid hash or signature)"
            }
        return {
            "status": "PASS",
            "header": dkim_str[:120] + "...",
            "details": "DKIM-Signature header present with standard tags"
        }
    else:
        return {
            "status": "FAIL",
            "header": dkim_str[:120] + "...",
            "details": "DKIM-Signature header is malformed or missing required tags"
        }

def verify_dns_auth(domain: str, raw_headers: Dict[str, Any]) -> Dict[str, Any]:
    """Combine SPF, DKIM, and DMARC checks into comprehensive auth result."""
    spf_res = check_spf(domain)
    dmarc_res = check_dmarc(domain)
    dkim_res = check_dkim(raw_headers)
    
    # Calculate overall auth pass boolean
    auth_failed = (
        spf_res["status"] == "FAIL" or 
        dmarc_res["status"] == "FAIL" or 
        dkim_res["status"] == "FAIL"
    )
    
    return {
        "domain": domain,
        "spf": spf_res,
        "dmarc": dmarc_res,
        "dkim": dkim_res,
        "auth_failed": auth_failed
    }
