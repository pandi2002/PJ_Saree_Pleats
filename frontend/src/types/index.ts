export interface BusinessInfo {
  id: number;
  businessName: string;
  tagline: string;
  phone: string;
  whatsappNumber: string;
  defaultWhatsappMessage: string;
  email: string;
  address: string;
  googleMapsUrl: string;
  instagramUrl: string;
  facebookUrl: string;
  businessHours: string;
}

export interface OwnerPost {
  id: string;
  title: string;
  description: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  category: string;
  tags?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  price: string;
  duration: string;
  availability: string;
  status: 'active' | 'inactive';
  sortOrder: number;
}

export interface CustomerReview {
  id: string;
  customerName: string;
  rating: number;
  review: string;
  imageUrl?: string | null;
  videoUrl?: string | null;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  approvedAt?: string | null;
}

export interface CustomerSubmission {
  id: string;
  customerName: string;
  phoneOrEmail?: string | null;
  caption: string;
  imageUrl?: string | null;
  videoUrl?: string | null;
  consent: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  approvedAt?: string | null;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt?: string;
}

export interface DashboardStats {
  ownerPostsCount: number;
  videosCount: number;
  pendingReviewsCount: number;
  approvedReviewsCount: number;
  pendingSubmissionsCount: number;
  approvedSubmissionsCount: number;
}
