import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { formatInventoryItem } from '@/lib/inventory';

// PUT /api/inventory/[id] - Update an inventory item
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
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

        const { id } = await params;
        const body = await request.json();
        const { name, quantity, unit, category, purchaseDate, expiryDate, costPerUnit, imageUrl } = body;

        // Check if item exists and belongs to user
        const existingItem = await prisma.inventoryItem.findFirst({
            where: {
                id,
                userId: user.id,
            },
        });

        if (!existingItem) {
            return NextResponse.json({ error: 'Inventory item not found' }, { status: 404 });
        }

        // Update the item
        const updatedItem = await prisma.inventoryItem.update({
            where: { id },
            data: {
                ...(name && { name }),
                ...(quantity !== undefined && { quantity: parseFloat(quantity) }),
                ...(unit && { unit }),
                ...(category && { category }),
                ...(purchaseDate !== undefined && { purchaseDate: purchaseDate ? new Date(purchaseDate) : null }),
                ...(expiryDate !== undefined && { expiryDate: expiryDate ? new Date(expiryDate) : null }),
                ...(costPerUnit !== undefined && { costPerUnit: costPerUnit ? parseFloat(costPerUnit) : null }),
                ...(imageUrl !== undefined && { imageUrl }),
            },
        });

        return NextResponse.json(formatInventoryItem(updatedItem as any));
    } catch (error) {
        console.error('[API /api/inventory/[id] PUT] Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// DELETE /api/inventory/[id] - Delete an inventory item
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
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

        const { id } = await params;

        // Check if item exists and belongs to user
        const existingItem = await prisma.inventoryItem.findFirst({
            where: {
                id,
                userId: user.id,
            },
        });

        if (!existingItem) {
            return NextResponse.json({ error: 'Inventory item not found' }, { status: 404 });
        }

        // Delete the item
        await prisma.inventoryItem.delete({
            where: { id },
        });

        return NextResponse.json({ message: 'Inventory item deleted successfully' });
    } catch (error) {
        console.error('[API /api/inventory/[id] DELETE] Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}