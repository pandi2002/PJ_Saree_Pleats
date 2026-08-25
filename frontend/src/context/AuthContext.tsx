import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/client';
import { AdminUser } from '../types';

interface AuthContextType {
  admin: AdminUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginStep1: (email: string, password: string) => Promise<{ requiresOtp: boolean; demoOtp?: string; fallbackOtp?: string; otpCode?: string; phone?: string }>;
  verifyOtp: (email: string, otpCode: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('pj_admin_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const verifyAuth = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const res = await api.get('/auth/me');
        setAdmin(res.data.admin);
      } catch (err) {
        console.error('Token validation failed', err);
        localStorage.removeItem('pj_admin_token');
        setToken(null);
        setAdmin(null);
      } finally {
        setIsLoading(false);
      }
    };
    verifyAuth();
  }, [token]);

  const loginStep1 = async (email: string, password: string) => {
    const res = await api.post('/auth/login-step1', { email, password });
    return res.data;
  };

  const verifyOtp = async (email: string, otpCode: string) => {
    const res = await api.post('/auth/verify-otp', { email, otpCode });
    const { token: newToken, admin: adminData } = res.data;
    localStorage.setItem('pj_admin_token', newToken);
    setToken(newToken);
    setAdmin(adminData);
  };

  const login = async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password });
    const { token: newToken, admin: adminData } = res.data;
    localStorage.setItem('pj_admin_token', newToken);
    setToken(newToken);
    setAdmin(adminData);
  };

  const logout = () => {
    localStorage.removeItem('pj_admin_token');
    setToken(null);
    setAdmin(null);
  };

  return (
    <AuthContext.Provider
      value={{
        admin,
        token,
        isAuthenticated: !!admin,
        isLoading,
        loginStep1,
        verifyOtp,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
