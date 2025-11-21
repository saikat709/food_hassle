# NourishBot - AI Chatbot & Meal Planning System

## Overview

This system implements a comprehensive AI-powered chatbot and meal planning engine for the Food Hassle application using Google's Gemini AI.

## Features

### 1. NourishBot - Multi-Capability Chatbot

The chatbot handles multiple topics with intelligent context switching:

- **Food Waste Reduction**: Advice on reducing waste, storage techniques, composting
- **Nutrition Balancing**: Dietary guidance, macronutrients, meal balancing
- **Budget Meal Planning**: Cost-effective meal ideas, shopping strategies
- **Leftover Transformation**: Creative recipes using leftovers
- **Food Sharing**: Community resources, donation guidelines
- **Environmental Impact**: Carbon footprint, sustainability education

#### Key Features:
- ✅ Contextual memory (last 20 messages per session)
- ✅ Automatic topic detection
- ✅ User profile integration (household size, dietary preferences, budget, location)
- ✅ Session management with history
- ✅ Personalized responses based on user context

### 2. AI Meal Optimization Engine

Generates optimized weekly meal plans considering:

- **Budget Constraints**: Stays within user's weekly budget
- **Inventory Prioritization**: Uses available items, especially those expiring soon
- **Nutrition Goals**: Meets daily calorie, protein, carbs, fat, fiber requirements
- **Dietary Preferences**: Respects user's dietary restrictions
- **Waste Reduction**: Reuses ingredients across meals

#### Output Includes:
- 21 meals (breakfast, lunch, dinner for 7 days)
- Detailed recipes with instructions
- Nutrition information per meal
- Shopping list with cost estimates
- Waste reduction tips

## Project Structure

```
lib/ai/
├── gemini-client.ts          # Gemini AI configuration & prompts
├── chatbot-service.ts         # Chat logic & session management
└── meal-optimizer.ts          # Meal planning optimization

app/api/
├── chatbot/
│   ├── chat/route.ts         # Chat endpoint
│   └── history/route.ts      # Session management
└── meal-plan/
    ├── optimize/route.ts     # Meal plan generation
    └── shopping-list/route.ts # Shopping list generation

components/
├── FloatingChatbot.tsx       # Floating chat UI
└── ChatbotWrapper.tsx        # Auth wrapper

data/knowledge-base/          # PDF files for RAG (future)
types/ai.ts                   # TypeScript type definitions
```

## Database Schema

### ChatSession
- Stores conversation sessions
- Links to User
- Has many ChatMessages

### ChatMessage
- Individual messages (user/assistant)
- Belongs to ChatSession
- Stores metadata (topic, etc.)

### MealPlan
- Weekly meal plans
- Links to User
- Has many MealPlanItems
- Stores budget, nutrition goals

### MealPlanItem
- Individual meals
- Belongs to MealPlan
- Stores recipe, ingredients, nutrition info

## Setup Instructions

### 1. Environment Variables

Add to your `.env.local`:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

Get your API key from: https://makersuite.google.com/app/apikey

### 2. Database Migration

Run Prisma migration to create new tables:

```bash
npx prisma migrate dev --name add_chatbot_and_meal_planning
```

### 3. Generate Prisma Client

```bash
npx prisma generate
```

## API Endpoints

### Chatbot APIs

#### POST /api/chatbot/chat
Send a message to the chatbot.

**Request:**
```json
{
  "message": "How can I reduce food waste?",
  "userId": "user_id",
  "sessionId": "session_id" // optional
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "response": "Here are some tips...",
    "sessionId": "session_id"
  }
}
```

#### GET /api/chatbot/history
Get chat history for a user.

**Query Params:**
- `userId` (required)
- `sessionId` (optional) - get specific session
- `limit` (optional) - number of sessions to return

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "session_id",
      "title": "Food waste tips",
      "messages": [...]
    }
  ]
}
```

#### DELETE /api/chatbot/history
Delete a chat session.

**Request:**
```json
{
  "sessionId": "session_id",
  "userId": "user_id"
}
```

### Meal Planning APIs

#### POST /api/meal-plan/optimize
Generate an optimized meal plan.

**Request:**
```json
{
  "userId": "user_id",
  "weekStartDate": "2025-11-21",
  "totalBudget": 150.00,
  "inventoryItems": [
    {
      "name": "Chicken breast",
      "quantity": 2,
      "unit": "lbs",
      "expiryDate": "2025-11-25",
      "estimatedCost": 10.00
    }
  ],
  "nutritionGoals": {
    "dailyCalories": 2000,
    "proteinGrams": 150,
    "carbsGrams": 200,
    "fatGrams": 65,
    "fiberGrams": 30
  },
  "preferences": {
    "cuisineTypes": ["Italian", "Asian"],
    "avoidIngredients": ["peanuts"],
    "mealComplexity": "moderate"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "mealPlanId": "plan_id",
    "estimatedCost": 142.50,
    "meals": [...],
    "shoppingList": [...],
    "nutritionSummary": {...},
    "wasteReductionTips": [...]
  }
}
```

#### GET /api/meal-plan/optimize
Get user's meal plans.

**Query Params:**
- `userId` (required)
- `mealPlanId` (optional) - get specific plan
- `limit` (optional) - number of plans

#### GET /api/meal-plan/shopping-list
Generate shopping list from a meal plan.

**Query Params:**
- `mealPlanId` (required)
- `userId` (required)

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [...],
    "totalEstimatedCost": 85.50,
    "itemCount": 24
  }
}
```

