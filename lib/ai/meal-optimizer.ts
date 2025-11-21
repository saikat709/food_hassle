import { genAI, MODELS, GENERATION_CONFIG } from './gemini-client';
import { prisma } from '@/lib/prisma';

export interface MealPlanRequest {
    userId: string;
    weekStartDate: Date;
    totalBudget: number;
    inventoryItems?: InventoryItem[];
    nutritionGoals?: NutritionGoals;
    preferences?: {
        cuisineTypes?: string[];
        avoidIngredients?: string[];
        mealComplexity?: 'simple' | 'moderate' | 'complex';
    };
}

export interface InventoryItem {
    name: string;
    quantity: number;
    unit: string;
    expiryDate?: Date;
    estimatedCost?: number;
}

export interface NutritionGoals {
    dailyCalories: number;
    proteinGrams: number;
    carbsGrams: number;
    fatGrams: number;
    fiberGrams?: number;
}

export interface MealPlanResponse {
    mealPlanId: string;
    weekStartDate: Date;
    totalBudget: number;
    estimatedCost: number;
    meals: MealItem[];
    shoppingList: ShoppingItem[];
    nutritionSummary: any;
    wasteReductionTips: string[];
}

export interface MealItem {
    dayOfWeek: number;
    mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    recipeName: string;
    ingredients: { name: string; quantity: number; unit: string; fromInventory: boolean }[];
    estimatedCost: number;
    nutritionInfo: {
        calories: number;
        protein: number;
        carbs: number;
        fat: number;
        fiber?: number;
    };
    instructions: string;
    prepTime: number;
    cookTime: number;
}

export interface ShoppingItem {
    name: string;
    quantity: number;
    unit: string;
    estimatedCost: number;
    category: string;
    priority: 'high' | 'medium' | 'low';
}

/**
 * Build optimization prompt for Gemini
 */
