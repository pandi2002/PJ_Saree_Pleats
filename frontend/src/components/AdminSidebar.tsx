import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Image,
  Video,
  Scissors,
  Star,
  Users,
  Building,
  Settings,
  LogOut,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AdminSidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { admin, logout } = useAuth();

  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Owner Posts', path: '/admin/posts', icon: Image },
    { name: 'Owner Videos', path: '/admin/videos', icon: Video },
    { name: 'Services Catalog', path: '/admin/services', icon: Scissors },
    { name: 'Customer Reviews', path: '/admin/reviews', icon: Star },
    { name: 'Customer Submissions', path: '/admin/customer-submissions', icon: Users },
    { name: 'Business Information', path: '/admin/business', icon: Building },
    { name: 'Settings & QR Code', path: '/admin/settings', icon: Settings }
  ];

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className="w-full lg:w-64 bg-pj-creamLight border-r border-pj-gold/20 flex flex-col justify-between shrink-0 min-h-screen">
      <div>
        {/* Brand Header */}
        <div className="p-6 border-b border-pj-gold/20 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-maroon-gradient flex items-center justify-center text-pj-gold shadow-md">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif text-lg font-bold text-pj-maroonDark leading-none">
              PJ Admin Portal
            </h2>
            <span className="text-[10px] uppercase tracking-wider text-pj-goldDark font-semibold block mt-1">
              Control Panel
            </span>
          </div>
        </div>

        {/* Admin Info Badge */}
        {admin && (
          <div className="mx-4 my-4 p-3 rounded-2xl bg-pj-creamDark/70 border border-pj-gold/30 flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-pj-maroon text-pj-gold font-bold text-xs flex items-center justify-center">
              {admin.name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <span className="text-xs font-bold text-pj-maroonDark block truncate">{admin.name}</span>
              <span className="text-[10px] text-pj-charcoal/60 block truncate">{admin.email}</span>
            </div>
          </div>
        )}

        {/* Menu Navigation */}
        <nav className="px-3 py-2 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? 'bg-pj-maroon text-pj-gold font-bold shadow-md'
                    : 'text-pj-charcoal/80 hover:bg-pj-gold/15 hover:text-pj-maroon'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${active ? 'text-pj-gold' : 'text-pj-maroonDark'}`} />
                  <span>{item.name}</span>
                </div>
                {active && <ChevronRight className="w-4 h-4 text-pj-gold" />}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-pj-gold/20 space-y-2">
        <Link
          to="/"
          target="_blank"
          className="w-full py-2.5 px-3 rounded-xl bg-pj-creamDark text-pj-maroonDark font-semibold text-xs border border-pj-gold/30 flex items-center justify-center space-x-2 hover:bg-pj-gold/20 transition-all"
        >
          <span>View Public Website ↗</span>
        </Link>

        <button
          onClick={handleLogout}
          className="w-full py-2.5 px-3 rounded-xl bg-rose-50 text-rose-700 font-semibold text-xs border border-rose-200 flex items-center justify-center space-x-2 hover:bg-rose-100 transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
