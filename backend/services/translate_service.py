import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel("models/gemini-2.5-flash")

def translate_text(text, target_lang="en"):
    if target_lang == "en":
        return text

    prompt = f"""
    Translate the following text into {target_lang}.
    Keep it natural and simple for Indian users.
    
    Text: {text}
    """

    response = model.generate_content(prompt)
    return response.text.strip()