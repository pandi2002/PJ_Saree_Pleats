import React from 'react';
import { Clock, CheckCircle2, MessageCircle, Sparkles } from 'lucide-react';
import { Service } from '../types';
import { useBusiness } from '../context/BusinessContext';

interface ServiceCardProps {
  service: Service;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  const { getWhatsAppLink } = useBusiness();
  const whatsappMsg = `Hi PJ Saree Pleating, I would like to book the "${service.name}" service (${service.price}). Please share available slots.`;

  return (
    <div className="group bg-pj-creamLight rounded-3xl overflow-hidden border border-pj-gold/20 shadow-card hover:shadow-premium transition-all duration-300 flex flex-col h-full hover:-translate-y-1">
      {/* Image Banner */}
      <div className="relative h-52 overflow-hidden bg-pj-creamDark">
        <img
          src={service.imageUrl}
          alt={service.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-pj-charcoal/70 via-transparent to-transparent" />
        
        {/* Availability Badge */}
        <div className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold bg-pj-maroon/90 text-pj-gold backdrop-blur-md border border-pj-gold/40 shadow-sm flex items-center space-x-1">
          <Sparkles className="w-3 h-3" />
          <span>{service.availability}</span>
        </div>

        {/* Price Tag */}
        <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between text-white">
          <div>
            <span className="text-xs uppercase tracking-wider text-pj-goldLight font-medium block">Starting at</span>
            <span className="font-serif text-xl font-bold text-white tracking-tight">{service.price}</span>
          </div>
          <div className="flex items-center space-x-1 text-xs text-pj-creamLight/90 bg-black/40 px-2.5 py-1 rounded-lg backdrop-blur-sm">
            <Clock className="w-3.5 h-3.5 text-pj-gold" />
            <span>{service.duration}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h3 className="font-serif text-xl font-bold text-pj-maroonDark group-hover:text-pj-maroon transition-colors">
            {service.name}
          </h3>
          <p className="text-sm text-pj-charcoal/75 mt-2 leading-relaxed font-light">
            {service.description}
          </p>
        </div>

        {/* Features Checklist */}
        <div className="pt-2 border-t border-pj-gold/10 space-y-1.5 text-xs text-pj-charcoal/80 font-medium">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-pj-goldDark shrink-0" />
            <span>Structured fan & box pleating</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-pj-goldDark shrink-0" />
            <span>Includes protective saree packaging</span>
          </div>
        </div>

        {/* WhatsApp Book Action */}
        <a
          href={getWhatsAppLink(whatsappMsg)}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center space-x-2 py-3 rounded-2xl bg-maroon-gradient text-pj-gold font-semibold text-sm shadow-md hover:shadow-gold transition-all duration-300 group-hover:bg-pj-gold group-hover:text-pj-maroonDark"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Book This Service</span>
        </a>
      </div>
    </div>
  );
};
