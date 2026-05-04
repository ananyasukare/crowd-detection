# Placeholder alert service. Integrate real email/SMS providers later.
from models.token_model import Token
from app import db


def send_alert_for_token(token: Token, channel: str = 'email'):
    # channel: 'email' or 'sms'
    # In production, integrate with SMTP or SMS gateway.
    message = f"Alert -> Token #{token.token_number} at {token.branch} for {token.service_type}. Estimated wait: {token.estimated_wait} min"
    # For now just print (or log) and mark the token as having received an alert
    print('[ALERT]', message)
    token.alert_sent = True
    db.session.add(token)
    db.session.commit()
    return True
