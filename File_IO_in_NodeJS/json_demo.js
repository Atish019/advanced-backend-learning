import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Path to JSON file
const jsonFilePath = path.join(__dirname, 'user_data.json');

// 2. Read JSON file (returns raw string)
const rawData = fs.readFileSync(jsonFilePath, 'utf-8');
console.log("--- RAW JSON STRING ---");
console.log(rawData);

// 3. Parse JSON string into a JavaScript Object
const parsedObject = JSON.parse(rawData);
console.log("\n--- PARSED JAVASCRIPT OBJECT ---");
console.log("User Name:", parsedObject.data.user.profile.fullName);
console.log("User Roles:", parsedObject.data.user.roles.join(", "));

// 4. Modify Object in JavaScript
parsedObject.data.user.stats.followersCount += 1;
parsedObject.metadata.lastUpdated = new Date().toISOString();

// 5. Serialize JavaScript Object back to formatted JSON string
const updatedJsonString = JSON.stringify(parsedObject, null, 2);
console.log("\n--- SERIALIZED UPDATED JSON STRING ---");
console.log(updatedJsonString);
