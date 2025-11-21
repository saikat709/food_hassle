// Chatbot Types
export interface ChatMessage {
    id: string;
    sessionId: string;
    role: 'user' | 'assistant';
    content: string;
    metadata?: {
        topic?: string;
        [key: string]: any;
    };
    createdAt: Date;
}

export interface ChatSession {
    id: string;
    userId: string;
    title: string;
    createdAt: Date;
    updatedAt: Date;
    messages: ChatMessage[];
}

// Meal Planning Types
export interface MealPlan {
    id: string;
    userId: string;
    weekStartDate: Date;
    totalBudget: number;
    estimatedCost: number;
    nutritionGoals?: NutritionGoals;
    createdAt: Date;
    updatedAt: Date;
    items: MealPlanItem[];
}

export interface MealPlanItem {
    id: string;
    mealPlanId: string;
    dayOfWeek: number; // 0-6
    mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    recipeName: string;
    ingredients: Ingredient[];
    estimatedCost: number;
    nutritionInfo?: NutritionInfo;
    instructions?: string;
}

export interface Ingredient {
    name: string;
    quantity: number;
    unit: string;
    fromInventory: boolean;
    estimatedCost?: number;
}

export interface NutritionInfo {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber?: number;
}

export interface NutritionGoals {
    dailyCalories: number;
    proteinGrams: number;
    carbsGrams: number;
    fatGrams: number;
    fiberGrams?: number;
}

export interface ShoppingListItem {
    name: string;
    quantity: number;
    unit: string;
    estimatedCost: number;
    category: 'produce' | 'protein' | 'dairy' | 'grains' | 'other';
    priority: 'high' | 'medium' | 'low';
}

export interface InventoryItem {
    name: string;
    quantity: number;
    unit: string;
    expiryDate?: Date;
    estimatedCost?: number;
}

// API Response Types
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    details?: any;
}

export interface ChatResponse {
    response: string;
    sessionId: string;
}

export interface MealPlanResponse {
    mealPlanId: string;
    weekStartDate: Date;
    totalBudget: number;
    estimatedCost: number;
    meals: MealPlanItem[];
    shoppingList: ShoppingListItem[];
    nutritionSummary: {
        averageDailyCalories: number;
        averageDailyProtein: number;
        averageDailyCarbs: number;
        averageDailyFat: number;
    };
    wasteReductionTips: string[];
}
