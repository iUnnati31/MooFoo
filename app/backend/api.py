import logging
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from src.workflow import food_workflow
from src.schema.schema import FoodRecommendation
from dotenv import load_dotenv
load_dotenv()

# --- Setup Logging ---
log_directory = "logs"
if not os.path.exists(log_directory):
    os.makedirs(log_directory)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    handlers=[
        logging.FileHandler(os.path.join(log_directory, "app.log")),
        logging.StreamHandler()
    ]
)

app = FastAPI(
    title="MooFoo Chatbot API",
    description="API for the MooFoo food recommendation chatbot.",
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000", 
        "http://127.0.0.1:3000",
        "http://localhost:3001", 
        "http://127.0.0.1:3001",
        "http://localhost:5173",  # Vite dev server default port
        "https://moofoo-recomm.vercel.app",
        "https://moofoo-frontend.vercel.app",
        "https://moo-foo-bfgz.vercel.app",  # Your specific Vercel domain
        "https://*.vercel.app",  # Allow any Vercel subdomain
        "https://*.onrender.com",  # Allow any Render subdomain
        os.getenv("FRONTEND_URL", ""),  # Allow environment variable override
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class UserRequest(BaseModel):
    message: str
    user_id: str = "default_user"

@app.get("/", tags=["Readiness"])
def read_root():
    return {"message": "Hi! I'm MooFoo, your mood based food recommendation chatbot. How can I help you today?"}

@app.get("/health", tags=["Readiness"])
def health_check():
    return {"status": "healthy"}

@app.get("/ready", tags=["Readiness"])
def ready_check():
    return {"status": "ready"}

@app.post("/recommendation", response_model=FoodRecommendation, tags=["Recommendation"])
def get_recommendation(request: UserRequest):
    # Pass both message and user_id in the message field for the workflow
    result = food_workflow.run({
        "message": request.message,
        "user_id": request.user_id
    })

    if result and result.status == "COMPLETED" and isinstance(result.content, FoodRecommendation):
        return result.content
    else:
        # If the workflow fails for any reason, return a valid, user-friendly error response
        return FoodRecommendation(
            recommendation_type="recipe",
            mood_analysis="I'm sorry, an error occurred while getting your recommendation. Please try again.",
            recipes=[],
            restaurants=[]
        )


