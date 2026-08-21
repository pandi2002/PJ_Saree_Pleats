import React, { useState, useEffect } from 'react';
import { Building, Save, CheckCircle2, AlertCircle } from 'lucide-react';
import { api } from '../api/client';
import { useBusiness } from '../context/BusinessContext';

export const AdminBusiness: React.FC = () => {
  const { businessInfo, refreshBusinessInfo } = useBusiness();
  const [formData, setFormData] = useState({
    businessName: '',
    tagline: '',
    phone: '',
    whatsappNumber: '',
    defaultWhatsappMessage: '',
    email: '',
    address: '',
    googleMapsUrl: '',
    instagramUrl: '',
    facebookUrl: '',
    businessHours: ''
  });

  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (businessInfo) {
      setFormData({
        businessName: businessInfo.businessName || '',
        tagline: businessInfo.tagline || '',
        phone: businessInfo.phone || '',
        whatsappNumber: businessInfo.whatsappNumber || '',
        defaultWhatsappMessage: businessInfo.defaultWhatsappMessage || '',
        email: businessInfo.email || '',
        address: businessInfo.address || '',
        googleMapsUrl: businessInfo.googleMapsUrl || '',
        instagramUrl: businessInfo.instagramUrl || '',
        facebookUrl: businessInfo.facebookUrl || '',
        businessHours: businessInfo.businessHours || ''
      });
    }
  }, [businessInfo]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      await api.put('/business-info', formData);
      await refreshBusinessInfo();
      setSuccessMsg('Business information updated successfully!');
    } catch (err: any) {
      setErrorMsg(err.response?.data?.error || 'Failed to update business information.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="border-b border-pj-gold/20 pb-4">
        <h1 className="font-serif text-3xl font-bold text-pj-maroonDark">Manage Business Information</h1>
        <p className="text-xs text-pj-charcoal/70">Update phone, WhatsApp number, studio address, hours, and social links</p>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-pj-creamLight rounded-3xl p-6 sm:p-8 border border-pj-gold/30 shadow-card space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-pj-maroonDark mb-1">Business Name *</label>
            <input
              type="text"
              name="businessName"
              required
              value={formData.businessName}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-pj-gold/30 bg-white text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-pj-maroonDark mb-1">Business Tagline *</label>
            <input
              type="text"
              name="tagline"
              required
              value={formData.tagline}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-pj-gold/30 bg-white text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-pj-maroonDark mb-1">Phone Number *</label>
            <input
              type="text"
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              placeholder="+91 98765 43210"
              className="w-full px-4 py-2.5 rounded-xl border border-pj-gold/30 bg-white text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-pj-maroonDark mb-1">WhatsApp Number (With Country Code, No spaces) *</label>
            <input
              type="text"
              name="whatsappNumber"
              required
              value={formData.whatsappNumber}
              onChange={handleChange}
              placeholder="919876543210"
              className="w-full px-4 py-2.5 rounded-xl border border-pj-gold/30 bg-white text-sm font-mono"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-pj-maroonDark mb-1">Default WhatsApp Booking Message</label>
            <input
              type="text"
              name="defaultWhatsappMessage"
              value={formData.defaultWhatsappMessage}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-pj-gold/30 bg-white text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-pj-maroonDark mb-1">Public Email *</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-pj-gold/30 bg-white text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-pj-maroonDark mb-1">Business Hours *</label>
            <input
              type="text"
              name="businessHours"
              required
              value={formData.businessHours}
              onChange={handleChange}
              placeholder="Mon - Sat: 9:00 AM - 8:00 PM"
              className="w-full px-4 py-2.5 rounded-xl border border-pj-gold/30 bg-white text-sm"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-pj-maroonDark mb-1">Studio Address *</label>
            <textarea
              name="address"
              required
              rows={2}
              value={formData.address}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-pj-gold/30 bg-white text-sm"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-pj-maroonDark mb-1">Google Maps URL</label>
            <input
              type="text"
              name="googleMapsUrl"
              value={formData.googleMapsUrl}
              onChange={handleChange}
              placeholder="https://maps.google.com/?q=..."
              className="w-full px-4 py-2.5 rounded-xl border border-pj-gold/30 bg-white text-sm font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-pj-maroonDark mb-1">Instagram URL</label>
            <input
              type="text"
              name="instagramUrl"
              value={formData.instagramUrl}
              onChange={handleChange}
              placeholder="https://instagram.com/pjsareepleating"
              className="w-full px-4 py-2.5 rounded-xl border border-pj-gold/30 bg-white text-sm font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-pj-maroonDark mb-1">Facebook URL</label>
            <input
              type="text"
              name="facebookUrl"
              value={formData.facebookUrl}
              onChange={handleChange}
              placeholder="https://facebook.com/pjsareepleating"
              className="w-full px-4 py-2.5 rounded-xl border border-pj-gold/30 bg-white text-sm font-mono"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-pj-gold/20">
          <button
            type="submit"
            disabled={isSaving}
            className="w-full py-4 rounded-2xl bg-maroon-gradient text-pj-gold font-bold text-sm shadow-md hover:shadow-gold transition-all flex items-center justify-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving Changes...' : 'Save Business Information'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
