import React, { useState } from 'react';
import { Settings, Lock, Mail, User, Shield, CheckCircle2, AlertCircle } from 'lucide-react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { QRGeneratorCard } from '../components/QRGeneratorCard';

export const AdminSettings: React.FC = () => {
  const { admin } = useAuth();
  const [adminName, setAdminName] = useState(admin?.name || 'PJ Admin Owner');
  const [adminEmail, setAdminEmail] = useState(admin?.email || 'admin@pjsareepleating.com');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [profileSuccessMsg, setProfileSuccessMsg] = useState('');
  const [profileErrorMsg, setProfileErrorMsg] = useState('');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [passwordSuccessMsg, setPasswordSuccessMsg] = useState('');
  const [passwordErrorMsg, setPasswordErrorMsg] = useState('');

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    setProfileSuccessMsg('');
    setProfileErrorMsg('');

    try {
      const res = await api.put('/auth/profile', { name: adminName, email: adminEmail });
      if (res.data.token) {
        localStorage.setItem('pj_admin_token', res.data.token);
      }
      setProfileSuccessMsg('Owner Name & Email updated successfully! Use your new email to login next time.');
    } catch (err: any) {
      setProfileErrorMsg(err.response?.data?.error || 'Failed to update profile details.');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordErrorMsg('New password and confirm password do not match');
      return;
    }

    setIsUpdatingPassword(true);
    setPasswordSuccessMsg('');
    setPasswordErrorMsg('');

    try {
      await api.put('/auth/change-password', { currentPassword, newPassword });
      setPasswordSuccessMsg('Admin password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setPasswordErrorMsg(err.response?.data?.error || 'Failed to update password');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <div className="space-y-10 max-w-5xl">
      <div className="border-b border-pj-gold/20 pb-4">
        <h1 className="font-serif text-3xl font-bold text-pj-maroonDark">Website Settings & Owner Account Studio</h1>
        <p className="text-xs text-pj-charcoal/70">Update owner email, login password & generate downloadable business QR codes</p>
      </div>

      {/* Section 1: Business QR Studio */}
      <QRGeneratorCard initialUrl="https://pjsareepleating.com" />

      {/* Section 2: Update Owner Profile (Name & Email) */}
      <div className="bg-pj-creamLight rounded-3xl p-6 sm:p-8 border border-pj-gold/30 shadow-card space-y-6">
        <div className="flex items-center space-x-3 border-b border-pj-gold/20 pb-4">
          <div className="w-10 h-10 rounded-2xl bg-pj-maroon text-pj-gold flex items-center justify-center shadow-md">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif text-xl font-bold text-pj-maroonDark">Owner Login Email & Name</h3>
            <p className="text-xs text-pj-charcoal/70">Change the email address used for admin login</p>
          </div>
        </div>

        {profileSuccessMsg && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{profileSuccessMsg}</span>
          </div>
        )}

        {profileErrorMsg && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{profileErrorMsg}</span>
          </div>
        )}

        <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-md">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-pj-maroonDark mb-1">Owner Display Name *</label>
            <input
              type="text"
              required
              value={adminName}
              onChange={(e) => setAdminName(e.target.value)}
              placeholder="e.g. PJ Saree Pleating Owner"
              className="w-full px-4 py-2.5 rounded-xl border border-pj-gold/30 bg-white text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-pj-maroonDark mb-1">Admin Login Email *</label>
            <input
              type="email"
              required
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              placeholder="owner@pjsareepleating.com"
              className="w-full px-4 py-2.5 rounded-xl border border-pj-gold/30 bg-white text-sm font-mono"
            />
          </div>

          <button
            type="submit"
            disabled={isUpdatingProfile}
            className="w-full py-3.5 rounded-xl bg-maroon-gradient text-pj-gold font-bold text-sm shadow-md"
          >
            {isUpdatingProfile ? 'Saving Email...' : 'Save New Owner Email'}
          </button>
        </form>
      </div>

      {/* Section 3: Change Password Form */}
      <div className="bg-pj-creamLight rounded-3xl p-6 sm:p-8 border border-pj-gold/30 shadow-card space-y-6">
        <div className="flex items-center space-x-3 border-b border-pj-gold/20 pb-4">
          <div className="w-10 h-10 rounded-2xl bg-pj-maroon text-pj-gold flex items-center justify-center shadow-md">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif text-xl font-bold text-pj-maroonDark">Change Owner Password</h3>
            <p className="text-xs text-pj-charcoal/70">Update password used to sign into Admin Portal</p>
          </div>
        </div>

        {passwordSuccessMsg && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{passwordSuccessMsg}</span>
          </div>
        )}

        {passwordErrorMsg && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{passwordErrorMsg}</span>
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-pj-maroonDark mb-1">Current Password *</label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-pj-gold/30 bg-white text-sm font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-pj-maroonDark mb-1">New Password *</label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-pj-gold/30 bg-white text-sm font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-pj-maroonDark mb-1">Confirm New Password *</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-pj-gold/30 bg-white text-sm font-mono"
            />
          </div>

          <button
            type="submit"
            disabled={isUpdatingPassword}
            className="w-full py-3.5 rounded-xl bg-maroon-gradient text-pj-gold font-bold text-sm shadow-md"
          >
            {isUpdatingPassword ? 'Updating Password...' : 'Update New Password'}
          </button>
        </form>
      </div>

    </div>
  );
};
