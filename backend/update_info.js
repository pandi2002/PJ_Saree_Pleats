const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'database.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

// 1. Update Services to exact 3 services requested by user
db.services = [
  {
    id: 'srv-1',
    name: 'Regular Pleats',
    description: 'Clean, crisp standard pleats and box folding tailored for all silk, cotton, and function sarees.',
    imageUrl: '/uploads/owner_work_1.jpg',
    price: '₹300',
    duration: '24 Hours',
    availability: 'Available',
    status: 'active',
    sortOrder: 1
  },
  {
    id: 'srv-2',
    name: 'Fluffy Pleats',
    description: 'Volume-enhanced fluffy pleating crafted for soft silk, tissue silk, and grand event sarees.',
    imageUrl: '/uploads/owner_work_2.jpg',
    price: '₹350',
    duration: '24 Hours',
    availability: 'Popular Choice',
    status: 'active',
    sortOrder: 2
  },
  {
    id: 'srv-3',
    name: 'Hanger Folding',
    description: 'Hanger-ready box folding with crease protection, pinned and ready to hang in your closet or carry for travel.',
    imageUrl: '/uploads/owner_work_8.jpg',
    price: '₹399',
    duration: '24 Hours',
    availability: 'Available',
    status: 'active',
    sortOrder: 3
  }
];

// 2. Update Business Info address and remove public email
db.business_info = [
  {
    id: 1,
    businessName: 'PJ Saree Pleating',
    tagline: 'Perfect Pleats, Perfect You • Effortless Saree Preparation',
    phone: '+91 63801 44979',
    whatsappNumber: '916380144979',
    defaultWhatsappMessage: 'Hi PJ Saree Pleating, I would like to enquire about your saree pleating service.',
    email: '',
    address: 'No. 13/25, Padmanabha Nagar Main Road, Periyar Pathai, Choolaimedu, Chennai - 600094 (Opposite Anujun Beauty Parlour)',
    googleMapsUrl: 'https://maps.google.com/?q=13/25+Padmanabha+Nagar+Main+Road+Periyar+Pathai+Choolaimedu+Chennai+94',
    instagramUrl: 'https://instagram.com/pjsareepleating',
    facebookUrl: 'https://facebook.com/pjsareepleating',
    businessHours: 'Mon - Sat: 9:00 AM - 8:00 PM | Sun: 10:00 AM - 4:00 PM'
  }
];

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf-8');
console.log('Successfully updated services catalog & business address/email in database.json!');
