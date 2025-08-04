# -*- coding: utf-8 -*-
from typing import List, Optional, Literal
from pydantic import BaseModel, Field

class UserPreferences(BaseModel):
    """User input preferences for food recommendations"""
    mood: Optional[str] = Field(None, description="User's current mood (happy, sad, stressed, etc.)")
    cuisine: Optional[str] = Field(None, description="Preferred cuisine type")
    dietary_type: Optional[Literal["veg", "non-veg", "vegan", "pescatarian"]] = None
    egg_preference: Optional[Literal["with_egg", "without_egg"]] = None
    meal_type: Optional[Literal["breakfast", "lunch", "dinner", "snacks"]] = None
    action_type: Literal["cook", "dine_in", "order"] = Field(..., description="What user wants to do")
    location: Optional[str] = Field(None, description="User location for restaurant/delivery")
    allergies: Optional[List[str]] = Field(default=[], description="Food allergies")

class Recipe(BaseModel):
    """Recipe recommendation structure"""
    name: str
    cuisine_type: str
    prep_time: str
    cook_time: str
    ingredients: List[str]
    instructions: List[str]
    youtube_videos: Optional[List[str]] = Field(default=[], description="Related YouTube video URLs")

class Restaurant(BaseModel):
    """Restaurant recommendation structure"""
    name: str
    cuisine_type: str
    rating: Optional[float] = None
    price_range: str
    address: str
    phone: Optional[str] = None
    specialties: List[str]

class RecipeList(BaseModel):
    """A list of recipe recommendations"""
    recipes: List[Recipe]

class RestaurantList(BaseModel):
    """A list of restaurant recommendations"""
    restaurants: List[Restaurant]

class FoodRecommendation(BaseModel):
    """Final recommendation output"""
    recommendation_type: Literal["recipe", "restaurant", "delivery"]
    recipes: Optional[List[Recipe]] = Field(default=[], description="Recipe recommendations")
    restaurants: Optional[List[Restaurant]] = Field(default=[], description="Restaurant recommendations")
    mood_analysis: str = Field(..., description="How the recommendation matches user's mood")