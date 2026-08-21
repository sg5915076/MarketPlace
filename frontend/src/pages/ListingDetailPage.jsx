import React, { useState, useEffect } from 'react';
import { 
  Star, MapPin, ShieldCheck, Heart, Phone, 
  MessageCircle, Send, ArrowLeft, Clock, Award, 
  Truck, ShoppingBag, CheckCircle, Sparkles, X, ChevronRight
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { CSATSummaryWidget } from '../components/CSATSummaryWidget';
import { ReviewRatingCard } from '../components/ReviewRatingCard';

export const ListingDetailPage = ({ slug, onNavigate, onOpenInquiry }) => {
  const { user, toggleBookmark, bookmarks } = useAuth();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('menu'); // menu, story, reviews
  const [showReviewModal, setShowReviewModal] = useState(false);

  // Review Form State
  const [newRating, setNewRating] = useState(5);
  const [subRatings, setSubRatings] = useState({ quality: 5, packaging: 5, value: 5, responsiveness: 5 });
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [orderedItems, setOrderedItems] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchListing = async () => {
    setLoading(true);
    try {
      const res = await api.getListingDetail(slug);
      setListing(res.data);
    } catch (e) {
      console.error('Failed to load listing', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slug) {
      fetchListing();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-10 h-10 border-3 border-[#5B4CF0] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-[#6B6B7B]">Loading artisan profile & verified CSAT ratings...</p>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h3 className="text-2xl font-bold text-[#202033]">Artisan Listing Not Found</h3>
        <p className="text-xs text-[#6B6B7B]">The listing may be under moderation review or unpublished.</p>
        <button
          onClick={() => onNavigate('explore')}
          className="bg-[#5B4CF0] hover:bg-[#4A3BE0] text-white text-xs font-bold px-4 py-2 rounded-xl"
        >
          Return to Explore
        </button>
      </div>
    );
  }

  const isBookmarked = bookmarks.some(b => b.listing === listing.id || b.listing_details?.id === listing.id);
  const isOwner = user && user.id === listing.owner;

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewText.trim()) return;

    setSubmittingReview(true);
    try {
      await api.submitReview(listing.id, {
        rating: newRating,
        sub_ratings: subRatings,
        review_title: reviewTitle,
        review_text: reviewText,
        ordered_items: orderedItems,
        customer_name: user?.full_name || 'Verified Community Buyer',
        customer_locality: user?.preferred_locality || listing.area_locality
      });

      setShowReviewModal(false);
      setReviewTitle('');
      setReviewText('');
      setOrderedItems('');
      await fetchListing();
    } catch (err) {
      console.error('Failed to submit review', err);
    } finally {
      setSubmittingReview(false);
    }
  };

  // Direct WhatsApp URL
  const phoneClean = ''.replace(/[^0-9]/g, listing.whatsapp_number || listing.contact_phone || '919876543210');
  const waDirectUrl = `https://wa.me/${phoneClean}?text=${encodeURIComponent(`Hi ${listing.business_name}! I found your artisanal storefront on Communiti and would like to inquire about your creations.`)}`;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back button */}
      <button
        onClick={() => onNavigate('explore')}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6B6B7B] hover:text-[#5B4CF0] transition cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Explore</span>
      </button>

      {/* Hero Artisan Banner */}
      <div className="bg-white rounded-2xl overflow-hidden border border-[#E8E8F2] shadow-card">
        {/* Banner Cover */}
        <div className="relative h-64 sm:h-80 w-full bg-[#202033]">
          <img
            src={listing.banner_image || 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1200&auto=format&fit=crop&q=80'}
            alt={listing.business_name}
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#202033]/90 via-[#202033]/40 to-transparent" />

          {/* Top Badges */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
            <span className="bg-white/95 backdrop-blur-md text-[#202033] text-xs font-bold px-3 py-1 rounded-lg shadow-xs">
              {listing.category?.name}
            </span>
            <button
              onClick={() => toggleBookmark(listing.id)}
              className={`w-9 h-9 rounded-xl flex items-center justify-center backdrop-blur-md transition shadow-xs cursor-pointer ${
                isBookmarked ? 'bg-[#D64545] text-white' : 'bg-white/90 text-[#202033] hover:text-[#D64545]'
              }`}
            >
              <Heart className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Bottom Banner Identity Strip */}
          <div className="absolute bottom-4 left-4 right-4 sm:left-8 sm:right-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-white">
            <div className="flex items-center gap-4">
              <img
                src={listing.logo_image || 'https://images.unsplash.com/photo-1583338917451-face2751d8d5?w=200&auto=format&fit=crop&q=80'}
                alt={listing.business_name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border-2 border-white shadow-md flex-shrink-0"
              />
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                    {listing.business_name}
                  </h1>
                  {listing.is_verified && (
                    <span className="inline-flex items-center gap-1 bg-[#15A37D] text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Verified Maker</span>
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-stone-200 mt-1 max-w-xl line-clamp-1">
                  {listing.tagline}
                </p>
              </div>
            </div>

            {/* Quick CSAT Score */}
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/30 self-start sm:self-auto">
              <Star className="w-4 h-4 fill-[#FFB84D] text-[#FFB84D]" />
              <span className="text-base font-extrabold">{listing.csat_summary?.avg_rating || 4.9}</span>
              <span className="text-xs text-[#FFB84D] font-semibold">({listing.csat_summary?.csat_percentage || 98}% CSAT)</span>
            </div>
          </div>
        </div>

        {/* Info & Action Strip */}
        <div className="p-6 sm:p-8 bg-[#F8F8FC] flex flex-col md:flex-row md:items-center justify-between gap-6 border-t border-[#E8E8F2]">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-[#6B6B7B]">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#15A37D]" />
              <span className="font-semibold text-[#202033]">{listing.area_locality}, {listing.city}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#6B6B7B]" />
              <span>{listing.operating_hours || '10:00 AM - 8:00 PM'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-[#15A37D]" />
              <span>{listing.delivery_radius_km} km radius coverage</span>
            </div>
            <span className="font-bold text-[#5B4CF0] bg-[#EEECFE] px-2 py-0.5 rounded-md font-mono">
              {listing.price_tier || '₹₹'}
            </span>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            <a
              href={waDirectUrl}
              target="_blank"
              rel="noreferrer"
              className="flex-1 sm:flex-none bg-[#15A37D] hover:bg-[#118A6A] text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition shadow-xs"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>WhatsApp Maker</span>
            </a>

            <button
              onClick={() => onOpenInquiry(listing)}
              className="flex-1 sm:flex-none bg-[#5B4CF0] hover:bg-[#4A3BE0] text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition shadow-xs cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Bespoke Inquiry</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-[#E8E8F2] pb-2">
        {[
          { id: 'menu', label: 'Menu & Offerings' },
          { id: 'story', label: 'Meet the Maker & Story' },
          { id: 'reviews', label: `Customer CSAT Reviews (${listing.reviews?.length || 0})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === tab.id
                ? 'bg-[#5B4CF0] text-white shadow-xs'
                : 'text-[#6B6B7B] hover:bg-[#EEECFE] hover:text-[#5B4CF0]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Menu & Products */}
      {activeTab === 'menu' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-[#202033]">
              Signature Creations & Offerings
            </h3>
            <span className="text-xs text-[#6B6B7B]">{listing.items?.length || 0} items available</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listing.items?.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-4 border border-[#E8E8F2] shadow-clean hover:border-[#5B4CF0]/40 transition flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-44 rounded-xl overflow-hidden mb-3 bg-[#F8F8FC]">
                    <img
                      src={item.image_url || 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?w=400'}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    {item.is_bestseller && (
                      <span className="absolute top-2 left-2 bg-[#FFB84D] text-[#202033] text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
                        Bestseller
                      </span>
                    )}
                  </div>

                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-sm font-bold text-[#202033] leading-snug">
                      {item.title}
                    </h4>
                    <span className="text-base font-extrabold text-[#5B4CF0] flex-shrink-0 font-mono">
                      ₹{item.price}
                    </span>
                  </div>

                  <p className="text-xs text-[#6B6B7B] mt-1.5 leading-relaxed line-clamp-2">
                    {item.description}
                  </p>

                  {/* Tags */}
                  {item.dietary_or_custom_tags && item.dietary_or_custom_tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2.5">
                      {item.dietary_or_custom_tags.map((tag, idx) => (
                        <span key={idx} className="text-[10px] bg-[#F8F8FC] text-[#6B6B7B] px-2 py-0.5 rounded-md font-medium border border-[#E8E8F2]">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-[#E8E8F2] flex items-center justify-between">
                  <span className="text-[11px] text-[#6B6B7B]">
                    Lead time: <strong className="text-[#202033]">{item.lead_time_days} day(s)</strong>
                  </span>
                  <button
                    onClick={() => onOpenInquiry(listing)}
                    className="bg-[#5B4CF0] hover:bg-[#4A3BE0] text-white text-[11px] font-bold px-3 py-1.5 rounded-xl transition cursor-pointer shadow-xs"
                  >
                    Order / Inquire
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Story & Craft Bio */}
      {activeTab === 'story' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 bg-white rounded-2xl p-6 sm:p-8 border border-[#E8E8F2] shadow-card space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-[#202033] mb-3">
                Meet the Maker & Our Craft Philosophy
              </h3>
              <p className="text-sm text-[#6B6B7B] leading-relaxed whitespace-pre-line">
                {listing.story_bio || 'Dedicated to crafting small-batch, authentic neighborhood goods with love and care.'}
              </p>
            </div>

            {/* Verification & License Details */}
            <div className="p-4 bg-[#E8F8F3] rounded-xl border border-[#15A37D]/30 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#0E7358]">
                <ShieldCheck className="w-4 h-4 text-[#15A37D]" />
                <span>Verified Business License / Registration</span>
              </div>
              <p className="text-xs text-[#202033] font-mono">
                Registration No: {listing.fssai_or_reg_number || 'MSME-VERIFIED-2026-KA'}
              </p>
              <p className="text-[11px] text-[#6B6B7B]">
                Operating for {listing.years_in_business || 2} year(s) in {listing.area_locality}, {listing.city}.
              </p>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-2xl p-6 border border-[#E8E8F2] shadow-card space-y-4">
              <h4 className="text-base font-bold text-[#202033]">Neighborhood Service Area</h4>
              <div className="text-xs text-[#6B6B7B] space-y-2">
                <p>📍 <strong>Hub:</strong> {listing.area_locality}, {listing.city}</p>
                <p>📦 <strong>Delivery:</strong> {listing.offers_delivery ? 'Available up to ' + listing.delivery_radius_km + ' km' : 'Pickup Only'}</p>
                <p>🛍️ <strong>Store Pickup:</strong> {listing.offers_pickup ? 'Available at studio' : 'Not available'}</p>
                <p>📞 <strong>Phone:</strong> {listing.contact_phone}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: CSAT Reviews & Rating Cards */}
      {activeTab === 'reviews' && (
        <div className="space-y-8">
          {/* CSAT Metric Widget */}
          <CSATSummaryWidget
            csatSummary={listing.csat_summary}
            onWriteReviewClick={() => setShowReviewModal(true)}
          />

          {/* Reviews List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-[#202033]">
                Verified Customer Feedback
              </h3>
              <button
                onClick={() => setShowReviewModal(true)}
                className="bg-[#5B4CF0] hover:bg-[#4A3BE0] text-white text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer shadow-xs"
              >
                Write a CSAT Review
              </button>
            </div>

            {listing.reviews && listing.reviews.length > 0 ? (
              <div className="space-y-4">
                {listing.reviews.map((rev) => (
                  <ReviewRatingCard
                    key={rev.id}
                    review={rev}
                    isOwner={isOwner}
                    onReplySuccess={fetchListing}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-8 text-center border border-[#E8E8F2]">
                <p className="text-xs text-[#6B6B7B]">Be the first neighbor to leave a review for {listing.business_name}!</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Write CSAT Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#202033]/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-modal border border-[#E8E8F2]">
            <div className="p-5 bg-[#202033] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-[#FFB84D] fill-[#FFB84D]" />
                <h3 className="text-base font-bold">Write Customer CSAT Review</h3>
              </div>
              <button onClick={() => setShowReviewModal(false)} className="text-white/70 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleReviewSubmit} className="p-6 space-y-4">
              {/* Star Rating selector */}
              <div>
                <label className="text-xs font-bold text-[#202033] block mb-1">
                  Overall Experience Rating
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setNewRating(star)}
                      className="p-1 cursor-pointer hover:scale-110 transition"
                    >
                      <Star
                        className={`w-7 h-7 ${star <= newRating ? 'fill-[#FFB84D] text-[#FFB84D]' : 'text-[#E8E8F2]'}`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-[#202033] ml-2">
                    {newRating === 5 ? 'Exceptional (5/5)' : newRating === 4 ? 'Very Good (4/5)' : `${newRating}/5`}
                  </span>
                </div>
              </div>

              {/* Sub-ratings sliders */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-[#F8F8FC] rounded-xl border border-[#E8E8F2]">
                {Object.keys(subRatings).map((metric) => (
                  <div key={metric} className="space-y-1">
                    <div className="flex justify-between text-[11px] font-bold text-[#202033] capitalize">
                      <span>{metric}</span>
                      <span className="text-[#5B4CF0]">{subRatings[metric]}★</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={subRatings[metric]}
                      onChange={(e) => setSubRatings({ ...subRatings, [metric]: parseInt(e.target.value) })}
                      className="w-full accent-[#5B4CF0]"
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="text-xs font-bold text-[#202033] block mb-1">What did you order?</label>
                <input
                  type="text"
                  value={orderedItems}
                  onChange={(e) => setOrderedItems(e.target.value)}
                  placeholder="e.g. Sourdough loaf, Belgian Babka..."
                  className="w-full text-xs p-2.5 border border-[#E8E8F2] rounded-xl outline-hidden focus:border-[#5B4CF0]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#202033] block mb-1">Review Headline</label>
                <input
                  type="text"
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  placeholder="Summarize your experience..."
                  className="w-full text-xs p-2.5 border border-[#E8E8F2] rounded-xl outline-hidden focus:border-[#5B4CF0]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#202033] block mb-1">Detailed CSAT Feedback</label>
                <textarea
                  required
                  rows={3}
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Share details about taste, craftsmanship, freshness, packaging, or delivery..."
                  className="w-full text-xs p-3 border border-[#E8E8F2] rounded-xl outline-hidden focus:border-[#5B4CF0]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="px-4 py-2 text-xs font-bold text-[#6B6B7B] hover:text-[#202033]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="bg-[#5B4CF0] hover:bg-[#4A3BE0] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition cursor-pointer shadow-xs"
                >
                  {submittingReview ? 'Submitting...' : 'Post CSAT Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListingDetailPage;
