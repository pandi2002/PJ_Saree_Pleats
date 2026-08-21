import React from 'react';
import { Phone, Mail, MapPin, Clock, MessageCircle, Navigation, Instagram, Facebook, Sparkles } from 'lucide-react';
import { useBusiness } from '../context/BusinessContext';

export const Contact: React.FC = () => {
  const { businessInfo, getWhatsAppLink } = useBusiness();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-pj-gold/20 text-pj-maroonDark text-xs font-bold border border-pj-gold/30">
          <MapPin className="w-4 h-4 text-pj-goldDark" />
          <span>Visit Studio or Connect Online</span>
        </div>

        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-pj-maroonDark">
          Contact PJ Saree Pleating
        </h1>

        <p className="text-base text-pj-charcoal/80 leading-relaxed font-light">
          Have questions about saree pleating turnaround times, custom fitting, or bulk event bookings? Reach out to us directly or visit our studio!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Contact Info Cards */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-pj-creamLight p-8 rounded-3xl border border-pj-gold/30 shadow-card space-y-6">
            <h3 className="font-serif text-2xl font-bold text-pj-maroonDark border-b border-pj-gold/20 pb-4">
              Studio Details
            </h3>

            {businessInfo && (
              <div className="space-y-5 text-sm">
                <div className="flex items-start space-x-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-pj-gold/15 text-pj-maroonDark flex items-center justify-center shrink-0 border border-pj-gold/30">
                    <MapPin className="w-5 h-5 text-pj-goldDark" />
                  </div>
                  <div>
                    <h4 className="font-bold text-pj-maroonDark text-xs uppercase tracking-wider">Studio Address</h4>
                    <p className="text-pj-charcoal/80 mt-0.5 leading-relaxed font-light">{businessInfo.address}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-pj-gold/15 text-pj-maroonDark flex items-center justify-center shrink-0 border border-pj-gold/30">
                    <Phone className="w-5 h-5 text-pj-goldDark" />
                  </div>
                  <div>
                    <h4 className="font-bold text-pj-maroonDark text-xs uppercase tracking-wider">Phone / Hotline</h4>
                    <a href={`tel:${businessInfo.phone}`} className="text-pj-maroon font-semibold hover:underline">
                      {businessInfo.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-pj-gold/15 text-pj-maroonDark flex items-center justify-center shrink-0 border border-pj-gold/30">
                    <MessageCircle className="w-5 h-5 text-pj-goldDark" />
                  </div>
                  <div>
                    <h4 className="font-bold text-pj-maroonDark text-xs uppercase tracking-wider">WhatsApp Business</h4>
                    <a href={getWhatsAppLink()} target="_blank" rel="noopener noreferrer" className="text-emerald-700 font-semibold hover:underline">
                      Click to chat on WhatsApp
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-pj-gold/15 text-pj-maroonDark flex items-center justify-center shrink-0 border border-pj-gold/30">
                    <Clock className="w-5 h-5 text-pj-goldDark" />
                  </div>
                  <div>
                    <h4 className="font-bold text-pj-maroonDark text-xs uppercase tracking-wider">Business Hours</h4>
                    <p className="text-pj-charcoal/80 mt-0.5 font-light">{businessInfo.businessHours}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Direct Action Buttons */}
            <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {businessInfo?.phone && (
                <a
                  href={`tel:${businessInfo.phone}`}
                  className="py-3 px-4 rounded-xl bg-pj-creamDark text-pj-maroonDark font-semibold text-xs border border-pj-gold/30 flex items-center justify-center space-x-2 hover:bg-pj-gold/20 transition-all"
                >
                  <Phone className="w-4 h-4 text-pj-maroon" />
                  <span>Call Now</span>
                </a>
              )}

              <a
                href={getWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-4 rounded-xl bg-maroon-gradient text-pj-gold font-bold text-xs shadow-md hover:shadow-gold flex items-center justify-center space-x-2 transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Us</span>
              </a>
            </div>

            {businessInfo?.googleMapsUrl && (
              <a
                href={businessInfo.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 rounded-xl bg-pj-gold text-pj-maroonDark font-bold text-xs flex items-center justify-center space-x-2 hover:bg-pj-goldLight transition-all"
              >
                <Navigation className="w-4 h-4" />
                <span>Get Directions On Google Maps</span>
              </a>
            )}
          </div>
        </div>

        {/* Map Placeholder / Visual Banner */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-pj-creamLight rounded-3xl overflow-hidden border border-pj-gold/30 shadow-card h-96 relative flex items-center justify-center bg-pj-creamDark">
            <iframe
              title="Google Maps Studio Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3886.5367675123!2d80.2300!3d13.0400!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTPCsDAyJzI0LjAiTiA4MMKwMTMnNDggMCJF!5e0!3m2!1sen!2sin!4v1600000000000!5m2!1sen!2sin"
              className="w-full h-full border-0 filter grayscale opacity-90 hover:grayscale-0 transition-all duration-500"
              loading="lazy"
            />
            <div className="absolute top-4 left-4 bg-pj-maroon text-pj-gold px-4 py-2 rounded-2xl shadow-xl border border-pj-gold/40 text-xs font-bold flex items-center space-x-1.5">
              <Sparkles className="w-4 h-4" />
              <span>PJ Saree Pleating Studio</span>
            </div>
          </div>

          <div className="p-6 bg-pj-maroonDark text-pj-creamLight rounded-3xl border border-pj-gold flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="font-serif text-lg font-bold text-pj-gold">Follow Us On Social Media</h4>
              <p className="text-xs text-pj-creamLight/75">Get daily saree pleating inspiration and client reels!</p>
            </div>
            <div className="flex items-center space-x-3">
              {businessInfo?.instagramUrl && (
                <a href={businessInfo.instagramUrl} target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-pj-maroon text-pj-gold hover:bg-pj-gold hover:text-pj-maroon transition-all">
                  <Instagram className="w-5 h-5" />
                </a>
              )}
              {businessInfo?.facebookUrl && (
                <a href={businessInfo.facebookUrl} target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-pj-maroon text-pj-gold hover:bg-pj-gold hover:text-pj-maroon transition-all">
                  <Facebook className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
