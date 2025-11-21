import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { CreateConsumptionDTO, ConsumptionFilters } from '@/types/consumption';

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const filters: ConsumptionFilters = {};

        // Parse query parameters
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');
        const category = searchParams.get('category');
        const itemName = searchParams.get('itemName');
        const removedFromInventory = searchParams.get('removedFromInventory');

        if (startDate) filters.startDate = startDate;
        if (endDate) filters.endDate = endDate;
        if (category) filters.category = category;
        if (itemName) filters.itemName = itemName;
        if (removedFromInventory !== null) {
            filters.removedFromInventory = removedFromInventory === 'true';
        }

        // Build where clause
        const where: any = {
            userId: session.user.id,
        };

        if (filters.startDate || filters.endDate) {
            where.consumptionDate = {};
            if (filters.startDate) {
                where.consumptionDate.gte = new Date(filters.startDate);
            }
            if (filters.endDate) {
                where.consumptionDate.lte = new Date(filters.endDate);
            }
        }

        if (filters.category) {
            where.category = filters.category;
        }

        if (filters.itemName) {
            where.itemName = {
                contains: filters.itemName,
                mode: 'insensitive',
            };
        }

        if (filters.removedFromInventory !== undefined) {
            where.removedFromInventory = filters.removedFromInventory;
        }

        const consumptions = await prisma.consumption.findMany({
            where,
            orderBy: {
                consumptionDate: 'desc',
                createdAt: 'desc',
            },
        });

        return NextResponse.json(consumptions);
    } catch (error) {
        console.error('Error fetching consumptions:', error);
        return NextResponse.json(
            { error: 'Failed to fetch consumption history' },
            { status: 500 }
        );
    }
}

// POST /api/log-consumption - Create new consumption record
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body: CreateConsumptionDTO = await request.json();

        // Validate required fields
        if (!body.itemName || !body.quantity || !body.unit || !body.consumptionDate) {
            return NextResponse.json(
                { error: 'Missing required fields: itemName, quantity, unit, consumptionDate' },
                { status: 400 }
            );
        }

        // If removeFromInventory is true, update inventory
        if (body.removedFromInventory) {
            // Find matching inventory item
            const inventoryItem = await prisma.inventoryItem.findFirst({
                where: {
                    userId: session.user.id,
                    name: {
                        contains: body.itemName,
                        mode: 'insensitive',
                    },
                    unit: body.unit,
                },
            });

            if (inventoryItem) {
                // Reduce inventory quantity
                const newQuantity = Math.max(0, inventoryItem.quantity - body.quantity);
                await prisma.inventoryItem.update({
                    where: { id: inventoryItem.id },
                    data: { quantity: newQuantity },
                });
            }
        }

        // Create consumption record
        const consumption = await prisma.consumption.create({
            data: {
                userId: session.user.id,
                itemName: body.itemName,
                quantity: body.quantity,
                unit: body.unit,
                category: body.category,
                consumptionDate: new Date(body.consumptionDate),
                consumptionTime: body.consumptionTime,
                notes: body.notes,
                removedFromInventory: body.removedFromInventory || false,
            },
        });

        return NextResponse.json(consumption, { status: 201 });
    } catch (error) {
        console.error('Error creating consumption:', error);
        return NextResponse.json(
            { error: 'Failed to log consumption' },
            { status: 500 }
        );
    }
}