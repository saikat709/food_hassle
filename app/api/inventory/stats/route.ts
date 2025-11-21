import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { calculateExpiryStatus } from '@/lib/inventory';

// GET /api/inventory/stats - Get inventory statistics
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession();

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get user from database
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Fetch all items for the user
        const items = await prisma.inventoryItem.findMany({
            where: { userId: user.id },
        });

        // Calculate statistics
        let expiringSoon = 0;
        let expired = 0;
        let totalValue = 0;
        const categoryCount: Record<string, number> = {};

        items.forEach((item: any) => {
            // Calculate expiry status
            const status = calculateExpiryStatus(item.expiryDate);
            if (status === 'expired') expired++;
            if (status === 'warning') expiringSoon++;

            // Calculate total value
            if (item.costPerUnit) {
                totalValue += Number(item.costPerUnit) * Number(item.quantity);
            }

            // Count by category
            categoryCount[item.category] = (categoryCount[item.category] || 0) + 1;
        });

        const stats = {
            totalItems: items.length,
            expiringSoon,
            expired,
            totalValue,
            categoryBreakdown: Object.entries(categoryCount).map(([category, count]) => ({
                category,
                count,
            })),
        };

        return NextResponse.json(stats);
    } catch (error: any) {
        console.error('[API /api/inventory/stats GET] Error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch inventory statistics', details: error.message },
            { status: 500 }
        );
    }
}
