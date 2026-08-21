import React from 'react';
import { 
  Star, MapPin, ShieldCheck, Heart, 
  Truck, ShoppingBag, ArrowRight, MessageSquare
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const ListingCard = ({ listing, onSelect, onOpenInquiry }) => {
  const { bookmarks, toggleBookmark } = useAuth();
  const isBookmarked = bookmarks.some(b => b.listing === listing.id || b.listing_details?.id === listing.id);

  const handleBookmarkClick = async (e) => {
    e.stopPropagation();
    await toggleBookmark(listing.id);
  };

  const handleInquiryClick = (e) => {
    e.stopPropagation();
    if (onOpenInquiry) {
      onOpenInquiry(listing);
    }
  };

  return (
    <div 
      onClick={() => onSelect(listing)}
      className="group bg-white rounded-2xl overflow-hidden border border-[#E8E8F2] hover:border-[#5B4CF0]/40 hover:shadow-elevated transition-all duration-300 flex flex-col cursor-pointer transform hover:-translate-y-1 relative"
    >
      {/* Banner / Cover Image */}
      <div className="relative h-48 w-full overflow-hidden bg-[#F8F8FC]">
        <img
          src={listing.banner_image || 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80'}
          alt={listing.business_name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#202033]/70 via-transparent to-black/20 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-auto">
          {/* Category Pill */}
          <span className="bg-white/95 backdrop-blur-md text-[#202033] text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-xs border border-white/60 flex items-center gap-1">
            <span>{listing.category_name}</span>
          </span>

          {/* Bookmark Button */}
          <button
            onClick={handleBookmarkClick}
            className={`w-8 h-8 rounded-xl flex items-center justify-center backdrop-blur-md transition shadow-xs cursor-pointer ${
              isBookmarked 
                ? 'bg-[#D64545] text-white' 
                : 'bg-white/90 text-[#202033] hover:bg-white hover:text-[#D64545]'
            }`}
            title="Save to favorites"
          >
            <Heart className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Bottom Banner Info: Locality & Verified Status */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
          <div className="flex items-center gap-1.5 font-medium bg-[#202033]/60 backdrop-blur-xs px-2.5 py-1 rounded-lg">
            <MapPin className="w-3.5 h-3.5 text-[#15A37D] flex-shrink-0" />
            <span className="font-semibold text-white">{listing.area_locality}</span>
            <span className="opacity-80 text-[11px]">({listing.city})</span>
          </div>

          {listing.is_verified && (
            <div className="flex items-center gap-1 bg-[#15A37D] text-white px-2 py-0.5 rounded-lg text-[10px] font-bold shadow-xs">
              <ShieldCheck className="w-3 h-3 text-white" />
              <span>Verified</span>
            </div>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Business Title & Price Tier */}
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3 className="text-base font-bold text-[#202033] group-hover:text-[#5B4CF0] transition-colors leading-snug line-clamp-1">
              {listing.business_name}
            </h3>
            <span className="text-xs font-mono font-bold text-[#5B4CF0] bg-[#EEECFE] px-2 py-0.5 rounded-md flex-shrink-0">
              {listing.price_tier || '₹₹'}
            </span>
          </div>

          {/* Tagline */}
          <p className="text-xs text-[#6B6B7B] line-clamp-2 leading-relaxed mb-3">
            {listing.tagline}
          </p>

          {/* Subcategory Tags */}
          {listing.subcategories && listing.subcategories.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {listing.subcategories.slice(0, 3).map((tag, idx) => (
                <span
                  key={idx}
                  className="bg-[#F8F8FC] text-[#6B6B7B] text-[10px] font-medium px-2 py-0.5 rounded-md border border-[#E8E8F2]"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* CSAT Rating Strip & Action Buttons */}
        <div className="pt-3 border-t border-[#E8E8F2] flex flex-col space-y-3">
          {/* CSAT Breakdown Row */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-1 bg-[#FFF7EB] text-[#D98207] px-2 py-0.5 rounded-lg font-bold border border-[#FFB84D]/30">
                <Star className="w-3.5 h-3.5 fill-[#FFB84D] text-[#FFB84D]" />
                <span>{listing.avg_rating || 4.9}</span>
              </div>
              <span className="text-[11px] text-[#6B6B7B] font-medium">
                ({listing.review_count || 12} reviews)
              </span>
            </div>

            <div className="flex items-center gap-1 text-[11px] font-bold text-[#15A37D] bg-[#E8F8F3] px-2.5 py-0.5 rounded-full border border-[#15A37D]/20">
              <span>{listing.csat_percentage || 98}% CSAT</span>
            </div>
          </div>

          {/* Delivery & Quick Inquire Buttons */}
          <div className="flex items-center justify-between gap-2 pt-1">
            <div className="flex items-center gap-2.5 text-[11px] text-[#6B6B7B]">
              {listing.offers_delivery && (
                <span className="flex items-center gap-1" title="Home Delivery available">
                  <Truck className="w-3.5 h-3.5 text-[#15A37D]" />
                  <span>Delivery</span>
                </span>
              )}
              {listing.offers_pickup && (
                <span className="flex items-center gap-1" title="Self Pickup available">
                  <ShoppingBag className="w-3.5 h-3.5 text-[#6B6B7B]" />
                  <span>Pickup</span>
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handleInquiryClick}
                className="p-2 rounded-xl text-[#6B6B7B] hover:text-[#5B4CF0] hover:bg-[#EEECFE] transition border border-[#E8E8F2] cursor-pointer"
                title="Send Custom Inquiry / Lead"
              >
                <MessageSquare className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => onSelect(listing)}
                className="flex items-center gap-1 bg-[#5B4CF0] hover:bg-[#4A3BE0] text-white text-[11px] font-bold px-3 py-2 rounded-xl transition shadow-xs cursor-pointer"
              >
                <span>View Store</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingCard;
