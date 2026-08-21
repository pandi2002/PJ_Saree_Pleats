import React, { useState, useEffect } from 'react';
import { Camera, Sparkles, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { CustomerSubmission } from '../types';

export const CustomerGallery: React.FC = () => {
  const [submissions, setSubmissions] = useState<CustomerSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const res = await api.get('/submissions');
        setSubmissions(res.data.submissions);
      } catch (err) {
        console.error('Failed to fetch customer gallery', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSubmissions();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-pj-gold/20 text-pj-maroonDark text-xs font-bold border border-pj-gold/30">
          <Camera className="w-4 h-4 text-pj-goldDark" />
          <span>Our Happy Customers Wall</span>
        </div>

        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-pj-maroonDark">
          Real Clients, Beautiful Saree Moments
        </h1>

        <p className="text-base text-pj-charcoal/80 leading-relaxed font-light">
          Explore photos and videos shared by our wonderful clients wearing PJ Saree Pleating pre-pleated sarees to weddings, receptions, and special functions!
        </p>

        <div className="pt-2">
          <Link
            to="/submit"
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-pj-maroon text-pj-gold font-bold text-xs shadow-md hover:bg-pj-maroonDark transition-all"
          >
            <Heart className="w-4 h-4 fill-pj-gold" />
            <span>Submit Your Own Saree Look</span>
          </Link>
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="text-center py-20">
          <div className="w-10 h-10 border-4 border-pj-gold border-t-pj-maroon rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-pj-charcoal/60">Loading customer gallery...</p>
        </div>
      ) : submissions.length === 0 ? (
        <div className="text-center py-16 bg-pj-creamLight rounded-3xl border border-dashed border-pj-gold/30 space-y-3">
          <p className="text-base text-pj-charcoal/60 font-medium">No customer photos approved yet.</p>
          <Link to="/submit" className="text-xs font-bold text-pj-maroon underline">Be the first to submit a photo!</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {submissions.map((sub) => (
            <div
              key={sub.id}
              className="bg-pj-creamLight rounded-3xl overflow-hidden border border-pj-gold/20 shadow-card flex flex-col justify-between"
            >
              <div className="relative h-72 sm:h-80 bg-pj-creamDark overflow-hidden">
                {sub.imageUrl ? (
                  <img src={sub.imageUrl} alt={sub.customerName} className="w-full h-full object-cover" loading="lazy" />
                ) : sub.videoUrl ? (
                  <video src={sub.videoUrl} controls className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-pj-cream">
                    <Sparkles className="w-12 h-12 text-pj-gold" />
                  </div>
                )}
                <div className="absolute top-3 right-3 px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-700 text-white shadow-sm">
                  Verified Client
                </div>
              </div>

              <div className="p-5 space-y-2">
                <h3 className="font-serif font-bold text-lg text-pj-maroonDark">{sub.customerName}</h3>
                <p className="text-xs sm:text-sm text-pj-charcoal/80 font-light italic">"{sub.caption}"</p>
                <span className="text-[10px] text-pj-charcoal/50 block pt-1">
                  Posted {new Date(sub.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
