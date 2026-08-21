import React, { useState, useEffect } from 'react';
import { Star, CheckCircle, XCircle, Trash2, Filter } from 'lucide-react';
import { api } from '../api/client';
import { CustomerReview } from '../types';

export const AdminReviews: React.FC = () => {
  const [reviews, setReviews] = useState<CustomerReview[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [isLoading, setIsLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      const res = await api.get(`/reviews/admin/all?status=${activeTab}`);
      setReviews(res.data.reviews);
    } catch (err) {
      console.error('Failed to fetch reviews', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [activeTab]);

  const handleUpdateStatus = async (id: string, status: 'approved' | 'rejected' | 'pending') => {
    try {
      await api.put(`/reviews/admin/${id}/status`, { status });
      fetchReviews();
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this review permanently?')) {
      try {
        await api.delete(`/reviews/admin/${id}`);
        fetchReviews();
      } catch (err) {
        console.error('Failed to delete review', err);
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-pj-gold/20 pb-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-pj-maroonDark">Manage Customer Reviews</h1>
          <p className="text-xs text-pj-charcoal/70">Moderate submitted reviews before they appear publicly</p>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center space-x-1.5 bg-pj-creamDark p-1.5 rounded-2xl border border-pj-gold/30">
          {(['all', 'pending', 'approved', 'rejected'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                activeTab === tab
                  ? 'bg-pj-maroon text-pj-gold shadow-sm'
                  : 'text-pj-charcoal/70 hover:text-pj-maroon'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-16 text-xs text-pj-charcoal/60">Loading reviews...</div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-16 bg-pj-creamLight rounded-3xl border border-dashed border-pj-gold/30">
          <p className="text-sm text-pj-charcoal/60 font-medium">No reviews found in tab "{activeTab}".</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-pj-creamLight p-6 rounded-3xl border border-pj-gold/20 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center space-x-3">
                  <span className="font-serif font-bold text-base text-pj-maroonDark">{rev.customerName}</span>
                  <div className="flex items-center space-x-1">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-pj-gold text-pj-gold" />
                    ))}
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      rev.status === 'approved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : rev.status === 'pending'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {rev.status}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-pj-charcoal/80 italic font-serif">"{rev.review}"</p>
                <span className="text-[10px] text-pj-charcoal/50 block">
                  Submitted {new Date(rev.createdAt).toLocaleString()}
                </span>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                {rev.status !== 'approved' && (
                  <button
                    onClick={() => handleUpdateStatus(rev.id, 'approved')}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-sm hover:bg-emerald-700 transition-colors"
                  >
                    Approve
                  </button>
                )}
                {rev.status !== 'rejected' && (
                  <button
                    onClick={() => handleUpdateStatus(rev.id, 'rejected')}
                    className="px-3.5 py-2 rounded-xl bg-rose-50 text-rose-700 font-semibold text-xs border border-rose-200 hover:bg-rose-100 transition-colors"
                  >
                    Reject
                  </button>
                )}
                <button
                  onClick={() => handleDelete(rev.id)}
                  className="p-2 rounded-xl bg-rose-100 text-rose-800 hover:bg-rose-200 transition-colors"
                  title="Delete review"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
