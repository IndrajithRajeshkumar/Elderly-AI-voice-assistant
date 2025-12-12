# backend/app/models.py
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, JSON, Text, Date
from sqlalchemy.orm import relationship
from .database import Base
import datetime

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    phone = Column(String, unique=True, index=True, nullable=False)
    is_caretaker = Column(Boolean, default=False)
    linked_user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # relationship for caretaker -> user (self-referential)
    caretaker_for = relationship("User", remote_side=[id], uselist=True)

class Medication(Base):
    __tablename__ = "medications"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String, nullable=False)
    # optional: human-friendly dosage label or count
    dosage_count = Column(Integer, default=1)
    # store dosage_times as JSON list of ISO strings
    dosage_times = Column(JSON, nullable=True)
    # start & end dates (date-only)
    start_date = Column(Date, nullable=True)
    end_date = Column(Date, nullable=True)
    # before/after food
    food_instruction = Column(String, nullable=True)
    notes = Column(Text, nullable=True)
    active = Column(Boolean, default=True)

    user = relationship("User", backref="medications")

class ReminderLog(Base):
    __tablename__ = "reminder_logs"
    id = Column(Integer, primary_key=True, index=True)
    medication_id = Column(Integer, ForeignKey("medications.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    sent_at = Column(DateTime, default=datetime.datetime.utcnow)
    confirmed = Column(Boolean, default=False)
    confirmed_at = Column(DateTime, nullable=True)
    escalated = Column(Boolean, default=False)
    details = Column(JSON, nullable=True)

    medication = relationship("Medication")
    user = relationship("User")





