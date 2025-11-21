import { NextRequest, NextResponse } from 'next/server';
import { chat } from '@/lib/ai/chatbot-service';
import { z } from 'zod';

const chatRequestSchema = z.object({
    message: z.string().min(1, 'Message cannot be empty'),
    userId: z.string(),
    sessionId: z.string().optional(),
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate request
        const validatedData = chatRequestSchema.parse(body);

        // Process chat
        const result = await chat(validatedData.message, {
            userId: validatedData.userId,
            sessionId: validatedData.sessionId,
        });

        return NextResponse.json({
            success: true,
            data: result,
        });
    } catch (error) {
        console.error('Chat API error:', error);

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
                error: error instanceof Error ? error.message : 'Failed to process chat',
            },
            { status: 500 }
        );
    }
}
