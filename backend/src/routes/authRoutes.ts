import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import { db } from '../db/db';
import { AuthRequest, generateToken, requireAdmin } from '../middleware/auth';

const router = Router();

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const data = db.get();
  const admin = data.admins.find((a) => a.email.toLowerCase() === email.toLowerCase());
  if (!admin) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const isPasswordValid = bcrypt.compareSync(password, admin.passwordHash);
  if (!isPasswordValid) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const token = generateToken({ id: admin.id, email: admin.email, role: admin.role });

  return res.json({
    message: 'Login successful',
    token,
    admin: {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role
    }
  });
});

// GET /api/auth/me
router.get('/me', requireAdmin, (req: AuthRequest, res: Response) => {
  const data = db.get();
  const admin = data.admins.find((a) => a.id === req.admin?.id);
  if (!admin) {
    return res.status(404).json({ error: 'Admin user not found' });
  }
  return res.json({
    admin: {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      createdAt: admin.createdAt
    }
  });
});

// PUT /api/auth/profile - Update Admin Name & Email
router.put('/profile', requireAdmin, (req: AuthRequest, res: Response) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  const data = db.get();
  const admin = data.admins.find((a) => a.id === req.admin?.id);
  if (!admin) {
    return res.status(404).json({ error: 'Admin not found' });
  }

  admin.name = name;
  admin.email = email;
  db.save();

  // Generate fresh token with updated email
  const newToken = generateToken({ id: admin.id, email: admin.email, role: admin.role });

  return res.json({
    message: 'Admin profile updated successfully',
    token: newToken,
    admin: {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role
    }
  });
});

// PUT /api/auth/change-password
router.put('/change-password', requireAdmin, (req: AuthRequest, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Current password and new password are required' });
  }

  const data = db.get();
  const admin = data.admins.find((a) => a.id === req.admin?.id);
  if (!admin) {
    return res.status(404).json({ error: 'Admin not found' });
  }

  const isValid = bcrypt.compareSync(currentPassword, admin.passwordHash);
  if (!isValid) {
    return res.status(400).json({ error: 'Incorrect current password' });
  }

  admin.passwordHash = bcrypt.hashSync(newPassword, 10);
  db.save();

  return res.json({ message: 'Password updated successfully' });
});

export default router;
