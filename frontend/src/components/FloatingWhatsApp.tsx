import React from 'react';
import { MessageCircle, Phone, Camera } from 'lucide-react';
import { useBusiness } from '../context/BusinessContext';
import { Link } from 'react-router-dom';

export const FloatingWhatsApp: React.FC = () => {
  const { businessInfo, getWhatsAppLink } = useBusiness();

  return (
    <>
      {/* Floating WhatsApp Button for Desktop/Tablet */}
      <a
        href={getWhatsAppLink()}
        target="_blank"
        rel="noopener noreferrer"
        className="hidden md:flex fixed bottom-6 right-6 z-40 items-center space-x-2.5 px-5 py-3.5 rounded-full bg-[#25D366] text-white font-bold shadow-2xl hover:scale-105 hover:bg-[#20ba5a] transition-all duration-300 group"
        aria-label="WhatsApp Contact"
      >
        <MessageCircle className="w-6 h-6 fill-white text-[#25D366] group-hover:rotate-12 transition-transform" />
        <span className="text-sm font-semibold tracking-wide">WhatsApp Us</span>
      </a>

      {/* Floating Bottom Quick Action Bar for Mobile Phones (QR / Mobile-First Experience) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-pj-creamLight/95 backdrop-blur-md border-t border-pj-gold/30 p-2.5 shadow-2xl flex items-center justify-around gap-2">
        {businessInfo?.phone && (
          <a
            href={`tel:${businessInfo.phone}`}
            className="flex-1 flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-xl bg-pj-creamDark text-pj-maroonDark font-semibold text-xs border border-pj-gold/30 active:scale-95 transition-transform"
          >
            <Phone className="w-4 h-4 text-pj-maroon" />
            <span>Call Us</span>
          </a>
        )}

        <a
          href={getWhatsAppLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-[1.5] flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-xl bg-maroon-gradient text-pj-gold font-bold text-xs shadow-md active:scale-95 transition-transform"
        >
          <MessageCircle className="w-4 h-4 fill-pj-gold text-pj-maroonDark" />
          <span>Book via WhatsApp</span>
        </a>

        <Link
          to="/submit"
          className="flex-1 flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-xl bg-pj-gold/20 text-pj-maroonDark font-semibold text-xs border border-pj-gold/40 active:scale-95 transition-transform"
        >
          <Camera className="w-4 h-4 text-pj-goldDark" />
          <span>Share Look</span>
        </Link>
      </div>
    </>
  );
};
