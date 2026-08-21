import React, { useState, useEffect } from 'react';
import { Video, Play, Sparkles, MessageCircle } from 'lucide-react';
import { api } from '../api/client';
import { OwnerPost } from '../types';
import { LightboxModal } from '../components/LightboxModal';
import { useBusiness } from '../context/BusinessContext';

export const Videos: React.FC = () => {
  const [videos, setVideos] = useState<OwnerPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<OwnerPost | null>(null);
  const { getWhatsAppLink } = useBusiness();

  useEffect(() => {
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
    fetchVideos();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-pj-gold/20 text-pj-maroonDark text-xs font-bold border border-pj-gold/30">
          <Video className="w-4 h-4 text-pj-goldDark" />
          <span>Short Videos & Instagram Reels</span>
        </div>

        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-pj-maroonDark">
          Saree Draping Demos & Pleating Reels
        </h1>

        <p className="text-base text-pj-charcoal/80 leading-relaxed font-light">
          Watch short video clips demonstrating our pre-pleated saree draping process, fan fold transformations, and live event results!
        </p>
      </div>

      {/* Video Responsive Grid */}
      {isLoading ? (
        <div className="text-center py-20">
          <div className="w-10 h-10 border-4 border-pj-gold border-t-pj-maroon rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-pj-charcoal/60">Loading video gallery...</p>
        </div>
      ) : videos.length === 0 ? (
        <div className="text-center py-16 bg-pj-creamLight rounded-3xl border border-dashed border-pj-gold/30">
          <p className="text-base text-pj-charcoal/60 font-medium">No videos uploaded yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {videos.map((vid) => (
            <div
              key={vid.id}
              onClick={() => setSelectedVideo(vid)}
              className="cursor-pointer group bg-pj-creamLight rounded-3xl overflow-hidden border border-pj-gold/20 shadow-card hover:shadow-premium transition-all duration-300 flex flex-col hover:-translate-y-1.5"
            >
              <div className="relative h-80 bg-black flex items-center justify-center overflow-hidden">
                <video
                  src={vid.mediaUrl}
                  className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-500"
                  muted
                  playsInline
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-pj-gold text-pj-maroonDark flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                    <Play className="w-7 h-7 fill-pj-maroonDark ml-1" />
                  </div>
                </div>
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold bg-pj-maroon text-pj-gold">
                  {vid.category}
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="font-serif text-lg font-bold text-pj-maroonDark line-clamp-1">{vid.title}</h3>
                  <p className="text-xs text-pj-charcoal/70 line-clamp-2 mt-1 font-light">{vid.description}</p>
                </div>

                <a
                  href={getWhatsAppLink(`Hi PJ Saree Pleating, I watched your video "${vid.title}" and would like to know more about this pleating style.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="w-full flex items-center justify-center space-x-1.5 py-2.5 rounded-xl bg-pj-gold/20 text-pj-maroonDark text-xs font-bold hover:bg-pj-gold/30 transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Ask About This Video Style</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox / Video Player Modal */}
      <LightboxModal
        post={selectedVideo}
        posts={videos}
        onClose={() => setSelectedVideo(null)}
        onNavigate={(vid) => setSelectedVideo(vid)}
      />

    </div>
  );
};
