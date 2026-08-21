import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import { db } from '../db/db';
import { AuthRequest, generateToken, requireAdmin } from '../middleware/auth';

const router = Router();

// In-memory OTP storage: email -> { code: string, expiresAt: number }
const otpStore: Record<string, { code: string; expiresAt: number }> = {};

// Helper: Generate 6-digit OTP
function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Helper: Send Real Email via Nodemailer SMTP
async function sendOtpEmail(recipientEmail: string, code: string): Promise<boolean> {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    console.log(`ℹ️ [EMAIL DISPATCH] SMTP credentials not set. OTP [ ${code} ] logged for ${recipientEmail}.`);
    return false;
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass }
    });

    await transporter.sendMail({
      from: `"PJ Saree Pleating Security" <${user}>`,
      to: recipientEmail,
      subject: `🌸 ${code} is your PJ Saree Pleating Admin Security Code`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 24px; border: 2px solid #D4AF37; border-radius: 20px; background-color: #FFFDF9;">
          <h2 style="color: #4A0E17; text-align: center; font-family: Georgia, serif; margin-bottom: 5px;">🌸 PJ Saree Pleating</h2>
          <p style="color: #8B6B23; text-align: center; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; margin-top: 0;">Protected Owner & Admin Portal</p>
          <hr style="border: 0; border-top: 1px solid #EAD8B1; margin: 15px 0;" />
          <p style="color: #333; font-size: 14px; text-align: center;">Your 2-Step Login Security Verification Code is:</p>
          <div style="background-color: #4A0E17; color: #F5E6C8; padding: 18px; text-align: center; border-radius: 14px; font-size: 32px; font-weight: bold; letter-spacing: 8px; margin: 20px 0; border: 1px solid #D4AF37;">
            ${code}
          </div>
          <p style="color: #666; font-size: 12px; text-align: center; line-height: 1.5;">This code is valid for 10 minutes. If you did not attempt to sign into your PJ Saree Pleating Admin Portal, please secure your account immediately.</p>
        </div>
      `
    });

    console.log(`✅ [EMAIL DISPATCH SUCCESS] Real Security OTP email sent to ${recipientEmail}`);
    return true;
  } catch (err) {
    console.error(`❌ [EMAIL DISPATCH FAILED] Error sending email to ${recipientEmail}:`, err);
    return false;
  }
}

// POST /api/auth/login-step1 - Validate password & generate/send OTP
router.post('/login-step1', async (req, res) => {
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

  // Generate 6-digit OTP valid for 10 minutes
  const code = generateOtp();
  otpStore[admin.email.toLowerCase()] = {
    code,
    expiresAt: Date.now() + 10 * 60 * 1000
  };

  console.log(`🔐 [SECURITY ALERT] 2-Step OTP Code for ${admin.email}: [ ${code} ]`);

  // Attempt to send email
  const emailSent = await sendOtpEmail(admin.email, code);

  return res.json({
    requiresOtp: true,
    message: emailSent
      ? `Password verified! Security OTP code sent to ${admin.email}`
      : 'Password verified. 6-Digit Security OTP code generated!',
    email: admin.email,
    emailSent,
    demoOtp: emailSent ? undefined : code // Show fallback banner only if SMTP is not configured
  });
});

// POST /api/auth/verify-otp - Verify 6-digit OTP & generate auth token
router.post('/verify-otp', (req, res) => {
  const { email, otpCode } = req.body;
  if (!email || !otpCode) {
    return res.status(400).json({ error: 'Email and OTP code are required' });
  }

  const cleanEmail = email.toLowerCase();
  const record = otpStore[cleanEmail];

  if (!record) {
    return res.status(400).json({ error: 'No active OTP request found. Please login again.' });
  }

  if (Date.now() > record.expiresAt) {
    delete otpStore[cleanEmail];
    return res.status(400).json({ error: 'OTP code has expired. Please request a new code.' });
  }

  if (record.code !== otpCode.trim()) {
    return res.status(400).json({ error: 'Invalid 6-digit Security OTP code. Please try again.' });
  }

  // Clear OTP upon success
  delete otpStore[cleanEmail];

  const data = db.get();
  const admin = data.admins.find((a) => a.email.toLowerCase() === cleanEmail);
  if (!admin) {
    return res.status(404).json({ error: 'Admin account not found' });
  }

  const token = generateToken({ id: admin.id, email: admin.email, role: admin.role });

  return res.json({
    message: 'OTP verified. Access granted to Owner Portal!',
    token,
    admin: {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role
    }
  });
});

// POST /api/auth/login - Legacy/Direct login endpoint
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
