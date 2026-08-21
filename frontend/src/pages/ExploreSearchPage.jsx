import React, { useState, useEffect } from 'react';
import { 
  Search, MapPin, Filter, Star, ShieldCheck, 
  Truck, ShoppingBag, SlidersHorizontal, Sparkles, X, ChevronDown
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ListingCard } from '../components/ListingCard';

const CATEGORIES = [
  { slug: 'all', name: 'All Categories', icon: '✨' },
  { slug: 'home-bakers', name: 'Home Bakers', icon: '🍰' },
  { slug: 'chocolate-creations', name: 'Chocolates', icon: '🍫' },
  { slug: 'bespoke-gifting', name: 'Bespoke Gifting', icon: '🎁' },
  { slug: 'handcrafted-crafts', name: 'Crafts & Pottery', icon: '🧶' },
  { slug: 'artisanal-gourmet', name: 'Artisanal Gourmet', icon: '🎨' },
  { slug: 'jewellery-designers', name: 'Jewellery', icon: '💍' },
  { slug: 'homemade-wines', name: 'Homemade Wines', icon: '🍷' },
];

export const ExploreSearchPage = ({ initialParams = {}, onNavigate, onOpenInquiry, onOpenLocationModal }) => {
  const { currentLocation, currentCity } = useAuth();
  const [searchTerm, setSearchTerm] = useState(initialParams.q || '');
  const [selectedCategory, setSelectedCategory] = useState(initialParams.category || 'all');
  const [locationTerm, setLocationTerm] = useState(initialParams.location || currentCity || '');
  const [selectedPrice, setSelectedPrice] = useState('');
  const [deliveryOnly, setDeliveryOnly] = useState(false);
  const [pickupOnly, setPickupOnly] = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchResults = async () => {
    setLoading(true);
    try {
      const params = {
        q: searchTerm,
        category: selectedCategory !== 'all' ? selectedCategory : '',
        location: locationTerm,
        price_tier: selectedPrice,
        delivery: deliveryOnly ? 'true' : '',
        pickup: pickupOnly ? 'true' : '',
        verified: verifiedOnly ? 'true' : '',
        sort: sortBy,
      };
      const res = await api.searchListings(params);
      setListings(res.data.results || []);
    } catch (e) {
      console.warn('Search request fallback', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, [selectedCategory, selectedPrice, deliveryOnly, pickupOnly, verifiedOnly, sortBy]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchResults();
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedPrice('');
    setDeliveryOnly(false);
    setPickupOnly(false);
    setVerifiedOnly(false);
    setSortBy('featured');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Search & Filter Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-[#E8E8F2] shadow-card space-y-4">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          {/* Keyword Search */}
          <div className="sm:col-span-6 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6B7B]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by specialty (e.g. sourdough, bonbons, macrame, silver...)"
              className="w-full pl-10 pr-4 py-2.5 bg-[#F8F8FC] border border-[#E8E8F2] rounded-xl text-xs text-[#202033] focus:bg-white focus:border-[#5B4CF0] focus:ring-2 focus:ring-[#5B4CF0]/10 outline-hidden transition"
            />
          </div>

          {/* Location / Area Input */}
          <div className="sm:col-span-4 relative">
            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#15A37D]" />
            <input
              type="text"
              value={locationTerm}
              onChange={(e) => setLocationTerm(e.target.value)}
              placeholder="Area or City (e.g. Indiranagar, Bandra...)"
              className="w-full pl-10 pr-4 py-2.5 bg-[#F8F8FC] border border-[#E8E8F2] rounded-xl text-xs text-[#202033] focus:bg-white focus:border-[#5B4CF0] focus:ring-2 focus:ring-[#5B4CF0]/10 outline-hidden transition"
            />
          </div>

          {/* Submit Search Button */}
          <div className="sm:col-span-2">
            <button
              type="submit"
              className="w-full bg-[#5B4CF0] hover:bg-[#4A3BE0] text-white text-xs font-bold py-2.5 rounded-xl transition shadow-xs cursor-pointer"
            >
              Search
            </button>
          </div>
        </form>

        {/* Micro-Category Pills Carousel */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer flex-shrink-0 ${
                selectedCategory === cat.slug
                  ? 'bg-[#5B4CF0] text-white shadow-xs'
                  : 'bg-[#F8F8FC] text-[#6B6B7B] hover:bg-[#EEECFE] hover:text-[#5B4CF0]'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Secondary Filters Strip */}
        <div className="pt-3 border-t border-[#E8E8F2] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            {/* Price Tier Filter */}
            <div className="flex items-center bg-[#F8F8FC] border border-[#E8E8F2] rounded-xl p-0.5">
              {['', '₹', '₹₹', '₹₹₹'].map((tier) => (
                <button
                  key={tier}
                  onClick={() => setSelectedPrice(tier)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                    selectedPrice === tier
                      ? 'bg-[#5B4CF0] text-white'
                      : 'text-[#6B6B7B] hover:text-[#202033]'
                  }`}
                >
                  {tier || 'All Prices'}
                </button>
              ))}
            </div>

            {/* Delivery Toggle */}
            <button
              onClick={() => setDeliveryOnly(!deliveryOnly)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                deliveryOnly
                  ? 'bg-[#E8F8F3] text-[#15A37D] border-[#15A37D]/30'
                  : 'bg-white text-[#6B6B7B] border-[#E8E8F2] hover:bg-[#F8F8FC]'
              }`}
            >
              <Truck className="w-3.5 h-3.5 text-[#15A37D]" />
              <span>Home Delivery</span>
            </button>

            {/* Pickup Toggle */}
            <button
              onClick={() => setPickupOnly(!pickupOnly)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                pickupOnly
                  ? 'bg-[#E8F8F3] text-[#15A37D] border-[#15A37D]/30'
                  : 'bg-white text-[#6B6B7B] border-[#E8E8F2] hover:bg-[#F8F8FC]'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5 text-[#6B6B7B]" />
              <span>Self Pickup</span>
            </button>

            {/* Verified Badge Toggle */}
            <button
              onClick={() => setVerifiedOnly(!verifiedOnly)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                verifiedOnly
                  ? 'bg-[#E8F8F3] text-[#15A37D] border-[#15A37D]/30'
                  : 'bg-white text-[#6B6B7B] border-[#E8E8F2] hover:bg-[#F8F8FC]'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#15A37D]" />
              <span>Verified Makers Only</span>
            </button>
          </div>

          {/* Sort Dropdown & Clear */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-[#6B6B7B] font-medium">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-[#F8F8FC] border border-[#E8E8F2] rounded-xl px-2.5 py-1 text-xs font-bold text-[#202033] outline-hidden focus:border-[#5B4CF0]"
              >
                <option value="featured">Spotlight & Recommended</option>
                <option value="rating">Highest CSAT Rating</option>
                <option value="views">Most Popular</option>
                <option value="newest">Recently Joined</option>
              </select>
            </div>

            <button
              onClick={clearAllFilters}
              className="text-[#6B6B7B] hover:text-[#202033] underline text-xs cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#202033]">
            Artisanal Micro-Businesses
          </h2>
          <p className="text-xs text-[#6B6B7B] mt-0.5">
            Showing {listings.length} verified creators in <strong className="text-[#202033]">{locationTerm || 'all hubs'}</strong>
          </p>
        </div>
      </div>

      {/* Listings Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="h-80 bg-[#F0F0F7] rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : listings.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-[#E8E8F2] shadow-clean space-y-4 max-w-md mx-auto">
          <span className="text-4xl">🔍</span>
          <h3 className="text-lg font-bold text-[#202033]">No Micro-Businesses Found</h3>
          <p className="text-xs text-[#6B6B7B] leading-relaxed">
            We couldn't find any listings matching your specific filters in this area. Try clearing filters or searching nearby localities.
          </p>
          <button
            onClick={clearAllFilters}
            className="bg-[#5B4CF0] hover:bg-[#4A3BE0] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition cursor-pointer shadow-xs"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              onSelect={(item) => onNavigate('listing-detail', { slug: item.slug })}
              onOpenInquiry={onOpenInquiry}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ExploreSearchPage;
