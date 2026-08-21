const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'database.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

// Clear all sample customer reviews and customer submissions
db.customer_reviews = [];
db.customer_submissions = [];

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf-8');
console.log('Successfully cleared sample customer reviews and customer submissions in database.json!');
