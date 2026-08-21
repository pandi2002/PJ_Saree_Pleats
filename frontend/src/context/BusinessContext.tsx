import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/client';
import { BusinessInfo } from '../types';

interface BusinessContextType {
  businessInfo: BusinessInfo | null;
  isLoading: boolean;
  getWhatsAppLink: (customMessage?: string) => string;
  refreshBusinessInfo: () => Promise<void>;
}

const BusinessContext = createContext<BusinessContextType | undefined>(undefined);

export const BusinessProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchBusinessInfo = async () => {
    try {
      const res = await api.get('/business-info');
      if (res.data.businessInfo) {
        setBusinessInfo(res.data.businessInfo);
      }
    } catch (err) {
      console.error('Failed to fetch business info', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBusinessInfo();
  }, []);

  const getWhatsAppLink = (customMessage?: string) => {
    const defaultMsg = 'Hi PJ Saree Pleating, I would like to enquire about your saree pleating service.';
    const message = customMessage || businessInfo?.defaultWhatsappMessage || defaultMsg;
    let rawNum = businessInfo?.whatsappNumber || '6380144979';
    let cleanNumber = rawNum.replace(/[^0-9]/g, '');

    if (cleanNumber.length === 10) {
      cleanNumber = `91${cleanNumber}`;
    }

    return `https://api.whatsapp.com/send?phone=${cleanNumber}&text=${encodeURIComponent(message)}`;
  };

  return (
    <BusinessContext.Provider
      value={{
        businessInfo,
        isLoading,
        getWhatsAppLink,
        refreshBusinessInfo: fetchBusinessInfo
      }}
    >
      {children}
    </BusinessContext.Provider>
  );
};

export const useBusiness = () => {
  const context = useContext(BusinessContext);
  if (!context) {
    throw new Error('useBusiness must be used within a BusinessProvider');
  }
  return context;
};
