import { z } from 'zod';

// Validation schemas
export const registerSchema = z.object({
    fullName: z.string().min(2, 'Full name must be at least 2 characters'),
    email: z.string().trim().pipe(z.email().toLowerCase()),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
    householdSize: z.number().min(1).max(20),
    dietaryPreferences: z.array(z.string()),
    budgetRange: z.enum(['Low', 'Medium', 'High']),
    location: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
});

export const loginSchema = z.object({
    email: z.string().trim().pipe(z.email().toLowerCase()),
    password: z.string().min(1, 'Password is required'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

// Password strength checker
export const checkPasswordStrength = (password: string): {
    strength: 'weak' | 'medium' | 'strong';
    feedback: string;
} => {
    if (password.length < 8) {
        return { strength: 'weak', feedback: 'Too short' };
    }

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const score = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar].filter(Boolean).length;

    if (score <= 2) {
        return { strength: 'weak', feedback: 'Add uppercase, numbers, or special characters' };
    } else if (score === 3) {
        return { strength: 'medium', feedback: 'Good password' };
    } else {
        return { strength: 'strong', feedback: 'Strong password!' };
    }
};
