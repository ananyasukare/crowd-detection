from datetime import datetime
import mongoengine as me


class Asset(me.Document):
    meta = {'collection': 'assets'}
    
    name = me.StringField(max_length=128, required=True)
    branch = me.StringField(max_length=128, required=True)
    location = me.StringField(max_length=256)
    service_type = me.StringField(max_length=64)
    max_capacity = me.IntField(default=50)
    status = me.StringField(default='open')  # open, closed, maintenance
    queue_length = me.IntField(default=0)
    estimated_wait = me.IntField(default=0)  # minutes
    latitude = me.FloatField(default=28.6139)  # Default: Delhi
    longitude = me.FloatField(default=77.2090)  # Default: Delhi
    created_at = me.DateTimeField(default=datetime.utcnow)
    updated_at = me.DateTimeField(default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': str(self.id),
            'name': self.name,
            'branch': self.branch,
            'location': self.location,
            'service_type': self.service_type,
            'max_capacity': self.max_capacity,
            'status': self.status,
            'queue_length': self.queue_length,
            'estimated_wait': self.estimated_wait,
            'latitude': self.latitude,
            'longitude': self.longitude,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }
