import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { Download, Printer, QrCode, Sparkles, Copy, Check } from 'lucide-react';

interface QRGeneratorCardProps {
  initialUrl?: string;
}

export const QRGeneratorCard: React.FC<QRGeneratorCardProps> = ({
  initialUrl = 'https://pjsareepleating.com'
}) => {
  const [targetUrl, setTargetUrl] = useState(initialUrl);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    generateQR(targetUrl);
  }, [targetUrl]);

  const generateQR = async (url: string) => {
    try {
      const dataUrl = await QRCode.toDataURL(url, {
        width: 600,
        margin: 2,
        color: {
          dark: '#7A1C30',
          light: '#FFFFFF'
        }
      });
      setQrDataUrl(dataUrl);
    } catch (err) {
      console.error('Failed to generate QR code', err);
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = `PJ_Saree_Pleating_QR.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>PJ Saree Pleating - Business QR Code</title>
            <style>
              body { font-family: sans-serif; text-align: center; padding: 40px; color: #2D2424; }
              .card { border: 2px solid #D4AF37; padding: 30px; border-radius: 20px; max-width: 400px; margin: 0 auto; background: #FAF7F2; }
              h1 { color: #7A1C30; font-size: 24px; margin-bottom: 5px; }
              p { color: #AA820A; font-size: 14px; margin-top: 0; }
              img { width: 260px; height: 260px; border-radius: 12px; margin: 20px 0; }
              .footer { font-size: 12px; color: #666; margin-top: 15px; }
            </style>
          </head>
          <body>
            <div class="card">
              <h1>PJ Saree Pleating</h1>
              <p>Perfect Pleats • Beautiful Sarees • Effortless Elegance</p>
              <img src="${qrDataUrl}" alt="PJ Saree Pleating QR" />
              <p><strong>Scan QR Code to View Work & Book Services</strong></p>
              <div class="footer">${targetUrl}</div>
            </div>
            <script>
              window.onload = function() { window.print(); window.close(); }
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(targetUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-pj-creamLight rounded-3xl p-6 sm:p-8 border border-pj-gold/30 shadow-card space-y-6">
      <div className="flex items-center space-x-3 border-b border-pj-gold/20 pb-4">
        <div className="w-10 h-10 rounded-2xl bg-pj-maroon text-pj-gold flex items-center justify-center shadow-md">
          <QrCode className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-serif text-xl font-bold text-pj-maroonDark">Business QR Code Studio</h3>
          <p className="text-xs text-pj-charcoal/70">
            Official QR code for business cards, saree covers, flyers & shop boards
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Visual QR Card Display */}
        <div className="bg-gradient-to-br from-pj-cream via-pj-creamLight to-pj-creamDark p-6 rounded-3xl border-2 border-pj-gold/40 shadow-premium text-center flex flex-col items-center space-y-4">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-pj-goldDark" />
            <span className="font-serif text-lg font-bold text-pj-maroonDark">PJ Saree Pleating</span>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-md border border-pj-gold/20 inline-block">
            {qrDataUrl && (
              <img src={qrDataUrl} alt="Website QR Code" className="w-48 h-48 sm:w-56 sm:h-56 object-contain" />
            )}
          </div>

          <p className="text-xs font-semibold text-pj-maroonDark uppercase tracking-wider">
            Scan to Explore & Book Saree Pleats
          </p>
          <span className="text-[11px] text-pj-charcoal/60 truncate max-w-full font-mono">
            {targetUrl}
          </span>
        </div>

        {/* Configuration & Downloads */}
        <div className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-pj-maroonDark mb-1">
              QR Target Website URL
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                placeholder="https://pjsareepleating.com"
                className="w-full px-4 py-2.5 rounded-xl border border-pj-gold/30 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-pj-gold"
              />
              <button
                onClick={handleCopyLink}
                className="p-2.5 rounded-xl bg-pj-gold/10 text-pj-maroon hover:bg-pj-gold/20 transition-colors"
                title="Copy Link"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="p-4 bg-pj-gold/10 rounded-2xl border border-pj-gold/30 text-xs text-pj-charcoal/80 space-y-1.5">
            <p className="font-bold text-pj-maroonDark">💡 Usage Suggestions:</p>
            <ul className="list-disc list-inside space-y-1 text-pj-charcoal/70">
              <li>Print on Saree Packaging bags & Thank-you cards</li>
              <li>Display at physical shop counter & window boards</li>
              <li>Include on business cards & WhatsApp posters</li>
            </ul>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleDownload}
              className="flex-1 py-3 px-4 rounded-xl bg-maroon-gradient text-pj-gold font-bold text-sm shadow-md hover:shadow-gold flex items-center justify-center space-x-2 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Download High-Res PNG</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex-1 py-3 px-4 rounded-xl bg-pj-creamDark text-pj-maroonDark font-semibold text-sm border border-pj-gold/40 flex items-center justify-center space-x-2 hover:bg-pj-gold/20 transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Print Display Card</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
