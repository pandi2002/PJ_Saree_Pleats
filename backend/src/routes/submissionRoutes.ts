import { Router, Response } from 'express';
import crypto from 'crypto';
import { db, CustomerSubmission } from '../db/db';
import { AuthRequest, requireAdmin } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

// GET /api/submissions - Public list of approved customer submissions
router.get('/', (req, res) => {
  const data = db.get();
  const submissions = data.customer_submissions
    .filter((s) => s.status === 'approved')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  res.json({ submissions });
});

// POST /api/submissions - Public customer upload (ALWAYS status = 'pending')
router.post('/', upload.single('mediaFile'), (req, res) => {
  const { customerName, phoneOrEmail, caption, consent } = req.body;

  if (!customerName || !caption) {
    return res.status(400).json({ error: 'Customer name and caption are required' });
  }

  const consentGiven = consent === 'true' || consent === '1' || consent === true ? 1 : 0;
  if (!consentGiven) {
    return res.status(400).json({ error: 'You must check the consent box to submit your saree look' });
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

  if (!imageUrl && !videoUrl && req.body.mediaUrl) {
    imageUrl = req.body.mediaUrl;
  }

  const id = `sub-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`;
  const now = new Date().toISOString();

  const newSub: CustomerSubmission = {
    id,
    customerName,
    phoneOrEmail: phoneOrEmail || null,
    caption,
    imageUrl,
    videoUrl,
    consent: consentGiven,
    status: 'pending',
    createdAt: now,
    approvedAt: null
  };

  const data = db.get();
  data.customer_submissions.unshift(newSub);
  db.save();

  res.status(201).json({
    message: 'Thank you! Your submission has been received and will be reviewed by PJ Saree Pleating.'
  });
});

// Protected Admin Endpoints
// GET /api/submissions/admin/all - Get all submissions for admin
router.get('/admin/all', requireAdmin, (req, res) => {
  const { status } = req.query;
  const data = db.get();
  let submissions = [...data.customer_submissions];

  if (status && status !== 'all') {
    submissions = submissions.filter((s) => s.status === status);
  }

  submissions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  res.json({ submissions });
});

// PUT /api/submissions/admin/:id/status - Approve or Reject customer submission
router.put('/admin/:id/status', requireAdmin, (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['approved', 'rejected', 'pending'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status value' });
  }

  const data = db.get();
  const index = data.customer_submissions.findIndex((s) => s.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Submission not found' });
  }

  data.customer_submissions[index].status = status as 'approved' | 'rejected' | 'pending';
  data.customer_submissions[index].approvedAt = status === 'approved' ? new Date().toISOString() : null;

  db.save();
  res.json({ message: `Submission status updated to ${status}` });
});

// DELETE /api/submissions/admin/:id - Delete customer submission
router.delete('/admin/:id', requireAdmin, (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const data = db.get();
  const index = data.customer_submissions.findIndex((s) => s.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Submission not found' });
  }

  data.customer_submissions.splice(index, 1);
  db.save();
  res.json({ message: 'Submission deleted successfully' });
});

export default router;
