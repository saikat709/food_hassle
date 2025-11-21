import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
    pool: Pool | undefined;
};

const connectionString = process.env.DATABASE_URL || '';

console.log('[Prisma] Initializing connection...');
console.log('[Prisma] Database URL:', connectionString.replace(/:[^:@]+@/, ':****@'));

// Create a connection pool with better timeout settings
const pool = globalForPrisma.pool ?? new Pool({
    connectionString,
    max: 5,
    idleTimeoutMillis: 60000,
    connectionTimeoutMillis: 60000,
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.pool = pool;

// Add pool error handler
pool.on('error', (err) => {
    console.error('[Prisma Pool] Unexpected error:', err);
});

pool.on('connect', () => {
    console.log('[Prisma Pool] New connection established');
});

const adapter = new PrismaPg(pool);

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ 
    adapter,
    log: [
        { level: 'query', emit: 'event' },
        { level: 'error', emit: 'stdout' },
        { level: 'warn', emit: 'stdout' },
    ],
});

// Log queries in development
if (process.env.NODE_ENV === 'development') {
    prisma.$on('query' as never, (e: any) => {
        console.log('[Prisma Query]:', e.query);
        console.log('[Prisma Params]:', e.params);
        console.log('[Prisma Duration]:', e.duration + 'ms');
    });
}

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

console.log('[Prisma] Client initialized successfully');