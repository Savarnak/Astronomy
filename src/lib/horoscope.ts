import { HoroscopeFormData, HoroscopeResult } from "@/types";

export async function getHoroscope(data: HoroscopeFormData): Promise<HoroscopeResult> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Mock response with Tamil labels as per requirements (or just data).
    // The requirements say "assume this function returns structured horoscope data".
    // The display should be in Tamil. I'll return the data in Tamil or English and formatting will handle it.
    // The example output shows the LABELS in Tamil, and presumably value.
    // I will return the values in Tamil script where appropriate for realism.

    return {
        name: data.name,
        raasi: "மேஷம் (Mesham)", // Example
        natchathiram: "அசுவினி (Ashwini)", // Example
        lagnam: "சிம்மம் (Simmam)", // Example
        latitude: "13.0827° N",
        longitude: "80.2707° E"
    };
}
