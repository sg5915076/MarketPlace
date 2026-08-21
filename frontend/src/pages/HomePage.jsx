import React, { useState, useEffect } from 'react';
import { 
  Search, MapPin, Sparkles, ArrowRight, ShieldCheck, 
  Star, Heart, Store, ThumbsUp, CheckCircle, ChevronRight,
  TrendingUp, Award, Layers
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ListingCard } from '../components/ListingCard';

const CATEGORY_TILES = [
  { slug: 'home-bakers', name: 'Home Bakers', icon: '🍰', color: 'bg-[#FFF7EB] text-[#D98207] border-[#FFB84D]/30', desc: 'Sourdough, brioche, custom birthday & wedding cakes' },
  { slug: 'chocolate-creations', name: 'Chocolate Creations', icon: '🍫', color: 'bg-[#FFF7EB] text-[#D98207] border-[#FFB84D]/30', desc: 'Bean-to-bar slabs, hand-painted bonbons, truffles' },
  { slug: 'bespoke-gifting', name: 'Bespoke Gifting', icon: '🎁', color: 'bg-[#EEECFE] text-[#5B4CF0] border-[#5B4CF0]/20', desc: 'Festive boxes, bridesmaid hampers, corporate keepsakes' },
  { slug: 'handcrafted-crafts', name: 'Handcrafted & Crafts', icon: '🧶', color: 'bg-[#E8F8F3] text-[#15A37D] border-[#15A37D]/20', desc: 'Studio pottery, ceramic mugs, macrame, botanical resin' },
  { slug: 'artisanal-gourmet', name: 'Artisanal Gourmet', icon: '🎨', color: 'bg-[#FFF7EB] text-[#D98207] border-[#FFB84D]/30', desc: 'Organic fruit preserves, chilli crisp, fermented sauces' },
  { slug: 'jewellery-designers', name: 'Jewellery Designers', icon: '💍', color: 'bg-[#EEECFE] text-[#5B4CF0] border-[#5B4CF0]/20', desc: '925 silver filigree, terracotta earrings, baroque pearls' },
  { slug: 'homemade-wines', name: 'Homemade Wines', icon: '🍷', color: 'bg-[#FDF2F2] text-[#D64545] border-[#D64545]/20', desc: 'Heritage spiced ginger wine, mulberry botanical brews' },
];

