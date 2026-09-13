# CogFlow — Passive Cognitive Load Detection for Smarter Learning

> An adaptive learning platform that silently monitors student behaviour and adjusts content difficulty in real-time.

---

## Project Structure

```
cogflow/
├── src/                    ← React Frontend (Vite)
│   ├── pages/              ← All UI screens (Landing → Learning → Results)
│   ├── components/         ← Reusable UI components
│   └── data/subjects.js    ← Static content library (replaced by backend in Phase 2)
│
├── backend/                ← Python FastAPI Server
│   ├── main.py             ← API routes (/api/adapt, /api/extract-topics)
│   ├── rag_engine.py       ← ChromaDB RAG + Claude AI content rewriting
│   └── requirements.txt    ← Python dependencies
│
├── ml_brain/               ← PyTorch Cognitive Load Classifier
│   ├── model.py            ← Neural network: 5 features → 3 states
│   ├── dummy_data_gen.py   ← Synthetic training data generator
│   ├── simulated_cogflow_data.csv
│   ├── export_onnx.py      ← Export model to ONNX format
│   └── exported_models/    ← Pre-trained model files (.pth, .onnx)
│
├── public/                 ← Static assets (favicon)
├── package.json
└── README.md               ← This file
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, React Router |
| Backend | FastAPI (Python), Uvicorn |
| Vector DB | ChromaDB (in-memory RAG) |
| AI Rewriting | Claude 3 Haiku (Anthropic) |
| ML Model | PyTorch → ONNX |
| Styling | Vanilla CSS with design system |

---

## Running the Project

### Terminal 1 — Frontend
```bash
cd "d:\Minor Project - B.Tech\cogflow"
npm install        # first time only
npm run dev
# → http://localhost:5173
```

### Terminal 2 — Backend
```bash
cd "d:\Minor Project - B.Tech\cogflow\backend"
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt

# Optional: set Claude API key for AI rewriting
$env:CLAUDE_API_KEY = "your-key-here"

uvicorn main:app --reload --port 8000
# → http://localhost:8000
```

---

## How It Works

```
Student reads content
       ↓
Frontend captures signals (mouse speed, scroll rate, typing gaps)
       ↓
ML Model classifies: Flow / Overload / Boredom
       ↓
Student sees suggestion: "This seems too hard — Simplify?"
       ↓
Student accepts → Frontend calls POST /api/adapt
       ↓
Backend (RAG Engine) retrieves content at new difficulty level
       ↓
Claude AI rewrites it for the student's state
       ↓
New content displayed with smooth fade transition
```

---

## Adaptation States

| State | Signal | Action |
|-------|--------|--------|
| **Flow** (0) | Normal mouse/typing patterns | Maintain current level |
| **Overload** (1) | Slow mouse, long typing pauses | Simplify content (level ↓) |
| **Boredom** (2) | Fast mouse, minimal typing | Challenge content (level ↑) |

---

## Phase Roadmap

- [x] Phase 1 — Frontend with simulated adaptation
- [x] Phase 1 — Backend server + RAG engine
- [x] Phase 1 — ML model training + ONNX export
- [ ] Phase 2 — Connect frontend signals to ML model to backend
- [ ] Phase 2 — Webcam integration (gaze variance, blink rate, facial tension)
- [ ] Phase 2 — Real PDF topic extraction
- [ ] Phase 2 — User authentication + session persistence
