"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { Clock, Star, MapPin, ChefHat, Utensils } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface Recipe {
  name: string
  cuisine_type: string
  prep_time: string
  cook_time: string
  ingredients: string[]
  instructions: string[]
  youtube_videos?: string[]
}

interface Restaurant {
  name: string
  cuisine_type: string
  rating?: number
  price_range: string
  address: string
  phone?: string
  specialties: string[]
}

interface FoodRecommendationProps {
  type: 'recipe' | 'restaurant'
  mood: string
  recipes?: Recipe[]
  restaurants?: Restaurant[]
}

export function FoodRecommendation({ type, mood, recipes = [], restaurants = [] }: FoodRecommendationProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Mood Analysis */}
      <motion.div variants={itemVariants}>
        <Card className="bg-gradient-to-r from-green-400 to-green-600 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white rounded-full">
                <ChefHat className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-white text-lg">Mood Analysis</h3>
                <p className="text-white/90">{mood}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recommendations */}
      {type === 'recipe' && recipes.length > 0 && (
        <div className="space-y-4">
          <motion.h3 variants={itemVariants} className="text-xl font-display font-semibold text-amber-800 flex items-center space-x-2">
            <Utensils className="w-5 h-5" />
            <span>Recommended Recipes</span>
          </motion.h3>

          <div className="grid gap-4 md:grid-cols-2">
            {recipes.map((recipe, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="hover:shadow-xl transition-all duration-300 border-orange-500/20 hover:border-orange-500">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-display text-amber-800">{recipe.name}</CardTitle>
                    <p className="text-sm text-gray-600">{recipe.cuisine_type} cuisine</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-1 text-orange-500">
                        <Clock className="w-4 h-4" />
                        <span>{recipe.prep_time}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-green-500">
                        <Clock className="w-4 h-4" />
                        <span>{recipe.cook_time}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium text-amber-800">Key Ingredients:</h4>
                      <div className="flex flex-wrap gap-1">
                        {recipe.ingredients.slice(0, 5).map((ingredient, idx) => (
                          <span key={idx} className="px-2 py-1 bg-yellow-50 text-amber-800 text-xs rounded-full">
                            {ingredient}
                          </span>
                        ))}
                        {recipe.ingredients.length > 5 && (
                          <span className="px-2 py-1 bg-yellow-200 text-amber-900 text-xs rounded-full">
                            +{recipe.ingredients.length - 5} more
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 capitalize">{recipe.cuisine_type}</span>
                      <Button variant="food" size="sm">
                        View Recipe
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {type === 'restaurant' && restaurants.length > 0 && (
        <div className="space-y-4">
          <motion.h3 variants={itemVariants} className="text-xl font-display font-semibold text-amber-800 flex items-center space-x-2">
            <MapPin className="w-5 h-5" />
            <span>Recommended Restaurants</span>
          </motion.h3>

          <div className="grid gap-4 md:grid-cols-2">
            {restaurants.map((restaurant, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="hover:shadow-xl transition-all duration-300 border-orange-500/20 hover:border-orange-500">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg font-display text-amber-800">{restaurant.name}</CardTitle>
                        <p className="text-sm text-gray-600">{restaurant.cuisine_type} restaurant</p>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{restaurant.rating}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-green-600 font-medium">{restaurant.cuisine_type}</span>
                      <span className="text-orange-500">{restaurant.price_range}</span>
                    </div>

                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{restaurant.address}</span>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium text-amber-800 text-sm">Specialties:</h4>
                      <div className="flex flex-wrap gap-1">
                        {restaurant.specialties.slice(0, 3).map((specialty, idx) => (
                          <span key={idx} className="px-2 py-1 bg-yellow-50 text-amber-800 text-xs rounded-full">
                            {specialty}
                          </span>
                        ))}
                        {restaurant.specialties.length > 3 && (
                          <span className="px-2 py-1 bg-yellow-200 text-amber-900 text-xs rounded-full">
                            +{restaurant.specialties.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    <Button variant="food" size="sm" className="w-full">
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {recipes.length === 0 && restaurants.length === 0 && (
        <motion.div variants={itemVariants}>
          <Card className="bg-yellow-50 border-orange-500/20">
            <CardContent className="p-6 text-center">
              <div className="flex flex-col items-center space-y-3">
                <div className="p-3 bg-orange-500 rounded-full">
                  <ChefHat className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-amber-800">No recommendations found</h3>
                  <p className="text-gray-600">Try asking for something different or be more specific about your preferences.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  )
} 