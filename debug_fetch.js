const API_KEY = "i2ZDBrwKdI9JZpF4xy0uA2HFZoOMXxA67bZjRT3I";
const URL = "https://json.freeastrologyapi.com/geo-details?place=Chennai,india";

async function test() {
    console.log("Testing Fetch...");
    try {
        const res = await fetch(URL, {
            headers: {
                "x-api-key": API_KEY
            }
        });

        console.log("Status:", res.status);
        const text = await res.text();
        console.log("Body:", text);
    } catch (e) {
        console.error("Fetch Error:", e);
    }
}

test();
