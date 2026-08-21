import React from 'react';
import { X, ChevronLeft, ChevronRight, MessageCircle } from 'lucide-react';
import { OwnerPost } from '../types';
import { useBusiness } from '../context/BusinessContext';

interface LightboxModalProps {
  post: OwnerPost | null;
  posts: OwnerPost[];
  onClose: () => void;
  onNavigate: (post: OwnerPost) => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  post,
  posts,
  onClose,
  onNavigate
}) => {
  const { getWhatsAppLink } = useBusiness();

  if (!post) return null;

  const currentIndex = posts.findIndex((p) => p.id === post.id);
  const prevPost = currentIndex > 0 ? posts[currentIndex - 1] : posts[posts.length - 1];
  const nextPost = currentIndex < posts.length - 1 ? posts[currentIndex + 1] : posts[0];

  const bookingMsg = `Hi PJ Saree Pleating, I saw your post "${post.title}" and would like to get a similar pleating style for my saree.`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
        aria-label="Close modal"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Prev Button */}
      {posts.length > 1 && (
        <button
          onClick={() => onNavigate(prevPost)}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors hidden sm:flex"
          aria-label="Previous post"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {/* Next Button */}
      {posts.length > 1 && (
        <button
          onClick={() => onNavigate(nextPost)}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors hidden sm:flex"
          aria-label="Next post"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      {/* Main Content Box */}
      <div className="max-w-4xl w-full max-h-[90vh] bg-pj-creamLight rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row">
        
        {/* Media Side */}
        <div className="md:w-3/5 bg-black flex items-center justify-center relative min-h-[300px] max-h-[60vh] md:max-h-none">
          {post.mediaType === 'video' ? (
            <video
              src={post.mediaUrl}
              controls
              autoPlay
              className="w-full h-full object-contain max-h-[60vh] md:max-h-[80vh]"
            />
          ) : (
            <img
              src={post.mediaUrl}
              alt={post.title}
              className="w-full h-full object-contain max-h-[60vh] md:max-h-[80vh]"
            />
          )}
        </div>

        {/* Info Side */}
        <div className="md:w-2/5 p-6 sm:p-8 flex flex-col justify-between space-y-6 overflow-y-auto max-h-[40vh] md:max-h-[80vh]">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-pj-maroon text-pj-gold">
                {post.category}
              </span>
              <span className="text-xs text-pj-charcoal/50">
                {new Date(post.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>

            <h2 className="font-serif text-2xl font-bold text-pj-maroonDark">
              {post.title}
            </h2>

            <p className="text-sm text-pj-charcoal/80 mt-4 leading-relaxed font-light whitespace-pre-line">
              {post.description}
            </p>

            {post.tags && (
              <div className="mt-4 pt-4 border-t border-pj-gold/20 flex flex-wrap gap-1.5">
                {post.tags.split(',').map((tag) => (
                  <span key={tag} className="text-xs bg-pj-gold/10 text-pj-maroon px-2.5 py-1 rounded-md font-medium">
                    #{tag.trim()}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-pj-gold/20 space-y-3">
            <a
              href={getWhatsAppLink(bookingMsg)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center space-x-2 py-3.5 rounded-2xl bg-maroon-gradient text-pj-gold font-bold text-sm shadow-md hover:shadow-gold transition-all"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Inquire This Pleating Style</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
