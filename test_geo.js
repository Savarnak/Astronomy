const https = require('https');

const API_KEY = "i2ZDBrwKdI9JZpF4xy0uA2HFZoOMXxA67bZjRT3I";
const GEO_API_URL = "https://json.freeastrologyapi.com/geo-details";
const PLACE = "Chennai,india";

const url = `${GEO_API_URL}?place=${encodeURIComponent(PLACE)}`;

console.log("Testing URL:", url);

const options = {
    headers: {
        "x-api-key": API_KEY
        // "Content-Type": "application/json"  <-- Removed this as it causes issues for GET
    }
};

https.get(url, options, (res) => {
    let data = '';
    console.log("Status Code:", res.statusCode);

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        console.log("Response Body Length:", data.length);
        console.log("Response Body Sample:", data.substring(0, 200));
    });

}).on("error", (err) => {
    console.log("Error:", err.message);
});
