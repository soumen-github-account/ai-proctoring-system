from django.db import models
import mongoengine as me
from datetime import datetime
import re
# Create your models here.

def validate_phone(value):
    pattern = r'^\+?[0-9]{10,15}$'
    if not re.match(pattern, value):
        raise me.ValidationError("Invalid phone number")


class User(me.Document):
    name = me.StringField(required = True)
    cId = me.StringField(required = True)
    email = me.EmailField(required = True, unique = True)
    phone = me.StringField(required=True, unique=True, validation=validate_phone)
    password = me.StringField(required = True, unique = True)
    created_at = me.DateTimeField(default=datetime.utcnow)

    meta = {'collection': 'users'}
    