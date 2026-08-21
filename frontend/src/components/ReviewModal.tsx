import React, { useState } from 'react';
import { X, Star, Upload, CheckCircle2, AlertCircle } from 'lucide-react';
import { api } from '../api/client';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [customerName, setCustomerName] = useState('');
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState('');
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const formData = new FormData();
      formData.append('customerName', customerName);
      formData.append('rating', rating.toString());
      formData.append('review', review);
      if (selectedFile) {
        formData.append('mediaFile', selectedFile);
      }

      const res = await api.post('/reviews', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setSuccessMessage(res.data.message);
      setTimeout(() => {
        onSuccess();
        onClose();
        setCustomerName('');
        setReview('');
        setSelectedFile(null);
        setSuccessMessage('');
      }, 2000);
    } catch (err: any) {
      setErrorMessage(err.response?.data?.error || 'Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="max-w-lg w-full bg-pj-creamLight rounded-3xl overflow-hidden shadow-2xl border border-pj-gold/30 p-6 sm:p-8 relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-pj-charcoal/60 hover:text-pj-maroon hover:bg-pj-gold/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="font-serif text-2xl font-bold text-pj-maroonDark">Write a Customer Review</h2>
        <p className="text-xs text-pj-charcoal/70 mt-1">Share your experience with PJ Saree Pleating</p>

        {successMessage ? (
          <div className="my-8 text-center p-6 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-800 space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h3 className="font-semibold text-lg">Thank You!</h3>
            <p className="text-sm">{successMessage}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Customer Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-pj-maroonDark mb-1">
                Your Name *
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. Priya Sundaram"
                className="w-full px-4 py-3 rounded-xl border border-pj-gold/30 bg-white focus:outline-none focus:ring-2 focus:ring-pj-gold text-sm"
              />
            </div>

            {/* Star Rating Picker */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-pj-maroonDark mb-1">
                Star Rating *
              </label>
              <div className="flex items-center space-x-2 py-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 focus:outline-none transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        star <= (hoverRating || rating)
                          ? 'fill-pj-gold text-pj-gold'
                          : 'text-pj-creamDark fill-pj-creamDark'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-sm font-semibold text-pj-goldDark ml-2">
                  {hoverRating || rating} / 5 Stars
                </span>
              </div>
            </div>

            {/* Review Text */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-pj-maroonDark mb-1">
                Your Review *
              </label>
              <textarea
                required
                rows={3}
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="How were your saree pleats? Mention the finishing, ease of draping, or event experience..."
                className="w-full px-4 py-3 rounded-xl border border-pj-gold/30 bg-white focus:outline-none focus:ring-2 focus:ring-pj-gold text-sm"
              />
            </div>

            {/* Optional Media File Upload */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-pj-maroonDark mb-1">
                Optional Photo / Short Video
              </label>
              <div className="relative border-2 border-dashed border-pj-gold/40 rounded-xl p-4 text-center hover:bg-pj-gold/5 transition-colors cursor-pointer">
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Upload className="w-6 h-6 text-pj-gold mx-auto mb-1" />
                <span className="text-xs text-pj-charcoal/70 font-medium block">
                  {selectedFile ? selectedFile.name : 'Click or drop saree photo or short video'}
                </span>
              </div>
            </div>

            <div className="p-3 bg-pj-creamDark/60 rounded-xl text-[11px] text-pj-charcoal/70 border border-pj-gold/20">
              ℹ️ Customer reviews undergo quick admin review before appearing publicly to maintain a clean platform.
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl bg-maroon-gradient text-pj-gold font-bold text-sm shadow-md hover:shadow-gold transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting Review...' : 'Submit Review'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
