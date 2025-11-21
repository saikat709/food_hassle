import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { formatInventoryItem } from '@/lib/inventory';

// GET /api/inventory/[id] - Get single inventory item
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await getServerSession();

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const item = await prisma.inventoryItem.findFirst({
            where: {
                id: id,
                userId: user.id, // Ensure user can only access their own items
            },
        });

        if (!item) {
            return NextResponse.json({ error: 'Item not found' }, { status: 404 });
        }

        const formattedItem = formatInventoryItem({
            ...item,
            quantity: Number(item.quantity),
            costPerUnit: item.costPerUnit ? Number(item.costPerUnit) : null,
            purchaseDate: item.purchaseDate?.toISOString() || null,
            expiryDate: item.expiryDate?.toISOString() || null,
            createdAt: item.createdAt.toISOString(),
            updatedAt: item.updatedAt.toISOString(),
        });

        return NextResponse.json(formattedItem);
    } catch (error) {
        console.error('Error fetching inventory item:', error);
        return NextResponse.json(
            { error: 'Failed to fetch inventory item' },
            { status: 500 }
        );
    }
}

// PUT /api/inventory/[id] - Update inventory item
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await getServerSession();

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Check if item exists and belongs to user
        const existingItem = await prisma.inventoryItem.findFirst({
            where: {
                id: id,
                userId: user.id,
            },
        });

        if (!existingItem) {
            return NextResponse.json({ error: 'Item not found' }, { status: 404 });
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

        // Build update data
        const updateData: any = {};
        if (name !== undefined) updateData.name = name;
        if (quantity !== undefined) updateData.quantity = Number(quantity);
        if (unit !== undefined) updateData.unit = unit;
        if (category !== undefined) updateData.category = category;
        if (purchaseDate !== undefined) {
            updateData.purchaseDate = purchaseDate ? new Date(purchaseDate) : null;
        }
        if (expiryDate !== undefined) {
            updateData.expiryDate = expiryDate ? new Date(expiryDate) : null;
        }
        if (costPerUnit !== undefined) {
            updateData.costPerUnit = costPerUnit ? Number(costPerUnit) : null;
        }
        if (imageUrl !== undefined) updateData.imageUrl = imageUrl;

        // Update item
        const updatedItem = await prisma.inventoryItem.update({
            where: { id: id },
            data: updateData,
        });

        const formattedItem = formatInventoryItem({
            ...updatedItem,
            quantity: Number(updatedItem.quantity),
            costPerUnit: updatedItem.costPerUnit ? Number(updatedItem.costPerUnit) : null,
            purchaseDate: updatedItem.purchaseDate?.toISOString() || null,
            expiryDate: updatedItem.expiryDate?.toISOString() || null,
            createdAt: updatedItem.createdAt.toISOString(),
            updatedAt: updatedItem.updatedAt.toISOString(),
        });

        return NextResponse.json(formattedItem);
    } catch (error) {
        console.error('Error updating inventory item:', error);
        return NextResponse.json(
            { error: 'Failed to update inventory item' },
            { status: 500 }
        );
    }
}

// DELETE /api/inventory/[id] - Delete inventory item
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await getServerSession();

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Check if item exists and belongs to user
        const existingItem = await prisma.inventoryItem.findFirst({
            where: {
                id: id,
                userId: user.id,
            },
        });

        if (!existingItem) {
            return NextResponse.json({ error: 'Item not found' }, { status: 404 });
        }

        // Delete item
        await prisma.inventoryItem.delete({
            where: { id: id },
        });

        return NextResponse.json({ message: 'Item deleted successfully' });
    } catch (error) {
        console.error('Error deleting inventory item:', error);
        return NextResponse.json(
            { error: 'Failed to delete inventory item' },
            { status: 500 }
        );
    }
}
