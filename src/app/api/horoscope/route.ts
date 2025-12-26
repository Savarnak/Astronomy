import { NextResponse } from 'next/server';

const GEO_API_URL = "https://json.freeastrologyapi.com/geo-details";
const VEDIC_API_URL = "https://json.freeastrologyapi.com/planets";
// Hardcoded for reliability during demo
const API_KEY = "54oM8b9OejaYzebF4uL423YHziSRRfKO4AcdmlGP";

// --- Helper Functions ---

// 1. Nakshatras (Stars) in Tamil
const NAKSHATRAS = [
    "அசுவினி (Ashwini)", "பரணி (Bharani)", "கார்த்திகை (Krittika)",
    "ரோகிணி (Rohini)", "மிருகசீரிடம் (Mrigashirsha)", "திருவாதிரை (Ardra)",
    "புனர்பூசம் (Punarvasu)", "பூசம் (Pushya)", "ஆயில்யம் (Ashlesha)",
    "மகம் (Magha)", "பூரம் (Purva Phalguni)", "உத்திரம் (Uttara Phalguni)",
    "அஸ்தம் (Hasta)", "சித்திரை (Chitra)", "சுவாதி (Swati)",
    "விசாகம் (Vishakha)", "அனுஷம் (Anuradha)", "கேட்டை (Jyeshtha)",
    "மூலம் (Mula)", "பூராடம் (Purva Ashadha)", "உத்திராடம் (Uttara Ashadha)",
    "திருவோணம் (Shravana)", "அவிட்டம் (Dhanishta)", "சதயம் (Shatabhisha)",
    "பூரட்டாதி (Purva Bhadrapada)", "உத்திரட்டாதி (Uttara Bhadrapada)", "ரேவதி (Revati)"
];

// Tamil equivalents can be mapped here if needed, or stick to transliterated names
const RASI_NAMES_TAMIL = [
    "", // 0-indexed padding
    "மேஷம் (Mesham)", // Aries
    "ரிஷபம் (Rishabam)", // Taurus
    "மிதுனம் (Mithunam)", // Gemini
    "கடகம் (Katagam)", // Cancer
    "சிம்மம் (Simmam)", // Leo
    "கன்னி (Kanni)", // Virgo
    "துலாம் (Thulaam)", // Libra
    "விருச்சிகம் (Viruchigam)", // Scorpio
    "தனுசு (Dhanusu)", // Sagittarius
    "மகரம் (Makaram)", // Capricorn
    "கும்பம் (Kumbam)", // Aquarius
    "மீனம் (Meenam)" // Pisces
];

function getNakshatra(longitude: number): string {
    // 360 degrees / 27 stars = 13.3333 degrees per star
    const starIndex = Math.floor(longitude / 13.33333333);
    return NAKSHATRAS[starIndex] || "Unknown";
}

function getRasiName(signNumber: number): string {
    return RASI_NAMES_TAMIL[signNumber] || "Unknown";
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, dob, tob, birthPlace } = body;

        console.log("API Request:", { name, dob, tob, birthPlace });

        if (!name || !dob || !tob || !birthPlace) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // 1. Geocoding
        const geoRes = await fetch(GEO_API_URL, {
            method: 'POST',
            headers: {
                "x-api-key": API_KEY,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ location: birthPlace })
        });

        if (!geoRes.ok) {
            const errText = await geoRes.text();
            console.error(`Geo API Error (${geoRes.status}):`, errText);
            return NextResponse.json({ error: `Failed to fetch location details: ${geoRes.status}` }, { status: 500 });
        }

        const geoData = await geoRes.json();

        // Handle "No Location found" array response
        if (Array.isArray(geoData) && geoData.length === 0) {
            return NextResponse.json({ error: "Location not found. Try a major city name only." }, { status: 404 });
        }

        if (geoData.error) {
            return NextResponse.json({ error: `Location error: ${JSON.stringify(geoData.error)}` }, { status: 404 });
        }

        const placeData = Array.isArray(geoData) ? geoData[0] : (geoData.data && geoData.data[0]) || geoData;

        if (!placeData || !placeData.latitude) {
            console.error("Invalid Geo Data structure:", geoData);
            return NextResponse.json({ error: "Invalid location data structure" }, { status: 500 });
        }

        const lat = placeData.latitude;
        const lon = placeData.longitude;

        if (!lat || !lon) {
            return NextResponse.json({ error: "Invalid coordinates received" }, { status: 500 });
        }

        // 2. Prepare Date/Time for Vedic API
        const [year, month, day] = dob.split('-').map(Number);
        const [hour, devMin] = tob.split(':').map(Number);

        // 3. Vedic API Call
        const payload = {
            year,
            month,
            date: day,
            hours: hour,
            minutes: devMin,
            seconds: 0,
            latitude: parseFloat(lat),
            longitude: parseFloat(lon),
            timezone: 5.5, // Standard for India
            config: {
                observation_point: "topocentric",
                ayanamsha: "lahiri"
            }
        };

        const vedicRes = await fetch(VEDIC_API_URL, {
            method: 'POST',
            headers: {
                "x-api-key": API_KEY,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        if (!vedicRes.ok) {
            const errText = await vedicRes.text();
            console.error("Vedic API Error:", errText);
            return NextResponse.json({ error: "Failed to calculate horoscope" }, { status: 500 });
        }

        const vedicData = await vedicRes.json();

        // 4. Data Extraction & Helper Mapping
        // API output is often: [ { '0': ..., '1': ... }, { 'Ascendant': ..., 'Sun': ... } ]
        // We want the object keyed by Planet Names ("Ascendant", "Moon").

        let planets: any = {};
        const rawOutput = vedicData.output || vedicData;

        if (Array.isArray(rawOutput)) {
            // Find the element that has "Ascendant" key
            const found = rawOutput.find(item => item["Ascendant"] || item.Ascendant);
            if (found) {
                planets = found;
            } else {
                // Fallback: Use the first element and iterate keys? No, likely structure implies finding the right object.
                // Or maybe it's the second element specifically.
                planets = rawOutput.length > 1 ? rawOutput[1] : rawOutput[0];
            }
        } else {
            planets = rawOutput;
        }

        const ascendant = planets["Ascendant"];
        const moon = planets["Moon"];

        if (!ascendant || !moon) {
            console.error("Missing planet data in response:", planets);
            return NextResponse.json({ error: "Incomplete astrological data received" }, { status: 500 });
        }

        // Map Values
        const rasiName = getRasiName(moon.current_sign);
        const lagnamName = getRasiName(ascendant.current_sign);

        // Calculate Star from Moon's Full Degree
        const moonLongitude = moon.fullDegree;
        const starName = getNakshatra(moonLongitude);

        return NextResponse.json({
            name,
            raasi: rasiName,
            natchathiram: starName,
            lagnam: lagnamName,
            latitude: `${lat}`,
            longitude: `${lon}`,
            raw_response: planets // For debugging
        });

    } catch (error: any) {
        console.error("API Route Error:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}
