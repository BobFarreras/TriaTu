// ARXIU: src/core/domain/entities/ShoppingSession.ts

// ✅ 1. Definim el tipus concret de l'objecte JSONB
export interface SnapshotItem {
    name: string;
    quantity: number;
    unit: string;
    emoji?: string;
    estimatedCost?: number;
    productId?: string;
    productImage?: string;
}

export interface ShoppingSessionProps {
    id: string;
    userId: string;
    createdAt: Date;
    totalCost: number;
    itemCount: number;
    // ✅ 2. Adeu 'any[]', hola 'SnapshotItem[]'
    itemsSnapshot: SnapshotItem[]; 
}

export class ShoppingSession {
    constructor(public readonly props: ShoppingSessionProps) {}
}