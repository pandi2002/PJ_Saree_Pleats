import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  MessageCircle,
  Star,
  CheckCircle,
  ArrowRight,
  Shield,
  Scissors,
  Award,
  Heart,
  Camera,
  Play
} from 'lucide-react';
import { api } from '../api/client';
import { Service, OwnerPost, CustomerReview, CustomerSubmission } from '../types';
import { useBusiness } from '../context/BusinessContext';
import { ServiceCard } from '../components/ServiceCard';
import { LightboxModal } from '../components/LightboxModal';
import { ReviewModal } from '../components/ReviewModal';

export const Home: React.FC = () => {
  const { getWhatsAppLink, businessInfo } = useBusiness();
  const [services, setServices] = useState<Service[]>([]);
  const [featuredPosts, setFeaturedPosts] = useState<OwnerPost[]>([]);
  const [featuredVideos, setFeaturedVideos] = useState<OwnerPost[]>([]);
  const [reviews, setReviews] = useState<CustomerReview[]>([]);
  const [happyCustomers, setHappyCustomers] = useState<CustomerSubmission[]>([]);
  const [selectedPost, setSelectedPost] = useState<OwnerPost | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesRes, postsRes, reviewsRes, subRes] = await Promise.all([
          api.get('/services'),
          api.get('/owner-posts'),
          api.get('/reviews'),
          api.get('/submissions')
        ]);

        setServices(servicesRes.data.services.slice(0, 3));
        
        const allPosts: OwnerPost[] = postsRes.data.posts;
        setFeaturedPosts(allPosts.filter((p) => p.mediaType === 'image').slice(0, 3));
        setFeaturedVideos(allPosts.filter((p) => p.mediaType === 'video').slice(0, 2));
        
        setReviews(reviewsRes.data.reviews.slice(0, 3));
        setHappyCustomers(subRes.data.submissions.slice(0, 4));
      } catch (err) {
        console.error('Failed to load homepage data', err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-20 pb-16">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-pj-cream via-pj-creamLight to-pj-creamDark pt-12 pb-20 border-b border-pj-gold/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Hero Text */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-pj-gold/20 text-pj-maroonDark text-xs sm:text-sm font-bold border border-pj-gold/40 shadow-sm animate-bounce-subtle">
                <Sparkles className="w-4 h-4 text-pj-goldDark" />
                <span>Premier Saree Preparation & Pleating Studio</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-pj-maroonDark leading-tight">
                PJ Saree Pleating
              </h1>

              <p className="font-serif italic text-xl sm:text-2xl text-pj-goldDark font-medium">
                Perfect Pleats. Beautiful Sarees. Effortless Elegance.
              </p>

              <p className="text-base sm:text-lg text-pj-charcoal/80 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light">
                Professional saree pleating, box folding, and pre-draping service. Get crisp, razor-sharp, event-ready finishing so you can drape any silk or designer saree in under 3 minutes.
              </p>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <a
                  href={getWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-maroon-gradient text-pj-gold font-bold text-base shadow-xl hover:shadow-gold hover:-translate-y-0.5 transition-all flex items-center justify-center space-x-2"
                >
                  <MessageCircle className="w-5 h-5 fill-pj-gold text-pj-maroonDark" />
                  <span>Book / Contact Us</span>
                </a>

                <Link
                  to="/our-work"
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-pj-creamLight text-pj-maroonDark font-semibold text-base border-2 border-pj-gold/40 hover:bg-pj-gold/15 transition-all flex items-center justify-center space-x-2 shadow-sm"
                >
                  <span>View Our Work</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/reviews"
                  className="w-full sm:w-auto px-6 py-4 rounded-2xl text-pj-charcoal/80 hover:text-pj-maroon font-semibold text-base flex items-center justify-center space-x-1"
                >
                  <Star className="w-4 h-4 fill-pj-gold text-pj-gold" />
                  <span>Customer Reviews</span>
                </Link>
              </div>

              {/* Trust Metrics Bar */}
              <div className="pt-8 border-t border-pj-gold/20 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0">
                <div>
                  <span className="font-serif text-2xl sm:text-3xl font-bold text-pj-maroonDark block">100%</span>
                  <span className="text-xs text-pj-charcoal/70 font-medium">Pin-Free Finishing</span>
                </div>
                <div>
                  <span className="font-serif text-2xl sm:text-3xl font-bold text-pj-maroonDark block">3 Mins</span>
                  <span className="text-xs text-pj-charcoal/70 font-medium">Fast Draping</span>
                </div>
                <div>
                  <span className="font-serif text-2xl sm:text-3xl font-bold text-pj-maroonDark block">5.0 ★</span>
                  <span className="text-xs text-pj-charcoal/70 font-medium">Customer Rating</span>
                </div>
              </div>
            </div>

            {/* Hero Image Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md rounded-3xl overflow-hidden shadow-2xl border-4 border-pj-gold/40 group">
                <img
                  src="/uploads/owner_work_1.jpg"
                  alt="Bridal Saree Pleating Showcase"
                  className="w-full h-[460px] object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-pj-charcoal/80 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                  <span className="text-xs font-bold text-pj-gold uppercase tracking-wider">Signature Bridal Finish</span>
                  <h3 className="font-serif text-xl font-bold text-white">Precision Fan & Box Pleats</h3>
                  <p className="text-xs text-pj-creamLight/80">Every saree is steam-pressed and pinned to millimeter perfection.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. ABOUT SNIPPET */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-pj-creamLight rounded-3xl p-8 sm:p-12 border border-pj-gold/20 shadow-card grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-pj-goldDark block">About PJ Saree Pleating</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-pj-maroonDark">
              Crafting Flawless Saree Silhouettes For Your Special Moments
            </h2>
            <p className="text-sm sm:text-base text-pj-charcoal/80 leading-relaxed font-light">
              Wearing a saree should bring joy, not stress! At PJ Saree Pleating, we combine traditional saree draping art with modern precision folding technology. Whether it is a heavy bridal Kanjeevaram or delicate Organza, we ensure neat, structured, body-flattering pleats ready for any event.
            </p>
            <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold text-pj-maroonDark">
              <span className="flex items-center space-x-1 bg-pj-gold/15 px-3 py-1.5 rounded-full border border-pj-gold/30">
                <CheckCircle className="w-4 h-4 text-pj-goldDark" />
                <span>Zero Fabric Damage Guarantee</span>
              </span>
              <span className="flex items-center space-x-1 bg-pj-gold/15 px-3 py-1.5 rounded-full border border-pj-gold/30">
                <CheckCircle className="w-4 h-4 text-pj-goldDark" />
                <span>Protective Saree Packaging Bag</span>
              </span>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col justify-center items-center lg:items-end">
            <Link
              to="/about"
              className="px-8 py-4 rounded-2xl bg-pj-maroon text-pj-gold font-bold text-sm shadow-md hover:bg-pj-maroonDark transition-all flex items-center space-x-2"
            >
              <span>Read Our Full Story</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 3. SERVICES HIGHLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-pj-goldDark">What We Offer</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-pj-maroonDark">
            Our Professional Saree Services
          </h2>
          <p className="text-sm sm:text-base text-pj-charcoal/70 font-light">
            Tailored pleating solutions for weddings, functions, and everyday elegant draping.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>

        <div className="text-center pt-4">
          <Link
            to="/services"
            className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-full bg-pj-gold/20 text-pj-maroonDark font-bold text-sm border border-pj-gold/40 hover:bg-pj-gold/30 transition-all"
          >
            <span>Explore All Saree Packages</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 4. FEATURED OWNER WORK */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-pj-gold/20 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-pj-goldDark block">Owner Showcase</span>
            <h2 className="font-serif text-3xl font-bold text-pj-maroonDark">
              Featured Pleating Gallery
            </h2>
          </div>
          <Link to="/our-work" className="text-sm font-bold text-pj-maroon hover:text-pj-goldDark flex items-center space-x-1">
            <span>View Full Gallery</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredPosts.map((post) => (
            <div
              key={post.id}
              onClick={() => setSelectedPost(post)}
              className="group cursor-pointer bg-pj-creamLight rounded-3xl overflow-hidden border border-pj-gold/20 shadow-card hover:shadow-premium transition-all duration-300"
            >
              <div className="relative h-64 overflow-hidden bg-pj-creamDark">
                <img
                  src={post.mediaUrl}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold bg-pj-maroon text-pj-gold">
                  {post.category}
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-serif text-lg font-bold text-pj-maroonDark line-clamp-1">{post.title}</h3>
                <p className="text-xs text-pj-charcoal/70 line-clamp-2 mt-1">{post.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. FEATURED SHORT VIDEOS */}
      {featuredVideos.length > 0 && (
        <section className="bg-pj-maroonDark text-pj-creamLight py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-pj-gold block">Video Demos</span>
              <h2 className="font-serif text-3xl font-bold text-white">Watch How Easy Saree Draping Becomes</h2>
              <p className="text-xs sm:text-sm text-pj-creamLight/80">Short Reels showing before/after pleating and instant 2-minute draping.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-3xl mx-auto">
              {featuredVideos.map((video) => (
                <div
                  key={video.id}
                  onClick={() => setSelectedPost(video)}
                  className="cursor-pointer group relative rounded-3xl overflow-hidden border-2 border-pj-gold/30 shadow-2xl h-80 bg-black"
                >
                  <video src={video.mediaUrl} className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500" muted />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-pj-gold text-pj-maroonDark flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                      <Play className="w-7 h-7 fill-pj-maroonDark ml-1" />
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="font-serif text-base font-bold text-pj-gold">{video.title}</h3>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center pt-2">
              <Link to="/videos" className="inline-flex items-center space-x-2 text-sm font-bold text-pj-gold hover:underline">
                <span>View All Short Videos & Reels</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* 6. WHY CHOOSE US */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-pj-goldDark">The PJ Guarantee</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-pj-maroonDark">Why Choose PJ Saree Pleating?</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-pj-creamLight p-8 rounded-3xl border border-pj-gold/20 shadow-card text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-pj-maroon text-pj-gold flex items-center justify-center mx-auto shadow-md">
              <Scissors className="w-7 h-7" />
            </div>
            <h3 className="font-serif text-xl font-bold text-pj-maroonDark">Millimeter Precision Pleats</h3>
            <p className="text-sm text-pj-charcoal/70 font-light">Every single pleat is custom measured according to your height, body frame, and saree length for a sleek look.</p>
          </div>

          <div className="bg-pj-creamLight p-8 rounded-3xl border border-pj-gold/20 shadow-card text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-pj-maroon text-pj-gold flex items-center justify-center mx-auto shadow-md">
              <Shield className="w-7 h-7" />
            </div>
            <h3 className="font-serif text-xl font-bold text-pj-maroonDark">Fabric Care & Steam Finish</h3>
            <p className="text-sm text-pj-charcoal/70 font-light">We handle silk, organza, georgette, and zardozi sarees with extreme care using non-damaging steam press methods.</p>
          </div>

          <div className="bg-pj-creamLight p-8 rounded-3xl border border-pj-gold/20 shadow-card text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-pj-maroon text-pj-gold flex items-center justify-center mx-auto shadow-md">
              <Award className="w-7 h-7" />
            </div>
            <h3 className="font-serif text-xl font-bold text-pj-maroonDark">Event-Ready Convenience</h3>
            <p className="text-sm text-pj-charcoal/70 font-light">Packaged securely in custom protective bags so you can travel to weddings and functions hassle-free.</p>
          </div>
        </div>
      </section>

      {/* 7. CUSTOMER REVIEWS PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-pj-gold/20 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-pj-goldDark block">Testimonials</span>
            <h2 className="font-serif text-3xl font-bold text-pj-maroonDark">What Our Customers Say</h2>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsReviewModalOpen(true)}
              className="px-5 py-2.5 rounded-full bg-pj-maroon text-pj-gold font-semibold text-xs shadow-md"
            >
              + Write a Review
            </button>
            <Link to="/reviews" className="text-sm font-bold text-pj-maroon hover:text-pj-goldDark flex items-center space-x-1">
              <span>View All ({reviews.length})</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((rev) => (
            <div key={rev.id} className="bg-pj-creamLight p-6 rounded-3xl border border-pj-gold/20 shadow-card flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-1">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-pj-gold text-pj-gold" />
                  ))}
                </div>
                <p className="text-sm text-pj-charcoal/80 italic font-serif">"{rev.review}"</p>
              </div>

              <div className="pt-3 border-t border-pj-gold/10 flex items-center space-x-3">
                {rev.imageUrl ? (
                  <img src={rev.imageUrl} alt={rev.customerName} className="w-10 h-10 rounded-full object-cover border border-pj-gold" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-pj-maroon text-pj-gold font-bold text-sm flex items-center justify-center">
                    {rev.customerName.charAt(0)}
                  </div>
                )}
                <div>
                  <h4 className="text-sm font-bold text-pj-maroonDark">{rev.customerName}</h4>
                  <span className="text-[11px] text-pj-charcoal/50">Verified Customer</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. HAPPY CUSTOMERS GALLERY PREVIEW */}
      {happyCustomers.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-pj-gold/20 pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-pj-goldDark block">Community</span>
              <h2 className="font-serif text-3xl font-bold text-pj-maroonDark">Our Happy Customers</h2>
            </div>
            <Link to="/customer-gallery" className="text-sm font-bold text-pj-maroon flex items-center space-x-1">
              <span>View Customer Gallery</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {happyCustomers.map((sub) => (
              <div key={sub.id} className="relative h-64 rounded-3xl overflow-hidden shadow-md group bg-pj-creamDark">
                {sub.imageUrl && (
                  <img src={sub.imageUrl} alt={sub.customerName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-pj-charcoal/80 via-transparent to-transparent opacity-90" />
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <span className="font-serif text-xs font-bold text-pj-gold block">{sub.customerName}</span>
                  <p className="text-[11px] text-pj-creamLight/80 line-clamp-1">{sub.caption}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 9. SUBMIT LOOK CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-maroon-gradient text-pj-creamLight rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 border-2 border-pj-gold">
          <div className="space-y-3 text-center md:text-left z-10 max-w-xl">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-pj-gold/20 text-pj-gold text-xs font-bold">
              <Camera className="w-3.5 h-3.5" />
              <span>Share Your Saree Moment</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">Wore Our Pleats to an Event?</h2>
            <p className="text-sm text-pj-creamLight/80 leading-relaxed font-light">
              Submit your saree photo or video to get featured on our website and official Instagram handle!
            </p>
          </div>

          <div className="z-10 shrink-0">
            <Link
              to="/submit"
              className="px-8 py-4 rounded-2xl bg-pj-gold text-pj-maroonDark font-bold text-base shadow-xl hover:bg-pj-goldLight transition-all flex items-center space-x-2"
            >
              <Heart className="w-5 h-5 fill-pj-maroonDark text-pj-gold" />
              <span>Submit Your Saree Look</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Modals */}
      <LightboxModal
        post={selectedPost}
        posts={featuredPosts.concat(featuredVideos)}
        onClose={() => setSelectedPost(null)}
        onNavigate={(post) => setSelectedPost(post)}
      />

      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        onSuccess={() => {
          // reload reviews
          api.get('/reviews').then((res) => setReviews(res.data.reviews.slice(0, 3)));
        }}
      />

    </div>
  );
};
