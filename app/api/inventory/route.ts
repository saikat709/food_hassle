import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { formatInventoryItem } from '@/lib/inventory';

// GET /api/inventory - Get all inventory items for authenticated user
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession();
        if (!session || !session.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const searchParams = request.nextUrl.searchParams;
        const category = searchParams.get('category');
        const search = searchParams.get('search');
        const sortBy = searchParams.get('sortBy') || 'expiryDate'; // Default sort by expiry
        const order = searchParams.get('order') || 'asc'; // Default ascending (soonest first)

        const where: any = {
            userId: user.id,
        };

        if (category && category !== 'All') {
            where.category = category;
        }

        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
            ];
        }

        const items = await prisma.inventoryItem.findMany({
            where,
            orderBy: {
                [sortBy]: order,
            },
        });

        // Calculate expiry status for each item
        const itemsWithStatus = items.map((item: any) => formatInventoryItem(item));

        return NextResponse.json(itemsWithStatus);
    } catch (error) {
        console.error('[API /api/inventory GET] Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// POST /api/inventory - Create new inventory item
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession();
        if (!session || !session.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const body = await request.json();
        const { name, quantity, unit, category, purchaseDate, expiryDate, costPerUnit, imageUrl } = body;

        // Validate required fields
        if (!name || !quantity || !unit || !category) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const item = await prisma.inventoryItem.create({
            data: {
                userId: user.id,
                name,
                quantity: parseFloat(quantity),
                unit,
                category,
                purchaseDate: purchaseDate ? new Date(purchaseDate) : null,
                expiryDate: expiryDate ? new Date(expiryDate) : null,
                costPerUnit: costPerUnit ? parseFloat(costPerUnit) : null,
                imageUrl: imageUrl || null,
            },
        });

        return NextResponse.json(formatInventoryItem(item as any), { status: 201 });
    } catch (error) {
        console.error('[API /api/inventory POST] Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
