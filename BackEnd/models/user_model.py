from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
import mongoengine as me


class User(me.Document):
    meta = {'collection': 'users'}
    
    name = me.StringField(max_length=128, required=True)
    email = me.EmailField(unique=True, required=True)
    password_hash = me.StringField(max_length=256, required=True)
    phone = me.StringField(max_length=20)
    is_admin = me.BooleanField(default=False)
    created_at = me.DateTimeField(default=datetime.utcnow)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            'id': str(self.id),
            'name': self.name,
            'email': self.email,
            'phone': self.phone,
            'is_admin': self.is_admin,
            'created_at': self.created_at.isoformat()
        }
