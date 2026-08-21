import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit3, Image, Video, X, Upload, Layers } from 'lucide-react';
import { api } from '../api/client';
import { OwnerPost } from '../types';

export const AdminPosts: React.FC = () => {
  const [posts, setPosts] = useState<OwnerPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<OwnerPost | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Bridal');
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [mediaUrl, setMediaUrl] = useState('');
  const [tags, setTags] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Batch upload states
  const [batchFiles, setBatchFiles] = useState<FileList | null>(null);
  const [batchCategory, setBatchCategory] = useState('Bridal');
  const [isBatchSaving, setIsBatchSaving] = useState(false);

  const fetchPosts = async () => {
    try {
      const res = await api.get('/owner-posts?type=image');
      setPosts(res.data.posts);
    } catch (err) {
      console.error('Failed to fetch posts', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleOpenModal = (post?: OwnerPost) => {
    if (post) {
      setEditingPost(post);
      setTitle(post.title);
      setDescription(post.description);
      setCategory(post.category);
      setMediaType(post.mediaType);
      setMediaUrl(post.mediaUrl);
      setTags(post.tags || '');
    } else {
      setEditingPost(null);
      setTitle('');
      setDescription('');
      setCategory('Bridal');
      setMediaType('image');
      setMediaUrl('');
      setTags('');
    }
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('category', category);
      formData.append('mediaType', mediaType);
      formData.append('tags', tags);

      if (selectedFile) {
        formData.append('mediaFile', selectedFile);
      } else if (mediaUrl) {
        formData.append('mediaUrl', mediaUrl);
      }

      if (editingPost) {
        await api.put(`/owner-posts/${editingPost.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await api.post('/owner-posts', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      fetchPosts();
      setIsModalOpen(false);
    } catch (err) {
      console.error('Failed to save post', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleBatchSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!batchFiles || batchFiles.length === 0) return;

    setIsBatchSaving(true);
    try {
      const formData = new FormData();
      formData.append('category', batchCategory);
      Array.from(batchFiles).forEach((file) => {
        formData.append('mediaFiles', file);
      });

      await api.post('/owner-posts/batch', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      fetchPosts();
      setIsBatchModalOpen(false);
      setBatchFiles(null);
    } catch (err) {
      console.error('Batch upload failed', err);
    } finally {
      setIsBatchSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this owner post?')) {
      try {
        await api.delete(`/owner-posts/${id}`);
        fetchPosts();
      } catch (err) {
        console.error('Failed to delete post', err);
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-pj-gold/20 pb-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-pj-maroonDark">Manage Owner Posts</h1>
          <p className="text-xs text-pj-charcoal/70">Upload & manage official studio gallery photos & close-ups ({posts.length} published)</p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsBatchModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-pj-gold text-pj-maroonDark font-bold text-xs shadow-md flex items-center space-x-2 hover:bg-pj-goldLight transition-all"
          >
            <Layers className="w-4 h-4" />
            <span>⚡ Batch Upload Files</span>
          </button>

          <button
            onClick={() => handleOpenModal()}
            className="px-5 py-2.5 rounded-xl bg-pj-maroon text-pj-gold font-bold text-xs shadow-md flex items-center space-x-2 hover:bg-pj-maroonDark transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Single Post</span>
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-16 text-xs text-pj-charcoal/60">Loading owner posts...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div key={post.id} className="bg-pj-creamLight rounded-3xl overflow-hidden border border-pj-gold/20 shadow-card flex flex-col justify-between">
              <div className="relative h-56 bg-pj-creamDark">
                {post.mediaType === 'video' ? (
                  <video src={post.mediaUrl} className="w-full h-full object-cover" controls />
                ) : (
                  <img src={post.mediaUrl} alt={post.title} className="w-full h-full object-cover" />
                )}
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold bg-pj-maroon text-pj-gold">
                  {post.category}
                </span>
              </div>

              <div className="p-5 space-y-2">
                <h3 className="font-serif font-bold text-base text-pj-maroonDark line-clamp-1">{post.title}</h3>
                <p className="text-xs text-pj-charcoal/75 line-clamp-2">{post.description}</p>
                <div className="pt-3 border-t border-pj-gold/15 flex items-center justify-end space-x-2">
                  <button
                    onClick={() => handleOpenModal(post)}
                    className="p-2 rounded-xl bg-pj-gold/15 text-pj-maroonDark hover:bg-pj-gold/30 transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
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

      {/* Batch Upload Modal */}
      {isBatchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="max-w-xl w-full bg-pj-creamLight rounded-3xl p-6 sm:p-8 border border-pj-gold/40 shadow-2xl relative">
            <button onClick={() => setIsBatchModalOpen(false)} className="absolute top-5 right-5 p-2 text-pj-charcoal/60 hover:text-pj-maroon">
              <X className="w-5 h-5" />
            </button>
            
            <h2 className="font-serif text-2xl font-bold text-pj-maroonDark mb-1">⚡ Batch Upload Photos & Videos</h2>
            <p className="text-xs text-pj-charcoal/70 mb-6">Select all your saree photos/videos at once (up to 50 files)</p>

            <form onSubmit={handleBatchSave} className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-pj-maroonDark mb-1">Default Category for Batch</label>
                <select
                  value={batchCategory}
                  onChange={(e) => setBatchCategory(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-pj-gold/30 bg-white text-sm"
                >
                  <option value="Bridal">Bridal</option>
                  <option value="Function">Function</option>
                  <option value="Close-Up">Close-Up</option>
                  <option value="Before/After">Before/After</option>
                  <option value="General">General</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-pj-maroonDark mb-1">Select Multiple Files</label>
                <div className="relative border-2 border-dashed border-pj-gold/40 rounded-2xl p-6 text-center hover:bg-pj-gold/5 transition-colors cursor-pointer">
                  <input
                    type="file"
                    multiple
                    required
                    accept="image/*,video/*"
                    onChange={(e) => setBatchFiles(e.target.files)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <Upload className="w-8 h-8 text-pj-gold mx-auto mb-2" />
                  <span className="text-sm font-bold text-pj-maroonDark block">
                    {batchFiles && batchFiles.length > 0
                      ? `${batchFiles.length} files selected`
                      : 'Click or drop all 47 photos/videos here'}
                  </span>
                  <span className="text-xs text-pj-charcoal/60 mt-1 block">Hold Ctrl (or Shift) to select multiple files at once</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isBatchSaving || !batchFiles || batchFiles.length === 0}
                className="w-full py-3.5 rounded-xl bg-maroon-gradient text-pj-gold font-bold text-sm shadow-md disabled:opacity-50"
              >
                {isBatchSaving ? `Uploading ${batchFiles?.length || ''} Files...` : `Upload ${batchFiles?.length || ''} Files Now`}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Single Post Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="max-w-xl w-full bg-pj-creamLight rounded-3xl p-6 sm:p-8 border border-pj-gold/40 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-5 right-5 p-2 text-pj-charcoal/60 hover:text-pj-maroon">
              <X className="w-5 h-5" />
            </button>
            <h2 className="font-serif text-2xl font-bold text-pj-maroonDark mb-4">
              {editingPost ? 'Edit Owner Post' : 'Create New Owner Post'}
            </h2>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-pj-maroonDark mb-1">Post Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Bridal Kanjeevaram 7-Pleat Pallu"
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
                  placeholder="Describe pleating technique, fabric type, finishing..."
                  className="w-full px-4 py-2.5 rounded-xl border border-pj-gold/30 bg-white text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-pj-maroonDark mb-1">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-pj-gold/30 bg-white text-sm"
                  >
                    <option value="Bridal">Bridal</option>
                    <option value="Function">Function</option>
                    <option value="Close-Up">Close-Up</option>
                    <option value="Before/After">Before/After</option>
                    <option value="General">General</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-pj-maroonDark mb-1">Media Type *</label>
                  <select
                    value={mediaType}
                    onChange={(e) => setMediaType(e.target.value as 'image' | 'video')}
                    className="w-full px-4 py-2.5 rounded-xl border border-pj-gold/30 bg-white text-sm"
                  >
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-pj-maroonDark mb-1">Upload File OR Media Image URL</label>
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  className="block w-full text-xs text-pj-charcoal/70 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-pj-gold/20 file:text-pj-maroonDark hover:file:bg-pj-gold/30 mb-2"
                />
                <input
                  type="text"
                  value={mediaUrl}
                  onChange={(e) => setMediaUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-4 py-2.5 rounded-xl border border-pj-gold/30 bg-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-pj-maroonDark mb-1">Tags (Comma separated)</label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="Kanjeevaram,Bridal,Silk"
                  className="w-full px-4 py-2.5 rounded-xl border border-pj-gold/30 bg-white text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="w-full py-3.5 rounded-xl bg-maroon-gradient text-pj-gold font-bold text-sm shadow-md"
              >
                {isSaving ? 'Saving Post...' : editingPost ? 'Update Post' : 'Create Owner Post'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
