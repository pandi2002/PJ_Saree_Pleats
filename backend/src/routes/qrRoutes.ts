import { Router } from 'express';
import QRCode from 'qrcode';
import { db } from '../db/db';

const router = Router();

// GET /api/qr-code - Generates Data URL / SVG for the website URL
router.get('/', async (req, res) => {
  try {
    const targetUrl = (req.query.url as string) || 'https://pjsareepleating.com';
    const format = (req.query.format as string) || 'dataurl';

    if (format === 'svg') {
      const svg = await QRCode.toString(targetUrl, {
        type: 'svg',
        color: {
          dark: '#7A1C30',  // PJ Maroon/Burgundy
          light: '#FFFFFF'
        },
        margin: 2
      });
      res.setHeader('Content-Type', 'image/svg+xml');
      return res.send(svg);
    } else {
      const dataUrl = await QRCode.toDataURL(targetUrl, {
        width: 512,
        margin: 2,
        color: {
          dark: '#7A1C30',
          light: '#FFFFFF'
        }
      });
      return res.json({ targetUrl, qrDataUrl: dataUrl });
    }
  } catch (err) {
    return res.status(500).json({ error: 'Failed to generate QR Code' });
  }
});

export default router;
