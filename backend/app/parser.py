import email
from email.header import decode_header
import re
from typing import Dict, Any, List, Optional, Tuple

def parse_email_address(raw_header: Optional[str]) -> Tuple[str, str]:
    """Returns (display_name, email_address) from address string."""
    if not raw_header:
        return ("", "")
    
    # Try parsing via email.utils
    from email.utils import parseaddr
    name, addr = parseaddr(raw_header)
    return (name, addr.strip().lower())

def extract_domain(email_addr: str) -> str:
    """Extract domain from an email address or string."""
    if not email_addr:
        return ""
    if "@" in email_addr:
        return email_addr.split("@")[-1].strip().lower()
    return email_addr.strip().lower()

def decode_mime_header(header_val: Optional[str]) -> str:
    """Decode MIME encoded header values."""
    if not header_val:
        return ""
    decoded_parts = []
    try:
        for part, encoding in decode_header(header_val):
            if isinstance(part, bytes):
                decoded_parts.append(part.decode(encoding or "utf-8", errors="ignore"))
            else:
                decoded_parts.append(str(part))
        return " ".join(decoded_parts)
    except Exception:
        return str(header_val)

def parse_received_headers(msg: email.message.Message) -> List[Dict[str, Any]]:
    """
    Parse hop-by-hop Received headers.
    Returns list of hops ordered from origin (first hop) to final destination.
    """
    raw_received = msg.get_all("Received") or []
    hops = []
    
    # Regex to extract IP addresses: e.g. [198.51.100.45] or (HELO ...) ([198.51.100.45])
    ip_pattern = re.compile(r'\[(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})\]')
    from_pattern = re.compile(r'from\s+([^\s]+)', re.IGNORECASE)
    by_pattern = re.compile(r'by\s+([^\s]+)', re.IGNORECASE)
    with_pattern = re.compile(r'with\s+([^\s]+)', re.IGNORECASE)
    
    for idx, header in enumerate(raw_received):
        # Cleaning multiline whitespace
        clean_h = " ".join(header.split())
        
        # Extract IP
        ip_matches = ip_pattern.findall(clean_h)
        from_ip = ip_matches[0] if ip_matches else ""
        
        # Extract from_host and by_host
        from_m = from_pattern.search(clean_h)
        by_m = by_pattern.search(clean_h)
        with_m = with_pattern.search(clean_h)
        
        from_host = from_m.group(1) if from_m else "unknown"
        by_host = by_m.group(1) if by_m else "unknown"
        protocol = with_m.group(1) if with_m else "SMTP"
        
        hops.append({
            "hop_number": len(raw_received) - idx,
            "from_host": from_host,
            "from_ip": from_ip,
            "by_host": by_host,
            "protocol": protocol,
            "raw": clean_h
        })
        
    # Reverse so hop 1 is the originating hop
    hops.reverse()
    return hops

def parse_eml(content_bytes: bytes) -> Dict[str, Any]:
    """Parse EML binary content into detailed JSON structured object."""
    msg = email.message_from_bytes(content_bytes)
    
    # Header extraction
    from_raw = decode_mime_header(msg.get("From"))
    to_raw = decode_mime_header(msg.get("To"))
    reply_to_raw = decode_mime_header(msg.get("Reply-To"))
    return_path_raw = decode_mime_header(msg.get("Return-Path"))
    subject = decode_mime_header(msg.get("Subject"))
    date_hdr = decode_mime_header(msg.get("Date"))
    message_id = decode_mime_header(msg.get("Message-ID"))
    
    from_name, from_addr = parse_email_address(from_raw)
    _, to_addr = parse_email_address(to_raw)
    _, reply_to_addr = parse_email_address(reply_to_raw)
    _, return_path_addr = parse_email_address(return_path_raw)
    
    from_domain = extract_domain(from_addr)
    reply_to_domain = extract_domain(reply_to_addr) if reply_to_addr else ""
    return_path_domain = extract_domain(return_path_addr) if return_path_addr else ""
    
    # Check mismatches
    reply_to_mismatch = bool(reply_to_domain and reply_to_domain != from_domain)
    return_path_mismatch = bool(return_path_domain and return_path_domain != from_domain)
    
    # Extract email body (plain text & HTML)
    text_body = ""
    html_body = ""
    
    if msg.is_multipart():
        for part in msg.walk():
            content_type = part.get_content_type()
            content_disposition = str(part.get("Content-Disposition"))
            
            if "attachment" in content_disposition:
                continue
                
            try:
                payload = part.get_payload(decode=True)
                if payload:
                    charset = part.get_content_charset() or "utf-8"
                    decoded_str = payload.decode(charset, errors="ignore")
                    if content_type == "text/plain" and not text_body:
                        text_body = decoded_str
                    elif content_type == "text/html" and not html_body:
                        html_body = decoded_str
            except Exception:
                pass
    else:
        try:
            payload = msg.get_payload(decode=True)
            if payload:
                charset = msg.get_content_charset() or "utf-8"
                decoded_str = payload.decode(charset, errors="ignore")
                if msg.get_content_type() == "text/html":
                    html_body = decoded_str
                else:
                    text_body = decoded_str
        except Exception:
            text_body = str(msg.get_payload())
            
    # Received hops
    received_chain = parse_received_headers(msg)
    
    # Find originating sender IP from received chain (first hop with IP)
    sender_ip = ""
    for hop in received_chain:
        if hop["from_ip"]:
            sender_ip = hop["from_ip"]
            break
            
    # Fallback to default if no IP found in chain
    if not sender_ip:
        sender_ip = "127.0.0.1"
        
    # Raw headers dict
    raw_headers = {}
    for k, v in msg.items():
        if k in raw_headers:
            if isinstance(raw_headers[k], list):
                raw_headers[k].append(decode_mime_header(v))
            else:
                raw_headers[k] = [raw_headers[k], decode_mime_header(v)]
        else:
            raw_headers[k] = decode_mime_header(v)
            
    return {
        "headers": {
            "from_raw": from_raw,
            "from_name": from_name,
            "from_address": from_addr,
            "from_domain": from_domain,
            "to_address": to_addr,
            "reply_to": reply_to_raw,
            "reply_to_address": reply_to_addr,
            "reply_to_domain": reply_to_domain,
            "return_path": return_path_raw,
            "return_path_address": return_path_addr,
            "return_path_domain": return_path_domain,
            "subject": subject,
            "date": date_hdr,
            "message_id": message_id,
            "reply_to_mismatch": reply_to_mismatch,
            "return_path_mismatch": return_path_mismatch,
        },
        "received_chain": received_chain,
        "sender_ip": sender_ip,
        "body": {
            "text": text_body,
            "html": html_body
        },
        "raw_headers": raw_headers
    }