export const HomePage = ({ onNavigate, onOpenLocationModal, onOpenInquiry }) => {
  const { currentLocation, currentCity } = useAuth();
  const [searchWord, setSearchWord] = useState('');
  const [featuredListings, setFeaturedListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeListings = async () => {
      try {
        const res = await api.searchListings({ location: currentCity || '' });
        setFeaturedListings(res.data.results || []);
      } catch (e) {
        console.warn('Using fallback data', e);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeListings();
  }, [currentCity]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onNavigate('explore', { q: searchWord });
  };

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#EEECFE]/40 via-[#F8F8FC] to-[#F8F8FC] pt-12 pb-20 px-4 sm:px-6 lg:px-8 border-b border-[#E8E8F2]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-full border border-[#E8E8F2] shadow-xs text-xs font-bold text-[#5B4CF0]">
              <Sparkles className="w-4 h-4 text-[#FFB84D]" />
              <span>Hyperlocal Discovery & Micro-Business Platform</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#202033] tracking-tight leading-[1.1]">
              Discover <span className="text-[#5B4CF0]">Artisanal</span> Treasures in Your Neighborhood
            </h1>

            <p className="text-sm sm:text-base text-[#6B6B7B] max-w-xl leading-relaxed font-normal">
              Connect directly with verified home bakers, bean-to-bar chocolatiers, bespoke gifting curators, ceramic potters, and boutique homemade winemakers right around <strong className="text-[#202033] font-semibold">{currentLocation}</strong>.
            </p>

            {/* Hyperlocal Search Bar */}
            <form onSubmit={handleSearchSubmit} className="bg-white p-2 rounded-2xl shadow-card border border-[#E8E8F2] flex flex-col sm:flex-row items-center gap-2 max-w-2xl">
              {/* Location Pill */}
              <button
                type="button"
                onClick={onOpenLocationModal}
                className="w-full sm:w-auto flex items-center gap-2 px-4 py-2.5 bg-[#F8F8FC] hover:bg-[#EEECFE] rounded-xl text-xs font-bold text-[#202033] border border-[#E8E8F2] transition cursor-pointer flex-shrink-0"
              >
                <MapPin className="w-3.5 h-3.5 text-[#15A37D]" />
                <span className="truncate max-w-[130px]">{currentLocation.split(',')[0]}</span>
              </button>

              {/* Keyword input */}
              <div className="w-full flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6B7B]" />
                <input
                  type="text"
                  value={searchWord}
                  onChange={(e) => setSearchWord(e.target.value)}
                  placeholder="Try 'Sourdough', 'Dark Chocolate Truffles', 'Filigree'..."
                  className="w-full pl-9 pr-3 py-2 text-xs text-[#202033] placeholder:text-[#6B6B7B] outline-hidden bg-transparent"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full sm:w-auto bg-[#5B4CF0] hover:bg-[#4A3BE0] text-white text-xs font-bold px-6 py-3 rounded-xl transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer flex-shrink-0"
              >
                <span>Find Makers</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 pt-2 text-xs text-[#6B6B7B]">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#15A37D]" />
                <span>Admin Verified Artisans</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ThumbsUp className="w-4 h-4 text-[#FFB84D]" />
                <span>98%+ Positive CSAT</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Store className="w-4 h-4 text-[#5B4CF0]" />
                <span>Direct WhatsApp Inquiries</span>
              </div>
            </div>
          </div>

          {/* Hero Right Visual Mosaic */}
          <div className="lg:col-span-5 relative">
            <div className="grid grid-cols-2 gap-3.5 relative">
              <div className="space-y-3.5">
                <div className="relative rounded-2xl overflow-hidden shadow-card aspect-4/5 group border border-[#E8E8F2]">
                  <img
                    src="https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80"
                    alt="Home Baker"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#202033]/80 via-transparent to-transparent flex items-end p-4">
                    <div>
                      <span className="bg-[#5B4CF0] text-white text-[10px] font-bold px-2 py-0.5 rounded-md">Indiranagar</span>
                      <h4 className="text-white font-bold text-sm mt-1">Wild Sourdough Studio</h4>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-[#E8E8F2] shadow-clean">
                  <div className="flex items-center gap-2.5">
                    <span className="p-2 rounded-xl bg-[#EEECFE] text-[#5B4CF0] text-base">👩‍🍳</span>
                    <div>
                      <div className="text-xs font-bold text-[#202033]">₹150 / mo Platform</div>
                      <div className="text-[10px] text-[#6B6B7B]">Zero commission on orders</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3.5 pt-6">
                <div className="bg-white p-4 rounded-2xl border border-[#E8E8F2] shadow-clean">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-1.5">
                      <img className="w-6 h-6 rounded-full border border-white object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100" alt="Customer" />
                      <img className="w-6 h-6 rounded-full border border-white object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100" alt="Customer" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1 text-[11px] font-bold text-[#202033]">
                        <Star className="w-3 h-3 fill-[#FFB84D] text-[#FFB84D]" />
                        <span>4.9★ CSAT Rated</span>
                      </div>
                      <div className="text-[10px] text-[#6B6B7B]">By 1,400+ neighbors</div>
                    </div>
                  </div>
                </div>

                <div className="relative rounded-2xl overflow-hidden shadow-card aspect-4/5 group border border-[#E8E8F2]">
                  <img
                    src="https://images.unsplash.com/photo-1548907040-4baa42d10919?w=600&auto=format&fit=crop&q=80"
                    alt="Artisanal Chocolates"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#202033]/80 via-transparent to-transparent flex items-end p-4">
                    <div>
                      <span className="bg-[#15A37D] text-white text-[10px] font-bold px-2 py-0.5 rounded-md">Bandra West</span>
                      <h4 className="text-white font-bold text-sm mt-1">Cocoa Alchemy</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7 Micro-Segment Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-bold text-[#5B4CF0] uppercase tracking-wider mb-1">
              Curated Micro-Segments
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#202033]">
              Explore by Handcrafted Specialization
            </h2>
          </div>
          <button
            onClick={() => onNavigate('explore')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5B4CF0] hover:text-[#4A3BE0] hover:underline cursor-pointer"
          >
            <span>Browse All Categories</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CATEGORY_TILES.map((cat) => (
            <div
              key={cat.slug}
              onClick={() => onNavigate('explore', { category: cat.slug })}
              className="bg-white p-5 rounded-2xl border border-[#E8E8F2] hover:border-[#5B4CF0]/40 hover:shadow-card transition-all duration-200 cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl p-2.5 rounded-xl bg-[#F8F8FC] group-hover:scale-110 transition-transform">
                    {cat.icon}
                  </span>
                  <span className="text-[#6B6B7B] group-hover:text-[#5B4CF0] transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
                <h3 className="text-base font-bold text-[#202033] group-hover:text-[#5B4CF0] transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-[#6B6B7B] mt-1 leading-relaxed">
                  {cat.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#E8E8F2] flex items-center justify-between text-[11px] text-[#6B6B7B]">
                <span className="font-semibold text-[#5B4CF0]">Explore Nearby</span>
                <span>Active Listings</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Hyperlocal Listings Row */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-[#EEECFE] text-[#5B4CF0] px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-3 h-3 text-[#FFB84D]" />
              <span>Near {currentLocation}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#202033]">
              Spotlight Micro-Businesses & Artisans
            </h2>
          </div>
          <button
            onClick={() => onNavigate('explore')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5B4CF0] hover:text-[#4A3BE0] hover:underline cursor-pointer"
          >
            <span>View All in Area</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-80 bg-[#F0F0F7] rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredListings.slice(0, 6).map((listing) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                onSelect={(item) => onNavigate('listing-detail', { slug: item.slug })}
                onOpenInquiry={onOpenInquiry}
              />
            ))}
          </div>
        )}
      </section>

      {/* Entrepreneur Invitation & ₹150 UPI Subscription Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#202033] text-white rounded-2xl p-8 sm:p-12 relative overflow-hidden shadow-card border border-[#31314D]">
          <div className="absolute right-0 bottom-0 w-96 h-96 bg-[#5B4CF0]/15 rounded-full blur-3xl pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 bg-[#5B4CF0]/20 text-[#EEECFE] border border-[#5B4CF0]/40 px-3 py-1 rounded-full text-xs font-bold">
                <Store className="w-3.5 h-3.5 text-[#FFB84D]" />
                <span>Micro-Entrepreneur & Home Maker Program</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Grow Your Hyperlocal Storefront for Just <span className="text-[#FFB84D]">₹150 / Month</span>
              </h2>

              <p className="text-sm text-[#9A9AA8] max-w-xl leading-relaxed">
                Whether you bake out of your home kitchen, design bespoke silver filigree, or curate handmade festival hampers — Communiti gives you an instant neighborhood presence, direct WhatsApp customer leads, verified badge, and CSAT review engine. Zero hidden commission.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                  <div className="text-[#FFB84D] font-bold text-xs">🚀 0% Commission</div>
                  <div className="text-[10px] text-[#9A9AA8]">Keep 100% of order revenue</div>
                </div>
                <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                  <div className="text-[#15A37D] font-bold text-xs">⚡ Instant UPI Setup</div>
                  <div className="text-[10px] text-[#9A9AA8]">Pay ₹150 via GPay, PhonePe, Paytm</div>
                </div>
                <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                  <div className="text-[#5B4CF0] font-bold text-xs">💬 Direct Leads</div>
                  <div className="text-[10px] text-[#9A9AA8]">Customers message on WhatsApp</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col items-center lg:items-end justify-center">
              <div className="bg-white text-[#202033] p-6 rounded-2xl shadow-modal max-w-xs w-full text-center space-y-4">
                <span className="text-3xl">👩‍🍳</span>
                <div>
                  <h4 className="font-bold text-lg">List Your Business</h4>
                  <p className="text-xs text-[#6B6B7B]">Takes less than 3 minutes to submit</p>
                </div>
                <div className="text-2xl font-black text-[#5B4CF0]">
                  ₹150 <span className="text-xs text-[#6B6B7B] font-normal">/ month</span>
                </div>
                <button
                  onClick={() => onNavigate('auth', { role: 'ENTREPRENEUR' })}
                  className="w-full bg-[#5B4CF0] hover:bg-[#4A3BE0] text-white font-bold text-xs py-3 rounded-xl transition shadow-md cursor-pointer"
                >
                  Join as Micro-Entrepreneur
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
