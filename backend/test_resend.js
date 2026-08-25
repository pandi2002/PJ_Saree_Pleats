const https = require('https');

// Resend API key
const apiKey = process.env.RESEND_API_KEY || 're_Y62nFshj_86wZ5b91b9bH2S1S';

function sendResendEmail(toEmail, code) {
  const data = JSON.stringify({
    from: 'PJ Saree Pleating Security <onboarding@resend.dev>',
    to: [toEmail],
    subject: `🌸 ${code} is your PJ Saree Pleating Security OTP Code`,
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

  const options = {
    hostname: 'api.resend.com',
    port: 443,
    path: '/emails',
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(data)
    }
  };

  const req = https.request(options, (res) => {
    let responseData = '';
    res.on('data', (chunk) => { responseData += chunk; });
    res.on('end', () => {
      console.log('Resend Response Status:', res.statusCode);
      console.log('Resend Response Data:', responseData);
    });
  });

  req.on('error', (e) => {
    console.error('Resend Request Error:', e);
  });

  req.write(data);
  req.end();
}

sendResendEmail('dharshyammu@gmail.com', '849201');
