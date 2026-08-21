import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { initDatabase } from './db/db';

import authRoutes from './routes/authRoutes';
import ownerPostRoutes from './routes/ownerPostRoutes';
import serviceRoutes from './routes/serviceRoutes';
import reviewRoutes from './routes/reviewRoutes';
import submissionRoutes from './routes/submissionRoutes';
import businessRoutes from './routes/businessRoutes';
import qrRoutes from './routes/qrRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Database
initDatabase();

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Uploaded Media Files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/owner-posts', ownerPostRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/business-info', businessRoutes);
app.use('/api/qr-code', qrRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', name: 'PJ Saree Pleating API', version: '1.0.0' });
});

// Serve production frontend dist if available
const frontendDistPath = path.join(__dirname, '../../frontend/dist');
if (fs.existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      return next();
    }
    res.sendFile(path.join(frontendDistPath, 'index.html'));
  });
} else {
  // Helpful root landing page when dev frontend is on port 3000
  app.get('/', (req, res) => {
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>PJ Saree Pleating - API Server Running</title>
          <style>
            body { font-family: system-ui, sans-serif; background: #FAF7F2; color: #2D2424; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 20px; text-align: center; }
            .card { background: #FFFDF9; border: 2px solid #D4AF37; border-radius: 24px; padding: 40px; max-width: 500px; box-shadow: 0 10px 30px rgba(122,28,48,0.1); }
            h1 { color: #7A1C30; font-size: 28px; margin: 0 0 10px 0; }
            p { color: #555; line-height: 1.6; margin-bottom: 25px; }
            .btn { display: inline-block; background: linear-gradient(135deg, #5B1222, #7A1C30); color: #D4AF37; font-weight: bold; text-decoration: none; padding: 14px 28px; border-radius: 16px; margin: 5px; shadow: 0 4px 15px rgba(122,28,48,0.2); }
            .btn:hover { background: #D4AF37; color: #5B1222; }
            .badge { background: #E6F4EA; color: #137333; font-weight: bold; padding: 4px 12px; border-radius: 20px; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="card">
            <span class="badge">Backend API Active</span>
            <h1>🌸 PJ Saree Pleating API</h1>
            <p>The backend server is running cleanly on <strong>Port 5000</strong>.</p>
            <p>To view the visual Website & UI, open the frontend dev server on <strong>Port 3000</strong>:</p>
            <div>
              <a class="btn" href="http://localhost:3000" target="_blank">Open Website (http://localhost:3000)</a>
              <a class="btn" href="http://localhost:3000/admin" target="_blank">Open Admin Portal</a>
            </div>
          </div>
        </body>
      </html>
    `);
  });
}

app.listen(PORT, () => {
  console.log(`🌸 PJ Saree Pleating Server running on http://localhost:${PORT}`);
});
