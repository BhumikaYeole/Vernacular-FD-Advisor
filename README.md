# Vernacular FD Advisor

A multilingual, AI-driven Fixed Deposit (FD) advisory and booking platform for Indian users. Vernacular lets users explore, compare, and book FDs from multiple banks entirely in their preferred language (English, Hindi, or Marathi) through a conversational chat interface and a guided booking flow.

---

## Features

### AI Chat Assistant
- Ask questions about Fixed Deposits in plain language
- Responds in the user's selected language : English / Hindi / Marathi
- Detects off-topic queries and politely redirects

### Voice Input (Speech-to-Text)
- Tap the mic button to speak your question instead of typing
- Uses the Web Speech API (supported in Chrome)
- Language tag sent to the browser matches the selected interface language (`en-IN`, `hi-IN`, `mr-IN`)

### Multilingual Support
- **3 languages** supported: English, Hindi, Marathi
- AI responses generated in the chosen language
- Speech recognition language also switches automatically

### FD Comparison Engine
- Compare FDs across **banks** and **tenures** (6 / 12 / 24 / 36 months)
- Sorted by interest rate for easy scanning
- Risk labels assigned by bank type: Public, Private, Small Finance

### AI FD Recommendation
- After comparison results load, a personalised 2–3 line recommendation is generated
- Recommendation is **language-aware** responds in whatever language the user has selected
- Takes into account the user's risk preference

### Data Visualisation
- **Bar Chart** : side-by-side interest rate comparison across all filtered banks
- **Pie Chart** : proportional rate share across banks
- Built with **Recharts** for smooth, animated renders

### 5-Step FD Booking Flow
1. **Amount** : enter investment amount or pick a quick preset (₹10K / ₹25K / ₹50K / ₹1L)
2. **Tenure + Risk** : choose 6 / 12 / 24 / 36 months and risk appetite
3. **Compare** : view all matching FDs with charts + AI recommendation
4. **Details** : enter name and PAN; see projected maturity amount
5. **Confirmation** : booking summary with all details

### FD Calculator
- Calculates maturity value using compound interest: `A = P(1 + r/100)^t`
- Returns principal, maturity amount, and interest earned

### Dark / Light Mode
- System-wide dark mode toggle
- All components respond to the theme

---

## System Architecture

```
Vernacular-FD-Advisor/
├── backend/                      
│   ├── app.py                    
│   ├── .env                      
│   ├── requirements.txt          
│   ├── data/
│   │   └── fd_data.json          
│   ├── routes/
│   │   ├── chat.py               
│   │   └── fd.py                 
│   └── services/
│       ├── ai_service.py         
│       ├── fd_service.py         
│       └── translate_service.py  
│
└── frontend/                     
    ├── index.html
    ├── src/
    │   ├── main.jsx              
    │   ├── App.jsx               
    │   ├── index.css             
    │   ├── App.css               
    │   ├── pages/
    │   │   └── Home.jsx          
    │   ├── components/
    │   │   ├── ChatUI.jsx        
    │   │   ├── BookingFlow.jsx   
    │   │   └── FDCompareCharts.jsx  
    │   └── utils/
    │       └── translations.js   
    └── .gitignore
```

---

## API Reference

### `POST /chat`
Accepts a user message and returns an AI-generated response in the selected language.

**Request body:**
```json
{
  "message": "SBI ka FD rate kya hai?",
  "lang": "hi"
}
```

**Response:**
```json
{
  "response": "SBI वर्तमान में 1 वर्ष की FD पर 6.80% ब्याज दे रहा है।"
}
```

---

### `GET /fd-options`
Returns filtered and ranked FD options with an AI recommendation.

**Query params:**

| Param    | Type   | Default  | Description                        |
|----------|--------|----------|------------------------------------|
| `tenure` | int    | `12`     | Tenure in months       |
| `risk`   | string | `medium` | Risk preference: low/medium/high   |
| `lang`   | string | `en`     | Language code: en/hi/mr            |

**Response:**
```json
{
  "best_option": { "bank": "ESAF SFB", "rate": 8.75, "tenure": 12, "type": "Small Finance", "risk": "Higher returns, slightly higher risk" },
  "all_options": [ ... ],
  "insight": "ESAF Small Finance Bank is offering the highest rate..."
}
```

---

### `POST /calculate`
Calculates FD maturity using compound interest.

**Request body:**
```json
{ "amount": 50000, "rate": 8.75, "time": 1 }
```

**Response:**
```json
{
  "maturity": 54375.0,
  "interest": 4375.0,
  "message": "₹50000 invest karne par aapko ₹54375.0 milenge..."
}
```

---

## Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/BhumikaYeole/Vernacular-FD-Advisor.git
cd Vernacular-FD-Advisor
```

---

### 2. Backend Setup

```bash
cd backend
```

**Install Python dependencies:**
```bash
pip install -r requirements.txt
```

**Create the `.env` file:**
```bash
# backend/.env
GEMINI_API_KEY=your_gemini_api_key
```

**Start the Flask server:**
```bash
python app.py
```

The backend runs at **`http://localhost:5000`**.

---

### 3. Frontend Setup

Open a new terminal:

```bash
cd frontend
```

**Install Node dependencies:**
```bash
npm install
```

**Start the Vite dev server:**
```bash
npm run dev
```

The frontend runs at **`http://localhost:5173`**.

> **Note:** Voice input requires **Google Chrome** (or any Chromium browser). The Web Speech API is not supported in Firefox.

---

*Built with ❤️ for Indian investors in the language they understand best.*
