import { NextRequest, NextResponse } from 'next/server';
import { generateShoppingList } from '@/lib/ai/meal-optimizer';
import { z } from 'zod';

const shoppingListRequestSchema = z.object({
    mealPlanId: z.string(),
    userId: z.string(),
});

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const mealPlanId = searchParams.get('mealPlanId');
        const userId = searchParams.get('userId');

        if (!mealPlanId || !userId) {
            return NextResponse.json(
                { success: false, error: 'mealPlanId and userId are required' },
                { status: 400 }
            );
        }

        const validatedData = shoppingListRequestSchema.parse({ mealPlanId, userId });

        const shoppingList = await generateShoppingList(
            validatedData.mealPlanId,
            validatedData.userId
        );

        return NextResponse.json({
            success: true,
            data: {
                items: shoppingList,
                totalEstimatedCost: shoppingList.reduce((sum, item) => sum + item.estimatedCost, 0),
                itemCount: shoppingList.length,
            },
        });
    } catch (error) {
        console.error('Shopping list API error:', error);

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
                error: error instanceof Error ? error.message : 'Failed to generate shopping list',
            },
            { status: 500 }
        );
    }
}
