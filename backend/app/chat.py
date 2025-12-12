# backend/app/chat.py
import os
from dotenv import load_dotenv
from . import config

load_dotenv()

# Use the google generative AI client if USE_AI True
genai = None
if config.USE_AI:
    try:
        import google.generativeai as genai_module
        genai = genai_module
        if config.GOOGLE_API_KEY:
            try:
                genai.configure(api_key=config.GOOGLE_API_KEY)
            except Exception:
                pass
    except Exception:
        genai = None

async def generate_ai_reply(prompt: str) -> str:
    """
    Attempt to generate a reply using Google Generative AI SDK when configured.
    Otherwise fallback to a safe echo response.
    """
    if config.USE_AI and genai:
        try:
            model_choice = os.getenv("GENAI_MODEL", config.GENAI_MODEL)
            # Try the commonly available helpers
            # genai.generate_text is used by newer wrappers
            if hasattr(genai, "generate_text"):
                resp = genai.generate_text(model=model_choice, prompt=prompt)
                if hasattr(resp, "text"):
                    return resp.text
                if hasattr(resp, "output_text"):
                    return resp.output_text
                return str(resp)
            # older interface
            if hasattr(genai, "generate"):
                resp = genai.generate(model=model_choice, prompt=prompt)
                try:
                    return resp["candidates"][0]["content"]
                except Exception:
                    return str(resp)
            return "⚠️ AI configured but SDK interface mismatch."
        except Exception:
            return "⚠️ Jarvis AI encountered an error. Check API key or network."
    # fallback:
    return f"Jarvis 💬: You said → {prompt}"


