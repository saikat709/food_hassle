# Database Migration Instructions

## Run the following command to create the database tables for chatbot and meal planning:

```bash
npx prisma migrate dev --name add_chatbot_and_meal_planning
```

If you encounter PowerShell execution policy issues on Windows, use:

```powershell
powershell -ExecutionPolicy Bypass -Command "npx prisma migrate dev --name add_chatbot_and_meal_planning"
```

Or alternatively:

```bash
npx prisma db push
```

## After migration, generate the Prisma client:

```bash
npx prisma generate
```

## Verify the migration:

```bash
npx prisma studio
```

This will open Prisma Studio where you can see the new tables:
- chat_sessions
- chat_messages
- meal_plans
- meal_plan_items
