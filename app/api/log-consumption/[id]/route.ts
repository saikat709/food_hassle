import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { UpdateConsumptionDTO } from '@/types/consumption';

// PUT /api/log-consumption/[id] - Update a consumption entry
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const body: UpdateConsumptionDTO = await request.json();

        // Check if consumption exists and belongs to user
        const existingConsumption = await prisma.consumption.findFirst({
            where: {
                id,
                userId: session.user.id,
            },
        });

        if (!existingConsumption) {
            return NextResponse.json({ error: 'Consumption not found' }, { status: 404 });
        }

        // Handle inventory adjustment if removedFromInventory status changed
        if (body.removedFromInventory !== undefined && body.removedFromInventory !== existingConsumption.removedFromInventory) {
            if (body.removedFromInventory) {
                // Find matching inventory item and reduce quantity
                const inventoryItem = await prisma.inventoryItem.findFirst({
                    where: {
                        userId: session.user.id,
                        name: {
                            contains: existingConsumption.itemName,
                            mode: 'insensitive',
                        },
                        unit: existingConsumption.unit,
                    },
                });

                if (inventoryItem) {
                    const newQuantity = Math.max(0, inventoryItem.quantity - existingConsumption.quantity);
                    await prisma.inventoryItem.update({
                        where: { id: inventoryItem.id },
                        data: { quantity: newQuantity },
                    });
                }
            } else {
                // If unchecking removeFromInventory, we could potentially add back to inventory
                // But this is complex, so we'll skip for now
            }
        }

        // Update consumption
        const updatedConsumption = await prisma.consumption.update({
            where: { id },
            data: {
                ...(body.itemName && { itemName: body.itemName }),
                ...(body.quantity !== undefined && { quantity: body.quantity }),
                ...(body.unit && { unit: body.unit }),
                ...(body.category !== undefined && { category: body.category }),
                ...(body.consumptionDate && { consumptionDate: new Date(body.consumptionDate) }),
                ...(body.consumptionTime !== undefined && { consumptionTime: body.consumptionTime }),
                ...(body.notes !== undefined && { notes: body.notes }),
                ...(body.removedFromInventory !== undefined && { removedFromInventory: body.removedFromInventory }),
            },
        });

        return NextResponse.json(updatedConsumption);
    } catch (error) {
        console.error('Error updating consumption:', error);
        return NextResponse.json(
            { error: 'Failed to update consumption' },
            { status: 500 }
        );
    }
}

// DELETE /api/log-consumption/[id] - Delete a consumption entry
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;

        // Check if consumption exists and belongs to user
        const existingConsumption = await prisma.consumption.findFirst({
            where: {
                id,
                userId: session.user.id,
            },
        });

        if (!existingConsumption) {
            return NextResponse.json({ error: 'Consumption not found' }, { status: 404 });
        }

        // If it was removed from inventory, we could potentially add it back
        // But this is complex, so we'll skip for now

        // Delete consumption
        await prisma.consumption.delete({
            where: { id },
        });

        return NextResponse.json({ message: 'Consumption deleted successfully' });
    } catch (error) {
        console.error('Error deleting consumption:', error);
        return NextResponse.json(
            { error: 'Failed to delete consumption' },
            { status: 500 }
        );
    }
}