import { Router, Response } from 'express';
import crypto from 'crypto';
import { db, Service } from '../db/db';
import { AuthRequest, requireAdmin } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

// GET /api/services - Public list of active services
router.get('/', (req, res) => {
  const data = db.get();
  const services = data.services
    .filter((s) => s.status === 'active')
    .sort((a, b) => a.sortOrder - b.sortOrder);
  res.json({ services });
});

// GET /api/services/admin/all - List all services for admin
router.get('/admin/all', requireAdmin, (req, res) => {
  const data = db.get();
  const services = [...data.services].sort((a, b) => a.sortOrder - b.sortOrder);
  res.json({ services });
});

// POST /api/services - Create Service (Admin only)
router.post('/', requireAdmin, upload.single('imageFile'), (req: AuthRequest, res: Response) => {
  const { name, description, price, duration, availability, imageUrl, sortOrder } = req.body;

  if (!name || !description || !price) {
    return res.status(400).json({ error: 'Name, description, and price are required' });
  }

  let finalImageUrl = imageUrl || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80';
  if (req.file) {
    finalImageUrl = `/uploads/${req.file.filename}`;
  }

  const id = `srv-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`;
  const order = sortOrder ? parseInt(sortOrder, 10) : 0;

  const newService: Service = {
    id,
    name,
    description,
    imageUrl: finalImageUrl,
    price,
    duration: duration || '24 Hours',
    availability: availability || 'Available',
    status: 'active',
    sortOrder: order
  };

  const data = db.get();
  data.services.push(newService);
  db.save();

  res.status(201).json({ message: 'Service created successfully', service: newService });
});

// PUT /api/services/:id - Update Service (Admin only)
router.put('/:id', requireAdmin, upload.single('imageFile'), (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const data = db.get();
  const index = data.services.findIndex((s) => s.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Service not found' });
  }

  const existing = data.services[index];
  const { name, description, price, duration, availability, imageUrl, status, sortOrder } = req.body;

  let finalImageUrl = existing.imageUrl;
  if (req.file) {
    finalImageUrl = `/uploads/${req.file.filename}`;
  } else if (imageUrl) {
    finalImageUrl = imageUrl;
  }

  data.services[index] = {
    ...existing,
    name: name || existing.name,
    description: description || existing.description,
    imageUrl: finalImageUrl,
    price: price || existing.price,
    duration: duration || existing.duration,
    availability: availability || existing.availability,
    status: status || existing.status,
    sortOrder: sortOrder !== undefined ? parseInt(sortOrder, 10) : existing.sortOrder
  };

  db.save();
  res.json({ message: 'Service updated successfully', service: data.services[index] });
});

// DELETE /api/services/:id - Delete Service (Admin only)
router.delete('/:id', requireAdmin, (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const data = db.get();
  const index = data.services.findIndex((s) => s.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Service not found' });
  }

  data.services.splice(index, 1);
  db.save();
  res.json({ message: 'Service deleted successfully' });
});

export default router;
