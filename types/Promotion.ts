import { Timestamp } from "firebase/firestore";

export type PromotionRecord = {
    promotionId: string;
    active: boolean;
    purchaseMilestone: number;
    reward: string;
    scans: number;  // total scans
    redeems: number;  // total redeeems
    startDateTimestamp: Timestamp;  // start date
    startDateFull: Date;
    startDateDay: number;
    startDateMonth: number;
    startDateYear: number;
    runLengthDays?: number;
    endDate?: Timestamp;
    endDateFull?: Date;
    endDateDay?: number;
    endDateMonth?: number;
    endDateYear?: number;
    interactions?: PromotionInteractions;
}


type PromotionInteractions = Record<string, {scans: number, redeems: number}>