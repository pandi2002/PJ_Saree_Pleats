import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Shield, Lock, Mail, AlertCircle, KeyRound, CheckCircle2, Phone, MessageSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [step, setStep] = useState<1 | 2>(1);

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { loginStep1, verifyOtp } = useAuth();
  const navigate = useNavigate();

  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    try {
      const data = await loginStep1(cleanEmail, cleanPassword);
      if (data.requiresOtp) {
        setStep(2);
        setOtpCode(''); // Strictly blank for true 2-step security verification!
        setSuccessMessage(`Password verified! Security OTP sent via SMS & WhatsApp to authorized mobile number +91 63801 44979`);
      }
    } catch (err: any) {
      setErrorMessage(err.response?.data?.error || 'Invalid email or password');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStep2Verify = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    const cleanOtp = otpCode.trim();

    if (!cleanOtp || cleanOtp.length < 6) {
      setErrorMessage('Please enter the 6-digit OTP code received on your mobile phone');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      await verifyOtp(cleanEmail, cleanOtp);
      navigate('/admin/dashboard');
    } catch (err: any) {
      setErrorMessage(err.response?.data?.error || 'Invalid OTP code. Please check your SMS / WhatsApp messages and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-pj-creamLight rounded-3xl p-8 border border-pj-gold/40 shadow-2xl space-y-6 relative overflow-hidden">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-full bg-maroon-gradient flex items-center justify-center text-pj-gold mx-auto shadow-lg">
            {step === 1 ? <Sparkles className="w-7 h-7" /> : <KeyRound className="w-7 h-7" />}
          </div>
          <h1 className="font-serif text-2xl font-bold text-pj-maroonDark">PJ Saree Pleating</h1>
          <p className="text-xs font-semibold uppercase tracking-wider text-pj-goldDark">
            {step === 1 ? 'Protected Owner Portal' : '2-Step Mobile Security Verification'}
          </p>
        </div>

        {/* Notifications */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* STEP 1 FORM: Email & Password */}
        {step === 1 && (
          <form onSubmit={handleStep1Submit} className="space-y-4" autoComplete="off">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-pj-maroonDark mb-1">
                Admin Email *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-pj-goldDark absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter owner email"
                  autoComplete="off"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-pj-gold/30 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-pj-gold font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-pj-maroonDark mb-1">
                Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-pj-goldDark absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter owner password"
                  autoComplete="off"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-pj-gold/30 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-pj-gold font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl bg-maroon-gradient text-pj-gold font-bold text-sm shadow-md hover:shadow-gold transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              <Shield className="w-4 h-4" />
              <span>{isSubmitting ? 'Verifying Password...' : 'Send SMS & WhatsApp OTP & Continue'}</span>
            </button>
          </form>
        )}

        {/* STEP 2 FORM: 6-Digit Mobile SMS & WhatsApp OTP Verification */}
        {step === 2 && (
          <form onSubmit={handleStep2Verify} className="space-y-5" autoComplete="off">
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
              <div className="flex items-center justify-center space-x-1.5 text-emerald-800 font-bold text-xs">
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                <span>Security OTP Sent via SMS & WhatsApp</span>
              </div>
              <p className="text-[11px] text-emerald-900/80 leading-relaxed">
                A 6-digit Security OTP has been sent to authorized admin mobile number: <strong className="text-emerald-950">+91 63801 44979</strong>.
                Please check your mobile phone messages.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-pj-maroonDark mb-1 text-center">
                Enter 6-Digit Mobile OTP *
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-pj-goldDark absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="------"
                  autoComplete="off"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-pj-gold/40 bg-white text-center text-xl font-mono tracking-[0.4em] focus:outline-none focus:ring-2 focus:ring-pj-gold text-pj-maroonDark font-bold"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || otpCode.length < 6}
              className="w-full py-3.5 rounded-xl bg-maroon-gradient text-pj-gold font-bold text-sm shadow-md hover:shadow-gold transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              <Shield className="w-4 h-4" />
              <span>{isSubmitting ? 'Verifying OTP...' : 'Verify Mobile OTP & Access Portal'}</span>
            </button>

            <button
              type="button"
              onClick={() => { setStep(1); setOtpCode(''); }}
              className="w-full text-center text-xs font-medium text-pj-charcoal/70 hover:text-pj-maroon transition-colors block"
            >
              ← Back to Password Login
            </button>
          </form>
        )}

        {/* Security Footer */}
        <div className="pt-4 border-t border-pj-gold/20 text-center text-xs text-pj-charcoal/60 space-y-1">
          <p className="flex items-center justify-center space-x-1.5 text-pj-maroon font-semibold">
            <Phone className="w-3.5 h-3.5 text-pj-goldDark" />
            <span>Authorized Admin Mobile (+91 63801 44979)</span>
          </p>
        </div>

      </div>
    </div>
  );
};
