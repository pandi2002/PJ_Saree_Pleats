import React, { useState, useEffect } from 'react';
import { Trash2, Users, CheckCircle, XCircle } from 'lucide-react';
import { api } from '../api/client';
import { CustomerSubmission } from '../types';

export const AdminSubmissions: React.FC = () => {
  const [submissions, setSubmissions] = useState<CustomerSubmission[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [isLoading, setIsLoading] = useState(true);

  const fetchSubmissions = async () => {
    try {
      const res = await api.get(`/submissions/admin/all?status=${activeTab}`);
      setSubmissions(res.data.submissions);
    } catch (err) {
      console.error('Failed to fetch submissions', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [activeTab]);

  const handleUpdateStatus = async (id: string, status: 'approved' | 'rejected' | 'pending') => {
    try {
      await api.put(`/submissions/admin/${id}/status`, { status });
      fetchSubmissions();
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this customer submission permanently?')) {
      try {
        await api.delete(`/submissions/admin/${id}`);
        fetchSubmissions();
      } catch (err) {
        console.error('Failed to delete submission', err);
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-pj-gold/20 pb-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-pj-maroonDark">Customer Photo Submissions</h1>
          <p className="text-xs text-pj-charcoal/70">Approve or reject customer-submitted saree photos & videos</p>
        </div>

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
        <div className="text-center py-16 text-xs text-pj-charcoal/60">Loading submissions...</div>
      ) : submissions.length === 0 ? (
        <div className="text-center py-16 bg-pj-creamLight rounded-3xl border border-dashed border-pj-gold/30">
          <p className="text-sm text-pj-charcoal/60 font-medium">No customer submissions found in tab "{activeTab}".</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {submissions.map((sub) => (
            <div key={sub.id} className="bg-pj-creamLight rounded-3xl overflow-hidden border border-pj-gold/20 shadow-card flex flex-col justify-between">
              <div className="relative h-60 bg-pj-creamDark">
                {sub.imageUrl ? (
                  <img src={sub.imageUrl} alt={sub.customerName} className="w-full h-full object-cover" />
                ) : sub.videoUrl ? (
                  <video src={sub.videoUrl} controls className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-pj-charcoal/40">No Media</div>
                )}
                <span
                  className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold ${
                    sub.status === 'approved'
                      ? 'bg-emerald-600 text-white'
                      : sub.status === 'pending'
                      ? 'bg-amber-500 text-white'
                      : 'bg-rose-600 text-white'
                  }`}
                >
                  {sub.status}
                </span>
              </div>

              <div className="p-5 space-y-3">
                <div>
                  <h3 className="font-serif font-bold text-base text-pj-maroonDark">{sub.customerName}</h3>
                  {sub.phoneOrEmail && <span className="text-[11px] text-pj-charcoal/60 block">{sub.phoneOrEmail}</span>}
                </div>
                <p className="text-xs text-pj-charcoal/80 font-light italic">"{sub.caption}"</p>

                <div className="pt-3 border-t border-pj-gold/15 flex items-center justify-between">
                  <span className="text-[10px] text-pj-charcoal/50">Consent Granted</span>
                  <div className="flex items-center space-x-2">
                    {sub.status !== 'approved' && (
                      <button
                        onClick={() => handleUpdateStatus(sub.id, 'approved')}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs shadow-sm hover:bg-emerald-700"
                      >
                        Approve
                      </button>
                    )}
                    {sub.status !== 'rejected' && (
                      <button
                        onClick={() => handleUpdateStatus(sub.id, 'rejected')}
                        className="px-3 py-1.5 rounded-lg bg-rose-50 text-rose-700 font-semibold text-xs border border-rose-200 hover:bg-rose-100"
                      >
                        Reject
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(sub.id)}
                      className="p-1.5 rounded-lg bg-rose-100 text-rose-800 hover:bg-rose-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
