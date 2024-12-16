// Required modules
const fs = require('fs');

// Paths to the JSON files
const enFilePath = './en_US.json';
const esFilePath = './es.json';

// Load JSON files
const enData = JSON.parse(fs.readFileSync(enFilePath, 'utf8'));
const esData = JSON.parse(fs.readFileSync(esFilePath, 'utf8'));

// Find missing keys
const enKeys = Object.keys(enData);
const esKeys = Object.keys(esData);

// Identify missing keys
const missingKeys = enKeys.filter(key => !esKeys.includes(key));

// Output result
if (missingKeys.length > 0) {
    console.log(`Missing keys in Spanish JSON (es.json):`);
    missingKeys.forEach(key => console.log(`- ${key}`));
} else {
    console.log('No missing keys. All English keys are present in the Spanish JSON.');
}

// Optional: Save missing keys to a file
const outputFilePath = './missing_keys.json';
fs.writeFileSync(outputFilePath, JSON.stringify(missingKeys, null, 2));
console.log(`Missing keys saved to ${outputFilePath}`);
