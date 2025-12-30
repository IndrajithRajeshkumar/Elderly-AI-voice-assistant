# backend/app/chat.py

import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

MODEL_NAME = "models/gemini-flash-latest"

async def generate_ai_reply(prompt: str) -> str:
    try:
        model = genai.GenerativeModel(MODEL_NAME)
        response = model.generate_content(prompt)

        if response and response.text:
            return response.text.strip()

        return "⚠️ Empty response from Gemini."

    except Exception as e:
        print("❌ GEMINI ERROR:", e)
        return "⚠️ Jarvis AI temporarily unavailable."








