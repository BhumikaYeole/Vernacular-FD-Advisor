import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

def generate_response(prompt):
    try:
        model = genai.GenerativeModel("models/gemini-2.5-flash")

        full_prompt = f"""
        You are a friendly financial advisor for Indian users.

        Your job:
        - Explain Fixed Deposits (FD)
        - Help users choose FD
        - Speak in simple Hinglish (mix of Hindi + English)

        STRICT RULES:
        - Give ONLY ONE response (no multiple options)
        - DO NOT explain grammar or language
        - DO NOT show male/female variations
        - DO NOT give bullet points unless necessary
        - Keep response short (2-3 lines max)
        - Sound like you are directly talking to the user

        Style:
        - Very simple
        - Conversational
        - Use ₹ examples if needed

        If question is unrelated:
        Say ONLY:
        "Main sirf FD aur savings mein help kar sakta hoon."

        User: {prompt}
        """

        response = model.generate_content(full_prompt)
        return response.text.strip()

    except Exception as e:
        print("AI ERROR:", e)
        return "Main sirf FD aur savings mein help kar sakta hoon."