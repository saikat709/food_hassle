import { ExpiryStatus, InventoryItem, InventoryItemWithStatus } from '@/types/inventory';

/**
 * Calculate the number of days until an item expires
 */
export function calculateDaysUntilExpiry(expiryDate: string | Date | null): number | null {
    if (!expiryDate) return null;

    const expiry = new Date(expiryDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    expiry.setHours(0, 0, 0, 0);

    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
}

/**
 * Determine the expiry status of an item
 */
export function calculateExpiryStatus(expiryDate: string | Date | null): ExpiryStatus {
    const daysUntilExpiry = calculateDaysUntilExpiry(expiryDate);

    if (daysUntilExpiry === null) return 'good';
    if (daysUntilExpiry < 0) return 'expired';
    if (daysUntilExpiry <= 3) return 'warning';

    return 'good';
}

/**
 * Get a human-readable expiry label
 */
export function getExpiryLabel(expiryDate: string | Date | null): string {
    const daysUntilExpiry = calculateDaysUntilExpiry(expiryDate);

    if (daysUntilExpiry === null) return 'No expiry date';
    if (daysUntilExpiry < 0) return 'Expired';
    if (daysUntilExpiry === 0) return 'Expires today';
    if (daysUntilExpiry === 1) return '1 day';
    if (daysUntilExpiry <= 7) return `${daysUntilExpiry} days`;
    if (daysUntilExpiry <= 14) return '1 week';
    if (daysUntilExpiry <= 30) return `${Math.ceil(daysUntilExpiry / 7)} weeks`;

    return `${Math.ceil(daysUntilExpiry / 30)} months`;
}

/**
 * Format an inventory item with calculated status and expiry info
 */
export function formatInventoryItem(item: InventoryItem): InventoryItemWithStatus {
    const daysUntilExpiry = calculateDaysUntilExpiry(item.expiryDate);
    const status = calculateExpiryStatus(item.expiryDate);
    const expiryLabel = getExpiryLabel(item.expiryDate);

    return {
        ...item,
        status,
        daysUntilExpiry,
        expiryLabel,
    };
}

/**
 * Get emoji for category
 */
export function getCategoryEmoji(category: string): string {
    const categoryMap: Record<string, string> = {
        dairy: '🥛',
        vegetables: '🥬',
        fruits: '🍎',
        meat: '🥩',
        bakery: '🍞',
        pantry: '📦',
        beverages: '🥤',
        snacks: '🍿',
    };

    return categoryMap[category.toLowerCase()] || '📦';
}
