import mongoengine as me


class Setting(me.Document):
    meta = {'collection': 'settings'}
    
    branch = me.StringField(max_length=128, required=True)
    service_type = me.StringField(max_length=64, required=True)
    avg_service_time = me.IntField(default=5)  # minutes

    def to_dict(self):
        return {
            'id': str(self.id),
            'branch': self.branch,
            'service_type': self.service_type,
            'avg_service_time': self.avg_service_time
        }
