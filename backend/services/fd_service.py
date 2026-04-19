import json
import os
from services.ai_service import generate_response

# Safe file path (prevents bugs)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FILE_PATH = os.path.join(BASE_DIR, "data", "fd_data.json")

# Map language code -> human-readable name for the prompt
LANG_NAME = {
    "en": "English",
    "hi": "Hindi (pure Hindi, Devanagari script, no English mixing)",
    "mr": "Marathi (pure Marathi, Devanagari script, no English mixing)",
}


def load_data():
    with open(FILE_PATH) as f:
        return json.load(f)


def generate_fd_insight(fd_list, user_pref, lang="en"):
    try:
        lang_instruction = LANG_NAME.get(lang, "English")

        prompt = f"""
        You are a financial advisor helping Indian users compare Fixed Deposits.

        User preference: {user_pref}

        FD options available:
        {fd_list}

        Your task:
        - Recommend the single best FD option from the list
        - Explain in 2-3 lines why it is the best choice
        - Keep it simple and conversational, like you are talking directly to the user
        - Use ₹ symbols where helpful

        STRICT LANGUAGE RULE:
        - You MUST respond ONLY in {lang_instruction}.
        - Do NOT mix languages. Do NOT use Hinglish unless the language is English.
        - If language is Hindi, write fully in Hindi (Devanagari).
        - If language is Marathi, write fully in Marathi (Devanagari).
        - If language is English, write in simple, clear English.

        DO NOT give multiple options. ONE recommendation only.
        """

        return generate_response(prompt)

    except:
        return "Best option gives higher returns with reasonable safety."


# FD COMPARISON ENGINE
def get_fd_comparison(tenure):
    data = load_data()

    # Filter by tenure
    filtered = [fd for fd in data if int(fd["tenure"]) == int(tenure)]

    # Sort by interest rate (descending)
    sorted_fds = sorted(filtered, key=lambda x: x["rate"], reverse=True)

    # Add risk label
    for fd in sorted_fds:
        if fd["type"] == "Public":
            fd["risk"] = "Low (Safe)"
        elif fd["type"] == "Private":
            fd["risk"] = "Moderate"
        else:
            fd["risk"] = "Higher returns, slightly higher risk"

    return {
        "best_option": sorted_fds[0] if sorted_fds else None,
        "all_options": sorted_fds
    }


# FD CALCULATOR
def calculate_fd(P, r, t):
    A = P * (1 + r / 100) ** t

    return {
        "maturity": round(A, 2),
        "interest": round(A - P, 2),
        "message": f"₹{P} invest karne par aapko ₹{round(A,2)} milenge ({round(A-P,2)} profit) in {t} years."
    }