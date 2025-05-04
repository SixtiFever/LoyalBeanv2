// import { Cafe } from "@/types/User"
// import { ImagePickerResult } from "expo-image-picker";

import { Timestamp } from "firebase/firestore";

// export const isCafeObjectValid = async (cafe: Partial<Cafe>) => {
//     if (!cafe) return false;
//     if (Object.keys(cafe).length < 9) return false
//     for (let prop of Object.values(cafe)) {
//         if (!prop || prop === undefined) {
//             return false;
//         }
//     }
//     return true;
// }

export function extractDayMonthYear(date: Date): { day: number; month: number; year: number } {
    const day = date.getDate();
    const month = date.getMonth() + 1; // getMonth() returns 0-based index
    const year = date.getFullYear();
    return { day, month, year };
}

export function calculateDaysBetween(timestamp1: Timestamp, timestamp2: Timestamp): number {
    const date1 = timestamp1.toDate();
    const date2 = timestamp2.toDate();
  
    const millisecondsPerDay = 1000 * 60 * 60 * 24;
    const diffInMillis = Math.abs(date2.getTime() - date1.getTime());
    
    return Math.floor(diffInMillis / millisecondsPerDay);
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