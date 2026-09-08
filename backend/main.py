from fastapi import FastAPI
from pydantic import BaseModel
from rag_engine import RAGEngine
import anthropic

# Initialize FastAPI application server for real-time adaptive content delivery
app = FastAPI(title="CogFlow Backend API", description="Real-time Adaptive Content Delivery")

# Instantiate the RAG engine to manage structured study materials
rag = RAGEngine()

# Define the data schema for incoming student telemetry and cognitive states
class StudentData(BaseModel):
    cognitive_state: int  # 0 = Flow, 1 = Overload, 2 = Boredom
    current_level: int    # Content difficulty level ranging from 1 to 5

def rewrite_with_claude(text: str, state: int):
    # Initialize the Anthropic client (API key placeholder for future integration)
    client = anthropic.Anthropic(api_key="YOUR_CLAUDE_API_KEY") 
    
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
        
        # Safely extract and return the text content from the response object
        first_content = response.content[0]
        if hasattr(first_content, 'text'):
            return first_content.text # type: ignore
        return text
        
    except Exception as e:
        print(f"⚠️ Claude API Error: {e}")
        # Fallback to the original RAG text if the API call fails
        return text

@app.get("/")
def read_root():
    # Health check endpoint to verify backend status
    return {"message": "CogFlow Engine + Claude AI is running perfectly! 🚀"}

@app.post("/api/adapt")
def get_adaptation(data: StudentData):
    # Step 1: Retrieve and adjust content from the RAG engine based on cognitive state
    adapted_text, new_level = rag.adapt_content(data.current_level, data.cognitive_state)

    # Step 2: Set up logging metadata and default content
    action_log = "Maintained Pace (Flow State)"
    final_text = adapted_text

    # Step 3: Trigger Claude rewriting if an overload or boredom state is detected
    if data.cognitive_state == 1:
        action_log = "Simplified Content via Claude (Overload Detected)"
        final_text = rewrite_with_claude(adapted_text, 1) if 'rewrite_with_claude' in globals() else rewrite_with_claude(adapted_text, 1)
    elif data.cognitive_state == 2:
        action_log = "Increased Depth via Claude (Boredom Detected)"
        final_text = rewrite_with_claude(adapted_text, 2)

    # Return the adaptation package to the frontend interface
    return {
        "status": "success",
        "action_taken": action_log,
        "new_level": new_level,
        "original_rag_text": adapted_text,
        "content": final_text
    }