import React, { useState } from 'react';
import { Camera, Upload, CheckCircle2, AlertCircle, Heart } from 'lucide-react';
import { api } from '../api/client';

export const SubmitLook: React.FC = () => {
  const [customerName, setCustomerName] = useState('');
  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [caption, setCaption] = useState('');
  const [consent, setConsent] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent) {
      setErrorMessage('Please check the consent box to allow PJ Saree Pleating to feature your photo/video.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const formData = new FormData();
      formData.append('customerName', customerName);
      formData.append('phoneOrEmail', phoneOrEmail);
      formData.append('caption', caption);
      formData.append('consent', consent ? '1' : '0');
      if (selectedFile) {
        formData.append('mediaFile', selectedFile);
      }

      const res = await api.post('/submissions', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setSuccessMessage(res.data.message);
      setCustomerName('');
      setPhoneOrEmail('');
      setCaption('');
      setConsent(false);
      setSelectedFile(null);
    } catch (err: any) {
      setErrorMessage(err.response?.data?.error || 'Failed to submit media. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-pj-gold/20 text-pj-maroonDark text-xs font-bold border border-pj-gold/30">
          <Camera className="w-4 h-4 text-pj-goldDark" />
          <span>Customer Submission Portal</span>
        </div>

        <h1 className="font-serif text-4xl font-bold text-pj-maroonDark">
          Share Your Saree Look
        </h1>

        <p className="text-sm sm:text-base text-pj-charcoal/80 leading-relaxed font-light">
          Did you drape a PJ Saree Pleating saree at a wedding or function? Upload your photo or short video below to get featured on our official website & social gallery!
        </p>
      </div>

      {/* Form Container */}
      <div className="bg-pj-creamLight rounded-3xl p-6 sm:p-10 border border-pj-gold/30 shadow-card">
        {successMessage ? (
          <div className="text-center py-10 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-pj-maroonDark">Submission Received!</h3>
            <p className="text-sm text-pj-charcoal/80 max-w-md mx-auto">{successMessage}</p>
            <button
              onClick={() => setSuccessMessage('')}
              className="px-6 py-2.5 rounded-xl bg-pj-maroon text-pj-gold font-bold text-xs shadow-md"
            >
              Submit Another Photo
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {errorMessage && (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-pj-maroonDark mb-1">
                Your Full Name *
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. Shalini Verma"
                className="w-full px-4 py-3 rounded-xl border border-pj-gold/30 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-pj-gold"
              />
            </div>

            {/* Optional Phone/Email */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-pj-maroonDark mb-1">
                Phone Number or Email (Optional)
              </label>
              <input
                type="text"
                value={phoneOrEmail}
                onChange={(e) => setPhoneOrEmail(e.target.value)}
                placeholder="e.g. +91 98765 43210 or shalini@gmail.com"
                className="w-full px-4 py-3 rounded-xl border border-pj-gold/30 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-pj-gold"
              />
            </div>

            {/* Caption */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-pj-maroonDark mb-1">
                Caption / Event Details *
              </label>
              <textarea
                required
                rows={3}
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="e.g. Draped this pure silk saree for my sister's engagement in 3 minutes! Loved the box pleats."
                className="w-full px-4 py-3 rounded-xl border border-pj-gold/30 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-pj-gold"
              />
            </div>

            {/* Media Upload */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-pj-maroonDark mb-1">
                Upload Saree Photo or Video *
              </label>
              <div className="relative border-2 border-dashed border-pj-gold/40 rounded-2xl p-6 text-center hover:bg-pj-gold/5 transition-colors cursor-pointer">
                <input
                  type="file"
                  required
                  accept="image/*,video/*"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Upload className="w-8 h-8 text-pj-gold mx-auto mb-2" />
                <span className="text-sm font-semibold text-pj-maroonDark block">
                  {selectedFile ? selectedFile.name : 'Choose Saree Photo or Video File'}
                </span>
                <span className="text-xs text-pj-charcoal/50 block mt-1">Supports JPG, PNG, WEBP, MP4, MOV (Max 50MB)</span>
              </div>
            </div>

            {/* Consent Checkbox */}
            <div className="p-4 bg-pj-gold/10 rounded-2xl border border-pj-gold/30">
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded text-pj-maroon focus:ring-pj-gold"
                />
                <span className="text-xs text-pj-charcoal/80 font-medium leading-relaxed">
                  I agree that PJ Saree Pleating may display my submitted photo/video on its official website, customer gallery, and social media channels.
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-2xl bg-maroon-gradient text-pj-gold font-bold text-base shadow-lg hover:shadow-gold transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              <Heart className="w-5 h-5 fill-pj-gold" />
              <span>{isSubmitting ? 'Submitting Your Look...' : 'Submit My Look'}</span>
            </button>
          </form>
        )}
      </div>

    </div>
  );
};
