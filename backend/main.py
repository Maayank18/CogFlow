from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from rag_engine import RAGEngine
import anthropic
import os

# Initialize FastAPI application server for real-time adaptive content delivery
app = FastAPI(title="CogFlow Backend API", description="Real-time Adaptive Content Delivery")

# ── CORS: Allow the React frontend (localhost:5173) to call this API ──
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Instantiate the RAG engine to manage structured study materials
rag = RAGEngine()

# Define the data schema for incoming student telemetry and cognitive states
class StudentData(BaseModel):
    cognitive_state: int  # 0 = Flow, 1 = Overload, 2 = Boredom
    current_level: int    # Content difficulty level ranging from 1 to 5

# Schema for PDF topic extraction (placeholder for Phase 2)
class PDFRequest(BaseModel):
    filename: str
    content: str  # base64 or raw text

def rewrite_with_claude(text: str, state: int):
    # Read API key from environment variable (never hardcode keys)
    api_key = os.environ.get("CLAUDE_API_KEY", "")
    if not api_key:
        # Graceful fallback: return original RAG text if no key is configured
        print("⚠️  CLAUDE_API_KEY not set — returning raw RAG content (no rewrite)")
        return text

    client = anthropic.Anthropic(api_key=api_key)

    # Construct targeted prompts based on the detected cognitive state
    if state == 1:
        prompt = f"Rewrite the following educational text for a struggling student using simple bullet points to reduce cognitive load:\n\n{text}"
    elif state == 2:
        prompt = f"Rewrite the following educational text to add more advanced depth and challenge for a student who is bored:\n\n{text}"
    else:
        return text

    try:
        # Request a real-time content rewrite using the lightweight Haiku model
        response = client.messages.create(
            model="claude-3-haiku-20240307",
            max_tokens=300,
            messages=[{"role": "user", "content": prompt}]
        )
        first_content = response.content[0]
        if hasattr(first_content, 'text'):
            return first_content.text  # type: ignore
        return text
    except Exception as e:
        print(f"⚠️ Claude API Error: {e}")
        return text  # Fallback to original RAG text


@app.get("/")
def read_root():
    return {"message": "CogFlow Engine is running 🚀", "status": "ok"}


@app.post("/api/adapt")
def get_adaptation(data: StudentData):
    """
    Main adaptation endpoint called by the React frontend.

    Request body:
        cognitive_state: int  — 0=Flow, 1=Overload, 2=Boredom
        current_level:   int  — 1 to 5 (current difficulty level)

    Response:
        status:           "success"
        action_taken:     human-readable description of what happened
        new_level:        int — updated difficulty level
        original_rag_text: raw text from ChromaDB
        content:          final text (Claude-rewritten if key available, else raw)
    """
    # Step 1: Get adapted content + new level from RAG engine
    adapted_text, new_level = rag.adapt_content(data.current_level, data.cognitive_state)

    action_log = "Maintained Pace (Flow State)"
    final_text = adapted_text

    # Step 2: Trigger Claude rewriting for overload or boredom states
    if data.cognitive_state == 1:
        action_log = "Simplified Content (Overload Detected)"
        final_text = rewrite_with_claude(adapted_text, 1)
    elif data.cognitive_state == 2:
        action_log = "Increased Depth (Boredom Detected)"
        final_text = rewrite_with_claude(adapted_text, 2)

    return {
        "status": "success",
        "action_taken": action_log,
        "new_level": new_level,
        "original_rag_text": adapted_text,
        "content": final_text,
    }


# ── PLACEHOLDER: PDF topic extraction (Phase 2) ──
# Connect this to your PDF parsing library (e.g. PyMuPDF, pdfplumber)
@app.post("/api/extract-topics")
def extract_topics(req: PDFRequest):
    """
    PLACEHOLDER — Phase 2 feature.
    Accepts a PDF file (as text/base64) and returns extracted topic list.
    Frontend: TopicSelection.jsx → handleFileUpload()
    """
    # TODO: Implement real PDF parsing here
    return {
        "status": "placeholder",
        "topics": [
            {"id": "ext-1", "name": "Introduction & Overview",  "subtopics": ["Background", "Motivation"]},
            {"id": "ext-2", "name": "Core Concepts",            "subtopics": ["Definitions", "Key Principles"]},
            {"id": "ext-3", "name": "Methodologies",            "subtopics": ["Approach 1", "Approach 2"]},
            {"id": "ext-4", "name": "Applications",             "subtopics": ["Use Case A", "Use Case B"]},
            {"id": "ext-5", "name": "Summary & Review",         "subtopics": ["Key Takeaways"]},
        ]
    }