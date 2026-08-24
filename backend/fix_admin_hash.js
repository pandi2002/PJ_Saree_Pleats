const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.join(__dirname, 'database.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

const validHash = bcrypt.hashSync('yamu@2008', 10);

db.admins = [
  {
    id: 'admin-1',
    name: 'PJ Saree Pleating Owner',
    email: 'dharshyammu@gmail.com',
    passwordHash: validHash,
    role: 'admin',
    createdAt: new Date().toISOString()
  }
];

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf-8');
console.log('Successfully updated admin passwordHash in database.json!');
console.log('Testing password verification for yamu@2008:', bcrypt.compareSync('yamu@2008', validHash));
