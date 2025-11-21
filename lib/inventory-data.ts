import { InventoryItem } from "@prisma/client";
import { InventoryItemWithStatus } from "@/types/inventory";
import { formatInventoryItem } from "./inventory";

const baseItems: Omit<InventoryItem, 'id' | 'userId' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: 'Organic Apples',
    category: 'Fruits',
    quantity: 10,
    unit: 'pcs',
    purchaseDate: new Date('2025-11-15T00:00:00.000Z'),
    expiryDate: new Date('2025-11-30T00:00:00.000Z'),
    costPerUnit: 0.5,
    imageUrl: null,
  },
  {
    name: 'Whole Milk',
    category: 'Dairy',
    quantity: 1,
    unit: 'gallon',
    purchaseDate: new Date('2025-11-20T00:00:00.000Z'),
    expiryDate: new Date('2025-11-25T00:00:00.000Z'),
    costPerUnit: 3.5,
    imageUrl: null,
  },
  {
    name: 'Sourdough Bread',
    category: 'Bakery',
    quantity: 1,
    unit: 'loaf',
    purchaseDate: new Date('2025-11-18T00:00:00.000Z'),
    expiryDate: new Date('2025-11-22T00:00:00.000Z'),
    costPerUnit: 4.0,
    imageUrl: null,
  },
  {
    name: 'Chicken Breast',
    category: 'Meat',
    quantity: 2,
    unit: 'lbs',
    purchaseDate: new Date('2025-11-19T00:00:00.000Z'),
    expiryDate: new Date('2025-11-24T00:00:00.000Z'),
    costPerUnit: 8.0,
    imageUrl: null,
  },
];

// Create full sample items and format them
export const sampleInventoryItems: InventoryItemWithStatus[] = baseItems.map((item, index) => {
    const fullItem: InventoryItem = {
        ...item,
        id: `clx_mock_${index}`,
        userId: 'mock_user_id',
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    // The formatInventoryItem function expects date strings, not Date objects.
    return formatInventoryItem({
        ...fullItem,
        purchaseDate: fullItem.purchaseDate?.toISOString() || null,
        expiryDate: fullItem.expiryDate?.toISOString() || null,
    } as any);
});


export const sampleInventoryStats = {
  totalItems: 4,
  expiringSoon: 2,
  expired: 1,
  totalValue: 42.5,
  categoryBreakdown: [
    { category: 'Fruits', count: 1 },
    { category: 'Dairy', count: 1 },
    { category: 'Bakery', count: 1 },
    { category: 'Meat', count: 1 },
  ],
};
