import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, Plus, CheckCircle2 } from 'lucide-react';
import { api } from '../api/client';
import { CustomerReview } from '../types';
import { ReviewModal } from '../components/ReviewModal';

export const Reviews: React.FC = () => {
  const [reviews, setReviews] = useState<CustomerReview[]>([]);
  const [stats, setStats] = useState({ totalReviews: 0, avgRating: 5.0 });
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchReviews = async () => {
    try {
      const res = await api.get('/reviews');
      setReviews(res.data.reviews);
      if (res.data.stats) {
        setStats(res.data.stats);
      }
    } catch (err) {
      console.error('Failed to fetch reviews', err);
    } fontFinally: {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-pj-gold/20 text-pj-maroonDark text-xs font-bold border border-pj-gold/30">
          <Star className="w-4 h-4 fill-pj-gold text-pj-gold" />
          <span>Real Customer Feedback</span>
        </div>

        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-pj-maroonDark">
          What Our Customers Say
        </h1>

        <p className="text-base text-pj-charcoal/80 leading-relaxed font-light">
          Read verified customer reviews from brides, function attendees, and saree lovers who experienced PJ Saree Pleating finishing.
        </p>

        {/* Rating Score Card */}
        <div className="bg-pj-creamLight p-6 rounded-3xl border border-pj-gold/30 shadow-card inline-flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left mt-4">
          <div className="text-center">
            <span className="font-serif text-5xl font-bold text-pj-maroonDark block">{stats.avgRating}</span>
            <div className="flex items-center justify-center space-x-1 my-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-pj-gold text-pj-gold" />
              ))}
            </div>
            <span className="text-xs text-pj-charcoal/60 font-medium">Based on {stats.totalReviews} verified reviews</span>
          </div>

          <div className="h-12 w-px bg-pj-gold/20 hidden sm:block" />

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3 rounded-2xl bg-maroon-gradient text-pj-gold font-bold text-sm shadow-md hover:shadow-gold transition-all flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Write Your Own Review</span>
          </button>
        </div>
      </div>

      {/* Reviews List */}
      {isLoading ? (
        <div className="text-center py-20">
          <div className="w-10 h-10 border-4 border-pj-gold border-t-pj-maroon rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-pj-charcoal/60">Loading customer reviews...</p>
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-16 bg-pj-creamLight rounded-3xl border border-dashed border-pj-gold/30">
          <p className="text-base text-pj-charcoal/60 font-medium">No reviews published yet. Be the first to write one!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-pj-creamLight p-6 sm:p-8 rounded-3xl border border-pj-gold/20 shadow-card flex flex-col justify-between space-y-6"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-pj-gold text-pj-gold" />
                    ))}
                  </div>
                  <span className="text-[11px] text-pj-charcoal/50">
                    {new Date(rev.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>

                <p className="text-sm sm:text-base text-pj-charcoal/85 italic font-serif leading-relaxed">
                  "{rev.review}"
                </p>

                {/* Media Attachment if present */}
                {rev.imageUrl && (
                  <div className="mt-3 rounded-2xl overflow-hidden h-44 bg-pj-creamDark border border-pj-gold/20">
                    <img src={rev.imageUrl} alt="Customer Review Media" className="w-full h-full object-cover" />
                  </div>
                )}
                {rev.videoUrl && (
                  <div className="mt-3 rounded-2xl overflow-hidden h-44 bg-black border border-pj-gold/20">
                    <video src={rev.videoUrl} controls className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-pj-gold/15 flex items-center space-x-3">
                <div className="w-11 h-11 rounded-full bg-pj-maroon text-pj-gold font-bold text-sm flex items-center justify-center border border-pj-gold/30 shadow-sm">
                  {rev.customerName.charAt(0)}
                </div>
                <div>
                  <h4 className="font-serif font-bold text-pj-maroonDark text-base">{rev.customerName}</h4>
                  <div className="flex items-center space-x-1 text-emerald-700 text-xs font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Verified PJ Saree Pleating Client</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Review Modal */}
      <ReviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchReviews}
      />

    </div>
  );
};
