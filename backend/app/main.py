# backend/app/main.py
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from . import crud, schemas, database, scheduler
from .deps import get_db
from .chat import generate_ai_reply

app = FastAPI(title="Jarvis Elderly Assistant - Backend")

# CORS - allow your front-end origin(s) here instead of "*"
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatInput(BaseModel):
    message: str

@app.get("/")
def root():
    return {"message": "JARVIS Elderly Assistant Backend Running 🚀"}

# startup
@app.on_event("startup")
def startup_event():
    database.init_db()
    scheduler.start_scheduler()

# Users
@app.post("/users/", response_model=schemas.UserOut)
def create_user(user: schemas.UserCreate, db=Depends(get_db)):
    return crud.create_user(db, user)

@app.post("/caretaker/link")
def link_caretaker(user_id: int, caretaker_id: int, db=Depends(get_db)):
    res = crud.link_caretaker(db, user_id, caretaker_id)
    if not res:
        raise HTTPException(status_code=404, detail="User or caretaker not found")
    return {"ok": True, "caretaker_id": res.id}

# Medications
@app.post("/meds/", response_model=schemas.MedicationOut)
def add_med(med: schemas.MedicationCreate, db=Depends(get_db)):
    return crud.create_medication(db, med)

@app.get("/meds/{user_id}", response_model=List[schemas.MedicationOut])
def list_meds(user_id: int, db=Depends(get_db)):
    return crud.get_medications_for_user(db, user_id)

@app.put("/meds/{med_id}", response_model=schemas.MedicationOut)
def update_med(med_id: int, med: schemas.MedicationCreate, db=Depends(get_db)):
    updated = crud.update_medication(db, med_id, med)
    if not updated:
        raise HTTPException(status_code=404, detail="Medication not found")
    return updated

@app.delete("/meds/{med_id}")
def delete_med(med_id: int, db=Depends(get_db)):
    ok = crud.delete_medication(db, med_id)
    if not ok:
        raise HTTPException(status_code=404, detail="Medication not found")
    return {"ok": True}

# Reminder confirm
@app.post("/reminder/confirm/{log_id}")
def confirm_reminder(log_id: int, db=Depends(get_db)):
    log = crud.confirm_take(db, log_id)
    if not log:
        raise HTTPException(status_code=404, detail="Log not found")
    return {"ok": True, "confirmed_at": str(log.confirmed_at)}

# Chatbot (AI)
@app.post("/chat")
async def chat_api(data: ChatInput):
    reply = await generate_ai_reply(data.message)
    return {"reply": reply}




