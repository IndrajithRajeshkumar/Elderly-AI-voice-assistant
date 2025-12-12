# backend/app/schemas.py
from pydantic import BaseModel, Field
from typing import List, Optional
import datetime

# Pydantic v2 compatibility config
class ConfigMixin:
    model_config = {"from_attributes": True}

class UserCreate(BaseModel, ConfigMixin):
    name: str
    phone: str

class UserOut(BaseModel, ConfigMixin):
    id: int
    name: str
    phone: str
    is_caretaker: bool
    linked_user_id: Optional[int] = None
    created_at: Optional[datetime.datetime] = None

class MedicationCreate(BaseModel, ConfigMixin):
    user_id: int
    name: str
    dosage_count: Optional[int] = 1
    dosage_times: Optional[List[str]] = None  # ISO strings
    start_date: Optional[datetime.date] = None
    end_date: Optional[datetime.date] = None
    food_instruction: Optional[str] = None  # "before" or "after"
    notes: Optional[str] = None

class MedicationOut(BaseModel, ConfigMixin):
    id: int
    user_id: int
    name: str
    dosage_count: Optional[int]
    dosage_times: Optional[List[str]] = None
    start_date: Optional[datetime.date] = None
    end_date: Optional[datetime.date] = None
    food_instruction: Optional[str] = None
    notes: Optional[str] = None
    active: bool

class ReminderLogOut(BaseModel, ConfigMixin):
    id: int
    medication_id: int
    user_id: int
    sent_at: Optional[datetime.datetime]
    confirmed: bool
    confirmed_at: Optional[datetime.datetime]
    escalated: bool
    details: Optional[dict]


