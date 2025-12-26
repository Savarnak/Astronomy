const API_KEY = "54oM8b9OejaYzebF4uL423YHziSRRfKO4AcdmlGP";

const GEO_URL = "https://json.freeastrologyapi.com/geo-details";
const PLANETS_URL = "https://json.freeastrologyapi.com/planets";

async function testGeo() {
    console.log("\n--- Testing GEO API (POST) ---");
    try {
        const res = await fetch(GEO_URL, {
            method: 'POST',
            headers: { "x-api-key": API_KEY.trim(), "Content-Type": "application/json" },
            body: JSON.stringify({ place: "Chennai,india" })
        });
        console.log("Status:", res.status);
        console.log("Body:", await res.text());
    } catch (e) {
        console.error("Error:", e.message);
    }
}

async function testPlanets() {
    console.log("\n--- Testing PLANETS API (POST) ---");
    // Standard payload from typical docs
    const payload = {
        year: 2000, month: 1, date: 1, hours: 12, minutes: 0, seconds: 0,
        latitude: 13.08, longitude: 80.27, timezone: 5.5,
        config: { observation_point: "topocentric", ayanamsha: "lahiri" }
    };

    try {
        const res = await fetch(PLANETS_URL, {
            method: 'POST',
            headers: { "x-api-key": API_KEY.trim(), "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
        console.log("Status:", res.status);
        console.log("Body:", await res.text());
    } catch (e) {
        console.error("Error:", e.message);
    }
}

async function run() {
    await testGeo();
    await testPlanets();
}

run();
