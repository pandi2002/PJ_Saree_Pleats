import React, { useState } from 'react';
import { Play, ZoomIn, Tag } from 'lucide-react';
import { OwnerPost } from '../types';

interface GalleryGridProps {
  posts: OwnerPost[];
  onSelectPost: (post: OwnerPost) => void;
  showCategories?: boolean;
}

export const GalleryGrid: React.FC<GalleryGridProps> = ({
  posts,
  onSelectPost,
  showCategories = true
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'Bridal', 'Function', 'Close-Up', 'Before/After', 'General'];

  const filteredPosts = activeCategory === 'All'
    ? posts
    : posts.filter((p) => p.category.toLowerCase() === activeCategory.toLowerCase());

  return (
    <div className="space-y-8">
      {/* Category Filter Tabs */}
      {showCategories && (
        <div className="flex items-center justify-center flex-wrap gap-2 sm:gap-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 ${
                activeCategory === cat
                  ? 'bg-pj-maroon text-pj-gold shadow-md scale-105 border border-pj-gold/30'
                  : 'bg-pj-creamLight text-pj-charcoal/70 hover:bg-pj-gold/20 hover:text-pj-maroon border border-pj-gold/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Grid Layout */}
      {filteredPosts.length === 0 ? (
        <div className="text-center py-16 bg-pj-creamLight rounded-3xl border border-dashed border-pj-gold/30">
          <p className="text-base text-pj-charcoal/60 font-medium">No posts found in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              onClick={() => onSelectPost(post)}
              className="group cursor-pointer bg-pj-creamLight rounded-3xl overflow-hidden border border-pj-gold/20 shadow-card hover:shadow-premium transition-all duration-300 flex flex-col hover:-translate-y-1.5"
            >
              {/* Media Container */}
              <div className="relative h-64 sm:h-72 overflow-hidden bg-pj-creamDark">
                {post.mediaType === 'video' ? (
                  <div className="relative w-full h-full flex items-center justify-center bg-black">
                    <video
                      src={post.mediaUrl}
                      className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-500"
                      muted
                      playsInline
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-pj-gold text-pj-maroon flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Play className="w-6 h-6 fill-pj-maroon ml-1" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <img
                    src={post.mediaUrl}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                )}

                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-pj-charcoal/80 via-pj-charcoal/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <span className="text-xs font-semibold text-pj-gold flex items-center space-x-1 bg-pj-maroon/90 px-3 py-1.5 rounded-full backdrop-blur-sm">
                    <ZoomIn className="w-3.5 h-3.5" />
                    <span>Click to view full screen</span>
                  </span>
                </div>

                {/* Category Badge */}
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold bg-pj-creamLight/90 text-pj-maroon border border-pj-gold/30 shadow-sm backdrop-blur-md">
                  {post.category}
                </div>
              </div>

              {/* Title & Description */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-2">
                <div>
                  <h3 className="font-serif text-lg font-bold text-pj-maroonDark group-hover:text-pj-maroon transition-colors line-clamp-1">
                    {post.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-pj-charcoal/70 line-clamp-2 mt-1 font-light">
                    {post.description}
                  </p>
                </div>

                {post.tags && (
                  <div className="pt-2 flex items-center space-x-1 text-[11px] text-pj-goldDark font-medium">
                    <Tag className="w-3 h-3" />
                    <span className="truncate">{post.tags.split(',').join(' • ')}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
