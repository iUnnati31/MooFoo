"use client"

import { useState, useEffect } from 'react'
import { ChatInterface } from '@/components/chat-interface'
import { api, FoodRecommendation as ApiFoodRecommendation, ApiError } from '@/lib/api'

export default function Home() {
  const [isLoading, setIsLoading] = useState(false)
  const [currentRecommendation, setCurrentRecommendation] = useState<ApiFoodRecommendation | null>(null)

  // Helper function to get rating description
  const getRatingDescription = (rating: number): string => {
    if (rating >= 4.5) return "Excellent"
    if (rating >= 4.0) return "Very Good"
    if (rating >= 3.5) return "Good"
    if (rating >= 3.0) return "Average"
    return "Fair"
  }



  const handleSendMessage = async (message: string): Promise<string> => {
    setIsLoading(true)
    try {
      // Enhanced prompt with more context and personality
      const enhancedMessage = `You are MooFoo, a friendly and enthusiastic food assistant. The user said: "${message}". 
      
      Please provide a warm, engaging response with:
      - Personalized recommendations based on their mood and preferences
      - Detailed descriptions that make the food sound irresistible
      - Pro tips and insights about the restaurants/recipes
      - A friendly, conversational tone with emojis
      - Specific details about why each option is perfect for them
      
      Make the user feel excited about their food choices!`

      const response = await api.getRecommendation({
        message: enhancedMessage,
        user_id: 'frontend_user'
      })

      setCurrentRecommendation(response)
      
      // Create a much more engaging and detailed response
      let responseText = ""
      
      if (response.recommendation_type === 'recipe') {
        responseText += "## 🍳 **Perfect Recipes for Your Mood!** ✨\n\n"
        responseText += "Based on your preferences, here are some amazing recipes that will delight your taste buds:\n\n"
        
        response.recipes?.forEach((recipe, index) => {
          responseText += `### **${index + 1}. ${recipe.name}** 🌟\n\n`
          responseText += `> *"${recipe.description}"*\n\n`
          responseText += `**⏱️ Preparation Time:** ${recipe.prep_time}\n`
          responseText += `**👥 Perfect For:** ${recipe.servings} people\n\n`
          
          // Add cooking tips based on recipe type
          if (recipe.name.toLowerCase().includes('spicy') || recipe.name.toLowerCase().includes('curry')) {
            responseText += `**🔥 Pro Tip:** This dish is perfect for spice lovers! Adjust the heat level to your preference.\n\n`
          } else if (recipe.name.toLowerCase().includes('healthy') || recipe.name.toLowerCase().includes('salad')) {
            responseText += `**🥗 Pro Tip:** A nutritious choice that's both delicious and good for you!\n\n`
          } else {
            responseText += `**👨‍🍳 Pro Tip:** This recipe is a crowd-pleaser and perfect for any occasion!\n\n`
          }
          
          responseText += `---\n\n`
        })
        
        responseText += `### 🎯 **Why These Recipes?**\n\n`
        responseText += `Based on your mood and preferences, I've selected recipes that will:\n`
        responseText += `• **Elevate your spirits** with amazing flavors\n`
        responseText += `• **Match your cravings** perfectly\n`
        responseText += `• **Be easy to prepare** at home\n\n`
        
      } else if (response.recommendation_type === 'restaurant') {
        responseText += "## 🍽️ **Amazing Restaurants Just for You!** 🌟\n\n"
        responseText += "I've handpicked these fantastic restaurants that match your mood and preferences perfectly:\n\n"
        
        response.restaurants?.forEach((restaurant, index) => {
          responseText += `### **${index + 1}. ${restaurant.name}** 🏆\n\n`
          responseText += `**🍽️ Cuisine:** *${restaurant.cuisine_type}*\n\n`
          
          // Enhanced location display
          if (restaurant.location && restaurant.location !== 'undefined') {
            responseText += `📍 **Location:** ${restaurant.location}\n`
          } else {
            responseText += `📍 **Location:** Near your area (Electronic City Phase 1)\n`
          }
          
          responseText += `⭐ **Rating:** ${restaurant.rating}/5 (${getRatingDescription(restaurant.rating)})\n\n`
          
          // Add restaurant-specific recommendations
          if (restaurant.name.toLowerCase().includes('a2b') || restaurant.name.toLowerCase().includes('adyar')) {
            responseText += `**🎯 Why You'll Love It:** Famous for their authentic South Indian breakfast and delicious sweets! Perfect for a hearty meal.\n\n`
          } else if (restaurant.name.toLowerCase().includes('punjabi') || restaurant.name.toLowerCase().includes('swaad')) {
            responseText += `**🎯 Why You'll Love It:** Authentic North Indian flavors with rich, spicy gravies that will satisfy your cravings!\n\n`
          } else if (restaurant.name.toLowerCase().includes('rasoiya') || restaurant.name.toLowerCase().includes('street')) {
            responseText += `**🎯 Why You'll Love It:** Street food style with bold flavors and generous portions. Great for sharing!\n\n`
          } else {
            responseText += `**🎯 Why You'll Love It:** Excellent food quality and great value for money!\n\n`
          }
          
          responseText += `---\n\n`
        })
        
        responseText += `### 🎯 **Perfect Match for Your Mood!**\n\n`
        responseText += `These restaurants are specially chosen because they:\n`
        responseText += `• **Match your spice preferences** perfectly\n`
        responseText += `• **Offer authentic flavors** you'll love\n`
        responseText += `• **Have great ratings** from happy customers\n`
        responseText += `• **Are conveniently located** near you\n\n`
      }
      
      // Enhanced mood analysis with more personality
      responseText += `### 🎭 **Your Mood Analysis** 💫\n\n`
      responseText += `*"${response.mood_analysis}"*\n\n`
      
      // Add personalized mood-based insights
      if (message.toLowerCase().includes('good mood') || message.toLowerCase().includes('happy')) {
        responseText += `**💡 My Recommendation:** Your positive energy is contagious! These options will amplify your great mood and create an even more amazing dining experience! ✨\n\n`
      } else if (message.toLowerCase().includes('spicy') || message.toLowerCase().includes('hot')) {
        responseText += `**💡 My Recommendation:** Spice lovers unite! 🌶️ These fiery options will set your taste buds on fire in the best way possible!\n\n`
      } else if (message.toLowerCase().includes('healthy') || message.toLowerCase().includes('light')) {
        responseText += `**💡 My Recommendation:** Smart choice! These nutritious options prove that healthy food can be absolutely delicious! 🥗\n\n`
      } else if (message.toLowerCase().includes('sweet') || message.toLowerCase().includes('dessert')) {
        responseText += `**💡 My Recommendation:** Sweet tooth satisfaction guaranteed! These treats will make your day even sweeter! 🍰\n\n`
      } else {
        responseText += `**💡 My Recommendation:** Based on your current mood, these options will definitely lift your spirits and satisfy your cravings!\n\n`
      }
      
      // Add call to action
      responseText += `### 🚀 **What's Next?**\n\n`
      if (response.recommendation_type === 'recipe') {
        responseText += `Ready to cook something amazing? Just let me know if you need:\n`
        responseText += `• **Cooking tips** for any recipe\n`
        responseText += `• **Ingredient substitutions**\n`
        responseText += `• **More recipe suggestions**\n\n`
      } else {
        responseText += `Ready to order? Just let me know if you need:\n`
        responseText += `• **Menu details** for any restaurant\n`
        responseText += `• **Popular dishes** recommendations\n`
        responseText += `• **More restaurant options**\n\n`
      }
      
      responseText += `**🍽️ Happy eating!** Let me know how it goes! 😊`
      
      return responseText
    } catch (error) {
      console.error('Error processing message:', error)
      return "I'm sorry, but I'm having trouble connecting to my recommendation service right now. Please try again in a moment!"
    } finally {
      setIsLoading(false)
    }
  }

    return (
    <div className="app-container">
      {/* Floating Food Particles */}
      <div className="floating-particles">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="particle" style={{
            '--delay': `${i * 0.5}s`,
            '--duration': `${3 + i * 0.5}s`,
            '--x': `${Math.random() * 100}%`,
            '--y': `${Math.random() * 100}%`
          } as React.CSSProperties}>
            {['🍕', '🍜', '🍔', '🍰', '🥗', '🍝', '🍣', '🍟', '🍦', '🥐', '🍪', '🍩'][i]}
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="chat-wrapper">
          <ChatInterface 
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* Background Pattern */}
      <div className="background-pattern"></div>

      <style jsx>{`
        .app-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #fff8dc 0%, #fff5e6 50%, #ffe4b5 100%);
          padding: 20px;
          position: relative;
          overflow: hidden;
        }

        .floating-particles {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1;
        }

        .particle {
          position: absolute;
          font-size: 1.5rem;
          opacity: 0.3;
          animation: float var(--duration) ease-in-out infinite;
          animation-delay: var(--delay);
          left: var(--x);
          top: var(--y);
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
            opacity: 0.6;
          }
        }

        .background-pattern {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: 
            radial-gradient(circle at 25% 25%, rgba(255, 107, 53, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, rgba(247, 147, 30, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(255, 140, 66, 0.03) 0%, transparent 50%);
          pointer-events: none;
          z-index: 0;
        }

        .main-content {
          max-width: 1200px;
          margin: 0 auto;
          padding-top: 40px;
          position: relative;
          z-index: 2;
        }

        .chat-wrapper {
          height: 85vh;
          border-radius: 25px;
          overflow: hidden;
          box-shadow: 
            0 25px 50px rgba(0, 0, 0, 0.15),
            0 0 0 1px rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          background: rgba(255, 255, 255, 0.1);
        }

        @media (max-width: 768px) {
          .app-container {
            padding: 10px;
          }
          
          .chat-wrapper {
            height: 90vh;
            border-radius: 20px;
          }
          
          .particle {
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  )
}
