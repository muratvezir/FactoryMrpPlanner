export enum ItemType {
    RawMaterial = 0,
    SemiFinished = 1,
    Finished = 2
}

export interface Item {
    code: string;
    type: ItemType;
    onHand: number;
    leadTimeDays: number;
    minOrderQty: number;
    safetyStock: number;
    billOfMaterials?: BomLine[];
}

export interface BomLine {
    childItemCode: string;
    quantity: number;
    scrapRate: number;
}
