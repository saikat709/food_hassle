import { NextRequest, NextResponse } from 'next/server';
import { generateMealPlan, getUserMealPlans, getMealPlan } from '@/lib/ai/meal-optimizer';
import { z } from 'zod';

const inventoryItemSchema = z.object({
    name: z.string(),
    quantity: z.number(),
    unit: z.string(),
    expiryDate: z.string().optional(),
    estimatedCost: z.number().optional(),
});

const nutritionGoalsSchema = z.object({
    dailyCalories: z.number(),
    proteinGrams: z.number(),
    carbsGrams: z.number(),
    fatGrams: z.number(),
    fiberGrams: z.number().optional(),
});

const mealPlanRequestSchema = z.object({
    userId: z.string(),
    weekStartDate: z.string(),
    totalBudget: z.number().positive(),
    inventoryItems: z.array(inventoryItemSchema).optional(),
    nutritionGoals: nutritionGoalsSchema.optional(),
    preferences: z.object({
        cuisineTypes: z.array(z.string()).optional(),
        avoidIngredients: z.array(z.string()).optional(),
        mealComplexity: z.enum(['simple', 'moderate', 'complex']).optional(),
    }).optional(),
});

const getMealPlanSchema = z.object({
    userId: z.string(),
    mealPlanId: z.string().optional(),
});

// POST - Generate new meal plan
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate request
        const validatedData = mealPlanRequestSchema.parse(body);

        // Convert inventory items with date strings to Date objects
        const inventoryItems = validatedData.inventoryItems?.map(item => ({
            ...item,
            expiryDate: item.expiryDate ? new Date(item.expiryDate) : undefined,
        }));

        // Generate meal plan
        const mealPlan = await generateMealPlan({
            userId: validatedData.userId,
            weekStartDate: new Date(validatedData.weekStartDate),
            totalBudget: validatedData.totalBudget,
            inventoryItems,
            nutritionGoals: validatedData.nutritionGoals,
            preferences: validatedData.preferences,
        });

        return NextResponse.json({
            success: true,
            data: mealPlan,
        });
    } catch (error) {
        console.error('Meal plan optimization API error:', error);

        if (error instanceof z.ZodError) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Invalid request data',
                    details: error.issues,
                },
                { status: 400 }
            );
        }

        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to generate meal plan',
            },
            { status: 500 }
        );
    }
}

// GET - Fetch meal plans
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');
        const mealPlanId = searchParams.get('mealPlanId');
        const limit = searchParams.get('limit');

        if (!userId) {
            return NextResponse.json(
                { success: false, error: 'userId is required' },
                { status: 400 }
            );
        }

        // Get specific meal plan
        if (mealPlanId) {
            const mealPlan = await getMealPlan(mealPlanId, userId);

            if (!mealPlan) {
                return NextResponse.json(
                    { success: false, error: 'Meal plan not found' },
                    { status: 404 }
                );
            }

            return NextResponse.json({
                success: true,
                data: mealPlan,
            });
        }

        // Get all meal plans for user
        const mealPlans = await getUserMealPlans(
            userId,
            limit ? parseInt(limit) : undefined
        );

        return NextResponse.json({
            success: true,
            data: mealPlans,
        });
    } catch (error) {
        console.error('Get meal plans API error:', error);

        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to fetch meal plans',
            },
            { status: 500 }
        );
    }
}
