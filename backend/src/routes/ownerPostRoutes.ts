import { Router, Response } from 'express';
import crypto from 'crypto';
import { db, OwnerPost } from '../db/db';
import { AuthRequest, requireAdmin } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

// GET /api/owner-posts - Public list of owner posts
router.get('/', (req, res) => {
  const { category, type } = req.query;
  const data = db.get();
  let posts = [...data.owner_posts];

  if (category && category !== 'All') {
    posts = posts.filter((p) => p.category.toLowerCase() === (category as string).toLowerCase());
  }

  if (type) {
    posts = posts.filter((p) => p.mediaType.toLowerCase() === (type as string).toLowerCase());
  }

  posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  res.json({ posts });
});

// GET /api/owner-posts/:id - Get single owner post
router.get('/:id', (req, res) => {
  const data = db.get();
  const post = data.owner_posts.find((p) => p.id === req.params.id);
  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }
  res.json({ post });
});

// Protected Admin Endpoints
// POST /api/owner-posts - Create Owner Post (Image or Video)
router.post('/', requireAdmin, upload.single('mediaFile'), (req: AuthRequest, res: Response) => {
  const { title, description, category, mediaType, mediaUrl, tags } = req.body;

  if (!title || !description || !category) {
    return res.status(400).json({ error: 'Title, description, and category are required' });
  }

  let finalMediaUrl = mediaUrl || '';
  if (req.file) {
    finalMediaUrl = `/uploads/${req.file.filename}`;
  }

  if (!finalMediaUrl) {
    return res.status(400).json({ error: 'Media file or URL is required' });
  }

  const detectedMediaType = mediaType || (req.file?.mimetype.startsWith('video') ? 'video' : 'image');
  const id = `post-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
  const now = new Date().toISOString();

  const newPost: OwnerPost = {
    id,
    title,
    description,
    mediaUrl: finalMediaUrl,
    mediaType: detectedMediaType,
    category,
    tags: tags || '',
    createdAt: now,
    updatedAt: now
  };

  const data = db.get();
  data.owner_posts.unshift(newPost);
  db.save();

  res.status(201).json({ message: 'Owner post created successfully', post: newPost });
});

// POST /api/owner-posts/batch - Upload multiple photos/videos at once (Admin only)
router.post('/batch', requireAdmin, upload.array('mediaFiles', 50), (req: AuthRequest, res: Response) => {
  const { category, tags } = req.body;
  const files = (req.files as Express.Multer.File[]) || [];

  if (files.length === 0) {
    return res.status(400).json({ error: 'No media files provided for batch upload' });
  }

  const data = db.get();
  const createdPosts: OwnerPost[] = [];
  const now = new Date().toISOString();

  files.forEach((file, index) => {
    const isVideo = file.mimetype.startsWith('video');
    let rawTitle = file.originalname ? file.originalname.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ') : '';
    if (!rawTitle || /whatsapp|img_|vid_|snapchat|\d{8}/i.test(rawTitle)) {
      rawTitle = isVideo ? `Saree Draping Video Demo #${index + 1}` : `Precision Saree Pleating Work #${index + 1}`;
    }
    const title = rawTitle;
    const id = `post-${Date.now()}-${crypto.randomBytes(3).toString('hex')}-${index}`;

    const newPost: OwnerPost = {
      id,
      title,
      description: 'Precision pre-pleated saree prepared at PJ Saree Pleating studio. Event-ready box and fan pleat finishing.',
      mediaUrl: `/uploads/${file.filename}`,
      mediaType: isVideo ? 'video' : 'image',
      category: category || 'Bridal',
      tags: tags || 'PJSareePleating,PerfectPleats',
      createdAt: new Date(Date.now() - index * 1000).toISOString(),
      updatedAt: now
    };

    data.owner_posts.unshift(newPost);
    createdPosts.push(newPost);
  });

  db.save();
  res.status(201).json({
    message: `Successfully uploaded ${createdPosts.length} posts to gallery!`,
    posts: createdPosts
  });
});

// PUT /api/owner-posts/:id - Edit Owner Post
router.put('/:id', requireAdmin, upload.single('mediaFile'), (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const data = db.get();
  const index = data.owner_posts.findIndex((p) => p.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Post not found' });
  }

  const existing = data.owner_posts[index];
  const { title, description, category, mediaType, mediaUrl, tags } = req.body;

  let finalMediaUrl = existing.mediaUrl;
  if (req.file) {
    finalMediaUrl = `/uploads/${req.file.filename}`;
  } else if (mediaUrl) {
    finalMediaUrl = mediaUrl;
  }

  data.owner_posts[index] = {
    ...existing,
    title: title || existing.title,
    description: description || existing.description,
    category: category || existing.category,
    mediaType: mediaType || existing.mediaType,
    mediaUrl: finalMediaUrl,
    tags: tags !== undefined ? tags : existing.tags,
    updatedAt: new Date().toISOString()
  };

  db.save();
  res.json({ message: 'Post updated successfully', post: data.owner_posts[index] });
});

// DELETE /api/owner-posts/:id - Delete Owner Post
router.delete('/:id', requireAdmin, (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const data = db.get();
  const index = data.owner_posts.findIndex((p) => p.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Post not found' });
  }

  data.owner_posts.splice(index, 1);
  db.save();
  res.json({ message: 'Post deleted successfully' });
});

export default router;
