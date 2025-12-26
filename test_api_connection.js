
const https = require('https');

const GEO_API_URL = "https://json.freeastrologyapi.com/geo-details";
const VEDIC_API_URL = "https://json.freeastrologyapi.com/planets";
const API_KEY = "54oM8b9OejaYzebF4uL423YHziSRRfKO4AcdmlGP";

function testUrl(url, method = 'GET', body = null) {
    return new Promise((resolve, reject) => {
        console.log(`Testing ${url} [${method}]...`);
        const urlObj = new URL(url);
        const options = {
            hostname: urlObj.hostname,
            path: urlObj.pathname,
            method: method,
            headers: {
                'x-api-key': API_KEY,
                'Content-Type': 'application/json'
            },
            timeout: 10000
        };

        const req = https.request(options, (res) => {
            console.log(`Response from ${url}: Status ${res.statusCode}`);
            res.on('data', (d) => {
                // consume data
            });
            resolve(res.statusCode);
        });

        req.on('error', (e) => {
            console.error(`Error connecting to ${url}:`, e.message);
            resolve(e.message);
        });

        req.on('timeout', () => {
            console.error(`Timeout connecting to ${url}`);
            req.destroy();
            resolve('TIMEOUT');
        });

        if (body) {
            req.write(JSON.stringify(body));
        }
        req.end();
    });
}

async function runTests() {
    // Test Geo API
    await testUrl(GEO_API_URL, 'POST', { location: "Chennai" });

    // Test Vedic API
    // Need a dummy payload for Vedic API to be valid, but connection test should work regardless of 400/500
    await testUrl(VEDIC_API_URL, 'POST', {
        year: 2023, month: 1, date: 1, hours: 12, minutes: 0, seconds: 0,
        latitude: 13.08, longitude: 80.27, timezone: 5.5,
        config: { observation_point: "topocentric", ayanamsha: "lahiri" }
    });
}

runTests();
