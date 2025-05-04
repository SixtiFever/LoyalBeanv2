import { Image } from "react-native-svg";
import { Geolocations } from "./Geolocations";

export interface User {
    id?: string;
    email?: string;
    password?: string;
}

export interface Customer extends User {
    username?: string;
    cafes?: string[],
}

export interface Cafe extends User {
    shopName: string;
    logo?: any;
    qrCode: string; // scannable qr code
    locations?: Geolocations;  // long lat address format
    addresses: string[];  // text addresses
    redeemCount: number;
    reward: string;
    customers?: string[],
}