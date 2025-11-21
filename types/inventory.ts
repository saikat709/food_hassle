export interface InventoryItem {
    id: string;
    userId: string;
    name: string;
    quantity: number;
    unit: string;
    category: string;
    purchaseDate: string | null;
    expiryDate: string | null;
    costPerUnit: number | null;
    imageUrl: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface CreateInventoryItemDTO {
    name: string;
    quantity: number;
    unit: string;
    category: string;
    purchaseDate?: string;
    expiryDate?: string;
    costPerUnit?: number;
    imageUrl?: string;
}

export interface UpdateInventoryItemDTO {
    name?: string;
    quantity?: number;
    unit?: string;
    category?: string;
    purchaseDate?: string | null;
    expiryDate?: string | null;
    costPerUnit?: number | null;
    imageUrl?: string | null;
}

export type ExpiryStatus = 'expired' | 'warning' | 'good';

export interface InventoryItemWithStatus extends InventoryItem {
    status: ExpiryStatus;
    daysUntilExpiry: number | null;
    expiryLabel: string;
}

export interface InventoryStats {
    totalItems: number;
    expiringSoon: number;
    expired: number;
    totalValue: number;
    categoryBreakdown: {
        category: string;
        count: number;
    }[];
}
