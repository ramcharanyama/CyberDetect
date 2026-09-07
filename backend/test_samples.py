import os
import json
from app.main import process_eml_bytes
from app.database import init_db

init_db()

samples = [
    ("Clean Newsletter", "01_clean_newsletter.eml"),
    ("PayPal Phishing", "02_paypal_phishing.eml"),
    ("CEO BEC Scam", "03_ceo_bec_urgent.eml")
]

for title, filename in samples:
    path = os.path.join("samples", filename)
    with open(path, "rb") as f:
        res = process_eml_bytes(f.read(), sample_key=filename)
        print(f"================ {title} ({filename}) ================")
        print(f"Risk Score: {res['risk']['score']} / 100")
        print(f"Classification: {res['risk']['classification']}")
        print("Reasons:")
        for r in res['risk']['reasons']:
            print(f"  - {r}")
        print(f"Sender IP: {res['sender_ip']}")
        print(f"Related emails found: {res['related_emails']['count']}")
        print(f"SPF: {res['auth']['spf']['status']} | DKIM: {res['auth']['dkim']['status']} | DMARC: {res['auth']['dmarc']['status']}")
        print()
