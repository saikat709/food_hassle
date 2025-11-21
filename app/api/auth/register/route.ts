import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { registerSchema } from '@/lib/validation';

export async function POST(req: NextRequest) {
    try {
        console.log('Registration request received');
        console.log('DATABASE_URL set:', !!process.env.DATABASE_URL);
        const body = await req.json();
        console.log('Request body:', body);

        const validatedData = registerSchema.parse(body);
        console.log('Validated data:', validatedData);

        // Check for existing user
        const existingUser = await prisma.user.findUnique({
            where: { email: validatedData.email },
        });
        console.log('Existing user check:', existingUser ? 'User exists' : 'No existing user');

        if (existingUser) {
            return NextResponse.json(
                { error: 'User with this email already exists' },
                { status: 400 }
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(validatedData.password, 10);
        console.log('Password hashed successfully');

        // Create user
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
        console.log('User created:', user.id);

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

        // More specific error handling for Prisma
        if (error.code) {
            console.error('Prisma error code:', error.code);
            return NextResponse.json(
                { error: `Database error: ${error.code}` },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
