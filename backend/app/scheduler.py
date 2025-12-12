# backend/app/scheduler.py
import logging
from apscheduler.schedulers.background import BackgroundScheduler
from .database import SessionLocal
from . import crud, models
import datetime

log = logging.getLogger("jarvis.scheduler")
scheduler = BackgroundScheduler()
_started = False

def _check_and_schedule_reminders():
    """
    Simple periodic job skeleton: look for medications that have dosage_times in the next minute or two,
    create a ReminderLog (if desired) and you can hook notifications/email/sms from here.
    This is intentionally minimal — expand with robust de-duplication / persistence later.
    """
    db = SessionLocal()
    try:
        meds = db.query(models.Medication).filter(models.Medication.active == True).all()
        now = datetime.datetime.utcnow()
        # You can implement logic to schedule per-dose notifications.
        # For now we just log (placeholder).
        for m in meds:
            # dosage_times stored as list of ISO strings: check if any match next minute
            if not m.dosage_times:
                continue
            for iso in m.dosage_times:
                try:
                    dt = datetime.datetime.fromisoformat(iso)
                except Exception:
                    continue
                # if dt is within next minute (UTC heuristic)
                delta = (dt - now).total_seconds()
                if 0 <= delta <= 60:
                    # create a reminder log if not already created very recently
                    crud.log_reminder(db, m.id, m.user_id)
        # end
    except Exception as e:
        log.exception("scheduler check failed: %s", e)
    finally:
        db.close()

def start_scheduler():
    global _started
    if _started:
        return
    # schedule the check every 30 seconds (tune as required)
    scheduler.add_job(_check_and_schedule_reminders, "interval", seconds=30, id="reminder_check", replace_existing=True)
    scheduler.start()
    _started = True
    log.info("Scheduler started successfully.")



