import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

const dbFilePath = path.join(__dirname, '../../database.json');
const uploadsDir = path.join(__dirname, '../../uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

export interface Admin {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: string;
  createdAt: string;
}

export interface OwnerPost {
  id: string;
  title: string;
  description: string;
  mediaUrl: string;
  mediaType: string;
  category: string;
  tags?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  price: string;
  duration: string;
  availability: string;
  status: string;
  sortOrder: number;
}

export interface CustomerReview {
  id: string;
  customerName: string;
  rating: number;
  review: string;
  imageUrl: string | null;
  videoUrl: string | null;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  approvedAt: string | null;
}

export interface CustomerSubmission {
  id: string;
  customerName: string;
  phoneOrEmail: string | null;
  caption: string;
  imageUrl: string | null;
  videoUrl: string | null;
  consent: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  approvedAt: string | null;
}

export interface BusinessInfo {
  id: number;
  businessName: string;
  tagline: string;
  phone: string;
  whatsappNumber: string;
  defaultWhatsappMessage: string;
  email: string;
  address: string;
  googleMapsUrl: string;
  instagramUrl: string;
  facebookUrl: string;
  businessHours: string;
}

export interface Schema {
  admins: Admin[];
  owner_posts: OwnerPost[];
  services: Service[];
  customer_reviews: CustomerReview[];
  customer_submissions: CustomerSubmission[];
  business_info: BusinessInfo[];
}

const defaultSchema: Schema = {
  admins: [],
  owner_posts: [],
  services: [],
  customer_reviews: [],
  customer_submissions: [],
  business_info: []
};

class JSONDatabase {
  private data: Schema = { ...defaultSchema };

  constructor() {
    this.reload();
  }

  public reload() {
    if (fs.existsSync(dbFilePath)) {
      try {
        const raw = fs.readFileSync(dbFilePath, 'utf-8');
        this.data = JSON.parse(raw);
      } catch (err) {
        console.error('Failed to parse database.json', err);
      }
    }
  }

  public save() {
    fs.writeFileSync(dbFilePath, JSON.stringify(this.data, null, 2), 'utf-8');
  }

  public getData(): Schema {
    return this.data;
  }
}

const dbInstance = new JSONDatabase();

export function initDatabase() {
  const data = dbInstance.getData();

  // 1. Seed & Sync Admin User
  const ownerEmail = (process.env.ADMIN_EMAIL || 'dharshyammu@gmail.com').trim().toLowerCase();
  const ownerPass = process.env.ADMIN_PASSWORD || 'yamuna@2008';
  const adminIndex = data.admins.findIndex(a => a.email.toLowerCase() === ownerEmail);
  const passwordHash = bcrypt.hashSync(ownerPass, 10);

  if (adminIndex >= 0) {
    data.admins[adminIndex].passwordHash = passwordHash;
  } else {
    data.admins.push({
      id: 'admin-1',
      name: 'PJ Saree Pleating Owner',
      email: ownerEmail,
      passwordHash,
      role: 'admin',
      createdAt: new Date().toISOString()
    });
  }
  dbInstance.save();
  console.log('Owner Admin Account Synced: dharshyammu@gmail.com (Password: yamuna@2008)');

  // 2. Seed Business Info
  if (data.business_info.length === 0) {
    data.business_info.push({
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
    });
  }

  // 3. Seed Services
  if (data.services.length === 0) {
    data.services = [
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
  }

  // 4. Seed Owner Posts
  if (data.owner_posts.length === 0) {
    data.owner_posts = [
      {
        id: 'post-1',
        title: 'Signature Sky Blue & Silver Box Pleat Preparation',
        description: 'Structured box pleats on rich sky-blue tissue silk saree. Pressed with non-damaging steam and packaged for effortless draping.',
        mediaUrl: '/uploads/owner_work_1.jpg',
        mediaType: 'image',
        category: 'Bridal',
        tags: 'SkyBlue,BoxPleats,TissueSilk,Bridal',
        createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
        updatedAt: new Date(Date.now() - 86400000 * 3).toISOString()
      },
      {
        id: 'post-2',
        title: 'Royal Purple & Blue Fan Pleated Pallu',
        description: 'Exquisite fan pleating on heavy silk saree pallu with razor-sharp borders and gold zari detailing.',
        mediaUrl: '/uploads/owner_work_2.jpg',
        mediaType: 'image',
        category: 'Function',
        tags: 'FanPleats,PurpleSilk,PalluAlignment',
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        updatedAt: new Date(Date.now() - 86400000 * 2).toISOString()
      },
      {
        id: 'post-3',
        title: 'Royal Blue Silk Shoulder Pleat Alignment',
        description: 'Precision shoulder pleats pre-pinned for a slim, body-flattering silhouette ready in 2 minutes.',
        mediaUrl: '/uploads/owner_work_3.jpg',
        mediaType: 'image',
        category: 'Bridal',
        tags: 'RoyalBlue,ShoulderPleats,SilkSaree',
        createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
        updatedAt: new Date(Date.now() - 86400000 * 1).toISOString()
      },
      {
        id: 'post-4',
        title: 'Magenta Pink & Gold Box Folded Saree with Tassels',
        description: 'Flawless box folding with pallu tassel protection and pin-free waistband alignment.',
        mediaUrl: '/uploads/owner_work_4.jpg',
        mediaType: 'image',
        category: 'Close-Up',
        tags: 'MagentaPink,BoxFolding,Tassels,CloseUp',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
  }

  // 5. Customer Reviews start clean
  data.customer_reviews = data.customer_reviews || [];

  // 6. Customer Submissions start clean
  data.customer_submissions = data.customer_submissions || [];

  dbInstance.save();
}

export const db = {
  get: () => {
    dbInstance.reload();
    return dbInstance.getData();
  },
  save: () => dbInstance.save()
};
