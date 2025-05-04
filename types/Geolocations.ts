import { LocationGeocodedLocation } from "expo-location";

export type Geolocations = Record<string, Geolocation>

export type Geolocation = { lat: number, lon: number }