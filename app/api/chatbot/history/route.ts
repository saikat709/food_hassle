import { NextRequest, NextResponse } from 'next/server';
import { getChatHistory, getChatSession, deleteChatSession } from '@/lib/ai/chatbot-service';
import { z } from 'zod';

const historyQuerySchema = z.object({
    userId: z.string(),
    limit: z.number().optional(),
});

const sessionQuerySchema = z.object({
    sessionId: z.string(),
    userId: z.string(),
});

const deleteSessionSchema = z.object({
    sessionId: z.string(),
    userId: z.string(),
});

// GET - Fetch chat history or specific session
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');
        const sessionId = searchParams.get('sessionId');
        const limit = searchParams.get('limit');

        if (!userId) {
            return NextResponse.json(
                { success: false, error: 'userId is required' },
                { status: 400 }
            );
        }

        // Get specific session
        if (sessionId) {
            const validatedData = sessionQuerySchema.parse({ sessionId, userId });
            const session = await getChatSession(validatedData.sessionId, validatedData.userId);

            if (!session) {
                return NextResponse.json(
                    { success: false, error: 'Session not found' },
                    { status: 404 }
                );
            }

            return NextResponse.json({
                success: true,
                data: session,
            });
        }

        // Get chat history
        const validatedData = historyQuerySchema.parse({
            userId,
            limit: limit ? parseInt(limit) : undefined,
        });

        const history = await getChatHistory(
            validatedData.userId,
            validatedData.limit
        );

        return NextResponse.json({
            success: true,
            data: history,
        });
    } catch (error) {
        console.error('Chat history API error:', error);

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
                error: error instanceof Error ? error.message : 'Failed to fetch chat history',
            },
            { status: 500 }
        );
    }
}

// DELETE - Delete a chat session
export async function DELETE(request: NextRequest) {
    try {
        const body = await request.json();
        const validatedData = deleteSessionSchema.parse(body);

        await deleteChatSession(validatedData.sessionId, validatedData.userId);

        return NextResponse.json({
            success: true,
            message: 'Session deleted successfully',
        });
    } catch (error) {
        console.error('Delete session API error:', error);

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
                error: error instanceof Error ? error.message : 'Failed to delete session',
            },
            { status: 500 }
        );
    }
}
