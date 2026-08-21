import React, { useState, useEffect } from 'react';
import { Sparkles, MessageCircle, Clock, CheckCircle2 } from 'lucide-react';
import { api } from '../api/client';
import { Service } from '../types';
import { ServiceCard } from '../components/ServiceCard';
import { useBusiness } from '../context/BusinessContext';

export const Services: React.FC = () => {
  const { getWhatsAppLink } = useBusiness();
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await api.get('/services');
        setServices(res.data.services);
      } catch (err) {
        console.error('Failed to fetch services', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchServices();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-pj-gold/20 text-pj-maroonDark text-xs font-bold border border-pj-gold/30">
          <Sparkles className="w-4 h-4 text-pj-goldDark" />
          <span>Professional Saree Service Catalog</span>
        </div>

        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-pj-maroonDark">
          Our Premium Saree Pleating Packages
        </h1>

        <p className="text-base text-pj-charcoal/80 leading-relaxed font-light">
          From grand bridal Kanjeevaram preparation to party-wear organza box pleating, explore our studio services below. Every service includes custom waist alignment and protective packaging.
        </p>
      </div>

      {/* Services Grid */}
      {isLoading ? (
        <div className="text-center py-20">
          <div className="w-10 h-10 border-4 border-pj-gold border-t-pj-maroon rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-pj-charcoal/60">Loading saree services...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      )}

      {/* Custom Request Banner */}
      <div className="bg-pj-creamLight rounded-3xl p-8 sm:p-12 border border-pj-gold/30 shadow-card flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-2 text-center md:text-left">
          <h3 className="font-serif text-2xl font-bold text-pj-maroonDark">Need Custom Pleating For Multiple Sarees?</h3>
          <p className="text-sm text-pj-charcoal/70 font-light">
            We offer special group packages for bridesmaids, family functions, and bulk wedding orders. Contact us on WhatsApp for custom pricing!
          </p>
        </div>

        <a
          href={getWhatsAppLink('Hi PJ Saree Pleating, I am interested in a bulk saree pleating package for an upcoming wedding/function.')}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 px-8 py-4 rounded-2xl bg-maroon-gradient text-pj-gold font-bold text-sm shadow-md hover:shadow-gold transition-all flex items-center space-x-2"
        >
          <MessageCircle className="w-5 h-5" />
          <span>Inquire Bulk Package</span>
        </a>
      </div>

    </div>
  );
};
