import React, { useState, useEffect } from 'react';
import { 
  Store, CreditCard, Users, Star, Plus, 
  Trash2, ShieldCheck, Clock, CheckCircle2, 
  AlertCircle, MessageCircle, Phone, ArrowRight, Download, RefreshCw
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { UpiPaymentModal } from '../components/UpiPaymentModal';

export const EntrepreneurPortalPage = ({ onNavigate }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('subscription'); // subscription, leads, profile
  const [listingData, setListingData] = useState(null);
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUpiModal, setShowUpiModal] = useState(false);

  // New Item State
  const [newItem, setNewItem] = useState({
    title: '',
    price: '',
    description: '',
    lead_time_days: 1,
    image_url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400',
    tags: 'Handcrafted',
  });

  const loadEntrepreneurData = async () => {
    setLoading(true);
    try {
      const [listRes, subRes, leadRes] = await Promise.allSettled([
        api.getMyListing(),
        api.getMySubscription(),
        api.getEntrepreneurLeads(),
      ]);

      if (listRes.status === 'fulfilled') setListingData(listRes.value.data?.listing);
      if (subRes.status === 'fulfilled') setSubscriptionData(subRes.value.data);
      if (leadRes.status === 'fulfilled') setLeads(leadRes.value.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEntrepreneurData();
  }, []);

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!newItem.title || !newItem.price) return;

    try {
      await api.addProductItem({
        title: newItem.title,
        price: parseFloat(newItem.price),
        description: newItem.description,
        lead_time_days: parseInt(newItem.lead_time_days),
        image_url: newItem.image_url,
        dietary_or_custom_tags: newItem.tags.split(',').map(t => t.trim()),
      });
      setNewItem({ title: '', price: '', description: '', lead_time_days: 1, image_url: '', tags: '' });
      await loadEntrepreneurData();
    } catch (err) {
      console.error('Failed to add item', err);
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (window.confirm('Are you sure you want to remove this item from your menu?')) {
      try {
        await api.deleteProductItem(itemId);
        await loadEntrepreneurData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleUpdateLeadStatus = async (leadId, newStatus) => {
    try {
      await api.updateLeadStatus(leadId, { status: newStatus });
      await loadEntrepreneurData();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-10 h-10 border-3 border-[#5B4CF0] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-[#6B6B7B]">Loading your artisan dashboard...</p>
      </div>
    );
  }

  const sub = subscriptionData?.subscription;
  const isSubActive = sub?.status === 'ACTIVE' || listingData?.subscription_active;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header Strip */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E8E8F2] shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={listingData?.logo_image || 'https://images.unsplash.com/photo-1583338917451-face2751d8d5?w=200'}
            alt="Logo"
            className="w-16 h-16 rounded-xl object-cover border border-[#E8E8F2] shadow-xs"
          />
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold text-[#202033]">
                {listingData?.business_name || 'My Micro-Business'}
              </h1>
              {listingData?.status === 'APPROVED' ? (
                <span className="bg-[#E8F8F3] text-[#15A37D] text-[11px] font-bold px-2.5 py-0.5 rounded-md flex items-center gap-1 border border-[#15A37D]/20">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Approved & Live</span>
                </span>
              ) : (
                <span className="bg-[#FFF7EB] text-[#D98207] text-[11px] font-bold px-2.5 py-0.5 rounded-md flex items-center gap-1 border border-[#FFB84D]/30">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Pending Admin Moderation</span>
                </span>
              )}
            </div>
            <p className="text-xs text-[#6B6B7B] mt-1">
              {listingData?.area_locality}, {listingData?.city} • {listingData?.category?.name}
            </p>
          </div>
        </div>

        {/* Top KPI Badges */}
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#F8F8FC] rounded-xl border border-[#E8E8F2] text-center min-w-[90px]">
            <div className="text-xs text-[#6B6B7B] font-medium">Page Views</div>
            <div className="text-xl font-bold text-[#202033]">{listingData?.view_count || 142}</div>
          </div>
          <div className="p-3 bg-[#F8F8FC] rounded-xl border border-[#E8E8F2] text-center min-w-[90px]">
            <div className="text-xs text-[#6B6B7B] font-medium">Total Leads</div>
            <div className="text-xl font-bold text-[#5B4CF0]">{leads.length || 18}</div>
          </div>
          <div className="p-3 bg-[#F8F8FC] rounded-xl border border-[#E8E8F2] text-center min-w-[90px]">
            <div className="text-xs text-[#6B6B7B] font-medium">Sub Plan</div>
            <div className="text-sm font-bold text-[#15A37D]">₹150/mo</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E8E8F2] pb-2">
        <button
          onClick={() => setActiveTab('subscription')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === 'subscription' ? 'bg-[#5B4CF0] text-white shadow-xs' : 'text-[#6B6B7B] hover:bg-[#EEECFE] hover:text-[#5B4CF0]'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>₹150 Subscription & Billing</span>
        </button>

        <button
          onClick={() => setActiveTab('leads')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer relative ${
            activeTab === 'leads' ? 'bg-[#5B4CF0] text-white shadow-xs' : 'text-[#6B6B7B] hover:bg-[#EEECFE] hover:text-[#5B4CF0]'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Customer Leads & Inquiries ({leads.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === 'profile' ? 'bg-[#5B4CF0] text-white shadow-xs' : 'text-[#6B6B7B] hover:bg-[#EEECFE] hover:text-[#5B4CF0]'
          }`}
        >
          <Store className="w-4 h-4" />
          <span>Storefront & Menu Editor</span>
        </button>
      </div>

      {/* TAB A: ₹150 Subscription & UPI Billing */}
      {activeTab === 'subscription' && (
        <div className="space-y-6">
          {/* Active Subscription Status Banner */}
          <div className="bg-[#202033] text-white rounded-2xl p-6 sm:p-8 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6 border border-[#31314D]">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 bg-[#5B4CF0]/20 text-[#EEECFE] px-3 py-1 rounded-full text-xs font-bold border border-[#5B4CF0]/40">
                <ShieldCheck className="w-3.5 h-3.5 text-[#15A37D]" />
                <span>Active ₹150 Monthly Artisan Pass</span>
              </div>
              <h3 className="text-2xl font-bold">
                Storefront Listed & Verified
              </h3>
              <p className="text-xs text-[#9A9AA8]">
                Valid until: <strong className="text-white font-mono">{sub?.end_date_formatted || '20 September 2026'}</strong> ({sub?.days_left || 28} days remaining)
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowUpiModal(true)}
                className="bg-[#5B4CF0] hover:bg-[#4A3BE0] text-white text-xs font-bold px-5 py-3 rounded-xl transition shadow-md flex items-center gap-2 cursor-pointer"
              >
                <span>Renew / Pay ₹150 with UPI</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-[#E8E8F2] space-y-1">
              <div className="text-xs font-bold text-[#202033]">📍 Hyperlocal Presence</div>
              <p className="text-xs text-[#6B6B7B]">Your store appears on search for {listingData?.area_locality} and nearby pins.</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-[#E8E8F2] space-y-1">
              <div className="text-xs font-bold text-[#202033]">💬 Direct WhatsApp Leads</div>
              <p className="text-xs text-[#6B6B7B]">Customers directly message you without middlemen or hidden fees.</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-[#E8E8F2] space-y-1">
              <div className="text-xs font-bold text-[#202033]">⭐ CSAT Reviews & Rating</div>
              <p className="text-xs text-[#6B6B7B]">Build high customer trust with verified community reviews and replies.</p>
            </div>
          </div>

          {/* Transaction Ledger Table */}
          <div className="bg-white rounded-2xl p-6 border border-[#E8E8F2] shadow-card space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-bold text-[#202033]">
                Payment History & GST Tax Invoices
              </h4>
              <button
                onClick={loadEntrepreneurData}
                className="text-xs font-semibold text-[#6B6B7B] hover:text-[#202033] flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Refresh Ledger</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#E8E8F2] text-[#6B6B7B] uppercase font-bold text-[10px]">
                    <th className="py-3 px-2">Invoice / Ref</th>
                    <th className="py-3 px-2">Date</th>
                    <th className="py-3 px-2">Channel</th>
                    <th className="py-3 px-2">Amount</th>
                    <th className="py-3 px-2">Status</th>
                    <th className="py-3 px-2 text-right">Tax Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E8F2]">
                  {(subscriptionData?.transactions || []).map((txn) => (
                    <tr key={txn.id} className="hover:bg-[#F8F8FC]">
                      <td className="py-3 px-2 font-mono font-bold text-[#202033]">
                        {txn.invoice_number || txn.transaction_id}
                        {txn.upi_reference_number && (
                          <div className="text-[10px] text-[#6B6B7B] font-sans">UTR: {txn.upi_reference_number}</div>
                        )}
                      </td>
                      <td className="py-3 px-2 text-[#6B6B7B]">{txn.created_at_formatted}</td>
                      <td className="py-3 px-2">
                        <span className="bg-[#F8F8FC] text-[#202033] px-2 py-0.5 rounded font-mono text-[10px] border border-[#E8E8F2]">
                          {txn.payment_channel}
                        </span>
                      </td>
                      <td className="py-3 px-2 font-bold text-[#202033] font-mono">
                        ₹{txn.amount}
                      </td>
                      <td className="py-3 px-2">
                        <span className="bg-[#E8F8F3] text-[#15A37D] px-2 py-0.5 rounded text-[10px] font-bold border border-[#15A37D]/20">
                          {txn.status}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-right">
                        <button
                          onClick={() => window.print()}
                          className="p-1.5 text-[#6B6B7B] hover:text-[#5B4CF0] transition cursor-pointer"
                          title="Print Tax Invoice"
                        >
                          <Download className="w-4 h-4 inline" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB B: Customer Leads & Inquiries */}
      {activeTab === 'leads' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-[#202033]">
              Inbound Customer Inquiries ({leads.length})
            </h3>
            <span className="text-xs text-[#6B6B7B]">Manage leads directly from nearby customers</span>
          </div>

          {leads.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-[#E8E8F2] space-y-2">
              <p className="text-sm font-bold text-[#202033]">No leads yet</p>
              <p className="text-xs text-[#6B6B7B]">Inquiries from neighbors will appear here in real time.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {leads.map((lead) => {
                const phoneOnly = lead.phone.replace(/[^0-9]/g, '');
                const waLink = `https://wa.me/${phoneOnly}?text=${encodeURIComponent(`Hi ${lead.name}! Thank you for inquiring on Communiti regarding ${lead.occasion}. How can we assist you?`)}`;

                return (
                  <div
                    key={lead.id}
                    className="bg-white rounded-2xl p-5 border border-[#E8E8F2] shadow-clean hover:border-[#5B4CF0]/30 transition space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#E8E8F2]">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-[#202033]">{lead.name}</h4>
                          <span className="text-xs text-[#6B6B7B] font-mono">{lead.phone}</span>
                        </div>
                        <p className="text-xs text-[#6B6B7B]">
                          {lead.occasion} • Target Date: {lead.event_date || 'Flexible'} • Budget: {lead.budget_range || 'Flexible'}
                        </p>
                      </div>

                      {/* Lead Status Dropdown & WhatsApp Action */}
                      <div className="flex items-center gap-2">
                        <select
                          value={lead.status}
                          onChange={(e) => handleUpdateLeadStatus(lead.id, e.target.value)}
                          className="text-xs p-1.5 border border-[#E8E8F2] rounded-lg bg-[#F8F8FC] font-bold text-[#202033] outline-hidden focus:border-[#5B4CF0]"
                        >
                          <option value="NEW">🟢 New Inquiry</option>
                          <option value="CONTACTED">🟡 Contacted</option>
                          <option value="QUALIFIED">🔵 Qualified</option>
                          <option value="CONVERTED">🎉 Converted Order</option>
                          <option value="CLOSED">⚪ Closed</option>
                        </select>

                        <a
                          href={waLink}
                          target="_blank"
                          rel="noreferrer"
                          className="bg-[#15A37D] hover:bg-[#118A6A] text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition shadow-xs"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>Reply on WA</span>
                        </a>
                      </div>
                    </div>

                    <p className="text-xs text-[#202033] italic bg-[#F8F8FC] p-3 rounded-xl border border-[#E8E8F2]">
                      "{lead.message}"
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB C: Storefront & Menu Editor */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Add Product Item Form */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-[#E8E8F2] shadow-card space-y-4">
            <h3 className="text-lg font-bold text-[#202033]">
              Add New Signature Creation
            </h3>

            <form onSubmit={handleAddItem} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-[#202033] block mb-1">Item Title</label>
                <input
                  type="text"
                  required
                  value={newItem.title}
                  onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                  placeholder="e.g. Lavender Honey Tea Cake (500g)"
                  className="w-full text-xs p-2.5 border border-[#E8E8F2] rounded-xl outline-hidden focus:border-[#5B4CF0]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-[#202033] block mb-1">Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={newItem.price}
                    onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                    placeholder="450.00"
                    className="w-full text-xs p-2.5 border border-[#E8E8F2] rounded-xl outline-hidden focus:border-[#5B4CF0]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#202033] block mb-1">Lead Time (Days)</label>
                  <input
                    type="number"
                    min="1"
                    value={newItem.lead_time_days}
                    onChange={(e) => setNewItem({ ...newItem, lead_time_days: e.target.value })}
                    className="w-full text-xs p-2.5 border border-[#E8E8F2] rounded-xl outline-hidden focus:border-[#5B4CF0]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#202033] block mb-1">Image URL</label>
                <input
                  type="url"
                  value={newItem.image_url}
                  onChange={(e) => setNewItem({ ...newItem, image_url: e.target.value })}
                  placeholder="https://..."
                  className="w-full text-xs p-2.5 border border-[#E8E8F2] rounded-xl outline-hidden focus:border-[#5B4CF0]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#202033] block mb-1">Tags (Comma separated)</label>
                <input
                  type="text"
                  value={newItem.tags}
                  onChange={(e) => setNewItem({ ...newItem, tags: e.target.value })}
                  placeholder="Gluten-Free, Eggless, Bestseller"
                  className="w-full text-xs p-2.5 border border-[#E8E8F2] rounded-xl outline-hidden focus:border-[#5B4CF0]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#202033] block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  placeholder="Ingredients, craft technique, or flavor profile..."
                  className="w-full text-xs p-2.5 border border-[#E8E8F2] rounded-xl outline-hidden focus:border-[#5B4CF0]"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#5B4CF0] hover:bg-[#4A3BE0] text-white text-xs font-bold py-2.5 rounded-xl transition cursor-pointer shadow-xs"
              >
                + Add Item to Menu
              </button>
            </form>
          </div>

          {/* Current Menu List */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="text-lg font-bold text-[#202033]">
              Current Catalogue Offerings ({listingData?.items?.length || 0})
            </h3>

            <div className="space-y-3">
              {(listingData?.items || []).map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-4 rounded-2xl border border-[#E8E8F2] shadow-clean flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image_url || 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?w=200'}
                      alt={item.title}
                      className="w-14 h-14 rounded-xl object-cover border border-[#E8E8F2] flex-shrink-0"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-[#202033]">{item.title}</h4>
                      <p className="text-xs font-mono font-bold text-[#5B4CF0]">₹{item.price}</p>
                      <p className="text-[11px] text-[#6B6B7B]">Prep time: {item.lead_time_days} day(s)</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    className="p-2 text-[#6B6B7B] hover:text-[#D64545] transition cursor-pointer"
                    title="Delete item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* UPI Payment Modal for ₹150 renewal */}
      <UpiPaymentModal
        isOpen={showUpiModal}
        onClose={() => setShowUpiModal(false)}
        onSuccess={() => {
          setShowUpiModal(false);
          loadEntrepreneurData();
        }}
      />
    </div>
  );
};

export default EntrepreneurPortalPage;
