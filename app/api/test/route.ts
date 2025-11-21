import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        // @ts-ignore
        const chatSessionCount = await prisma.chatSession.count();
        return NextResponse.json({
            success: true,
            message: 'Prisma is working',
            chatSessionCount
        });
    } catch (error) {
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : String(error)
        }, { status: 500 });
    }
}