function buildMealPlanPrompt(request: MealPlanRequest, userProfile: any): string {
    const { totalBudget, inventoryItems, nutritionGoals, preferences } = request;

    let prompt = `You are an expert meal planning assistant. Create a comprehensive 7-day meal plan with the following requirements:

**Budget Constraint:**
- Total weekly budget: $${totalBudget.toFixed(2)}
- Optimize to stay within or under budget
- Prioritize cost-effective ingredients

**User Profile:**
- Household size: ${userProfile.householdSize} ${userProfile.householdSize === 1 ? 'person' : 'people'}
- Dietary preferences: ${userProfile.dietaryPreferences.join(', ') || 'None'}
- Budget range: ${userProfile.budgetRange}
${userProfile.location ? `- Location: ${userProfile.location}` : ''}

`;

    if (inventoryItems && inventoryItems.length > 0) {
        prompt += `**Available Inventory (PRIORITIZE THESE):**\n`;
        inventoryItems.forEach(item => {
            prompt += `- ${item.name}: ${item.quantity} ${item.unit}`;
            if (item.expiryDate) {
                const daysUntilExpiry = Math.ceil((new Date(item.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                prompt += ` (expires in ${daysUntilExpiry} days - USE SOON!)`;
            }
            prompt += '\n';
        });
        prompt += '\n';
    }

    if (nutritionGoals) {
        prompt += `**Daily Nutrition Goals:**
- Calories: ${nutritionGoals.dailyCalories} kcal
- Protein: ${nutritionGoals.proteinGrams}g
- Carbohydrates: ${nutritionGoals.carbsGrams}g
- Fat: ${nutritionGoals.fatGrams}g
${nutritionGoals.fiberGrams ? `- Fiber: ${nutritionGoals.fiberGrams}g` : ''}

`;
    }

    if (preferences) {
        prompt += `**Preferences:**\n`;
        if (preferences.cuisineTypes?.length) {
            prompt += `- Cuisine types: ${preferences.cuisineTypes.join(', ')}\n`;
        }
        if (preferences.avoidIngredients?.length) {
            prompt += `- Avoid: ${preferences.avoidIngredients.join(', ')}\n`;
        }
        if (preferences.mealComplexity) {
            prompt += `- Meal complexity: ${preferences.mealComplexity}\n`;
        }
        prompt += '\n';
    }

    prompt += `**Output Format (MUST BE VALID JSON):**
Return a JSON object with this exact structure:
{
  "meals": [
    {
      "dayOfWeek": 0-6,
      "mealType": "breakfast|lunch|dinner|snack",
      "recipeName": "string",
      "ingredients": [
        {
          "name": "string",
          "quantity": number,
          "unit": "string",
          "fromInventory": boolean,
          "estimatedCost": number
        }
      ],
      "estimatedCost": number,
      "nutritionInfo": {
        "calories": number,
        "protein": number,
        "carbs": number,
        "fat": number,
        "fiber": number
      },
      "instructions": "string",
      "prepTime": number,
      "cookTime": number
    }
  ],
  "shoppingList": [
    {
      "name": "string",
      "quantity": number,
      "unit": "string",
      "estimatedCost": number,
      "category": "produce|protein|dairy|grains|other",
      "priority": "high|medium|low"
    }
  ],
  "totalEstimatedCost": number,
  "wasteReductionTips": ["string"],
  "nutritionSummary": {
    "averageDailyCalories": number,
    "averageDailyProtein": number,
    "averageDailyCarbs": number,
    "averageDailyFat": number
  }
}

**Important Rules:**
1. Plan 3 meals per day (breakfast, lunch, dinner) for 7 days = 21 meals total
2. Maximize use of inventory items, especially those expiring soon
3. Minimize food waste by reusing ingredients across meals
4. Stay within the budget constraint
5. Meet or exceed nutrition goals
6. Provide realistic cost estimates based on typical grocery prices
7. Include clear, step-by-step cooking instructions
8. Return ONLY valid JSON, no markdown formatting or extra text`;

    return prompt;
}

/**
 * Generate optimized meal plan using Gemini
 */
export async function generateMealPlan(request: MealPlanRequest): Promise<MealPlanResponse> {
    try {
        // Get user profile
        const user = await prisma.user.findUnique({
            where: { id: request.userId },
            select: {
                householdSize: true,
                dietaryPreferences: true,
                budgetRange: true,
                location: true,
            },
        });

        if (!user) {
            throw new Error('User not found');
        }

        // Build prompt
        const prompt = buildMealPlanPrompt(request, user);

        // Initialize model
        const model = genAI.getGenerativeModel({
            model: MODELS.PLANNING,
            generationConfig: {
                ...GENERATION_CONFIG,
                temperature: 0.4, // Lower temperature for more consistent structured output
                responseMimeType: 'application/json',
            },
        });

        // Generate meal plan
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        // Parse JSON response
        let planData;
        try {
            planData = JSON.parse(responseText);
        } catch (parseError) {
            console.error('Failed to parse AI response:', responseText);
            throw new Error('Invalid response format from AI');
        }

        // Save meal plan to database
        const mealPlan = await prisma.mealPlan.create({
            data: {
                userId: request.userId,
                weekStartDate: request.weekStartDate,
                totalBudget: request.totalBudget,
                estimatedCost: planData.totalEstimatedCost,
                nutritionGoals: request.nutritionGoals || {},
                items: {
                    create: planData.meals.map((meal: any) => ({
                        dayOfWeek: meal.dayOfWeek,
                        mealType: meal.mealType,
                        recipeName: meal.recipeName,
                        ingredients: meal.ingredients,
                        estimatedCost: meal.estimatedCost,
                        nutritionInfo: meal.nutritionInfo,
                        instructions: meal.instructions,
                    })),
                },
            },
            include: {
                items: true,
            },
        });

        return {
            mealPlanId: mealPlan.id,
            weekStartDate: mealPlan.weekStartDate,
            totalBudget: mealPlan.totalBudget,
            estimatedCost: mealPlan.estimatedCost,
            meals: planData.meals,
            shoppingList: planData.shoppingList,
            nutritionSummary: planData.nutritionSummary,
            wasteReductionTips: planData.wasteReductionTips,
        };
    } catch (error) {
        console.error('Meal plan generation error:', error);
        throw new Error('Failed to generate meal plan');
    }
}

/**
 * Get user's meal plans
 */
export async function getUserMealPlans(userId: string, limit = 10) {
    const mealPlans = await prisma.mealPlan.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: limit,
        include: {
            items: {
                orderBy: [
                    { dayOfWeek: 'asc' },
                    { mealType: 'asc' },
                ],
            },
        },
    });

    return mealPlans;
}

/**
 * Get specific meal plan
 */
export async function getMealPlan(mealPlanId: string, userId: string) {
    const mealPlan = await prisma.mealPlan.findFirst({
        where: {
            id: mealPlanId,
            userId,
        },
        include: {
            items: {
                orderBy: [
                    { dayOfWeek: 'asc' },
                    { mealType: 'asc' },
                ],
            },
        },
    });

    return mealPlan;
}

/**
 * Generate shopping list from meal plan
 */
export async function generateShoppingList(mealPlanId: string, userId: string) {
    const mealPlan = await getMealPlan(mealPlanId, userId);

    if (!mealPlan) {
        throw new Error('Meal plan not found');
    }

    // Aggregate ingredients
    const ingredientMap = new Map<string, ShoppingItem>();

    mealPlan.items.forEach((item: any) => {
        const ingredients = item.ingredients as any[];
        ingredients.forEach((ing: any) => {
            if (!ing.fromInventory) {
                const key = ing.name.toLowerCase();
                if (ingredientMap.has(key)) {
                    const existing = ingredientMap.get(key)!;
                    existing.quantity += ing.quantity;
                    existing.estimatedCost += ing.estimatedCost || 0;
                } else {
                    ingredientMap.set(key, {
                        name: ing.name,
                        quantity: ing.quantity,
                        unit: ing.unit,
                        estimatedCost: ing.estimatedCost || 0,
                        category: categorizeIngredient(ing.name),
                        priority: 'medium',
                    });
                }
            }
        });
    });

    return Array.from(ingredientMap.values());
}

/**
 * Simple ingredient categorization
 */
function categorizeIngredient(name: string): string {
    const lowerName = name.toLowerCase();

    if (lowerName.match(/chicken|beef|pork|fish|tofu|egg|meat/)) return 'protein';
    if (lowerName.match(/milk|cheese|yogurt|butter|cream/)) return 'dairy';
    if (lowerName.match(/rice|pasta|bread|flour|oat|cereal/)) return 'grains';
    if (lowerName.match(/apple|banana|berry|orange|vegetable|lettuce|tomato|carrot|onion/)) return 'produce';

    return 'other';
}
