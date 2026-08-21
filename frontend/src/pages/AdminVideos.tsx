import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Video, X } from 'lucide-react';
import { api } from '../api/client';
import { OwnerPost } from '../types';

export const AdminVideos: React.FC = () => {
  const [videos, setVideos] = useState<OwnerPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Reel');
  const [mediaUrl, setMediaUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const fetchVideos = async () => {
    try {
      const res = await api.get('/owner-posts?type=video');
      setVideos(res.data.posts);
    } catch (err) {
      console.error('Failed to fetch videos', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('category', category);
      formData.append('mediaType', 'video');

      if (selectedFile) {
        formData.append('mediaFile', selectedFile);
      } else if (mediaUrl) {
        formData.append('mediaUrl', mediaUrl);
      }

      await api.post('/owner-posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      fetchVideos();
      setIsModalOpen(false);
      setTitle('');
      setDescription('');
      setMediaUrl('');
      setSelectedFile(null);
    } catch (err) {
      console.error('Failed to save video', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this video?')) {
      try {
        await api.delete(`/owner-posts/${id}`);
        fetchVideos();
      } catch (err) {
        console.error('Failed to delete video', err);
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-pj-gold/20 pb-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-pj-maroonDark">Manage Owner Videos</h1>
          <p className="text-xs text-pj-charcoal/70">Upload & manage short Reels-style video demos for customers</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-pj-maroon text-pj-gold font-bold text-xs shadow-md flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Short Video / Reel</span>
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-16 text-xs text-pj-charcoal/60">Loading videos...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((vid) => (
            <div key={vid.id} className="bg-pj-creamLight rounded-3xl overflow-hidden border border-pj-gold/20 shadow-card flex flex-col justify-between">
              <div className="relative h-64 bg-black">
                <video src={vid.mediaUrl} className="w-full h-full object-cover" controls />
              </div>

              <div className="p-5 space-y-2">
                <h3 className="font-serif font-bold text-base text-pj-maroonDark">{vid.title}</h3>
                <p className="text-xs text-pj-charcoal/75 line-clamp-2">{vid.description}</p>
                <div className="pt-3 border-t border-pj-gold/15 flex items-center justify-end">
                  <button
                    onClick={() => handleDelete(vid.id)}
                    className="p-2 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="max-w-xl w-full bg-pj-creamLight rounded-3xl p-6 sm:p-8 border border-pj-gold/40 shadow-2xl relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-5 right-5 p-2 text-pj-charcoal/60 hover:text-pj-maroon">
              <X className="w-5 h-5" />
            </button>
            <h2 className="font-serif text-2xl font-bold text-pj-maroonDark mb-4">Upload Short Video / Reel</h2>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-pj-maroonDark mb-1">Video Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Quick 2-Minute Saree Draping Demo"
                  className="w-full px-4 py-2.5 rounded-xl border border-pj-gold/30 bg-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-pj-maroonDark mb-1">Description *</label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Short description of what happens in this video..."
                  className="w-full px-4 py-2.5 rounded-xl border border-pj-gold/30 bg-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-pj-maroonDark mb-1">Upload MP4 Video File OR Direct Video URL</label>
                <input
                  type="file"
                  accept="video/mp4,video/quicktime,video/webm"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  className="block w-full text-xs text-pj-charcoal/70 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-pj-gold/20 file:text-pj-maroonDark hover:file:bg-pj-gold/30 mb-2"
                />
                <input
                  type="text"
                  value={mediaUrl}
                  onChange={(e) => setMediaUrl(e.target.value)}
                  placeholder="https://assets.mixkit.co/..."
                  className="w-full px-4 py-2.5 rounded-xl border border-pj-gold/30 bg-white text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="w-full py-3.5 rounded-xl bg-maroon-gradient text-pj-gold font-bold text-sm shadow-md"
              >
                {isSaving ? 'Uploading Video...' : 'Publish Owner Video'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
