# backend/app/crud.py
from sqlalchemy.orm import Session
from . import models, schemas
import datetime
from typing import List, Optional

def create_user(db: Session, user: schemas.UserCreate, is_caretaker: bool=False):
    db_user = models.User(name=user.name, phone=user.phone, is_caretaker=is_caretaker)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def link_caretaker(db: Session, user_id: int, caretaker_id: int):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    caretaker = db.query(models.User).filter(models.User.id == caretaker_id).first()
    if not user or not caretaker:
        return None
    caretaker.linked_user_id = user.id
    db.commit()
    db.refresh(caretaker)
    return caretaker

def create_medication(db: Session, med: schemas.MedicationCreate):
    db_med = models.Medication(
        user_id=med.user_id,
        name=med.name,
        dosage_count=med.dosage_count or 1,
        dosage_times=med.dosage_times,
        start_date=med.start_date,
        end_date=med.end_date,
        food_instruction=med.food_instruction,
        notes=med.notes,
        active=True
    )
    db.add(db_med)
    db.commit()
    db.refresh(db_med)
    return db_med

def update_medication(db: Session, med_id: int, med: schemas.MedicationCreate):
    db_med = db.query(models.Medication).filter(models.Medication.id == med_id).first()
    if not db_med:
        return None
    update_data = {
        "name": med.name,
        "dosage_count": med.dosage_count or db_med.dosage_count,
        "dosage_times": med.dosage_times,
        "start_date": med.start_date,
        "end_date": med.end_date,
        "food_instruction": med.food_instruction,
        "notes": med.notes,
    }
    for k, v in update_data.items():
        setattr(db_med, k, v)
    db.commit()
    db.refresh(db_med)
    return db_med

def delete_medication(db: Session, med_id: int):
    db_med = db.query(models.Medication).filter(models.Medication.id == med_id).first()
    if not db_med:
        return False
    db.delete(db_med)
    db.commit()
    return True

def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_medications_for_user(db: Session, user_id: int) -> List[models.Medication]:
    return db.query(models.Medication).filter(models.Medication.user_id == user_id, models.Medication.active==True).all()

def log_reminder(db: Session, med_id: int, user_id: int):
    log = models.ReminderLog(medication_id=med_id, user_id=user_id, sent_at=datetime.datetime.utcnow())
    db.add(log)
    db.commit()
    db.refresh(log)
    return log

def confirm_take(db: Session, log_id: int):
    log = db.query(models.ReminderLog).filter(models.ReminderLog.id == log_id).first()
    if not log:
        return None
    log.confirmed = True
    log.confirmed_at = datetime.datetime.utcnow()
    db_med_query = db.query(models.Medication).filter(models.Medication.id == log.medication_id)
    db_med_query.update({"active": True})  # keep active; you may update last_taken etc.
    db.commit()
    db.refresh(log)
    return log


