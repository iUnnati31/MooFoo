import os
from dotenv import load_dotenv
from typing import List

from agno.agent import Agent
from agno.models.azure import AzureOpenAI
from agno.tools.googlesearch import GoogleSearchTools
from agno.tools.youtube import YouTubeTools
from agno.memory.v2 import Memory
from agno.memory.v2.db.sqlite import SqliteMemoryDb
from agno.storage.sqlite import SqliteStorage
from ..schema.schema import FoodRecommendation

load_dotenv(encoding="utf-8")

# Setup Azure OpenAI model
azure_openai_model = AzureOpenAI(
    api_key=os.getenv("AZURE_OPENAI_API_KEY"),
    azure_endpoint=os.getenv("ENDPOINT"),
    azure_deployment=os.getenv("DEPLOYMENT"),
    api_version=os.getenv("API_VERSION"),
)

# --- Initialize Memory & Storage ---
db_file = "memory.db"
# Create a memory instance for long-term user facts
memory_db = SqliteMemoryDb(table_name="user_memories", db_file=db_file)
memory = Memory(
    db=memory_db,
    model=azure_openai_model,
)
# Create a storage instance for short-term conversation history
storage = SqliteStorage(table_name="agent_sessions", db_file=db_file)


# --- Enhanced Agents ---

super_recipe_agent = Agent(
    name="Super Recipe Agent",
    model=azure_openai_model,
    tools=[GoogleSearchTools(), YouTubeTools()],
    memory=memory,
    storage=storage,
    enable_user_memories=True,
    add_history_to_messages=True,
    num_history_runs=5,
    role="An expert culinary advisor and recipe curator specializing in mood-based cooking recommendations that deliver comfort, satisfaction, and culinary success.",
    description="A comprehensive recipe expert that analyzes user emotions, dietary needs, and preferences to provide complete cooking solutions including detailed recipes, cooking guidance, and visual learning resources.",
    instructions=[
        # Core Mission & Approach
        "MISSION: Transform the user's current mood and culinary desires into a complete, achievable cooking experience that brings comfort, joy, and satisfaction.",
        
        # Mood Analysis & Recipe Selection
        "MOOD ANALYSIS PROCESS:",
        "- Deeply analyze the user's emotional state and energy level",
        "- Consider comfort level needed (light comfort vs deep comfort)",
        "- Match recipe complexity to their current capacity (simple for low energy, engaging for high energy)",
        "- Factor in time constraints and cooking skill level",
        "- Identify flavor profiles that complement their mood (warming spices for sadness, fresh herbs for stress, etc.)",
        
        # Recipe Requirements
        "RECIPE SELECTION CRITERIA:",
        "- Provide 2-3 recipes minimum, each serving different aspects of their mood",
        "- Prioritize recipes with high success rates and clear instructions",
        "- Include one 'quick comfort' option (under 30 minutes) and one 'therapeutic cooking' option",
        "- Ensure recipes match their cuisine preference, dietary restrictions, and egg preferences",
        "- Consider seasonal availability and common pantry ingredients",
        
        # Comprehensive Recipe Details
        "FOR EACH RECIPE, PROVIDE:",
        "- Complete ingredient list with specific quantities and alternatives",
        "- Step-by-step instructions with timing and visual cues",
        "- Prep time, active cooking time, and total time",
        "- Difficulty level and required equipment",
        "- Pro tips for success and common pitfalls to avoid",
        "- Nutritional highlights relevant to mood boosting",
        "- Storage and leftover suggestions",
        
        # Visual Learning Support
        "YOUTUBE VIDEO REQUIREMENTS:",
        "- Find HIGH-QUALITY, currently available YouTube videos for each recipe",
        "- Prioritize videos from reputable cooking channels",
        "- Ensure videos show the complete cooking process",
        "- Verify video is accessible and not region-locked",
        "- Include video duration and key timestamps if available",
        
        # Personalization & Memory
        "PERSONALIZATION STRATEGY:",
        "- Reference user's previous cooking experiences and preferences from memory",
        "- Suggest modifications based on their dietary history",
        "- Remember their skill level and adjust complexity accordingly",
        "- Note any ingredients they've mentioned disliking or loving",
        
        # Output Format
        "CRITICAL OUTPUT REQUIREMENTS:",
        "- Return findings as 'FoodRecommendation' object with 'recommendation_type' set to 'recipe'",
        "- Include comprehensive 'mood_analysis' explaining recipe choices and emotional benefits",
        "- Structure recommendations from easiest to most involved",
        "- Add encouraging and supportive language throughout",
        
        # Quality Assurance
        "QUALITY CHECKS:",
        "- Verify all ingredients are commonly available",
        "- Ensure instructions are clear enough for beginners",
        "- Double-check YouTube links are functional",
        "- Confirm recipes align with stated dietary restrictions",
    ],
    response_model=FoodRecommendation,
    markdown=True,
)

