import React from 'react';
import { Star, ShieldCheck, Sparkles, ThumbsUp, CheckCircle } from 'lucide-react';

export const CSATSummaryWidget = ({ csatSummary, onWriteReviewClick }) => {
  const {
    avg_rating = 4.9,
    total_reviews = 0,
    csat_percentage = 98,
    distribution = { '5': 90, '4': 8, '3': 2, '2': 0, '1': 0 },
    quality_avg = 4.9,
    packaging_avg = 4.8,
    value_avg = 4.7,
    responsiveness_avg = 4.9,
  } = csatSummary || {};

  const totalDist = Object.values(distribution).reduce((a, b) => a + b, 0) || 1;

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E8E8F2] shadow-card">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
        {/* CSAT Hero Score */}
        <div className="flex flex-col items-center justify-center text-center p-6 bg-[#F8F8FC] rounded-xl border border-[#E8E8F2]">
          <div className="inline-flex items-center gap-1.5 bg-[#E8F8F3] text-[#15A37D] px-3 py-1 rounded-full text-xs font-bold mb-3 border border-[#15A37D]/20">
            <ThumbsUp className="w-3.5 h-3.5" />
            <span>{csat_percentage}% Positive CSAT</span>
          </div>

          <div className="text-5xl font-extrabold text-[#202033] mb-1">
            {avg_rating}
          </div>

          {/* Star display */}
          <div className="flex items-center gap-1 text-[#FFB84D] mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-5 h-5 ${star <= Math.round(avg_rating) ? 'fill-[#FFB84D] text-[#FFB84D]' : 'text-[#E8E8F2]'}`}
              />
            ))}
          </div>

          <p className="text-xs text-[#6B6B7B] font-medium">
            Based on {total_reviews} verified customer reviews
          </p>

          {onWriteReviewClick && (
            <button
              onClick={onWriteReviewClick}
              className="mt-4 w-full bg-[#5B4CF0] hover:bg-[#4A3BE0] text-white text-xs font-bold py-2.5 px-4 rounded-xl transition shadow-xs cursor-pointer"
            >
              Write a CSAT Review
            </button>
          )}
        </div>

        {/* Rating Breakdown Bars */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-[#202033] uppercase tracking-wider mb-3">
            Rating Distribution
          </h4>
          {[5, 4, 3, 2, 1].map((stars) => {
            const count = distribution[String(stars)] || 0;
            const pct = Math.round((count / totalDist) * 100);
            return (
              <div key={stars} className="flex items-center gap-2.5 text-xs text-[#6B6B7B]">
                <span className="w-6 font-semibold text-[#202033]">{stars}★</span>
                <div className="flex-1 h-2 bg-[#F0F0F7] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      stars >= 4 ? 'bg-[#FFB84D]' : stars === 3 ? 'bg-[#FFAA33]' : 'bg-[#D5D1FC]'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-8 text-right text-[11px] text-[#6B6B7B] font-mono">{pct}%</span>
              </div>
            );
          })}
        </div>

        {/* Sub-Criteria CSAT Scores */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-[#202033] uppercase tracking-wider mb-3">
            Customer CSAT Benchmarks
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-[#F8F8FC] rounded-xl border border-[#E8E8F2]">
              <div className="text-[11px] text-[#6B6B7B] font-medium">Quality & Craft</div>
              <div className="flex items-center gap-1 text-lg font-extrabold text-[#202033]">
                <span>{quality_avg}</span>
                <span className="text-xs text-[#6B6B7B] font-normal">/ 5</span>
              </div>
            </div>
            <div className="p-3 bg-[#F8F8FC] rounded-xl border border-[#E8E8F2]">
              <div className="text-[11px] text-[#6B6B7B] font-medium">Packaging Aesthetics</div>
              <div className="flex items-center gap-1 text-lg font-extrabold text-[#202033]">
                <span>{packaging_avg}</span>
                <span className="text-xs text-[#6B6B7B] font-normal">/ 5</span>
              </div>
            </div>
            <div className="p-3 bg-[#F8F8FC] rounded-xl border border-[#E8E8F2]">
              <div className="text-[11px] text-[#6B6B7B] font-medium">Value for Money</div>
              <div className="flex items-center gap-1 text-lg font-extrabold text-[#202033]">
                <span>{value_avg}</span>
                <span className="text-xs text-[#6B6B7B] font-normal">/ 5</span>
              </div>
            </div>
            <div className="p-3 bg-[#F8F8FC] rounded-xl border border-[#E8E8F2]">
              <div className="text-[11px] text-[#6B6B7B] font-medium">Maker Responsiveness</div>
              <div className="flex items-center gap-1 text-lg font-extrabold text-[#202033]">
                <span>{responsiveness_avg}</span>
                <span className="text-xs text-[#6B6B7B] font-normal">/ 5</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CSATSummaryWidget;
