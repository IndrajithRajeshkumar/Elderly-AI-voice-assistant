# backend/app/config.py
import os
from dotenv import load_dotenv

load_dotenv()

# Google / Gemini API Key (if you want real AI)
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

# Toggle to use real AI
USE_AI = os.getenv("USE_AI", "false").lower() in ("1", "true", "yes")

# Default model name (change if necessary)
GENAI_MODEL = os.getenv("GENAI_MODEL", "models/gemini-2.5-flash-native-audio-preview-12-2025")

# Database URL (SQLite default)
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./jarvis.db")



