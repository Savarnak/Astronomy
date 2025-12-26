const API_KEY = "54oM8b9OejaYzebF4uL423YHziSRRfKO4AcdmlGP";
const GEO_URL = "https://json.freeastrologyapi.com/geo-details";

const variants = [
    { location: "Chennai,india" },
    { city: "Chennai,india" },
    { city_name: "Chennai,india" },
    { query: "Chennai,india" },
    { address: "Chennai,india" },
    { place: "Chennai" } // Try simple string
];

async function test() {
    console.log("Testing Geo API Payload Variants (POST)...");

    for (const body of variants) {
        console.log(`\nTesting Body: ${JSON.stringify(body)}`);
        try {
            const res = await fetch(GEO_URL, {
                method: 'POST',
                headers: {
                    "x-api-key": API_KEY.trim(),
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            });
            console.log(`Status: ${res.status}`);
            if (res.status !== 403 && res.status !== 500) {
                console.log("Response:", await res.text());
            }
        } catch (e) {
            console.error("Error:", e.message);
        }
    }
}

test();
