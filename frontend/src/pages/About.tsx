import React from 'react';
import { Sparkles, CheckCircle2, Shield, Heart, Award, Scissors, Clock } from 'lucide-react';
import { useBusiness } from '../context/BusinessContext';

export const About: React.FC = () => {
  const { getWhatsAppLink } = useBusiness();

  const steps = [
    {
      step: '01',
      title: 'Hand Inspection & Fabric Study',
      description: 'We carefully check your saree material (Silk, Georgette, Organza, Cotton, Tissue) to determine appropriate pleat width, steam level, and fold temperature.'
    },
    {
      step: '02',
      title: 'Precision Pallu & Fan Pleating',
      description: 'Using high-accuracy folding tools and hand measurement, we align every pallu border to lay flat and structured without bunching.'
    },
    {
      step: '03',
      title: 'Custom Waist & Body Fit Alignment',
      description: 'Pleats are customized based on customer height and body shape so the saree drapes comfortably without pulling or twisting.'
    },
    {
      step: '04',
      title: 'Non-Damaging Gentle Steam Press',
      description: 'We set the pleats permanently using delicate steam pressing that keeps saree fibers pristine while locking in razor-sharp lines.'
    },
    {
      step: '05',
      title: 'Pin-Free Boxing & Saree Bag Protection',
      description: 'The pre-pleated saree is carefully folded into a compact box shape, pinned safely with fabric guards, and sealed in a protective saree bag.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-pj-gold/20 text-pj-maroonDark text-xs font-bold border border-pj-gold/30">
          <Sparkles className="w-4 h-4 text-pj-goldDark" />
          <span>About PJ Saree Pleating Studio</span>
        </div>

        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-pj-maroonDark">
          Redefining Saree Preparation With Elegance & Precision
        </h1>

        <p className="text-base text-pj-charcoal/80 leading-relaxed font-light">
          At **PJ Saree Pleating**, our mission is simple: to make saree draping effortless, stress-free, and breathtakingly beautiful for every woman.
        </p>
      </div>

      {/* Story & Vision */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-6 space-y-6">
          <span className="text-xs font-bold uppercase tracking-widest text-pj-goldDark block">Our Heritage & Promise</span>
          <h2 className="font-serif text-3xl font-bold text-pj-maroonDark">
            Where Tradition Meets Modern Convenience
          </h2>
          <p className="text-sm sm:text-base text-pj-charcoal/80 leading-relaxed font-light">
            Sarees carry memories of celebrations, weddings, family heritage, and personal pride. However, getting those crisp, event-ready pleats on busy event mornings can be challenging and time-consuming.
          </p>
          <p className="text-sm sm:text-base text-pj-charcoal/80 leading-relaxed font-light">
            We started PJ Saree Pleating to provide a specialized, professional solution. Our studio treats every single saree with the utmost reverence—ensuring zero pin tears, zero fabric burns, and a drape that fits like tailored couture.
          </p>

          <div className="pt-4 grid grid-cols-2 gap-4">
            <div className="p-4 bg-pj-creamLight rounded-2xl border border-pj-gold/20 flex items-center space-x-3">
              <Shield className="w-8 h-8 text-pj-goldDark shrink-0" />
              <div>
                <h4 className="font-serif font-bold text-pj-maroonDark text-sm">Safe Pins</h4>
                <p className="text-[11px] text-pj-charcoal/70">Coated safety pins prevent snags.</p>
              </div>
            </div>

            <div className="p-4 bg-pj-creamLight rounded-2xl border border-pj-gold/20 flex items-center space-x-3">
              <Clock className="w-8 h-8 text-pj-goldDark shrink-0" />
              <div>
                <h4 className="font-serif font-bold text-pj-maroonDark text-sm">Quick Turnaround</h4>
                <p className="text-[11px] text-pj-charcoal/70">12 - 24 hour event delivery.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-pj-gold/30">
            <img
              src="/uploads/owner_work_2.jpg"
              alt="PJ Saree Pleating Process"
              className="w-full h-[440px] object-cover"
            />
          </div>
        </div>
      </div>

      {/* 5-Step Process */}
      <div className="space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-pj-goldDark">Craftsmanship</span>
          <h2 className="font-serif text-3xl font-bold text-pj-maroonDark">Our 5-Step Signature Pleating Method</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {steps.map((s) => (
            <div key={s.step} className="bg-pj-creamLight p-6 rounded-3xl border border-pj-gold/20 shadow-card flex flex-col justify-between space-y-4">
              <span className="font-serif text-3xl font-bold text-pj-gold">{s.step}</span>
              <h3 className="font-serif text-lg font-bold text-pj-maroonDark">{s.title}</h3>
              <p className="text-xs text-pj-charcoal/75 leading-relaxed font-light">{s.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Box */}
      <div className="bg-maroon-gradient text-pj-creamLight rounded-3xl p-10 text-center space-y-6 shadow-2xl border border-pj-gold">
        <h2 className="font-serif text-3xl font-bold text-white">Have an Upcoming Event or Wedding?</h2>
        <p className="text-sm text-pj-creamLight/80 max-w-xl mx-auto">
          Get your sarees pre-pleated and event-ready with PJ Saree Pleating. Contact us today to reserve your studio slot!
        </p>
        <a
          href={getWhatsAppLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-2 px-8 py-4 rounded-2xl bg-pj-gold text-pj-maroonDark font-bold text-sm shadow-lg hover:bg-pj-goldLight transition-all"
        >
          <Sparkles className="w-4 h-4" />
          <span>Book Saree Pleating Service</span>
        </a>
      </div>

    </div>
  );
};
