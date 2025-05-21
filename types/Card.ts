import { BeanType } from "@/utils/utils";
import { Timestamp } from "firebase/firestore";

export type Card = {
    userId: string;
    cafeId: string;
    userEmail: string;
    reward: string;
    currentCount: number;
    countRequiredRedeem: number;
    totalScanCount: number;
    totalRedeemCount: number;
    ranking: number;
    dateCardCreated: Timestamp;
    dateCardUpdated: Timestamp; // last scan date
    logoUri: string;
    beanType: BeanType;
    beanIconUri: string;
    pendingRedeems?: PromotionRedeem;
    cafeName: string;
    archivedRedeems?: PromotionRedeem;
}

export type PromotionRedeem = Record<string, {reward: string}>