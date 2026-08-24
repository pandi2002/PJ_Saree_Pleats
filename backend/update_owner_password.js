const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.join(__dirname, 'database.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

const newPassword = 'yamuna@2008';
const passwordHash = bcrypt.hashSync(newPassword, 10);

db.admins = [
  {
    id: 'admin-1',
    name: 'PJ Saree Pleating Owner',
    email: 'dharshyammu@gmail.com',
    passwordHash: passwordHash,
    role: 'admin',
    createdAt: new Date().toISOString()
  }
];

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf-8');
console.log('Successfully updated owner password to yamuna@2008 in database.json!');
console.log('Verification test for yamuna@2008:', bcrypt.compareSync('yamuna@2008', passwordHash));
