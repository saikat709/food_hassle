# Authentication System Setup Guide

## 🎉 What's Been Implemented

Your authentication system has been completely revamped with:

### ✨ Features
- **Stunning UI Design**: Modern split-screen layout with animated gradients, glassmorphism effects, and smooth transitions
- **Email/Password Authentication**: Secure login and registration using NextAuth credentials provider
- **Comprehensive User Data**: Collects all required information:
  - Full name
  - Email (with validation)
  - Password (with strength indicator)
  - Household size (1-10+ people)
  - Dietary preferences (multi-select)
  - Budget range (Low/Medium/High)
  - Location (optional)
- **Security**: Passwords hashed with bcrypt (10 rounds)
- **Database**: PostgreSQL with Prisma ORM
- **Validation**: Client-side and server-side validation with Zod
- **UX Enhancements**:
  - Password show/hide toggle
  - Real-time password strength indicator
  - Smooth tab switching between login/register
  - Loading states with spinners
  - Success/error messages with animations
  - Auto-login after registration

## 🚀 Setup Instructions

### 1. Configure Environment Variables

You need to update your `.env.local` file with the following variables:

```bash
# Database - Update with your PostgreSQL credentials
DATABASE_URL="postgresql://username:password@localhost:5432/food_hassle?schema=public"

# NextAuth - Generate a secret key
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
```

**To generate a secure NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### 2. Set Up PostgreSQL Database

Make sure you have PostgreSQL installed and running. Then create the database:

```bash
# Login to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE food_hassle;

# Exit
\q
```

### 3. Run Database Migrations

Push the Prisma schema to your database:

```bash
npx prisma db push
```

This will create the `users` table with all the required fields.

### 4. (Optional) View Database with Prisma Studio

To view and manage your database visually:

```bash
npx prisma studio
```

This will open a browser interface at `http://localhost:5555`

### 5. Start the Development Server

```bash
npm run dev
```

Visit `http://localhost:3000/auth` to see your stunning new authentication page!

## 📁 Files Created/Modified

### Backend Files
- `prisma/schema.prisma` - Database schema with User model
- `prisma/prisma.config.ts` - Prisma 7 configuration
- `lib/prisma.ts` - Prisma client singleton
- `lib/validation.ts` - Zod validation schemas and password strength checker
- `app/api/auth/register/route.ts` - Registration endpoint
- `app/api/auth/[...nextauth]/route.ts` - NextAuth configuration with credentials provider

### Frontend Files
- `app/auth/page.tsx` - Stunning authentication page with login/register forms

## 🎨 Design Features

The new auth page includes:

1. **Left Panel** (Desktop):
   - Animated gradient background
   - Floating animated shapes
   - Brand logo and tagline
   - Feature highlights with checkmarks
   - Background image with overlay

2. **Right Panel**:
   - Glassmorphism tab switcher
   - Smooth form transitions
   - Icon-enhanced input fields
   - Password strength indicator
   - Multi-select dietary preferences
   - Responsive design (mobile-friendly)

## 🔒 Security Features

- ✅ Passwords hashed with bcrypt (10 rounds)
- ✅ JWT-based session management
- ✅ Email uniqueness validation
- ✅ Password length validation (minimum 8 characters)
- ✅ Password strength feedback
- ✅ Secure httpOnly cookies
- ✅ Server-side validation with Zod

## 🧪 Testing the System

### Test Registration:
1. Go to `/auth`
2. Click "Register" tab
3. Fill in all required fields
4. Click "Create Account"
5. You should be auto-logged in and redirected to `/dashboard`

### Test Login:
1. Go to `/auth`
2. Click "Login" tab
3. Enter your registered email and password
4. Click "Sign In"
5. You should be redirected to `/dashboard`

## 📊 Database Schema

```prisma
model User {
  id                  String   @id @default(cuid())
  email               String   @unique
  password            String
  fullName            String
  householdSize       Int      @default(1)
  dietaryPreferences  String[] @default([])
  budgetRange         String   @default("Medium")
  location            String?
  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt
}
```

## 🐛 Troubleshooting

### "Database connection error"
- Make sure PostgreSQL is running
- Check your DATABASE_URL in `.env.local`
- Verify database exists: `psql -U postgres -l`

### "NEXTAUTH_SECRET is not defined"
- Make sure you've added NEXTAUTH_SECRET to `.env.local`
- Generate one with: `openssl rand -base64 32`

### "Prisma Client not found"
- Run: `npx prisma generate`

### "Table doesn't exist"
- Run: `npx prisma db push`

## 🎯 Next Steps

After setup, you can:
1. Test the registration and login flows
2. Customize the color scheme in `globals.css`
3. Add password reset functionality
4. Add email verification
5. Implement session management in protected routes

## 💡 Tips

- The password strength indicator encourages users to create strong passwords
- Dietary preferences support multiple selections
- All form fields have proper validation and error messages
- The UI is fully responsive and works on mobile devices
- Smooth animations enhance the user experience without being distracting

Enjoy your new authentication system! 🎉