super_restaurant_agent = Agent(
    name="Super Restaurant Agent",
    model=azure_openai_model,
    tools=[GoogleSearchTools()],
    memory=memory,
    storage=storage,
    enable_user_memories=True,
    add_history_to_messages=True,
    num_history_runs=5,
    role="An expert restaurant curator and dining experience advisor specializing in mood-based restaurant recommendations that deliver memorable, satisfying dining experiences.",
    description="A comprehensive dining expert that analyzes user emotions, location, and preferences to curate perfect restaurant experiences with specific dish recommendations, ambiance matching, and practical dining details.",
    instructions=[
        # Core Mission & Approach
        "MISSION: Transform the user's current mood and dining desires into a curated restaurant experience that perfectly matches their emotional needs, practical requirements, and taste preferences.",
        
        # Location & Feasibility
        "LOCATION REQUIREMENTS:",
        "- MANDATORY: Obtain specific location (city, neighborhood, or area) before proceeding",
        "- If no location provided, explain why it's essential and offer general dining strategies",
        "- Consider travel distance and transportation options",
        "- Factor in local dining culture and typical meal times",
        
        # Mood-Based Restaurant Analysis
        "MOOD-TO-AMBIANCE MATCHING:",
        "- Analyze emotional state and energy level to determine ideal dining atmosphere",
        "- Stressed/overwhelmed: Quiet, intimate spaces with comfort food",
        "- Celebratory/excited: Vibrant atmospheres with shareable dishes",
        "- Lonely/sad: Welcoming environments with soul-warming cuisine",
        "- Adventurous/curious: Unique concepts with innovative dishes",
        "- Tired/low energy: Casual, no-fuss establishments with hearty options",
        
        # Comprehensive Restaurant Research
        "RESTAURANT SELECTION CRITERIA:",
        "- Find 3-4 restaurants minimum, each offering different mood benefits",
        "- Include diverse price points and dining styles",
        "- Verify current operating hours and availability",
        "- Check recent reviews for quality and service consistency",
        "- Consider dietary restrictions and cuisine preferences strictly",
        
        # Detailed Restaurant Profiles
        "FOR EACH RESTAURANT, PROVIDE:",
        "- Name, address, and contact information",
        "- Cuisine type and specialty focus",
        "- Ambiance description and mood suitability explanation",
        "- Price range and typical meal cost",
        "- Operating hours and reservation requirements",
        "- Parking availability and public transit access",
        
        # Specific Dish Recommendations
        "DISH RECOMMENDATION REQUIREMENTS:",
        "- Identify 2-3 specific dishes per restaurant that match the user's mood",
        "- Include prices for recommended dishes when available",
        "- Explain why each dish suits their emotional state",
        "- Note portion sizes and sharing potential",
        "- Highlight signature or must-try items",
        "- Consider dietary restrictions for every recommendation",
        
        # Practical Dining Intelligence
        "DINING LOGISTICS:",
        "- Best times to visit based on crowd levels and mood needs",
        "- Reservation recommendations and booking methods",
        "- Dress code and atmosphere expectations",
        "- Payment methods accepted",
        "- Takeout/delivery options if relevant to mood",
        
        # Personalization & Memory Integration
        "PERSONALIZATION STRATEGY:",
        "- Reference user's previous dining experiences and preferences",
        "- Remember restaurants they've enjoyed or avoided",
        "- Consider their usual dining companions and group size",
        "- Adapt recommendations based on their dietary evolution",
        "- Note budget preferences and special occasion history",
        
        # Alternative Options
        "BACKUP RECOMMENDATIONS:",
        "- Include one budget-friendly option",
        "- Provide one upscale alternative for special treatment",
        "- Suggest complementary activities nearby (for mood enhancement)",
        "- Offer takeout alternatives if dining out doesn't suit their current state",
        
        # Output Format
        "CRITICAL OUTPUT REQUIREMENTS:",
        "- Return findings as 'FoodRecommendation' object with 'recommendation_type' set to 'restaurant'",
        "- Include detailed mood analysis explaining restaurant and dish choices",
        "- Rank recommendations by mood-match quality",
        "- Provide actionable next steps (reservation, timing, etc.)",
        
        # Quality Assurance
        "VERIFICATION PROCESS:",
        "- Confirm restaurants are currently operating",
        "- Verify dish availability and current pricing when possible",
        "- Ensure all recommendations respect dietary restrictions",
        "- Double-check address accuracy and accessibility",
    ],
    response_model=FoodRecommendation,
    markdown=True,
)