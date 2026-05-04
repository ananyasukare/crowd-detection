from datetime import datetime
import mongoengine as me
from models.user_model import User


class Token(me.Document):
    meta = {'collection': 'tokens'}
    
    token_number = me.IntField(required=True)
    user_id = me.ReferenceField(User, required=True)
    branch = me.StringField(max_length=128, required=True)
    service_type = me.StringField(max_length=64, required=True)
    status = me.StringField(default='waiting')  # waiting, serving, served, cancelled
    created_at = me.DateTimeField(default=datetime.utcnow)
    estimated_wait = me.IntField()  # minutes
    alert_sent = me.BooleanField(default=False)

    def to_dict(self):
        return {
            'id': str(self.id),
            'token_number': self.token_number,
            'user_id': str(self.user_id.id) if self.user_id else None,
            'branch': self.branch,
            'service_type': self.service_type,
            'status': self.status,
            'created_at': self.created_at.isoformat(),
            'estimated_wait': self.estimated_wait,
            'alert_sent': self.alert_sent
        }
