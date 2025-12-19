export const ItemType = {
    RawMaterial: 0,
    WorkInProgress: 1,
    FinishedGood: 2
} as const;

export type ItemType = typeof ItemType[keyof typeof ItemType];

export interface Item {
    id?: number;
    code: string;
    type: ItemType;
    onHand: number;
    leadTimeDays: number;
    minOrderQty: number;
    safetyStock: number;
    lowLevelCode: number;
}

export interface BomLine {
    id?: number;
    parentItemCode: string;
    childItemCode: string;
    quantity: number;
    scrapRate: number;
}
