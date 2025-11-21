# Quick Start Guide - NourishBot Setup

## Step 1: Add Gemini API Key

1. Get your API key from: https://makersuite.google.com/app/apikey
2. Add to `.env.local`:

```env
GEMINI_API_KEY=your_api_key_here
```

## Step 2: Run Database Migration

```bash
npx prisma migrate dev --name add_chatbot_and_meal_planning
npx prisma generate
```

## Step 3: Add PDF Files (Optional)

Place your PDF knowledge base files in:
```
data/knowledge-base/
```

Recommended files:
- food_waste_reduction_guide.pdf
- nutrition_basics.pdf
- budget_meal_planning.pdf
- leftover_recipes.pdf
- food_sharing_guidelines.pdf
- environmental_impact.pdf

## Step 4: Update Authentication

Edit `components/ChatbotWrapper.tsx` to integrate with your auth system:

```typescript
const getUserId = async () => {
  // Replace with your auth logic
  const session = await getSession();
  if (session?.user?.id) {
    setUserId(session.user.id);
    // Also store in localStorage for persistence
    localStorage.setItem('userId', session.user.id);
  }
};
```

## Step 5: Test the Chatbot

1. Start your dev server:
```bash
npm run dev
```

2. Log in to your application

3. Look for the floating chatbot button in the bottom-right corner

4. Click it and start chatting!

## Step 6: Test Meal Planning API

You can test the meal planning API using the following example:

```bash
curl -X POST http://localhost:3000/api/meal-plan/optimize \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "your_user_id",
    "weekStartDate": "2025-11-21",
    "totalBudget": 150,
    "nutritionGoals": {
      "dailyCalories": 2000,
      "proteinGrams": 150,
      "carbsGrams": 200,
      "fatGrams": 65
    }
  }'
```

## Troubleshooting

### Chatbot not appearing?
- Check if user is logged in
- Open browser console and check for errors
- Verify `userId` is set in localStorage

### API errors?
- Check if `GEMINI_API_KEY` is set correctly
- Verify database migrations ran successfully
- Check server logs for detailed errors

### Database errors?
- Run: `npx prisma migrate reset` (WARNING: This will delete all data)
- Then: `npx prisma migrate dev`
- Finally: `npx prisma generate`

## What's Next?

1. **Customize the chatbot**: Edit system prompts in `lib/ai/gemini-client.ts`
2. **Add meal planning UI**: Create a page to display and manage meal plans
3. **Implement RAG**: Process PDFs for more accurate responses
4. **Add analytics**: Track chatbot usage and meal plan effectiveness

## Need Help?

Check the comprehensive documentation in `CHATBOT_README.md`
