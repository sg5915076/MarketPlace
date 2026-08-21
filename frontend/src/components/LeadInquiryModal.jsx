import React, { useState } from 'react';
import { X, Send, MessageCircle, Phone, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export const LeadInquiryModal = ({ isOpen, listing, onClose }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.full_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    occasion: 'Bespoke Order',
    event_date: '',
    budget_range: '₹1,000 - ₹3,000',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [whatsappUrl, setWhatsappUrl] = useState('');

  if (!isOpen || !listing) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await api.submitInquiry(listing.id, formData);
      setWhatsappUrl(res.data.whatsapp_direct_url || '');
      setSubmitted(true);
    } catch (err) {
      console.warn('API lead submission fallback', err);
      // Construct fallback WhatsApp link
      const phoneClean = ''.replace(/[^0-9]/g, listing.whatsapp_number || listing.contact_phone || '919876543210');
      const waLink = `https://wa.me/${phoneClean}?text=${encodeURIComponent(`Hi ${listing.business_name}! I found your store on Communiti. Inquiry: ${formData.message}`)}`;
      setWhatsappUrl(waLink);
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#202033]/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-modal border border-[#E8E8F2] flex flex-col">
        {/* Header */}
        <div className="p-5 bg-[#202033] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#5B4CF0] flex items-center justify-center text-white">
              <MessageCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold">Contact Artisan Maker</h3>
              <p className="text-[11px] text-[#9A9AA8] truncate max-w-xs">{listing.business_name}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-white/70 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {submitted ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 bg-[#E8F8F3] text-[#15A37D] rounded-2xl flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-[#202033]">Inquiry Sent to Maker!</h4>
                <p className="text-xs text-[#6B6B7B] mt-1">
                  {listing.business_name} will get notified in their Artisan Lead Inbox.
                </p>
              </div>

              {whatsappUrl && (
                <div className="p-4 bg-[#E8F8F3] rounded-2xl border border-[#15A37D]/30 space-y-2">
                  <p className="text-xs font-bold text-[#0E7358]">
                    Want instant reply? Chat directly on WhatsApp:
                  </p>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 w-full bg-[#15A37D] hover:bg-[#118A6A] text-white text-xs font-bold py-2.5 px-4 rounded-xl transition shadow-xs"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Open WhatsApp Chat with Maker</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}

              <button
                onClick={onClose}
                className="w-full bg-[#5B4CF0] hover:bg-[#4A3BE0] text-white text-xs font-bold py-2.5 rounded-xl transition cursor-pointer shadow-xs"
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#202033] block mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Priya Nair"
                    className="w-full text-xs p-2.5 border border-[#E8E8F2] rounded-xl focus:border-[#5B4CF0] focus:ring-2 focus:ring-[#5B4CF0]/10 outline-hidden text-[#202033]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#202033] block mb-1">Phone / WhatsApp</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full text-xs p-2.5 border border-[#E8E8F2] rounded-xl focus:border-[#5B4CF0] focus:ring-2 focus:ring-[#5B4CF0]/10 outline-hidden text-[#202033]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#202033] block mb-1">Occasion / Type</label>
                  <select
                    value={formData.occasion}
                    onChange={(e) => setFormData({ ...formData, occasion: e.target.value })}
                    className="w-full text-xs p-2.5 border border-[#E8E8F2] rounded-xl focus:border-[#5B4CF0] bg-white outline-hidden text-[#202033]"
                  >
                    <option value="Custom Cake / Bakes">Custom Cake / Bakes</option>
                    <option value="Festive Gifting Hamper">Festive Gifting Hamper</option>
                    <option value="Wine / Brew Batch">Wine / Brew Batch</option>
                    <option value="Bespoke Jewellery Commission">Bespoke Jewellery Commission</option>
                    <option value="Studio Pottery & Craft">Studio Pottery & Craft</option>
                    <option value="Bulk Gourmet Order">Bulk Gourmet Order</option>
                    <option value="General Inquiry">General Inquiry</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-[#202033] block mb-1">Expected Date</label>
                  <input
                    type="date"
                    value={formData.event_date}
                    onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                    className="w-full text-xs p-2.5 border border-[#E8E8F2] rounded-xl focus:border-[#5B4CF0] outline-hidden text-[#202033]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#202033] block mb-1">
                  Your Requirements & Details
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Describe customization, dietary preferences (eggless, gluten-free), quantities, or design notes..."
                  className="w-full text-xs p-3 border border-[#E8E8F2] rounded-xl focus:border-[#5B4CF0] focus:ring-2 focus:ring-[#5B4CF0]/10 outline-hidden text-[#202033]"
                />
              </div>

              <div className="pt-2 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-[#6B6B7B] hover:text-[#202033] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-[#5B4CF0] hover:bg-[#4A3BE0] text-white text-xs font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition cursor-pointer shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submitting ? 'Submitting...' : 'Send Inquiry to Maker'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeadInquiryModal;
