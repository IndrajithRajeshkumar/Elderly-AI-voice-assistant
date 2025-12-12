# app/notifications.py
# Minimal stub for notifications — replace with SMS/Push/email logic

def send_user_message(user_phone: str, message: str):
    # Placeholder: integrate Twilio or similar here
    print(f"[NOTIFY] To {user_phone}: {message}")


def send_escalation_notification(db, reminder_log):
    # Lookup medication and user, then notify caretakers (example)
    from . import models
    med = db.query(models.Medication).filter(models.Medication.id == reminder_log.medication_id).first()
    if not med:
        return
    user = db.query(models.User).filter(models.User.id == med.user_id).first()
    if not user:
        return
    # If user has a linked caretaker, notify them
    caretaker = None
    if user.linked_user_id:
        caretaker = db.query(models.User).filter(models.User.id == user.linked_user_id).first()
    # Send a simple print notification
    target = caretaker.phone if caretaker else user.phone
    print(f"[ESCALATION] Notify {target}: Medication '{med.name}' not confirmed for user {user.name}.")

