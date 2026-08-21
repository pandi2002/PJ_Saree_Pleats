import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { api } from '../api/client';
import { OwnerPost } from '../types';
import { GalleryGrid } from '../components/GalleryGrid';
import { LightboxModal } from '../components/LightboxModal';

export const OurWork: React.FC = () => {
  const [posts, setPosts] = useState<OwnerPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<OwnerPost | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await api.get('/owner-posts');
        setPosts(res.data.posts);
      } catch (err) {
        console.error('Failed to fetch owner posts', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-pj-gold/20 text-pj-maroonDark text-xs font-bold border border-pj-gold/30">
          <Sparkles className="w-4 h-4 text-pj-goldDark" />
          <span>Official PJ Studio Showcase</span>
        </div>

        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-pj-maroonDark">
          Our Pleating Work & Craftsmanship
        </h1>

        <p className="text-base text-pj-charcoal/80 leading-relaxed font-light">
          Browse through authentic photos, close-ups, and before/after pleating transformations crafted exclusively by PJ Saree Pleating.
        </p>

        <div className="p-3 bg-pj-gold/10 rounded-2xl border border-pj-gold/20 text-xs text-pj-maroonDark font-semibold max-w-xl mx-auto">
          🔒 Certified Owner Content • Guaranteed authentic work done at PJ Saree Pleating Studio
        </div>
      </div>

      {/* Gallery Grid */}
      {isLoading ? (
        <div className="text-center py-20">
          <div className="w-10 h-10 border-4 border-pj-gold border-t-pj-maroon rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-pj-charcoal/60">Loading studio gallery...</p>
        </div>
      ) : (
        <GalleryGrid
          posts={posts}
          onSelectPost={(post) => setSelectedPost(post)}
          showCategories={true}
        />
      )}

      {/* Lightbox Modal */}
      <LightboxModal
        post={selectedPost}
        posts={posts}
        onClose={() => setSelectedPost(null)}
        onNavigate={(post) => setSelectedPost(post)}
      />

    </div>
  );
};