## Usage Examples

### Frontend Integration

The floating chatbot is automatically available on all pages for logged-in users. It appears as a floating button in the bottom-right corner.

### Using the Chatbot

```typescript
// The chatbot automatically handles:
// 1. User authentication (via ChatbotWrapper)
// 2. Session management
// 3. Message history
// 4. Topic detection
// 5. Context-aware responses

// Users just click the floating button and start chatting!
```

### Generating a Meal Plan

```typescript
const response = await fetch('/api/meal-plan/optimize', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: currentUser.id,
    weekStartDate: new Date().toISOString(),
    totalBudget: 150,
    inventoryItems: userInventory,
    nutritionGoals: {
      dailyCalories: 2000,
      proteinGrams: 150,
      carbsGrams: 200,
      fatGrams: 65,
    },
  }),
});

const { data } = await response.json();
// data contains the complete meal plan
```

## PDF Knowledge Base

Place PDF files in `data/knowledge-base/` covering:

1. **food_waste_reduction_guide.pdf** - Food waste best practices
2. **nutrition_basics.pdf** - Nutrition information
3. **budget_meal_planning.pdf** - Budget strategies
4. **leftover_recipes.pdf** - Creative leftover ideas
5. **food_sharing_guidelines.pdf** - Community sharing info
6. **environmental_impact.pdf** - Sustainability data

**Note:** Current implementation uses Gemini's general knowledge. Future enhancement will implement RAG (Retrieval-Augmented Generation) to use these PDFs for more accurate, document-based responses.

## Authentication Integration

The chatbot requires user authentication. Update `ChatbotWrapper.tsx` to integrate with your auth system:

```typescript
// Example with your auth system
const getUserId = async () => {
  const session = await getSession(); // Your auth function
  if (session?.user?.id) {
    setUserId(session.user.id);
  }
};
```

## Customization

### Adjusting System Prompts

Edit `lib/ai/gemini-client.ts` to modify the chatbot's personality and capabilities:

```typescript
export const SYSTEM_PROMPTS = {
  GENERAL: `Your custom prompt here...`,
  // ... other prompts
};
```

### Changing Model Settings

Adjust temperature, max tokens, etc. in `lib/ai/gemini-client.ts`:

```typescript
export const GENERATION_CONFIG = {
  temperature: 0.7,  // 0-1, higher = more creative
  topK: 40,
  topP: 0.95,
  maxOutputTokens: 2048,
};
```

## Performance Considerations

- **Context Window**: Currently stores last 20 messages per session
- **Model Selection**: Uses `gemini-1.5-flash` for chat (fast), `gemini-1.5-pro` for meal planning (more powerful)
- **Caching**: Consider implementing Redis for session caching in production

## Future Enhancements

1. **RAG Implementation**: Process PDFs and use vector embeddings for accurate responses
2. **Voice Input**: Add speech-to-text for voice queries
3. **Image Recognition**: Upload food photos for waste analysis
4. **Recipe Suggestions**: Real-time recipe recommendations based on inventory
5. **Community Sharing**: Connect users for food sharing
6. **Analytics Dashboard**: Track waste reduction metrics

## Troubleshooting

### Chatbot not appearing
- Check if user is logged in
- Verify `userId` is set in localStorage
- Check browser console for errors

### API errors
- Verify `GEMINI_API_KEY` is set correctly
- Check Gemini API quota limits
- Review server logs for detailed errors

### Database errors
- Ensure migrations are run: `npx prisma migrate dev`
- Regenerate Prisma client: `npx prisma generate`
- Check database connection string

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review API documentation
3. Check Gemini AI documentation: https://ai.google.dev/docs
4. Review Prisma documentation: https://www.prisma.io/docs

## License

Part of the Food Hassle application.
