import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { registerSchema } from '@/lib/validation';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const validatedData = registerSchema.parse(body);
        const existingUser = await prisma.user.findUnique({
            where: { email: validatedData.email },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: 'User with this email already exists' },
                { status: 400 }
            );
        }
        const hashedPassword = await bcrypt.hash(validatedData.password, 10);
        const user = await prisma.user.create({
            data: {
                email: validatedData.email,
                password: hashedPassword,
                fullName: validatedData.fullName,
                householdSize: validatedData.householdSize,
                dietaryPreferences: validatedData.dietaryPreferences,
                budgetRange: validatedData.budgetRange,
                location: validatedData.location || null,
            },
        });
        const { password: _, ...userWithoutPassword } = user;

        return NextResponse.json(
            {
                message: 'User registered successfully',
                user: userWithoutPassword
            },
            { status: 201 }
        );
    } catch (error: any) {
        console.error('Registration error:', error);

        if (error.name === 'ZodError') {
            return NextResponse.json(
                { error: 'Validation failed', details: error.errors },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
