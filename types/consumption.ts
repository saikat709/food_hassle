export interface Consumption {
    id: string;
    userId: string;
    itemName: string;
    quantity: number;
    unit: string;
    category?: string;
    consumptionDate: string;
    consumptionTime?: string;
    notes?: string;
    removedFromInventory: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateConsumptionDTO {
    itemName: string;
    quantity: number;
    unit: string;
    category?: string;
    consumptionDate: string;
    consumptionTime?: string;
    notes?: string;
    removedFromInventory?: boolean;
}

export interface UpdateConsumptionDTO {
    itemName?: string;
    quantity?: number;
    unit?: string;
    category?: string;
    consumptionDate?: string;
    consumptionTime?: string;
    notes?: string;
    removedFromInventory?: boolean;
}

export interface ConsumptionFilters {
    startDate?: string;
    endDate?: string;
    category?: string;
    itemName?: string;
    removedFromInventory?: boolean;
}

export interface ConsumptionStats {
    totalConsumptions: number;
    totalItemsConsumed: number;
    categoriesBreakdown: {
        category: string;
        count: number;
        totalQuantity: number;
    }[];
    mostConsumedItems: {
        itemName: string;
        count: number;
        totalQuantity: number;
    }[];
}