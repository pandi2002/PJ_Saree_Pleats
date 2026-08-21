const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'database.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

const videoItems = [
  {
    id: 'post-vid-1',
    title: 'Quick 2-Minute Saree Draping Demo',
    description: 'Watch how fast our pre-pleated saree can be draped without assistance! Pinned & steam-pressed to perfection.',
    mediaUrl: '/uploads/owner_video_1.mp4',
    mediaType: 'video',
    category: 'General',
    tags: 'Video,Reel,QuickDrape,PJSareePleating',
    createdAt: new Date(Date.now() - 1000 * 60 * 7).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'post-vid-2',
    title: 'Bridal Silk Saree Fan Pleat Showcase',
    description: 'Razor-sharp fan pleating on heavy bridal silk saree pallu with gold zari detailing.',
    mediaUrl: '/uploads/owner_video_2.mp4',
    mediaType: 'video',
    category: 'Bridal',
    tags: 'BridalVideo,FanPleats,SilkSaree',
    createdAt: new Date(Date.now() - 1000 * 60 * 6).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'post-vid-3',
    title: 'Before & After Pre-Pleating Transformation',
    description: 'See how our structured pre-pleating transforms a bulky soft silk saree into a slim, flattering silhouette.',
    mediaUrl: '/uploads/owner_video_3.mp4',
    mediaType: 'video',
    category: 'Before/After',
    tags: 'Transformation,BeforeAfter,SoftSilk',
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'post-vid-4',
    title: 'Precision Box Folding & Tassel Guard Demo',
    description: 'Compact box folding with pallu tassel protection and pin-free waistband alignment.',
    mediaUrl: '/uploads/owner_video_4.mp4',
    mediaType: 'video',
    category: 'Close-Up',
    tags: 'BoxFolding,Tassels,Packaging',
    createdAt: new Date(Date.now() - 1000 * 60 * 4).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'post-vid-5',
    title: 'Organza Saree Draping & Gentle Heat Pressing',
    description: 'Organza sarees pre-pleated with heat treatment for easy 2-minute draping.',
    mediaUrl: '/uploads/owner_video_5.mp4',
    mediaType: 'video',
    category: 'Function',
    tags: 'Organza,PartyWear,Draping',
    createdAt: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'post-vid-6',
    title: 'Shoulder & Waist Pleat Fitting Walkthrough',
    description: 'Custom measured shoulder pleats and waist curve alignment based on customer height.',
    mediaUrl: '/uploads/owner_video_6.mp4',
    mediaType: 'video',
    category: 'Bridal',
    tags: 'ShoulderPleats,WaistAlignment,Fit',
    createdAt: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'post-vid-7',
    title: 'Live Client Event Saree Draping Reel',
    description: 'Watch our client dressed in PJ Saree Pleating ready-to-wear pre-pleated saree at a wedding function.',
    mediaUrl: '/uploads/owner_video_7.mp4',
    mediaType: 'video',
    category: 'General',
    tags: 'ClientReel,EventReady,Function',
    createdAt: new Date(Date.now() - 1000 * 60 * 1).toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Unshift videos so they appear at the top
videoItems.forEach((v) => {
  db.owner_posts.unshift(v);
});

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf-8');
console.log('Successfully added all 7 video posts to database.json!');
