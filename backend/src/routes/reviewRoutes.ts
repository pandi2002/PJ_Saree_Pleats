import { Router, Response } from 'express';
import crypto from 'crypto';
import { db, CustomerReview } from '../db/db';
import { AuthRequest, requireAdmin } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

// GET /api/reviews - Public list of approved customer reviews
router.get('/', (req, res) => {
  const data = db.get();
  const approvedReviews = data.customer_reviews
    .filter((r) => r.status === 'approved')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const totalReviews = approvedReviews.length;
  const avgRating = totalReviews > 0
    ? parseFloat((approvedReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1))
    : 5.0;

  res.json({
    reviews: approvedReviews,
    stats: {
      totalReviews,
      avgRating
    }
  });
});

// POST /api/reviews - Public review submission (ALWAYS status = 'pending')
router.post('/', upload.single('mediaFile'), (req, res) => {
  const { customerName, rating, review } = req.body;

  if (!customerName || !rating || !review) {
    return res.status(400).json({ error: 'Customer name, star rating, and review text are required' });
  }

  const numericRating = parseInt(rating, 10);
  if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
    return res.status(400).json({ error: 'Rating must be between 1 and 5 stars' });
  }

  let imageUrl: string | null = null;
  let videoUrl: string | null = null;

  if (req.file) {
    if (req.file.mimetype.startsWith('video')) {
      videoUrl = `/uploads/${req.file.filename}`;
    } else {
      imageUrl = `/uploads/${req.file.filename}`;
    }
  }

  const id = `rev-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`;
  const now = new Date().toISOString();

  const newReview: CustomerReview = {
    id,
    customerName,
    rating: numericRating,
    review,
    imageUrl,
    videoUrl,
    status: 'pending',
    createdAt: now,
    approvedAt: null
  };

  const data = db.get();
  data.customer_reviews.unshift(newReview);
  db.save();

  res.status(201).json({
    message: 'Thank you! Your review has been submitted successfully and will be reviewed by PJ Saree Pleating.'
  });
});

// Protected Admin Endpoints
// GET /api/reviews/admin/all - Get all reviews
router.get('/admin/all', requireAdmin, (req, res) => {
  const { status } = req.query;
  const data = db.get();
  let reviews = [...data.customer_reviews];

  if (status && status !== 'all') {
    reviews = reviews.filter((r) => r.status === status);
  }

  reviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  res.json({ reviews });
});

// PUT /api/reviews/admin/:id/status - Approve or Reject review
router.put('/admin/:id/status', requireAdmin, (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['approved', 'rejected', 'pending'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status value' });
  }

  const data = db.get();
  const index = data.customer_reviews.findIndex((r) => r.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Review not found' });
  }

  data.customer_reviews[index].status = status as 'approved' | 'rejected' | 'pending';
  data.customer_reviews[index].approvedAt = status === 'approved' ? new Date().toISOString() : null;

  db.save();
  res.json({ message: `Review status updated to ${status}` });
});

// DELETE /api/reviews/admin/:id - Delete review
router.delete('/admin/:id', requireAdmin, (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const data = db.get();
  const index = data.customer_reviews.findIndex((r) => r.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Review not found' });
  }

  data.customer_reviews.splice(index, 1);
  db.save();
  res.json({ message: 'Review deleted successfully' });
});

export default router;
