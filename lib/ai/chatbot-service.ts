import { genAI, MODELS, SYSTEM_PROMPTS, GENERATION_CONFIG } from './gemini-client';
import { prisma } from '@/lib/prisma';

export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
    timestamp?: Date;
}

export interface ChatContext {
    userId: string;
    sessionId?: string;
    userProfile?: {
        householdSize: number;
        dietaryPreferences: string[];
        budgetRange: string;
        location?: string;
    };
}

/**
 * Detect the topic/intent of the user's message
 */
function detectTopic(message: string): keyof typeof SYSTEM_PROMPTS {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.match(/waste|throw|spoil|expire|compost/)) {
        return 'FOOD_WASTE';
    }
    if (lowerMessage.match(/nutrition|healthy|vitamin|protein|calorie|diet/)) {
        return 'NUTRITION';
    }
    if (lowerMessage.match(/budget|cheap|afford|cost|save money|expensive/)) {
        return 'BUDGET_PLANNING';
    }
    if (lowerMessage.match(/leftover|remain|extra|use up|creative/)) {
        return 'LEFTOVERS';
    }
    if (lowerMessage.match(/share|donate|community|neighbor|food bank/)) {
        return 'FOOD_SHARING';
    }
    if (lowerMessage.match(/environment|carbon|climate|sustainable|eco/)) {
        return 'ENVIRONMENTAL';
    }

    return 'GENERAL';
}

/**
 * Build context-aware system prompt
 */
function buildSystemPrompt(topic: keyof typeof SYSTEM_PROMPTS, context: ChatContext): string {
    let prompt = SYSTEM_PROMPTS[topic];

    if (context.userProfile) {
        const { householdSize, dietaryPreferences, budgetRange, location } = context.userProfile;

        prompt += `\n\nUser Context:
- Household size: ${householdSize} ${householdSize === 1 ? 'person' : 'people'}
- Dietary preferences: ${dietaryPreferences.length > 0 ? dietaryPreferences.join(', ') : 'None specified'}
- Budget range: ${budgetRange}
${location ? `- Location: ${location}` : ''}

Use this context to personalize your responses.`;
    }

    return prompt;
}

/**
 * Get or create a chat session for the user
 */
async function getOrCreateSession(userId: string, sessionId?: string) {
    if (sessionId) {
        const session = await prisma.chatSession.findUnique({
            where: { id: sessionId },
            include: {
                messages: {
                    orderBy: { createdAt: 'asc' },
                    take: 20, // Last 20 messages for context
                },
            },
        });

        if (session && session.userId === userId) {
            return session;
        }
    }

    // Create new session
    return await prisma.chatSession.create({
        data: {
            userId,
            title: 'New Conversation',
        },
        include: {
            messages: true,
        },
    });
}

/**
 * Update session title based on first user message
 */
async function updateSessionTitle(sessionId: string, firstMessage: string) {
    const title = firstMessage.slice(0, 50) + (firstMessage.length > 50 ? '...' : '');
    await prisma.chatSession.update({
        where: { id: sessionId },
        data: { title },
    });
}

/**
 * Main chatbot service - handles conversation with context memory
 */
export async function chat(
    userMessage: string,
    context: ChatContext
): Promise<{ response: string; sessionId: string }> {
    try {
        // Get user profile for context
        const user = await prisma.user.findUnique({
            where: { id: context.userId },
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

        context.userProfile = {
            ...user,
            location: user.location || undefined
        };

        // Get or create session
        // @ts-ignore - Runtime check for model existence
        if (!prisma.chatSession) {
            throw new Error('ChatSession model not found. Please run "npx prisma generate" to update the Prisma client.');
        }

        const session = await getOrCreateSession(context.userId, context.sessionId);

        // Update title if this is the first message
        if (session.messages.length === 0) {
            await updateSessionTitle(session.id, userMessage);
        }

        // Detect topic
        const topic = detectTopic(userMessage);
        const systemPrompt = buildSystemPrompt(topic, context);

        // Build conversation history
        const history = session.messages.map((msg: any) => ({
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: msg.content }],
        }));

        // Initialize model
        const model = genAI.getGenerativeModel({
            model: MODELS.CHAT,
            systemInstruction: systemPrompt,
            generationConfig: GENERATION_CONFIG,
        });

        // Start chat with history
        const chatSession = model.startChat({
            history,
        });

        // Send message and get response
        const result = await chatSession.sendMessage(userMessage);
        const responseText = result.response.text();

        // Save user message
        await prisma.chatMessage.create({
            data: {
                sessionId: session.id,
                role: 'user',
                content: userMessage,
                metadata: { topic },
            },
        });

        // Save assistant response
        await prisma.chatMessage.create({
            data: {
                sessionId: session.id,
                role: 'assistant',
                content: responseText,
                metadata: { topic },
            },
        });

        return {
            response: responseText,
            sessionId: session.id,
        };
    } catch (error) {
        console.error('Chatbot error:', error);
        throw new Error(`Failed to process chat message: ${error instanceof Error ? error.message : String(error)}`);
    }
}

/**
 * Get chat history for a user
 */
export async function getChatHistory(userId: string, limit = 10) {
    const sessions = await prisma.chatSession.findMany({
        where: { userId },
        orderBy: { updatedAt: 'desc' },
        take: limit,
        include: {
            messages: {
                orderBy: { createdAt: 'asc' },
            },
        },
    });

    return sessions;
}

/**
 * Get a specific chat session
 */
export async function getChatSession(sessionId: string, userId: string) {
    const session = await prisma.chatSession.findFirst({
        where: {
            id: sessionId,
            userId,
        },
        include: {
            messages: {
                orderBy: { createdAt: 'asc' },
            },
        },
    });

    return session;
}

/**
 * Delete a chat session
 */
export async function deleteChatSession(sessionId: string, userId: string) {
    const session = await prisma.chatSession.findFirst({
        where: {
            id: sessionId,
            userId,
        },
    });

    if (!session) {
        throw new Error('Session not found');
    }

    await prisma.chatSession.delete({
        where: { id: sessionId },
    });

    return { success: true };
}
