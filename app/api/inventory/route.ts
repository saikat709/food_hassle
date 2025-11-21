import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { formatInventoryItem } from '@/lib/inventory';

// GET /api/inventory - Get all inventory items for authenticated user
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

        // Get query parameters
        const searchParams = request.nextUrl.searchParams;
        const category = searchParams.get('category');
        const search = searchParams.get('search');
        const sortBy = searchParams.get('sortBy') || 'createdAt';

        // Build where clause
        const where: any = { userId: user.id };

        if (category && category !== 'All') {
            where.category = category;
        }

        if (search) {
            where.name = {
                contains: search,
                mode: 'insensitive',
            };
        }

        // Fetch inventory items
        const items = await prisma.inventoryItem.findMany({
            where,
            orderBy: { [sortBy]: 'desc' },
        });

        // Format items with expiry status
        const formattedItems = items.map((item: any) => formatInventoryItem({
            ...item,
            quantity: Number(item.quantity),
            costPerUnit: item.costPerUnit ? Number(item.costPerUnit) : null,
            purchaseDate: item.purchaseDate?.toISOString() || null,
            expiryDate: item.expiryDate?.toISOString() || null,
            createdAt: item.createdAt.toISOString(),
            updatedAt: item.updatedAt.toISOString(),
        }));

        return NextResponse.json(formattedItems);
    } catch (error) {
        console.error('Error fetching inventory:', error);
        return NextResponse.json(
            { error: 'Failed to fetch inventory items' },
            { status: 500 }
        );
    }
}

// POST /api/inventory - Create new inventory item
export async function POST(request: NextRequest) {
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

        const body = await request.json();
        const {
            name,
            quantity,
            unit,
            category,
            purchaseDate,
            expiryDate,
            costPerUnit,
            imageUrl,
        } = body;

        // Validation
        if (!name || !quantity || !unit || !category) {
            return NextResponse.json(
                { error: 'Missing required fields: name, quantity, unit, category' },
                { status: 400 }
            );
        }

        // Create inventory item
        const item = await prisma.inventoryItem.create({
            data: {
                userId: user.id,
                name,
                quantity: Number(quantity),
                unit,
                category,
                purchaseDate: purchaseDate ? new Date(purchaseDate) : null,
                expiryDate: expiryDate ? new Date(expiryDate) : null,
                costPerUnit: costPerUnit ? Number(costPerUnit) : null,
                imageUrl: imageUrl || null,
            },
        });

        // Format and return
        const formattedItem = formatInventoryItem({
            ...item,
            quantity: Number(item.quantity),
            costPerUnit: item.costPerUnit ? Number(item.costPerUnit) : null,
            purchaseDate: item.purchaseDate?.toISOString() || null,
            expiryDate: item.expiryDate?.toISOString() || null,
            createdAt: item.createdAt.toISOString(),
            updatedAt: item.updatedAt.toISOString(),
        });

        return NextResponse.json(formattedItem, { status: 201 });
    } catch (error) {
        console.error('Error creating inventory item:', error);
        return NextResponse.json(
            { error: 'Failed to create inventory item' },
            { status: 500 }
        );
    }
}
