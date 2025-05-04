import { Cafe } from "./User";

//  loyalty card cafe object
export interface CafeObject extends Partial<Cafe> {
    currentScans?: number;
    totalScans?: number;
    reward?: string;
    redeems?: number;
    customerRank?: string;
    loyaltyLevel?: string;
}