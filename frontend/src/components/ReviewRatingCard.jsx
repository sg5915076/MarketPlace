import React, { useState } from 'react';
import { Star, ShieldCheck, MessageCircle, Send, Check, CornerDownRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export const ReviewRatingCard = ({ review, isOwner, onReplySuccess }) => {
  const { user } = useAuth();
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [submittingReply, setSubmittingReply] = useState(false);

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    setSubmittingReply(true);
    try {
      await api.replyReview(review.id, replyText);
      setShowReplyBox(false);
      setReplyText('');
      if (onReplySuccess) onReplySuccess();
    } catch (err) {
      console.error('Failed to post reply', err);
    } finally {
      setSubmittingReply(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-[#E8E8F2] shadow-clean hover:border-[#5B4CF0]/30 transition-colors space-y-4">
      {/* Reviewer Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <img
            src={review.customer_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'}
            alt={review.customer_name}
            className="w-10 h-10 rounded-xl object-cover border border-[#E8E8F2]"
          />
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-[#202033]">{review.customer_name}</h4>
              {review.is_verified_buyer && (
                <span className="inline-flex items-center gap-0.5 bg-[#E8F8F3] text-[#15A37D] text-[10px] font-bold px-2 py-0.5 rounded-md border border-[#15A37D]/20">
                  <ShieldCheck className="w-3 h-3 text-[#15A37D]" />
                  <span>Verified Buyer</span>
                </span>
              )}
            </div>
            <p className="text-xs text-[#6B6B7B]">
              {review.customer_locality && `Near ${review.customer_locality} • `}
              {review.created_at_formatted || 'Recently'}
            </p>
          </div>
        </div>

        {/* Rating & CSAT Badge */}
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-1 bg-[#FFF7EB] text-[#D98207] px-2.5 py-1 rounded-lg font-bold text-xs border border-[#FFB84D]/30">
            <Star className="w-3.5 h-3.5 fill-[#FFB84D] text-[#FFB84D]" />
            <span>{review.rating}.0</span>
          </div>
          <span className="text-[10px] text-[#15A37D] font-bold mt-1">
            {review.csat_score || 100}% CSAT
          </span>
        </div>
      </div>

      {/* Ordered items tag */}
      {review.ordered_items && (
        <div className="text-xs bg-[#F8F8FC] text-[#202033] px-3 py-1.5 rounded-xl border border-[#E8E8F2] inline-block">
          <span className="font-semibold text-[#6B6B7B]">Ordered: </span>
          <span>{review.ordered_items}</span>
        </div>
      )}

      {/* Review Content */}
      <div className="space-y-1">
        {review.review_title && (
          <h5 className="text-sm font-bold text-[#202033]">
            {review.review_title}
          </h5>
        )}
        <p className="text-xs text-[#6B6B7B] leading-relaxed">
          {review.review_text}
        </p>
      </div>

      {/* Sub-Ratings Chips */}
      {review.sub_ratings && typeof review.sub_ratings === 'object' && (
        <div className="flex flex-wrap gap-2 pt-1">
          {Object.entries(review.sub_ratings).map(([key, val]) => (
            <div
              key={key}
              className="text-[10px] font-medium bg-[#F8F8FC] text-[#202033] px-2 py-0.5 rounded-md border border-[#E8E8F2] flex items-center gap-1 capitalize"
            >
              <span className="text-[#6B6B7B]">{key}:</span>
              <span className="font-bold text-[#FFB84D]">{val}★</span>
            </div>
          ))}
        </div>
      )}

      {/* Entrepreneur Reply */}
      {review.entrepreneur_reply ? (
        <div className="bg-[#EEECFE]/60 rounded-xl p-3.5 border border-[#5B4CF0]/20 ml-4 space-y-1 relative">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#5B4CF0]">
            <CornerDownRight className="w-3.5 h-3.5 text-[#5B4CF0]" />
            <span>Maker Response</span>
          </div>
          <p className="text-xs text-[#202033] leading-relaxed italic">
            "{review.entrepreneur_reply}"
          </p>
        </div>
      ) : isOwner ? (
        <div className="pt-2">
          {!showReplyBox ? (
            <button
              onClick={() => setShowReplyBox(true)}
              className="text-xs font-bold text-[#5B4CF0] hover:text-[#4A3BE0] flex items-center gap-1.5 cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Reply to Customer CSAT Review</span>
            </button>
          ) : (
            <form onSubmit={handleReplySubmit} className="space-y-2.5 ml-4 mt-2">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Thank the customer or share how their feedback helps your craft..."
                rows={2}
                className="w-full text-xs p-3 rounded-xl border border-[#E8E8F2] focus:border-[#5B4CF0] focus:ring-2 focus:ring-[#5B4CF0]/10 outline-hidden bg-white text-[#202033]"
                required
              />
              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  disabled={submittingReply}
                  className="bg-[#5B4CF0] hover:bg-[#4A3BE0] text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition cursor-pointer"
                >
                  <Send className="w-3 h-3" />
                  <span>{submittingReply ? 'Posting...' : 'Post Reply'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowReplyBox(false)}
                  className="text-xs text-[#6B6B7B] hover:text-[#202033] px-2 py-1 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default ReviewRatingCard;
