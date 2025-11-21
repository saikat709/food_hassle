// AI Meal Optimizer Service

import { genAI, MODELS, GENERATION_CONFIG } from './gemini-client';
import { prisma } from '@/lib/prisma';

/** Request payload for generating a meal plan */
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

/** Response format returned to the frontend */
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
    ingredients: { name: string; quantity: number; unit: string; fromInventory: boolean; estimatedCost: number }[];
    estimatedCost: number;
    nutritionInfo: { calories: number; protein: number; carbs: number; fat: number; fiber?: number };
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


function tryParseJSON(text: string) {
    if (typeof text !== 'string') throw new Error('No text to parse');

    // helper: quick normalization
    let t = text.trim();
    if (!t) throw new Error('Empty response');

    // remove BOM
    if (t.charCodeAt(0) === 0xfeff) t = t.slice(1);

    // quick direct parse
    try {
        return { value: JSON.parse(t), method: 'direct' };
    } catch (e) {
        // fallthrough to scanned extraction
    }

    // scan for balanced JSON candidates starting at every { or [
    const candidates: { start: number; end: number; text: string }[] = [];
    const isOpen = (c: string) => c === '{' || c === '[';
    const closingFor = (c: string) => (c === '{' ? '}' : ']');

    for (let pos = 0; pos < t.length; pos++) {
        const ch = t[pos];
        if (!isOpen(ch)) continue;

        let stack: string[] = [];
        let inString = false;
        let stringChar = '';
        let escaped = false;

        for (let i = pos; i < t.length; i++) {
            const c = t[i];

            if (inString) {
                if (escaped) {
                    escaped = false;
                    continue;
                }
                if (c === '\\') {
                    escaped = true;
                    continue;
                }
                if (c === stringChar) {
                    inString = false;
                    stringChar = '';
                }
                continue;
            } else {
                if (c === '"' || c === "'") {
                    inString = true;
                    stringChar = c;
                    continue;
                }
                if (isOpen(c)) {
                    stack.push(closingFor(c));
                    continue;
                }
                if ((c === '}' || c === ']')) {
                    if (stack.length === 0) {
                        // unmatched closing — break this candidate
                        break;
                    }
                    const expected = stack.pop();
                    if (c !== expected) {
                        // mismatched pair (shouldn't happen normally) — break
                        break;
                    }
                    if (stack.length === 0) {
                        // found balanced JSON from pos..i
                        const candidate = t.substring(pos, i + 1).trim();
                        candidates.push({ start: pos, end: i, text: candidate });
                        break; // stop scanning this start position (move to next start)
                    }
                }
            }
        }
    }

    // Try parsing candidates, prefer the largest (by length) successful parse
    if (candidates.length > 0) {
        candidates.sort((a, b) => b.text.length - a.text.length);
        const parseErrors: string[] = [];
        for (const c of candidates) {
            try {
                const val = JSON.parse(c.text);
                return { value: val, method: `scanned (pos ${c.start}-${c.end})` };
            } catch (err) {
                parseErrors.push(`pos ${c.start}-${c.end}: ${String(err)}`);
            }
        }
        // none parsed
        throw new Error('Found candidate JSON blocks but all failed to parse: ' + parseErrors.join(' | '));
    }

    // Fallbacks: strip common wrappers (code fences, leading comments) and retry bracket scanning on cleaned text
    let cleaned = t
        .replace(/^```(?:json)?\s*/i, '') // leading ```json
        .replace(/\s*```$/i, '') // trailing ```
        .replace(/^(\/\/.*\r?\n)+/, '') // leading // comments
        .trim();

    // Try regex to pick first { ... } or [ ... ] block (greedy)
    const regex = /(\{[\s\S]*\}|\[[\s\S]*\])/;
    const m = cleaned.match(regex);
    if (m && m[0]) {
        // try to parse progressively shrinking substring if there are trailing chars after a valid JSON
        const candidate = m[0].trim();
        try {
            return { value: JSON.parse(candidate), method: 'regex-first' };
        } catch (e) {
            // try bracket-walking on cleaned text (recursive call to reuse logic)
            if (cleaned !== t) {
                return tryParseJSON(cleaned); // may throw with improved message
            }
            throw new Error('Regex fallback found candidate but parse failed: ' + String(e));
        }
    }

    // Nothing found
    throw new Error('Unable to find balanced JSON object or array in response');
}

/** Build the prompt sent to Gemini */
function buildMealPlanPrompt(request: MealPlanRequest, userProfile: any): string {
    const { totalBudget, inventoryItems, nutritionGoals, preferences } = request;
    let prompt = `You are an expert meal planning assistant. Create a comprehensive 7-day meal plan with the following requirements:\n\n`;
    prompt += `**Budget Constraint:**\n- Total weekly budget: $${totalBudget.toFixed(2)}\n- Optimize to stay within or under budget\n- Prioritize cost-effective ingredients\n\n`;
    prompt += `**User Profile:**\n- Household size: ${userProfile.householdSize} ${userProfile.householdSize === 1 ? 'person' : 'people'}\n- Dietary preferences: ${userProfile.dietaryPreferences.join(', ') || 'None'}\n- Budget range: ${userProfile.budgetRange}\n${userProfile.location ? `- Location: ${userProfile.location}` : ''}\n\n`;
    if (inventoryItems && inventoryItems.length > 0) {
        prompt += `**Available Inventory (PRIORITIZE THESE):**\\n`;
        inventoryItems.forEach(item => {
            prompt += `- ${item.name}: ${item.quantity} ${item.unit}`;
            if (item.expiryDate) {
                const days = Math.ceil((new Date(item.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                prompt += ` (expires in ${days} days - USE SOON!)`;
            }
            prompt += '\\n';
        });
        prompt += '\\n';
    }
    if (nutritionGoals) {
        prompt += `**Daily Nutrition Goals:**\n- Calories: ${nutritionGoals.dailyCalories} kcal\n- Protein: ${nutritionGoals.proteinGrams}g\n- Carbohydrates: ${nutritionGoals.carbsGrams}g\n- Fat: ${nutritionGoals.fatGrams}g`;
        if (nutritionGoals.fiberGrams) prompt += `\n- Fiber: ${nutritionGoals.fiberGrams}g`;
        prompt += '\n\n';
    }
    if (preferences) {
        prompt += `**Preferences:**\\n`;
        if (preferences.cuisineTypes?.length) prompt += `- Cuisine types: ${preferences.cuisineTypes.join(', ')}\\n`;
        if (preferences.avoidIngredients?.length) prompt += `- Avoid: ${preferences.avoidIngredients.join(', ')}\\n`;
        if (preferences.mealComplexity) prompt += `- Meal complexity: ${preferences.mealComplexity}\\n`;
        prompt += '\\n';
    }
    prompt += `**Output Format - Return ONLY valid JSON matching this example:**
{
  "meals": [
    {
      "dayOfWeek": 0,
      "mealType": "breakfast",
      "recipeName": "Scrambled Eggs with Toast",
      "ingredients": [
        {
          "name": "Eggs",
          "quantity": 2,
          "unit": "pieces",
          "fromInventory": false,
          "estimatedCost": 0.5
        },
        {
          "name": "Bread",
          "quantity": 2,
          "unit": "slices",
          "fromInventory": false,
          "estimatedCost": 0.3
        }
      ],
      "estimatedCost": 0.8,
      "nutritionInfo": {
        "calories": 320,
        "protein": 18,
        "carbs": 28,
        "fat": 14,
        "fiber": 2
      },
      "instructions": "1. Beat eggs in a bowl. 2. Heat pan with butter. 3. Pour eggs and scramble. 4. Toast bread. 5. Serve together.",
      "prepTime": 5,
      "cookTime": 10
    }
  ],
  "shoppingList": [
    {
      "name": "Eggs",
      "quantity": 14,
      "unit": "pieces",
      "estimatedCost": 3.5,
      "category": "protein",
      "priority": "high"
    }
  ],
  "totalEstimatedCost": 145.50,
  "wasteReductionTips": [
    "Store eggs in the refrigerator to extend freshness",
    "Use leftover bread for croutons or breadcrumbs"
  ],
  "nutritionSummary": {
    "averageDailyCalories": 2000,
    "averageDailyProtein": 150,
    "averageDailyCarbs": 200,
    "averageDailyFat": 65
  }
}

**Critical Instructions:**
1. Create 21 meals total (breakfast, lunch, dinner for 7 days, dayOfWeek 0-6)
2. Prioritize inventory items, especially those expiring soon
3. Stay within budget of $${totalBudget.toFixed(2)}
4. Return ONLY the JSON object - no markdown, no explanations, no code blocks
5. Ensure all numeric values are numbers, not strings
6. All fields are required - do not omit any`;
    return prompt;
}

/** Generate optimized meal plan using Gemini */
export async function generateMealPlan(request: MealPlanRequest): Promise<MealPlanResponse> {
    try {
        // Fetch user profile
        console.log('[MealPlan] Step 1: Fetching user profile for ID:', request.userId);
        const user = await prisma.user.findUnique({
            where: { id: request.userId },
            select: {
                householdSize: true,
                dietaryPreferences: true,
                budgetRange: true,
                location: true,
                inventoryItems: true,
            },
        });

        if (!user) {
            console.error('[MealPlan] User not found:', request.userId);
            throw new Error(`User not found: ${request.userId}`);
        }

        console.log('[MealPlan] Step 2: User profile loaded successfully');

        // Determine inventory to use
        const inventoryToUse = request.inventoryItems && request.inventoryItems.length > 0
            ? request.inventoryItems
            : user.inventoryItems.map(item => ({
                name: item.name,
                quantity: item.quantity,
                unit: item.unit,
                expiryDate: item.expiryDate ?? undefined,
                estimatedCost: 0,
            }));

        console.log('[MealPlan] Step 3: Inventory items:', inventoryToUse.length);

        const requestWithInventory = { ...request, inventoryItems: inventoryToUse };
        const prompt = buildMealPlanPrompt(requestWithInventory, user);

        console.log('[MealPlan] Step 4: Calling Gemini AI...');
        const model = genAI.getGenerativeModel({
            model: MODELS.PLANNING,
            systemInstruction: `You are a meal planning assistant. You MUST respond with ONLY valid JSON. Do not include any explanatory text, markdown formatting, or code blocks. Return ONLY the raw JSON object as specified in the prompt.`,
            generationConfig: {
                ...GENERATION_CONFIG,
                temperature: 0.4,
                responseMimeType: 'application/json',
            },
        });

        // Generate content
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        console.log('[MealPlan] Step 5: AI response received, length:', responseText.length);


        console.log("Response: ", responseText);
        // Robust JSON parsing
        let planData: any;
        try {
            // use the helper
            planData = tryParseJSON(responseText);// should succeed
            console.log('[MealPlan] Step 6: JSON parsed successfully, meals count:', planData.meals?.length);
        } catch (e) {
            console.error('[MealPlan] JSON parse error:', e);
            console.error('[MealPlan] Raw response:', responseText);
            throw new Error('Invalid AI response format: ' + (e instanceof Error ? e.message : String(e)));
        }

        // Persist to DB with safe defaults
        console.log('[MealPlan] Step 7: Saving to database...');
        const mealPlan = await prisma.mealPlan.create({
            data: {
                userId: request.userId,
                weekStartDate: request.weekStartDate,
                totalBudget: request.totalBudget,
                estimatedCost: planData.totalEstimatedCost || 0,
                nutritionGoals: (request.nutritionGoals || {}) as any,
                items: {
                    create: (planData.meals || []).map((meal: any) => ({
                        dayOfWeek: meal.dayOfWeek ?? 0,
                        mealType: meal.mealType || 'breakfast',
                        recipeName: meal.recipeName || 'Untitled Recipe',
                        ingredients: meal.ingredients || [],
                        estimatedCost: meal.estimatedCost ?? 0,
                        nutritionInfo: meal.nutritionInfo || { calories: 0, protein: 0, carbs: 0, fat: 0 },
                        instructions: meal.instructions || 'No instructions provided',
                    })),
                },
            },
            include: { items: true },
        });

        console.log('[MealPlan] Step 8: Meal plan created successfully, ID:', mealPlan.id);

        return {
            mealPlanId: mealPlan.id,
            weekStartDate: mealPlan.weekStartDate,
            totalBudget: mealPlan.totalBudget,
            estimatedCost: mealPlan.estimatedCost,
            meals: planData.meals || [],
            shoppingList: planData.shoppingList || [],
            nutritionSummary: planData.nutritionSummary || {
                averageDailyCalories: 0,
                averageDailyProtein: 0,
                averageDailyCarbs: 0,
                averageDailyFat: 0,
            },
            wasteReductionTips: planData.wasteReductionTips || [],
        };
    } catch (error) {
        console.error('[MealPlan] Error details:', {
            name: error instanceof Error ? error.name : 'Unknown',
            message: error instanceof Error ? error.message : String(error),
            code: (error as any)?.code,
            meta: (error as any)?.meta,
        });
        throw error instanceof Error ? error : new Error('Failed to generate meal plan');
    }
}

/** Get user's meal plans */
export async function getUserMealPlans(userId: string, limit = 10) {
    const mealPlans = await prisma.mealPlan.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: limit,
        include: { items: { orderBy: [{ dayOfWeek: 'asc' }, { mealType: 'asc' }] } },
    });
    return mealPlans;
}

/** Get a specific meal plan */
export async function getMealPlan(mealPlanId: string, userId: string) {
    const mealPlan = await prisma.mealPlan.findFirst({
        where: { id: mealPlanId, userId },
        include: { items: { orderBy: [{ dayOfWeek: 'asc' }, { mealType: 'asc' }] } },
    });
    return mealPlan;
}

/** Generate shopping list from a meal plan */
export async function generateShoppingList(mealPlanId: string, userId: string) {
    const mealPlan = await getMealPlan(mealPlanId, userId);
    if (!mealPlan) throw new Error('Meal plan not found');
    const ingredientMap = new Map<string, ShoppingItem>();
    mealPlan.items.forEach(item => {
        (item.ingredients as any[]).forEach(ing => {
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

/** Simple ingredient categorization */
function categorizeIngredient(name: string): string {
    const lower = name.toLowerCase();
    if (lower.match(/chicken|beef|pork|fish|tofu|egg|meat/)) return 'protein';
    if (lower.match(/milk|cheese|yogurt|butter|cream/)) return 'dairy';
    if (lower.match(/rice|pasta|bread|flour|oat|cereal/)) return 'grains';
    if (lower.match(/apple|banana|berry|orange|vegetable|lettuce|tomato|carrot|onion/)) return 'produce';
    return 'other';
}
