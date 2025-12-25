export interface HoroscopeFormData {
    name: string;
    dob: string;
    tob: string;
    birthPlace: string;
}

export interface HoroscopeResult {
    name: string;
    raasi: string;
    natchathiram: string;
    lagnam: string;
    latitude: string;
    longitude: string;
}

export interface Message {
    id: number;
    sender: "bot" | "user";
    text?: string;
    isResult?: boolean;
    resultData?: HoroscopeResult | null;
}
