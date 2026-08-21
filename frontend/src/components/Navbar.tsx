import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sparkles, Phone, MessageCircle, ShieldCheck } from 'lucide-react';
import { useBusiness } from '../context/BusinessContext';
import { useAuth } from '../context/AuthContext';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { businessInfo, getWhatsAppLink } = useBusiness();
  const { isAuthenticated } = useAuth();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Our Work', path: '/our-work' },
    { name: 'Videos', path: '/videos' },
    { name: 'Reviews', path: '/reviews' },
    { name: 'Customer Gallery', path: '/customer-gallery' },
    { name: 'Contact', path: '/contact' }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-pj-creamLight/90 backdrop-blur-md border-b border-pj-gold/20 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-11 h-11 rounded-full bg-maroon-gradient flex items-center justify-center text-pj-gold shadow-md group-hover:scale-105 transition-transform">
              <Sparkles className="w-6 h-6 animate-pulse-subtle" />
            </div>
            <div>
              <span className="font-serif text-2xl font-bold tracking-tight text-pj-maroonDark block leading-none">
                PJ Saree Pleating
              </span>
              <span className="text-[10px] tracking-widest uppercase font-medium text-pj-goldDark block mt-1">
                Perfect Pleats • Effortless Elegance
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3.5 py-2 rounded-full text-sm font-medium transition-all ${
                  isActive(link.path)
                    ? 'bg-pj-maroon text-pj-creamLight font-semibold shadow-sm'
                    : 'text-pj-charcoal/80 hover:text-pj-maroon hover:bg-pj-gold/10'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Action CTAs */}
          <div className="hidden lg:flex items-center space-x-3">
            {isAuthenticated ? (
              <Link
                to="/admin/dashboard"
                className="flex items-center space-x-1.5 px-3.5 py-2 rounded-full text-xs font-semibold bg-pj-gold/20 text-pj-maroonDark hover:bg-pj-gold/30 transition-all border border-pj-gold/40"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Admin Dashboard</span>
              </Link>
            ) : null}

            <a
              href={getWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 px-5 py-2.5 rounded-full text-sm font-semibold bg-maroon-gradient text-pj-gold hover:shadow-gold transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Us</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center space-x-2">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2.5 rounded-xl bg-pj-gold/10 text-pj-maroon hover:bg-pj-gold/20 transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="lg:hidden bg-pj-creamLight border-b border-pj-gold/20 shadow-xl px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top duration-300">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={`block px-4 py-3 rounded-xl text-base font-medium transition-all ${
                isActive(link.path)
                  ? 'bg-pj-maroon text-pj-creamLight font-semibold shadow-sm'
                  : 'text-pj-charcoal hover:bg-pj-gold/10 hover:text-pj-maroon'
              }`}
            >
              {link.name}
            </Link>
          ))}

          <div className="pt-4 border-t border-pj-gold/20 flex flex-col space-y-2.5">
            <a
              href={getWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl font-semibold bg-maroon-gradient text-pj-gold shadow-md text-base"
            >
              <MessageCircle className="w-5 h-5" />
              <span>WhatsApp Direct Booking</span>
            </a>

            {businessInfo?.phone && (
              <a
                href={`tel:${businessInfo.phone}`}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl font-medium bg-pj-creamDark text-pj-maroonDark text-sm border border-pj-gold/30"
              >
                <Phone className="w-4 h-4" />
                <span>Call {businessInfo.phone}</span>
              </a>
            )}

            {isAuthenticated ? (
              <Link
                to="/admin/dashboard"
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl font-medium bg-pj-gold/20 text-pj-maroonDark text-sm border border-pj-gold/40"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Admin Dashboard</span>
              </Link>
            ) : (
              <Link
                to="/admin/login"
                onClick={() => setIsOpen(false)}
                className="text-center text-xs text-pj-charcoal/50 hover:text-pj-maroon py-1 block"
              >
                Owner / Admin Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
