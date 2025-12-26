const https = require('https');

const API_KEY = "i2ZDBrwKdI9JZpF4xy0uA2HFZoOMXxA67bZjRT3I";
const GEO_API_URL = "https://json.freeastrologyapi.com/geo-details";
const PLACE = "Chennai,india";

const fullUrl = `${GEO_API_URL}?place=${encodeURIComponent(PLACE)}`;

console.log(`Sending request to: ${fullUrl}`);

const req = https.request(fullUrl, {
    method: 'GET',
    headers: {
        'x-api-key': API_KEY,
        'Content-Type': 'application/json'
    }
}, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    console.log(`HEADERS: ${JSON.stringify(res.headers)}`);

    let body = '';
    res.on('data', (chunk) => body += chunk);
    res.on('end', () => {
        console.log('BODY: ' + body);
    });
});

req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
});

req.end();
