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

      {/* Metric Cards Grid - Interactive Clickable Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Card 1: Owner Posts -> Redirects to /admin/posts */}
        <Link
          to="/admin/posts"
          className="bg-pj-creamLight p-5 rounded-3xl border border-pj-gold/20 shadow-card hover:border-pj-gold hover:shadow-gold/20 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-pj-charcoal/60 font-medium block">Owner Posts</span>
              <span className="font-serif text-3xl font-bold text-pj-maroonDark mt-1 block">
                {stats.ownerPostsCount}
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-pj-gold/15 text-pj-maroon flex items-center justify-center border border-pj-gold/30 group-hover:scale-110 transition-transform">
              <Image className="w-6 h-6 text-pj-goldDark" />
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-pj-gold/10 flex items-center justify-between text-[11px] font-bold text-pj-goldDark group-hover:text-pj-maroon transition-colors">
            <span>Manage Posts</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* Card 2: Short Videos -> Redirects to /admin/videos */}
        <Link
          to="/admin/videos"
          className="bg-pj-creamLight p-5 rounded-3xl border border-pj-gold/20 shadow-card hover:border-pj-gold hover:shadow-gold/20 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-pj-charcoal/60 font-medium block">Short Videos</span>
              <span className="font-serif text-3xl font-bold text-pj-maroonDark mt-1 block">
                {stats.videosCount}
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-pj-gold/15 text-pj-maroon flex items-center justify-center border border-pj-gold/30 group-hover:scale-110 transition-transform">
              <Video className="w-6 h-6 text-pj-goldDark" />
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-pj-gold/10 flex items-center justify-between text-[11px] font-bold text-pj-goldDark group-hover:text-pj-maroon transition-colors">
            <span>Manage Videos</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* Card 3: Pending Reviews -> Redirects to /admin/reviews */}
        <Link
          to="/admin/reviews"
          className="bg-pj-creamLight p-5 rounded-3xl border border-pj-gold/20 shadow-card hover:border-amber-400 hover:shadow-amber-200/50 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-pj-charcoal/60 font-medium block">Pending Reviews</span>
              <span className="font-serif text-3xl font-bold text-amber-600 mt-1 block">
                {stats.pendingReviewsCount}
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200 group-hover:scale-110 transition-transform">
              <Star className="w-6 h-6 fill-amber-500 text-amber-500" />
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-pj-gold/10 flex items-center justify-between text-[11px] font-bold text-amber-700 group-hover:text-amber-800 transition-colors">
            <span>Moderate Reviews</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* Card 4: Pending Photos -> Redirects to /admin/customer-submissions */}
        <Link
          to="/admin/customer-submissions"
          className="bg-pj-creamLight p-5 rounded-3xl border border-pj-gold/20 shadow-card hover:border-amber-400 hover:shadow-amber-200/50 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-pj-charcoal/60 font-medium block">Pending Photos</span>
              <span className="font-serif text-3xl font-bold text-amber-600 mt-1 block">
                {stats.pendingSubmissionsCount}
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200 group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-pj-gold/10 flex items-center justify-between text-[11px] font-bold text-amber-700 group-hover:text-amber-800 transition-colors">
            <span>Approve Photos</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

      </div>

      {/* Moderation Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Pending Reviews Moderation Card */}
        <div className="bg-pj-creamLight p-6 rounded-3xl border border-pj-gold/30 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-pj-gold/20 pb-3">
            <h2 className="font-serif text-xl font-bold text-pj-maroonDark flex items-center space-x-2">
              <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
              <span>Pending Reviews ({recentPendingReviews.length})</span>
            </h2>
            <Link to="/admin/reviews" className="text-xs font-semibold text-pj-maroon hover:underline flex items-center space-x-1">
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {recentPendingReviews.length === 0 ? (
            <p className="text-xs text-pj-charcoal/60 py-4 text-center">No pending reviews requiring moderation.</p>
          ) : (
            <div className="space-y-3">
              {recentPendingReviews.map((review) => (
                <div key={review.id} className="p-3.5 rounded-2xl bg-white border border-pj-gold/20 flex items-start justify-between space-x-3 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-pj-maroonDark">{review.customerName}</span>
                      <span className="text-[10px] text-amber-600 font-bold">★ {review.rating}/5</span>
                    </div>
                    <p className="text-pj-charcoal/80 italic">"{review.review}"</p>
                  </div>
                  <div className="flex items-center space-x-1 shrink-0">
                    <button
                      onClick={() => handleReviewAction(review.id, 'approved')}
                      className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
                      title="Approve Review"
                    >
                      <CheckCircle className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleReviewAction(review.id, 'rejected')}
                      className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
                      title="Reject Review"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pending Customer Photo Submissions */}
        <div className="bg-pj-creamLight p-6 rounded-3xl border border-pj-gold/30 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-pj-gold/20 pb-3">
            <h2 className="font-serif text-xl font-bold text-pj-maroonDark flex items-center space-x-2">
              <Users className="w-5 h-5 text-pj-maroon" />
              <span>Pending Customer Photos ({recentPendingSubmissions.length})</span>
            </h2>
            <Link to="/admin/customer-submissions" className="text-xs font-semibold text-pj-maroon hover:underline flex items-center space-x-1">
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {recentPendingSubmissions.length === 0 ? (
            <p className="text-xs text-pj-charcoal/60 py-4 text-center">No customer photo submissions awaiting approval.</p>
          ) : (
            <div className="space-y-3">
              {recentPendingSubmissions.map((sub) => (
                <div key={sub.id} className="p-3.5 rounded-2xl bg-white border border-pj-gold/20 flex items-center justify-between space-x-3 text-xs">
                  <div className="flex items-center space-x-3">
                    {sub.imageUrl && (
                      <img src={sub.imageUrl} alt={sub.customerName} className="w-10 h-10 rounded-xl object-cover border border-pj-gold/30" />
                    )}
                    <div>
                      <span className="font-bold text-pj-maroonDark block">{sub.customerName}</span>
                      <span className="text-[10px] text-pj-charcoal/60 block">{sub.caption}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 shrink-0">
                    <button
                      onClick={() => handleSubmissionAction(sub.id, 'approved')}
                      className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
                      title="Approve Submission"
                    >
                      <CheckCircle className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleSubmissionAction(sub.id, 'rejected')}
                      className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
                      title="Reject Submission"
                    >
                      <XCircle className="w-4 h-4" />
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
