import React, { useState, useEffect } from 'react';
import { Bookmark, Star, MessageCircle, Heart, ArrowRight, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ListingCard } from '../components/ListingCard';

export const CustomerDashboardPage = ({ onNavigate, onOpenInquiry }) => {
  const { user, bookmarks, currentLocation } = useAuth();
  const [activeTab, setActiveTab] = useState('bookmarks'); // bookmarks

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Customer Profile Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E8E8F2] shadow-card flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img
            src={user?.avatar_url || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'}
            alt={user?.full_name}
            className="w-16 h-16 rounded-xl object-cover border-2 border-[#5B4CF0]"
          />
          <div>
            <h1 className="text-2xl font-bold text-[#202033]">
              {user?.full_name || 'My Communiti Account'}
            </h1>
            <p className="text-xs text-[#6B6B7B]">
              {user?.email} • Hub: <strong className="text-[#202033]">{currentLocation}</strong>
            </p>
          </div>
        </div>

        <div className="text-right">
          <div className="text-xs text-[#6B6B7B] font-medium">Saved Makers</div>
          <div className="text-2xl font-black text-[#5B4CF0]">{bookmarks.length}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E8E8F2] pb-2">
        <button
          onClick={() => setActiveTab('bookmarks')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === 'bookmarks' ? 'bg-[#5B4CF0] text-white shadow-xs' : 'text-[#6B6B7B] hover:bg-[#EEECFE] hover:text-[#5B4CF0]'
          }`}
        >
          <Bookmark className="w-3.5 h-3.5" />
          <span>Saved Micro-Businesses ({bookmarks.length})</span>
        </button>
      </div>

      {/* Bookmarks Grid */}
      {activeTab === 'bookmarks' && (
        <div>
          {bookmarks.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-[#E8E8F2] space-y-3">
              <Heart className="w-10 h-10 text-[#6B6B7B]/40 mx-auto" />
              <h3 className="text-base font-bold text-[#202033]">No Saved Makers Yet</h3>
              <p className="text-xs text-[#6B6B7B]">Bookmark your favorite local bakes, chocolates, or artisans to find them anytime.</p>
              <button
                onClick={() => onNavigate('explore')}
                className="bg-[#5B4CF0] hover:bg-[#4A3BE0] text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs"
              >
                Explore Neighborhood Makers
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookmarks.map((b) => {
                const item = b.listing_details || b;
                return (
                  <ListingCard
                    key={b.id || item.id}
                    listing={item}
                    onSelect={(target) => onNavigate('listing-detail', { slug: target.slug })}
                    onOpenInquiry={onOpenInquiry}
                  />
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CustomerDashboardPage;
