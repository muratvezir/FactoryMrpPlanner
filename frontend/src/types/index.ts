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
    billOfMaterials?: BomLine[];
}

export interface BomLine {
    id?: number;
    parentItemCode: string;
    childItemCode: string;
    quantity: number;
    scrapRate: number;
}

export const DemandType = {
    Order: 0,
    Forecast: 1
} as const;

export type DemandType = typeof DemandType[keyof typeof DemandType];

export interface Demand {
    id?: number;
    itemCode: string;
    dueDate: string;
    quantity: number;
    type: DemandType;
    sourceId?: string;
}

export const ActionType = {
    Make: 0,
    Buy: 1
} as const;

export type ActionType = typeof ActionType[keyof typeof ActionType];

export const ExceptionType = {
    Shortage: 0,
    LateDemand: 1,
    CapacityOverflow: 2
} as const;

export type ExceptionType = typeof ExceptionType[keyof typeof ExceptionType];

export interface Suggestion {
    id: number;
    itemCode: string;
    action: ActionType;
    startDate: string;
    endDate: string;
    quantity: number;
    peggingInfo: string;
}

export interface PlanningException {
    itemCode: string;
    type: ExceptionType;
    message: string;
    affectedDate?: string;
}

export interface MrpInput {
    items: Item[];
    demands: Demand[];
}

export interface MrpResult {
    planId: string;
    generatedAt: string;
    suggestions: Suggestion[];
    exceptions: PlanningException[];
}
