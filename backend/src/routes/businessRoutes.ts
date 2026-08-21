import { Router, Response } from 'express';
import { db } from '../db/db';
import { AuthRequest, requireAdmin } from '../middleware/auth';

const router = Router();

// GET /api/business-info - Public business info
router.get('/', (req, res) => {
  const data = db.get();
  const info = data.business_info[0] || null;
  res.json({ businessInfo: info });
});

// PUT /api/business-info - Update business info (Admin only)
router.put('/', requireAdmin, (req: AuthRequest, res: Response) => {
  const data = db.get();
  if (data.business_info.length === 0) {
    return res.status(404).json({ error: 'Business info not found' });
  }

  const current = data.business_info[0];
  const {
    businessName,
    tagline,
    phone,
    whatsappNumber,
    defaultWhatsappMessage,
    email,
    address,
    googleMapsUrl,
    instagramUrl,
    facebookUrl,
    businessHours
  } = req.body;

  data.business_info[0] = {
    ...current,
    businessName: businessName || current.businessName,
    tagline: tagline || current.tagline,
    phone: phone || current.phone,
    whatsappNumber: whatsappNumber || current.whatsappNumber,
    defaultWhatsappMessage: defaultWhatsappMessage || current.defaultWhatsappMessage,
    email: email || current.email,
    address: address || current.address,
    googleMapsUrl: googleMapsUrl || current.googleMapsUrl,
    instagramUrl: instagramUrl || current.instagramUrl,
    facebookUrl: facebookUrl || current.facebookUrl,
    businessHours: businessHours || current.businessHours
  };

  db.save();
  res.json({ message: 'Business information updated successfully', businessInfo: data.business_info[0] });
});

// GET /api/business-info/stats - Admin Dashboard Quick Stats
router.get('/stats', requireAdmin, (req, res) => {
  const data = db.get();

  const ownerPostsCount = data.owner_posts.length;
  const videosCount = data.owner_posts.filter((p) => p.mediaType === 'video').length;
  const pendingReviewsCount = data.customer_reviews.filter((r) => r.status === 'pending').length;
  const approvedReviewsCount = data.customer_reviews.filter((r) => r.status === 'approved').length;
  const pendingSubmissionsCount = data.customer_submissions.filter((s) => s.status === 'pending').length;
  const approvedSubmissionsCount = data.customer_submissions.filter((s) => s.status === 'approved').length;

  const recentPendingReviews = data.customer_reviews
    .filter((r) => r.status === 'pending')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const recentPendingSubmissions = data.customer_submissions
    .filter((s) => s.status === 'pending')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  res.json({
    stats: {
      ownerPostsCount,
      videosCount,
      pendingReviewsCount,
      approvedReviewsCount,
      pendingSubmissionsCount,
      approvedSubmissionsCount
    },
    recentPendingReviews,
    recentPendingSubmissions
  });
});

export default router;
