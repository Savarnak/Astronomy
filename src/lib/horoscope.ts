import { HoroscopeFormData, HoroscopeResult } from "@/types";

export async function getHoroscope(data: HoroscopeFormData): Promise<HoroscopeResult> {

    // Call the Internal Next.js API Route which talks to External APIs
    const response = await fetch('/api/horoscope', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch horoscope data");
    }

    const result = await response.json();

    // Ensure the result matches the interface
    return {
        name: result.name,
        raasi: result.raasi,
        natchathiram: result.natchathiram,
        lagnam: result.lagnam,
        latitude: result.latitude,
        longitude: result.longitude
    };
}
