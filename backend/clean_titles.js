const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'database.json');
const raw = fs.readFileSync(dbPath, 'utf-8');
const db = JSON.parse(raw);

const sampleTitles = [
  'Bridal Kanjeevaram Box Pleats',
  'Precision Fan Pleated Pallu',
  'Royal Silk Saree Pre-Pleating',
  'Grand Reception Saree Preparation',
  'Organza Saree Heat-Pressed Pleats',
  'Magenta Zari Border Box Folding',
  'Sky Blue Tissue Silk Pleat Detailing',
  'Pure Soft Silk Shoulder Pleat Alignment',
  'Pink & Gold Zari Saree Box Fold',
  'Cream & Gold Fan Pleat Detailing',
  'Bridal Entourage Pleating Finish',
  'Custom Waistband Fit Alignment'
];

let cleanedCount = 0;

db.owner_posts.forEach((post, i) => {
  if (post.title.includes('WhatsApp Image') || post.title.includes('WhatsApp')) {
    const baseTitle = sampleTitles[i % sampleTitles.length];
    post.title = `${baseTitle} #${i + 1}`;
    cleanedCount++;
  }
});

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf-8');
console.log(`Successfully cleaned ${cleanedCount} post titles in database.json!`);
