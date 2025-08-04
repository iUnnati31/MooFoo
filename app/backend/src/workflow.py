import sys
import os
import re
import logging

# Add the project root to Python path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from agno.workflow.v2 import Workflow, Step, StepOutput
from agno.workflow.v2.types import StepInput
from src.schema.schema import FoodRecommendation
from src.agents.agents import super_recipe_agent, super_restaurant_agent

def get_recommendation_executor(step_input: StepInput) -> StepOutput:
    """
    Dynamically chooses the right agent based on user intent,
    runs the agent, and returns its output.
    """
    # The step_input.message is now a dictionary
    input_data = step_input.message
    user_message = input_data.get("message", "")
    user_id = input_data.get("user_id", "default_user")
    user_message_lower = user_message.lower()
    
    # 1. Choose the agent
    if "cook" in user_message_lower or "recipe" in user_message_lower:
        agent_to_use = super_recipe_agent
    elif "order" in user_message_lower or "dine" in user_message_lower or "restaurant" in user_message_lower:
        agent_to_use = super_restaurant_agent
    else:
        # Default to recipe agent if intent is unclear
        agent_to_use = super_recipe_agent
        
    # 2. Enrich the input message
    dietary_prefs = []
    if "veg" in user_message_lower: dietary_prefs.append("veg")
    if "non-veg" in user_message_lower: dietary_prefs.append("non-veg")
    if "vegan" in user_message_lower: dietary_prefs.append("vegan")
    if "pescatarian" in user_message_lower: dietary_prefs.append("pescatarian")
    if "egg" in user_message_lower: dietary_prefs.append("with_egg")
    
    enriched_message = user_message
    if dietary_prefs:
        enriched_message += f"\n\n(User's dietary preferences: {', '.join(dietary_prefs)})"

    # 3. Run the chosen agent and handle failures
    try:
        agent_response = agent_to_use.run(
            message=enriched_message,
            user_id=user_id
        )
        
        # 4. Check if the agent returned the correct structured object
        if isinstance(agent_response.content, FoodRecommendation):
            return StepOutput(
                content=agent_response.content,
                success=True
            )
    except Exception as e:
        logging.error(f"Agent execution failed with error: {e}")
        # If an exception occurs, we fall through to the generic rejection below.
        pass

    # If agent execution fails or returns an invalid object, return a polite message.
    rejection_response = FoodRecommendation(
        recommendation_type="recipe",  # A default type
        mood_analysis="I'm sorry, I can't provide a suggestion for that. Please try a different query.",
        recipes=[],
        restaurants=[]
    )
    return StepOutput(
        content=rejection_response,
        success=True  # We consider this a success from the workflow's perspective.
    )

# Simplified Food Recommendation Workflow
food_workflow = Workflow(
    name="Simplified Food Recommendation System",
    description="A streamlined workflow for providing mood-based food recommendations.",
    steps=[
        Step(
            name="Get Recommendation",
            executor=get_recommendation_executor,
            description="Dynamically selects and runs an agent to get a food recommendation based on user intent."
        )
    ]
)