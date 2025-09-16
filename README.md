# MooFoo - Your Personal Food Assistant 🍕

**MooFoo** is an intelligent AI-powered food recommendation chatbot that provides personalized food suggestions based on your mood, preferences, and dietary requirements. Whether you want to cook at home or dine out, MooFoo analyzes your current state of mind and offers tailored recommendations for recipes and restaurants.

## 🎯 Key Features

- **Mood-Based Recommendations:** Get personalized food suggestions based on your current mood and emotional state
- **Smart Intent Recognition:** Automatically detects whether you want to cook at home or dine out
- **Dietary Preference Support:** Handles vegetarian, non-vegetarian, vegan, and pescatarian preferences
- **Recipe Recommendations:** Detailed recipes with ingredients, instructions, cooking times, and YouTube video links
- **Restaurant Suggestions:** Curated restaurant recommendations with ratings, addresses, and specialties
- **Interactive Chat Interface:** Natural conversation flow with a friendly, emoji-rich personality
- **Real-time Analysis:** Instant mood analysis and contextual food matching

## 🚀 Live Demo

**Try MooFoo now:** [https://moo-foo-bfgz.vercel.app/](https://moo-foo-bfgz.vercel.app/)

## 💬 How It Works

1. **Start a Conversation:** Open the chat interface and greet MooFoo
2. **Share Your Mood:** Tell MooFoo how you're feeling (happy, stressed, hungry, etc.)
3. **Specify Preferences:** Mention dietary restrictions, cuisine preferences, or meal types
4. **Get Recommendations:** MooFoo will analyze your mood and provide personalized suggestions
5. **Choose Your Path:** Decide whether to cook at home or dine out
6. **Follow Instructions:** Get detailed recipes or restaurant information

## 🛠️ Tech Stack

**Backend:**
- FastAPI (Python web framework)
- Agno Workflow (AI workflow orchestration)
- Pydantic (Data validation)
- Uvicorn (ASGI server)

**Frontend:**
- Next.js 14 (React framework)
- TypeScript
- Tailwind CSS
- Shadcn/ui components

**AI/ML:**
- Custom AI agents for recipe and restaurant recommendations
- Mood analysis and intent classification
- Structured data generation

## 📱 Example Conversations

**User:** "I'm feeling happy and want to cook something special"
**MooFoo:** Provides celebratory recipes with detailed instructions and cooking tips

**User:** "I'm stressed and need comfort food, preferably vegetarian"
**MooFoo:** Suggests soothing vegetarian comfort food recipes or restaurants

**User:** "I want to order something spicy for dinner"
**MooFoo:** Recommends spicy restaurant options with ratings and specialties

## 🎯 Deployment Status

- ✅ **Backend:** Deployed on Render
- ✅ **Frontend:** Deployed on Vercel at [https://moo-foo-bfgz.vercel.app/](https://moo-foo-bfgz.vercel.app/)

## 🏗️ Project Structure

```
MooFoo/
├── app/
│   ├── backend/          # FastAPI backend
│   │   ├── api.py        # Main API endpoints
│   │   ├── requirements.txt
│   │   └── src/          # Backend source code
│   └── frontend/         # Next.js frontend
│       ├── src/
│       │   ├── app/      # Next.js app router
│       │   ├── components/ # React components
│       │   └── lib/      # Utility functions
│       └── package.json
├── src/                  # Core application logic
│   ├── agents/          # AI agents
│   ├── schema/          # Data models
│   └── workflow.py      # Main workflow orchestration
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Python 3.8+
- Node.js 18+
- OpenAI API key

### Backend Setup
```bash
cd app/backend
pip install -r requirements.txt
uvicorn api:app --reload
```

### Frontend Setup
```bash
cd app/frontend
npm install
npm run dev
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

MooFoo is your personal food companion that understands your mood and cravings, making every meal decision a delightful experience! 🍕✨
