import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Shield, Lock, Mail, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      await login(email, password);
      navigate('/admin/dashboard');
    } catch (err: any) {
      setErrorMessage(err.response?.data?.error || 'Invalid credentials');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-pj-creamLight rounded-3xl p-8 border border-pj-gold/40 shadow-2xl space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-full bg-maroon-gradient flex items-center justify-center text-pj-gold mx-auto shadow-lg">
            <Sparkles className="w-7 h-7" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-pj-maroonDark">PJ Saree Pleating</h1>
          <p className="text-xs font-semibold uppercase tracking-wider text-pj-goldDark">Protected Owner & Admin Portal</p>
        </div>

        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4" autoComplete="off">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-pj-maroonDark mb-1">
              Admin Email
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
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-pj-gold/30 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-pj-gold font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-pj-maroonDark mb-1">
              Password
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
            <span>{isSubmitting ? 'Authenticating...' : 'Sign In To Dashboard'}</span>
          </button>
        </form>

        <div className="pt-4 border-t border-pj-gold/20 text-center text-xs text-pj-charcoal/60 space-y-1">
          <p className="flex items-center justify-center space-x-1.5 text-pj-maroon font-semibold">
            <Shield className="w-3.5 h-3.5 text-pj-goldDark" />
            <span>Authorized Owner Access Only</span>
          </p>
        </div>

      </div>
    </div>
  );
};
