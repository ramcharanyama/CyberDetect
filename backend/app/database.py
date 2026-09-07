import sqlite3
import os
import json
from datetime import datetime
from typing import Dict, Any, List, Optional

DB_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "cyberdetect.db")

def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Initialize SQLite database schema."""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS analysis_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            sample_key TEXT,
            subject TEXT,
            from_address TEXT,
            sender_ip TEXT,
            risk_score INTEGER,
            classification TEXT,
            reasons_json TEXT,
            full_result_json TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    conn.commit()
    conn.close()

def save_analysis(
    sample_key: Optional[str],
    subject: str,
    from_address: str,
    sender_ip: str,
    risk_score: int,
    classification: str,
    reasons: List[str],
    full_result: Dict[str, Any]
) -> int:
    """Save an analysis record to history database."""
    conn = get_connection()
    cursor = conn.cursor()
    
    cursor.execute("""
        INSERT INTO analysis_history (
            sample_key, subject, from_address, sender_ip, risk_score, classification, reasons_json, full_result_json
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        sample_key,
        subject,
        from_address,
        sender_ip,
        risk_score,
        classification,
        json.dumps(reasons),
        json.dumps(full_result)
    ))
    
    record_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return record_id

def find_related_emails_by_ip(sender_ip: str, current_record_id: Optional[int] = None) -> List[Dict[str, Any]]:
    """
    Find other emails analyzed that share the same sender IP.
    Triggers 'Related emails found: X - possible shared infrastructure' banner.
    """
    if not sender_ip or sender_ip == "127.0.0.1":
        return []
        
    conn = get_connection()
    cursor = conn.cursor()
    
    if current_record_id:
        cursor.execute("""
            SELECT id, subject, from_address, risk_score, classification, created_at
            FROM analysis_history
            WHERE sender_ip = ? AND id != ?
            ORDER BY created_at DESC
        """, (sender_ip, current_record_id))
    else:
        cursor.execute("""
            SELECT id, subject, from_address, risk_score, classification, created_at
            FROM analysis_history
            WHERE sender_ip = ?
            ORDER BY created_at DESC
        """, (sender_ip,))
        
    rows = cursor.fetchall()
    conn.close()
    
    related = []
    for r in rows:
        related.append({
            "id": r["id"],
            "subject": r["subject"],
            "from_address": r["from_address"],
            "risk_score": r["risk_score"],
            "classification": r["classification"],
            "created_at": r["created_at"]
        })
    return related

def get_analysis_history(limit: int = 10) -> List[Dict[str, Any]]:
    """Get recent analysis history."""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT id, sample_key, subject, from_address, sender_ip, risk_score, classification, created_at
        FROM analysis_history
        ORDER BY id DESC
        LIMIT ?
    """, (limit,))
    rows = cursor.fetchall()
    conn.close()
    
    return [dict(r) for r in rows]
