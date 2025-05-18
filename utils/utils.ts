// import { Cafe } from "@/types/User"
// import { ImagePickerResult } from "expo-image-picker";

import { Card } from "@/types/Card";
import { DashboardMenuOption } from "@/types/DashboardMenuOption";
import { PromotionInteractions, PromotionRecord } from "@/types/Promotion";
import { Timestamp } from "firebase/firestore";

export function sortCardsByLatestUpdate(cards: Card[]): Card[] {
    return [...cards].sort((a, b) => {
        const dateA = a.dateCardUpdated.toMillis(); // or toDate().getTime()
        const dateB = b.dateCardUpdated.toMillis();
        return dateB - dateA; // latest first
    });
}

export const getSelectedOption = ( options: DashboardMenuOption[] ): DashboardMenuOption => {
    const selectedOption: DashboardMenuOption[] = options.filter((option) => option.selected === true);
    return selectedOption[0];
}

export function extractDayMonthYear(date: Date): { day: number; month: number; year: number } {
    const day = date.getDate();
    const month = date.getMonth() + 1; // getMonth() returns 0-based index
    const year = date.getFullYear();
    return { day, month, year };
}

export const filterActivePromotion = (promotions: Record<string, PromotionRecord>): PromotionRecord | undefined => {
    for (const key in promotions) {
        if ( promotions[key].active ) {
            return promotions[key]
        }
    }
    return undefined;
}

export function calculateDaysBetween(timestamp1: Timestamp, timestamp2: Timestamp): number {
    const date1 = timestamp1.toDate();
    const date2 = timestamp2.toDate();
  
    const millisecondsPerDay = 1000 * 60 * 60 * 24;
    const diffInMillis = Math.abs(date2.getTime() - date1.getTime());
    
    return Math.floor(diffInMillis / millisecondsPerDay) <= 0 ? 1 : Math.floor(diffInMillis / millisecondsPerDay);
  }

  export function calculatePerDayStat(promotion: PromotionRecord, daysRun: number): void | {scansPerDay: number, redeemsPerDay: number} {
    if ( !promotion.interactions ) return;
    let scans: number = 0;
    let redeems: number = 0;
    const interactions: PromotionInteractions = promotion.interactions;
    for (let key in interactions) {
        scans += interactions[key].scans;
        redeems += interactions[key].redeems;
    }
    scans  /= daysRun;
    redeems /= daysRun;
    return {scansPerDay: scans, redeemsPerDay: redeems}
  }

export const splitPattern: string = '-%-%-';

export enum BeanType {
    'King Bean',
    'Queen Bean',
    'Royal Bean',
    'Loyal Bean',
    'Cool Bean',
    'Normal Bean',
    'Stranger Bean',
    'Green Bean'
}