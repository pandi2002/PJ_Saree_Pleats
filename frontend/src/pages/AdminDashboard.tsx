import React, { useState, useEffect } from 'react';
import {
  Image,
  Video,
  Star,
  Users,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { DashboardStats, CustomerReview, CustomerSubmission } from '../types';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    ownerPostsCount: 0,
    videosCount: 0,
    pendingReviewsCount: 0,
    approvedReviewsCount: 0,
    pendingSubmissionsCount: 0,
    approvedSubmissionsCount: 0
  });
  const [recentPendingReviews, setRecentPendingReviews] = useState<CustomerReview[]>([]);
  const [recentPendingSubmissions, setRecentPendingSubmissions] = useState<CustomerSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboardStats = async () => {
    try {
      const res = await api.get('/business-info/stats');
      if (res.data.stats) {
        setStats(res.data.stats);
      }
      if (res.data.recentPendingReviews) {
        setRecentPendingReviews(res.data.recentPendingReviews);
      }
      if (res.data.recentPendingSubmissions) {
        setRecentPendingSubmissions(res.data.recentPendingSubmissions);
      }
    } catch (err) {
      console.error('Failed to fetch dashboard stats', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const handleReviewAction = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await api.put(`/reviews/admin/${id}/status`, { status });
      fetchDashboardStats();
    } catch (err) {
      console.error('Failed to update review status', err);
    }
  };

  const handleSubmissionAction = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await api.put(`/submissions/admin/${id}/status`, { status });
      fetchDashboardStats();
    } catch (err) {
      console.error('Failed to update submission status', err);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-pj-gold/20 pb-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-pj-maroonDark">
            Admin Dashboard Overview
          </h1>
          <p className="text-xs text-pj-charcoal/70">
            PJ Saree Pleating Business Metrics & Content Moderation Pipeline
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            to="/admin/posts"
            className="px-4 py-2 rounded-xl bg-pj-maroon text-pj-gold font-bold text-xs shadow-sm hover:bg-pj-maroonDark transition-all"
          >
            + Create Owner Post
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Card 1: Owner Posts */}
        <div className="bg-pj-creamLight p-5 rounded-3xl border border-pj-gold/20 shadow-card flex items-center justify-between">
          <div>
            <span className="text-xs text-pj-charcoal/60 font-medium block">Owner Posts</span>
            <span className="font-serif text-3xl font-bold text-pj-maroonDark mt-1 block">
              {stats.ownerPostsCount}
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-pj-gold/15 text-pj-maroon flex items-center justify-center border border-pj-gold/30">
            <Image className="w-6 h-6 text-pj-goldDark" />
          </div>
        </div>

        {/* Card 2: Short Videos */}
        <div className="bg-pj-creamLight p-5 rounded-3xl border border-pj-gold/20 shadow-card flex items-center justify-between">
          <div>
            <span className="text-xs text-pj-charcoal/60 font-medium block">Short Videos</span>
            <span className="font-serif text-3xl font-bold text-pj-maroonDark mt-1 block">
              {stats.videosCount}
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-pj-gold/15 text-pj-maroon flex items-center justify-center border border-pj-gold/30">
            <Video className="w-6 h-6 text-pj-goldDark" />
          </div>
        </div>

        {/* Card 3: Pending Reviews */}
        <div className="bg-pj-creamLight p-5 rounded-3xl border border-pj-gold/20 shadow-card flex items-center justify-between">
          <div>
            <span className="text-xs text-pj-charcoal/60 font-medium block">Pending Reviews</span>
            <span className="font-serif text-3xl font-bold text-amber-600 mt-1 block">
              {stats.pendingReviewsCount}
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200">
            <Star className="w-6 h-6 fill-amber-500 text-amber-500" />
          </div>
        </div>

        {/* Card 4: Pending Submissions */}
        <div className="bg-pj-creamLight p-5 rounded-3xl border border-pj-gold/20 shadow-card flex items-center justify-between">
          <div>
            <span className="text-xs text-pj-charcoal/60 font-medium block">Pending Photos</span>
            <span className="font-serif text-3xl font-bold text-amber-600 mt-1 block">
              {stats.pendingSubmissionsCount}
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200">
            <Users className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Moderation Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* 1. Pending Reviews Moderation */}
        <div className="bg-pj-creamLight p-6 rounded-3xl border border-pj-gold/30 shadow-card space-y-4">
          <div className="flex items-center justify-between border-b border-pj-gold/20 pb-3">
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-pj-goldDark fill-pj-gold" />
              <h3 className="font-serif text-lg font-bold text-pj-maroonDark">Pending Customer Reviews</h3>
            </div>
            <Link to="/admin/reviews" className="text-xs font-bold text-pj-maroon hover:underline">
              View All ({stats.pendingReviewsCount})
            </Link>
          </div>

          {recentPendingReviews.length === 0 ? (
            <div className="py-8 text-center text-xs text-pj-charcoal/60">
              <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              <span>No pending customer reviews awaiting moderation.</span>
            </div>
          ) : (
            <div className="space-y-4">
              {recentPendingReviews.map((rev) => (
                <div key={rev.id} className="p-4 rounded-2xl bg-white border border-pj-gold/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-pj-maroonDark">{rev.customerName}</span>
                    <div className="flex items-center space-x-1">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-pj-gold text-pj-gold" />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-pj-charcoal/80 font-light italic">"{rev.review}"</p>

                  <div className="flex items-center justify-end space-x-2 pt-2 border-t border-gray-100">
                    <button
                      onClick={() => handleReviewAction(rev.id, 'rejected')}
                      className="px-3 py-1.5 rounded-lg bg-rose-50 text-rose-700 font-semibold text-xs border border-rose-200 hover:bg-rose-100"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleReviewAction(rev.id, 'approved')}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs shadow-sm hover:bg-emerald-700"
                    >
                      Approve & Publish
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 2. Pending Submissions Moderation */}
        <div className="bg-pj-creamLight p-6 rounded-3xl border border-pj-gold/30 shadow-card space-y-4">
          <div className="flex items-center justify-between border-b border-pj-gold/20 pb-3">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-pj-maroon" />
              <h3 className="font-serif text-lg font-bold text-pj-maroonDark">Pending Customer Gallery Looks</h3>
            </div>
            <Link to="/admin/customer-submissions" className="text-xs font-bold text-pj-maroon hover:underline">
              View All ({stats.pendingSubmissionsCount})
            </Link>
          </div>

          {recentPendingSubmissions.length === 0 ? (
            <div className="py-8 text-center text-xs text-pj-charcoal/60">
              <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              <span>No pending customer photo uploads awaiting moderation.</span>
            </div>
          ) : (
            <div className="space-y-4">
              {recentPendingSubmissions.map((sub) => (
                <div key={sub.id} className="p-4 rounded-2xl bg-white border border-pj-gold/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-pj-maroonDark">{sub.customerName}</span>
                    <span className="text-[10px] text-pj-charcoal/50">{sub.phoneOrEmail}</span>
                  </div>

                  <p className="text-xs text-pj-charcoal/80 font-light font-sans">{sub.caption}</p>

                  {sub.imageUrl && (
                    <div className="h-28 rounded-xl overflow-hidden bg-pj-creamDark">
                      <img src={sub.imageUrl} alt="Pending look" className="w-full h-full object-cover" />
                    </div>
                  )}

                  <div className="flex items-center justify-end space-x-2 pt-2 border-t border-gray-100">
                    <button
                      onClick={() => handleSubmissionAction(sub.id, 'rejected')}
                      className="px-3 py-1.5 rounded-lg bg-rose-50 text-rose-700 font-semibold text-xs border border-rose-200 hover:bg-rose-100"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleSubmissionAction(sub.id, 'approved')}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs shadow-sm hover:bg-emerald-700"
                    >
                      Approve & Publish
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
