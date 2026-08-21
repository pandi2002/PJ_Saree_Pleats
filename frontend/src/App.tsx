import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { BusinessProvider } from './context/BusinessContext';

import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { AdminLayout } from './components/AdminLayout';

import { Home } from './pages/Home';
import { About } from './pages/About';
import { Services } from './pages/Services';
import { OurWork } from './pages/OurWork';
import { Videos } from './pages/Videos';
import { Reviews } from './pages/Reviews';
import { CustomerGallery } from './pages/CustomerGallery';
import { SubmitLook } from './pages/SubmitLook';
import { Contact } from './pages/Contact';

import { AdminLogin } from './pages/AdminLogin';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminPosts } from './pages/AdminPosts';
import { AdminVideos } from './pages/AdminVideos';
import { AdminServices } from './pages/AdminServices';
import { AdminReviews } from './pages/AdminReviews';
import { AdminSubmissions } from './pages/AdminSubmissions';
import { AdminBusiness } from './pages/AdminBusiness';
import { AdminSettings } from './pages/AdminSettings';

const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-pj-cream">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BusinessProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/our-work" element={<OurWork />} />
              <Route path="/videos" element={<Videos />} />
              <Route path="/reviews" element={<Reviews />} />
              <Route path="/customer-gallery" element={<CustomerGallery />} />
              <Route path="/submit" element={<SubmitLook />} />
              <Route path="/contact" element={<Contact />} />
            </Route>

            {/* Admin Login Route */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Protected Admin Dashboard Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="posts" element={<AdminPosts />} />
              <Route path="videos" element={<AdminVideos />} />
              <Route path="services" element={<AdminServices />} />
              <Route path="reviews" element={<AdminReviews />} />
              <Route path="customer-submissions" element={<AdminSubmissions />} />
              <Route path="business" element={<AdminBusiness />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>

            {/* Fallback to Home */}
            <Route path="*" element={<Home />} />
          </Routes>
        </Router>
      </BusinessProvider>
    </AuthProvider>
  );
};

export default App;
