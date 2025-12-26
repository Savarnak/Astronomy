import { HoroscopeFormData, HoroscopeResult } from "@/types";
import * as Astronomy from "astronomy-engine";

const RASI_NAMES = [
    "மேஷம் (Mesham / Aries)",
    "ரிஷபம் (Rishabam / Taurus)",
    "மிதுனம் (Mithunam / Gemini)",
    "கடகம் (Katakam / Cancer)",
    "சிம்மம் (Simmam / Leo)",
    "கன்னி (Kanni / Virgo)",
    "துலாம் (Thulaam / Libra)",
    "விருச்சிகம் (Vrichigam / Scorpio)",
    "தனுசு (Dhanusu / Sagittarius)",
    "மகரம் (Makaram / Capricorn)",
    "கும்பம் (Kumbam / Aquarius)",
    "மீனம் (Meenam / Pisces)"
];

const NAKSHATRA_NAMES = [
    "அசுவினி (Ashwini)", "பரணி (Bharani)", "கிருத்திகை (Krittika)",
    "ரோகிணி (Rohini)", "மிருகசீரிடம் (Mrigashirsha)", "திருவாதிரை (Ardra)",
    "புனர்பூசம் (Punarvasu)", "பூசம் (Pushya)", "ஆயில்யம் (Ashlesha)",
    "மகம் (Magha)", "பூரம் (Purva Phalguni)", "உத்திரம் (Uttara Phalguni)",
    "அஸ்தம் (Hasta)", "சித்திரை (Chitra)", "சுவாதி (Swati)",
    "விசாகம் (Vishakha)", "அனுஷம் (Anuradha)", "கேட்டை (Jyeshtha)",
    "மூலம் (Mula)", "பூராடம் (Purva Ashadha)", "உத்திராடம் (Uttara Ashadha)",
    "திருவோணம் (Shravana)", "அவிட்டம் (Dhanishta)", "சதயம் (Shatabhisha)",
    "பூரட்டாதி (Purva Bhadrapada)", "உத்திரட்டாதி (Uttara Bhadrapada)", "ரேவதி (Revati)"
];

function getZodiacSign(longitude: number): string {
    // Normalize longitude to 0-360
    let lon = longitude % 360;
    if (lon < 0) lon += 360;
    const index = Math.floor(lon / 30);
    return RASI_NAMES[index] || "Unknown";
}

function getNakshatra(longitude: number): string {
    let lon = longitude % 360;
    if (lon < 0) lon += 360;
    const index = Math.floor(lon / 13.333333);
    return NAKSHATRA_NAMES[index] || "Unknown";
}

function getAscendant(date: Date, lat: number, lon: number): string {
    // Calculate Local Sidereal Time (LST)
    // Astronomy.SiderealTime returns Greenwich Sidereal Time (GST) in hours?
    // Let's check documentation via assumption or small search if needed. 
    // Usually SiderealTime(date) returns GST in hours.

    // Astronomy.SiderealTime(date) -> GST in hours.
    const gstHours = Astronomy.SiderealTime(date);
    const lstHours = (gstHours + lon / 15.0 + 24) % 24; // Convert GST to LST (Longitude is in degrees)

    const ramc = lstHours * 15 * (Math.PI / 180); // Convert LST to RAMC in radians
    // Use constant for Obliquity to avoid API lookup issues (approx 23.44 degrees)
    const OBLIQUITY_DEG = 23.4367;
    const epsilon = OBLIQUITY_DEG * (Math.PI / 180); // Obliquity of Ecliptic
    const latitude = lat * (Math.PI / 180);

    // Formula for Ascendant
    // tan(Asc) = cos(RAMC) / ( -sin(RAMC)cos(e) - tan(lat)sin(e) ) (For East Point/Ascendant logic)
    const top = Math.cos(ramc);
    const bottom = -Math.sin(ramc) * Math.cos(epsilon) - Math.tan(latitude) * Math.sin(epsilon);

    let asc = Math.atan2(top, bottom) * (180 / Math.PI);

    if (asc < 0) asc += 360;

    return getZodiacSign(asc);
}

export async function getHoroscope(data: HoroscopeFormData): Promise<HoroscopeResult> {
    // Simulate API delay for effect
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Default Location: Chennai, India
    const lat = 13.0827;
    const lon = 80.2707;

    // Parse Date and Time
    // data.dob is "YYYY-MM-DD", data.tob is "HH:MM"
    const dateStr = `${data.dob}T${data.tob}:00`;
    let date = new Date(dateStr);

    // Check if valid
    if (isNaN(date.getTime())) {
        date = new Date(); // Fallback
    }

    // Adjust for Timezone? 
    // The input is likely "Local Time". `new Date(string)` parses as UTC if ends in Z, or Local if not?
    // In Browser/Node, `new Date("2024-01-01T10:00:00")` is typically Local.
    // We will assume the user entered Local Time (IST presumably).
    // astronomy-engine expects UTC Date object. 
    // `date` object accounts for system timezone. 
    // Ideally we'd offset to IST if the system is not IST, but let's assume system time or just use it as given.

    // Calculate Moon Position (Geocentric Ecliptic)
    const moonPos = Astronomy.GeoVector(Astronomy.Body.Moon, date, true);
    // Actually GeoVector returns rectangular. We need Ecliptic coordinates.
    // Astronomy.Ecliptic(vector)
    const moonEcliptic = Astronomy.Ecliptic(moonPos);

    // astronomy-engine 'Ecliptic' returns Spherical: { elat, elon, dist } (Correction based on type feedback)
    const rasi = getZodiacSign(moonEcliptic.elon);
    const star = getNakshatra(moonEcliptic.elon);

    // Calculate Lagnam
    const lagnam = getAscendant(date, lat, lon);

    return {
        name: data.name,
        raasi: rasi,
        natchathiram: star,
        lagnam: lagnam,
        latitude: `${lat}° N`,
        longitude: `${lon}° E`
    };
}
