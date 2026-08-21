import React, { useState } from 'react';
import { 
  Search, MapPin, Bookmark, Store, ShieldCheck, 
  User, LogOut, ChevronDown, Sparkles, CheckCircle2,
  Layers, CreditCard, Heart
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar = ({ onOpenLocationModal, onNavigate, currentTab }) => {
  const { user, currentLocation, bookmarks, logout, switchDemoRole, isEntrepreneur, isAdmin } = useAuth();
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate('explore', { q: searchQuery });
    }
  };

  return (
    <header className="sticky top-0 z-40 glass-nav">
      {/* Top micro-announcement banner */}
      <div className="bg-[#202033] text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-[#5B4CF0] text-white text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full">
              Hyperlocal Discovery
            </span>
            <span className="hidden sm:inline text-stone-300">
              Connecting neighborhoods with home bakers, chocolatiers, jewel designers & craft studios.
            </span>
          </div>

          {/* Quick Demo Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white px-2.5 py-0.5 rounded-lg text-[11px] font-medium transition cursor-pointer"
            >
              <Sparkles className="w-3 h-3 text-[#FFB84D]" />
              <span>Persona: <strong className="text-[#FFB84D]">{user ? user.role : 'Guest'}</strong></span>
              <ChevronDown className="w-3 h-3 opacity-70" />
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 mt-1.5 w-60 bg-white text-[#202033] rounded-2xl shadow-modal border border-[#E8E8F2] py-1.5 z-50 animate-in fade-in">
                <div className="px-3.5 py-2 border-b border-[#E8E8F2] text-[10px] font-bold text-[#6B6B7B] uppercase tracking-wider">
                  Switch Active Persona
                </div>
                <button
                  onClick={() => { switchDemoRole('CUSTOMER'); setShowRoleMenu(false); }}
                  className="w-full px-3.5 py-2.5 text-left hover:bg-[#F8F8FC] flex items-center gap-2.5 text-xs font-medium cursor-pointer"
                >
                  <span className="p-1.5 rounded-xl bg-[#FFF7EB] text-[#D98207]">🛍️</span>
                  <div>
                    <div className="font-semibold text-[#202033]">Riya Sharma (Customer)</div>
                    <div className="text-[10px] text-[#6B6B7B]">Discover makers & leave CSAT reviews</div>
                  </div>
                </button>
                <button
                  onClick={() => { switchDemoRole('ENTREPRENEUR'); setShowRoleMenu(false); }}
                  className="w-full px-3.5 py-2.5 text-left hover:bg-[#F8F8FC] flex items-center gap-2.5 text-xs font-medium cursor-pointer"
                >
                  <span className="p-1.5 rounded-xl bg-[#EEECFE] text-[#5B4CF0]">👩‍🍳</span>
                  <div>
                    <div className="font-semibold text-[#202033]">Ananya Roy (Micro-Baker)</div>
                    <div className="text-[10px] text-[#6B6B7B]">Manage Indiranagar store & ₹150 UPI pass</div>
                  </div>
                </button>
                <button
                  onClick={() => { switchDemoRole('ADMIN'); setShowRoleMenu(false); }}
                  className="w-full px-3.5 py-2.5 text-left hover:bg-[#F8F8FC] flex items-center gap-2.5 text-xs font-medium cursor-pointer"
                >
                  <span className="p-1.5 rounded-xl bg-[#E8F8F3] text-[#15A37D]">🛡️</span>
                  <div>
                    <div className="font-semibold text-[#202033]">Platform Administrator</div>
                    <div className="text-[10px] text-[#6B6B7B]">Review approvals & system audit logs</div>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main navigation header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div 
          onClick={() => onNavigate('home')} 
          className="flex items-center gap-2.5 cursor-pointer group select-none flex-shrink-0"
        >
          <div className="w-10 h-10 rounded-xl bg-[#5B4CF0] flex items-center justify-center text-white shadow-sm shadow-[#5B4CF0]/30 group-hover:scale-105 transition-transform duration-200">
            <span className="font-extrabold text-xl tracking-tight">C</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-extrabold tracking-tight text-[#202033] group-hover:text-[#5B4CF0] transition-colors">
                Communiti
              </span>
              <span className="text-[10px] bg-[#EEECFE] text-[#5B4CF0] font-bold px-1.5 py-0.5 rounded-md tracking-wider uppercase">
                Hyperlocal
              </span>
            </div>
            <p className="text-[11px] text-[#6B6B7B] font-medium leading-none">Micro-Business Network</p>
          </div>
        </div>

        {/* Location Picker Pill */}
        <button
          onClick={onOpenLocationModal}
          className="hidden md:flex items-center gap-2 bg-[#FFFFFF] hover:bg-[#F8F8FC] px-3.5 py-2 rounded-xl text-xs font-semibold text-[#202033] border border-[#E8E8F2] hover:border-[#5B4CF0]/40 transition shadow-xs group cursor-pointer"
        >
          <MapPin className="w-4 h-4 text-[#15A37D] group-hover:scale-110 transition-transform" />
          <span className="max-w-[170px] truncate">{currentLocation}</span>
          <ChevronDown className="w-3.5 h-3.5 text-[#6B6B7B]" />
        </button>

        {/* Hyperlocal Search Input */}
        <form 
          onSubmit={handleSearchSubmit} 
          className="flex-1 max-w-lg hidden lg:block"
        >
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6B7B]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search sourdough bakes, bonbons, gifting, pottery, wines..."
              className="w-full pl-10 pr-24 py-2.5 bg-[#F8F8FC] hover:bg-white focus:bg-white border border-[#E8E8F2] focus:border-[#5B4CF0] rounded-xl text-xs text-[#202033] placeholder:text-[#6B6B7B] focus:outline-hidden focus:ring-3 focus:ring-[#5B4CF0]/10 transition"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-[#5B4CF0] hover:bg-[#4A3BE0] text-white text-xs font-bold px-3.5 py-1.5 rounded-lg transition shadow-xs cursor-pointer"
            >
              Search
            </button>
          </div>
        </form>

        {/* Action Controls & User Navigation */}
        <div className="flex items-center gap-2">
          {/* Explore Nav Link */}
          <button
            onClick={() => onNavigate('explore')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
              currentTab === 'explore' 
                ? 'bg-[#EEECFE] text-[#5B4CF0]' 
                : 'text-[#6B6B7B] hover:text-[#202033] hover:bg-[#F8F8FC]'
            }`}
          >
            Explore Area
          </button>

          {/* Bookmarks */}
          <button
            onClick={() => onNavigate('dashboard')}
            className="relative p-2 rounded-xl text-[#6B6B7B] hover:text-[#5B4CF0] hover:bg-[#EEECFE] transition cursor-pointer"
            title="Saved Micro-Businesses"
          >
            <Bookmark className="w-4 h-4" />
            {bookmarks.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#5B4CF0] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                {bookmarks.length}
              </span>
            )}
          </button>

          {/* Entrepreneur Quick Tab */}
          {isEntrepreneur ? (
            <button
              onClick={() => onNavigate('entrepreneur')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer ${
                currentTab === 'entrepreneur'
                  ? 'bg-[#5B4CF0] text-white'
                  : 'bg-[#EEECFE] text-[#5B4CF0] hover:bg-[#D5D1FC]'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              <span>Artisan Portal</span>
            </button>
          ) : (
            <button
              onClick={() => onNavigate('auth', { role: 'ENTREPRENEUR' })}
              className="hidden sm:flex items-center gap-1.5 bg-[#202033] hover:bg-[#141424] text-white px-3.5 py-2 rounded-xl text-xs font-semibold transition shadow-xs cursor-pointer"
            >
              <Store className="w-3.5 h-3.5 text-[#FFB84D]" />
              <span>List Your Business</span>
              <span className="text-[10px] bg-[#FFB84D]/20 text-[#FFB84D] px-1.5 py-0.5 rounded font-mono font-bold">₹150/mo</span>
            </button>
          )}

          {/* Admin Queue Tab */}
          {isAdmin && (
            <button
              onClick={() => onNavigate('admin')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                currentTab === 'admin'
                  ? 'bg-[#15A37D] text-white'
                  : 'bg-[#E8F8F3] text-[#15A37D] hover:bg-[#C7EFE2]'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Approvals</span>
            </button>
          )}

          {/* User Account / Auth Dropdown */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 pl-1.5 pr-2.5 py-1.5 rounded-xl border border-[#E8E8F2] hover:border-[#5B4CF0]/40 bg-white transition cursor-pointer"
              >
                <img
                  src={user.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                  alt={user.full_name}
                  className="w-6 h-6 rounded-lg object-cover border border-[#E8E8F2]"
                />
                <span className="text-xs font-semibold text-[#202033] max-w-[90px] truncate">
                  {user.full_name ? user.full_name.split(' ')[0] : 'Account'}
                </span>
                <ChevronDown className="w-3 h-3 text-[#6B6B7B]" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-modal border border-[#E8E8F2] py-2 z-50 animate-in fade-in">
                  <div className="px-4 py-2 border-b border-[#E8E8F2]">
                    <p className="text-xs font-bold text-[#202033] truncate">{user.full_name || user.email}</p>
                    <p className="text-[11px] text-[#6B6B7B] capitalize">{user.role.toLowerCase()} • {user.preferred_city}</p>
                  </div>
                  <button
                    onClick={() => { onNavigate('dashboard'); setShowUserMenu(false); }}
                    className="w-full px-4 py-2 text-left hover:bg-[#F8F8FC] text-xs font-medium text-[#202033] flex items-center gap-2 cursor-pointer"
                  >
                    <User className="w-3.5 h-3.5 text-[#6B6B7B]" />
                    <span>My Dashboard & CSAT</span>
                  </button>
                  {isEntrepreneur && (
                    <button
                      onClick={() => { onNavigate('entrepreneur'); setShowUserMenu(false); }}
                      className="w-full px-4 py-2 text-left hover:bg-[#F8F8FC] text-xs font-medium text-[#202033] flex items-center gap-2 cursor-pointer"
                    >
                      <CreditCard className="w-3.5 h-3.5 text-[#5B4CF0]" />
                      <span>₹150 Subscription & Leads</span>
                    </button>
                  )}
                  {isAdmin && (
                    <button
                      onClick={() => { onNavigate('admin'); setShowUserMenu(false); }}
                      className="w-full px-4 py-2 text-left hover:bg-[#F8F8FC] text-xs font-medium text-[#15A37D] flex items-center gap-2 cursor-pointer"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-[#15A37D]" />
                      <span>Moderation & Audit Queue</span>
                    </button>
                  )}
                  <div className="border-t border-[#E8E8F2] my-1"></div>
                  <button
                    onClick={() => { logout(); setShowUserMenu(false); }}
                    className="w-full px-4 py-2 text-left hover:bg-[#FDF2F2] text-xs font-medium text-[#D64545] flex items-center gap-2 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => onNavigate('auth')}
              className="bg-[#5B4CF0] hover:bg-[#4A3BE0] text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
