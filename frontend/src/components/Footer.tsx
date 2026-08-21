import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Phone, Mail, MapPin, Instagram, Facebook, MessageCircle, Heart } from 'lucide-react';
import { useBusiness } from '../context/BusinessContext';

export const Footer: React.FC = () => {
  const { businessInfo, getWhatsAppLink } = useBusiness();

  return (
    <footer className="bg-pj-maroonDark text-pj-creamLight pt-16 pb-24 md:pb-12 border-t-4 border-pj-gold">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-pj-gold flex items-center justify-center text-pj-maroonDark shadow-md">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-pj-gold">
                PJ Saree Pleating
              </span>
            </div>
            <p className="text-sm text-pj-creamLight/80 leading-relaxed font-light">
              Perfect Pleats. Beautiful Sarees. Effortless Elegance. Professional saree preparation and box pleating service designed for event-ready perfection.
            </p>
            <div className="pt-2 flex items-center space-x-3">
              {businessInfo?.instagramUrl && (
                <a
                  href={businessInfo.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-pj-maroon flex items-center justify-center text-pj-gold hover:bg-pj-gold hover:text-pj-maroon transition-all"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {businessInfo?.facebookUrl && (
                <a
                  href={businessInfo.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-pj-maroon flex items-center justify-center text-pj-gold hover:bg-pj-gold hover:text-pj-maroon transition-all"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              <a
                href={getWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-pj-maroon flex items-center justify-center text-pj-gold hover:bg-pj-gold hover:text-pj-maroon transition-all"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-lg font-semibold text-pj-gold mb-4 tracking-wide">Quick Links</h4>
            <ul className="space-y-2.5 text-sm text-pj-creamLight/80 font-medium">
              <li><Link to="/" className="hover:text-pj-gold transition-colors">Home</Link></li>
              <li><Link to="/about" className="hover:text-pj-gold transition-colors">About Us</Link></li>
              <li><Link to="/services" className="hover:text-pj-gold transition-colors">Saree Services</Link></li>
              <li><Link to="/our-work" className="hover:text-pj-gold transition-colors">Our Work Gallery</Link></li>
              <li><Link to="/videos" className="hover:text-pj-gold transition-colors">Short Videos / Reels</Link></li>
              <li><Link to="/reviews" className="hover:text-pj-gold transition-colors">Customer Reviews</Link></li>
              <li><Link to="/customer-gallery" className="hover:text-pj-gold transition-colors">Happy Customers</Link></li>
            </ul>
          </div>

          {/* Customer Action */}
          <div>
            <h4 className="font-serif text-lg font-semibold text-pj-gold mb-4 tracking-wide">Customer Zone</h4>
            <ul className="space-y-2.5 text-sm text-pj-creamLight/80 font-medium">
              <li>
                <Link to="/submit" className="text-pj-gold hover:underline flex items-center space-x-1 font-semibold">
                  <span>✨ Submit Your Saree Look</span>
                </Link>
              </li>
              <li><Link to="/reviews" className="hover:text-pj-gold transition-colors">Write a Review</Link></li>
              <li><Link to="/contact" className="hover:text-pj-gold transition-colors">Book Appointment</Link></li>
              <li><Link to="/admin/login" className="hover:text-pj-gold transition-colors text-xs opacity-75">Owner Portal Access</Link></li>
            </ul>
          </div>

          {/* Business Information */}
          <div className="space-y-3">
            <h4 className="font-serif text-lg font-semibold text-pj-gold mb-4 tracking-wide">Contact Studio</h4>
            {businessInfo && (
              <div className="space-y-3 text-sm text-pj-creamLight/80">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-pj-gold shrink-0 mt-0.5" />
                  <span>{businessInfo.address}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-pj-gold shrink-0" />
                  <a href={`tel:${businessInfo.phone}`} className="hover:text-pj-gold transition-colors">
                    {businessInfo.phone}
                  </a>
                </div>
                {businessInfo.email && (
                  <div className="flex items-center space-x-3">
                    <Mail className="w-4 h-4 text-pj-gold shrink-0" />
                    <a href={`mailto:${businessInfo.email}`} className="hover:text-pj-gold transition-colors">
                      {businessInfo.email}
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>

        <div className="mt-12 pt-8 border-t border-pj-creamLight/10 text-center text-xs text-pj-creamLight/60 flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© 2026 PJ Saree Pleating. All Rights Reserved.</p>
          <p className="flex items-center space-x-1">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-pj-gold fill-pj-gold" />
            <span>for saree lovers everywhere</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
