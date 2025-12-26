const fs = require('fs');

const API_KEY = "i2ZDBrwKdI9JZpF4xy0uA2HFZoOMXxA67bZjRT3I";
const URL = "https://json.freeastrologyapi.com/geo-details?place=Chennai";

const configs = [
    { name: "x-api-key (lower)", headers: { "x-api-key": API_KEY } },
    { name: "X-Api-Key (Pascal)", headers: { "X-Api-Key": API_KEY } },
    { name: "apikey", headers: { "apikey": API_KEY } },
    { name: "Authorization Bearer", headers: { "Authorization": `Bearer ${API_KEY}` } },
    { name: "Authorization Basic", headers: { "Authorization": `Basic ${Buffer.from(API_KEY).toString('base64')}` } }
];

async function run() {
    let log = "Starting Diagnostics...\n";

    for (const config of configs) {
        log += `Testing: ${config.name}\n`;
        try {
            const res = await fetch(URL, { headers: config.headers });
            log += `Status: ${res.status}\n`;
            const text = await res.text();
            log += `Body: ${text.substring(0, 100)}\n\n`;
        } catch (e) {
            log += `Error: ${e.message}\n\n`;
        }
    }

    fs.writeFileSync('auth_log.txt', log);
    console.log("Done");
}

run();
