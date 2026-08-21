import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, CheckCircle2, XCircle, AlertTriangle, 
  Sparkles, RefreshCw, Star, Layers, MapPin, Eye, FileText, Check
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const AdminApprovalPage = ({ onNavigate }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('queue'); // queue, approved, audit
  const [queueData, setQueueData] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionNotes, setActionNotes] = useState({});
  const [processingId, setProcessingId] = useState(null);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [qRes, logRes] = await Promise.allSettled([
        api.getAdminModerationQueue('ALL'),
        api.getAdminAuditLogs(),
      ]);

      if (qRes.status === 'fulfilled') setQueueData(qRes.value.data);
      if (logRes.status === 'fulfilled') setAuditLogs(logRes.value.data || []);
    } catch (e) {
      console.error('Failed to fetch admin data', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleModerateAction = async (listingId, action) => {
    setProcessingId(listingId);
    try {
      const notes = actionNotes[listingId] || '';
      await api.moderateListing(listingId, { action, notes });
      await fetchAdminData();
    } catch (e) {
      console.error(e);
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-10 h-10 border-3 border-[#15A37D] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-[#6B6B7B]">Loading platform moderation queue & audit logs...</p>
      </div>
    );
  }

  const stats = queueData?.stats || {
    total_listings: 8,
    pending_approvals: 1,
    approved_active: 7,
    platform_avg_csat: 4.9,
    monthly_mrr_inr: 1050,
  };

  const listings = queueData?.listings || [];
  const pendingListings = listings.filter(l => l.status === 'PENDING_APPROVAL');
  const approvedListings = listings.filter(l => l.status === 'APPROVED');

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#E8F8F3] text-[#15A37D]">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold text-[#202033]">
              Admin Moderation & Quality Approvals
            </h1>
          </div>
          <p className="text-xs text-[#6B6B7B] mt-1">
            Review micro-business listings, verify KYC/FSSAI credentials, and monitor platform CSAT.
          </p>
        </div>

        <button
          onClick={fetchAdminData}
          className="self-start sm:self-auto bg-[#F8F8FC] hover:bg-[#EEECFE] text-[#202033] hover:text-[#5B4CF0] text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition border border-[#E8E8F2] cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Queue</span>
        </button>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#E8E8F2] shadow-card">
          <div className="text-xs text-[#6B6B7B] font-medium">Pending Approvals</div>
          <div className="text-3xl font-black text-[#FFB84D] mt-1">
            {stats.pending_approvals}
          </div>
          <span className="text-[10px] text-[#D98207] bg-[#FFF7EB] px-2 py-0.5 rounded font-bold border border-[#FFB84D]/20">
            Needs Review
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E8E8F2] shadow-card">
          <div className="text-xs text-[#6B6B7B] font-medium">Approved Active</div>
          <div className="text-3xl font-black text-[#15A37D] mt-1">
            {stats.approved_active}
          </div>
          <span className="text-[10px] text-[#15A37D] bg-[#E8F8F3] px-2 py-0.5 rounded font-bold border border-[#15A37D]/20">
            Live on Platform
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E8E8F2] shadow-card">
          <div className="text-xs text-[#6B6B7B] font-medium">Monthly Subscriptions</div>
          <div className="text-3xl font-black text-[#5B4CF0] mt-1 font-mono">
            ₹{stats.monthly_mrr_inr}
          </div>
          <span className="text-[10px] text-[#6B6B7B] font-medium">₹150 × {stats.approved_active} makers</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E8E8F2] shadow-card">
          <div className="text-xs text-[#6B6B7B] font-medium">Platform Avg CSAT</div>
          <div className="text-3xl font-black text-[#202033] mt-1 flex items-center gap-1">
            <Star className="w-5 h-5 fill-[#FFB84D] text-[#FFB84D]" />
            <span>{stats.platform_avg_csat}</span>
          </div>
          <span className="text-[10px] text-[#15A37D] font-bold">98% Positive CSAT</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E8E8F2] pb-2">
        <button
          onClick={() => setActiveTab('queue')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer relative ${
            activeTab === 'queue' ? 'bg-[#5B4CF0] text-white shadow-xs' : 'text-[#6B6B7B] hover:bg-[#EEECFE] hover:text-[#5B4CF0]'
          }`}
        >
          <span>Pending Approvals Queue</span>
          {pendingListings.length > 0 && (
            <span className="bg-[#FFB84D] text-[#202033] text-[10px] font-bold px-1.5 rounded-full">
              {pendingListings.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('approved')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === 'approved' ? 'bg-[#5B4CF0] text-white shadow-xs' : 'text-[#6B6B7B] hover:bg-[#EEECFE] hover:text-[#5B4CF0]'
          }`}
        >
          Active Storefronts ({approvedListings.length})
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === 'audit' ? 'bg-[#5B4CF0] text-white shadow-xs' : 'text-[#6B6B7B] hover:bg-[#EEECFE] hover:text-[#5B4CF0]'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>System Audit Trail</span>
        </button>
      </div>

      {/* TAB 1: Pending Queue */}
      {activeTab === 'queue' && (
        <div className="space-y-6">
          {pendingListings.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-[#E8E8F2] space-y-2">
              <CheckCircle2 className="w-12 h-12 text-[#15A37D] mx-auto" />
              <h3 className="text-lg font-bold text-[#202033]">All Approvals Up to Date!</h3>
              <p className="text-xs text-[#6B6B7B]">There are no pending micro-business listings awaiting review.</p>
            </div>
          ) : (
            pendingListings.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-6 sm:p-8 border border-[#FFB84D]/40 shadow-card space-y-6"
              >
                {/* Header info */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <img
                      src={item.logo_image || 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=150'}
                      alt={item.business_name}
                      className="w-16 h-16 rounded-xl object-cover border border-[#E8E8F2] flex-shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-bold text-[#202033]">
                          {item.business_name}
                        </h3>
                        <span className="bg-[#FFF7EB] text-[#D98207] text-[10px] font-bold px-2 py-0.5 rounded-md border border-[#FFB84D]/30">
                          Pending Review
                        </span>
                      </div>
                      <p className="text-xs text-[#6B6B7B] mt-0.5">
                        Category: <strong>{item.category?.name}</strong> • Locality: <strong>{item.area_locality}, {item.city}</strong>
                      </p>
                      <p className="text-xs text-[#6B6B7B] mt-1 font-mono">
                        Owner: {item.owner_details?.email} ({item.contact_phone})
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-mono font-bold text-[#5B4CF0] bg-[#EEECFE] px-3 py-1 rounded-xl self-start">
                    Plan: ₹150 / mo
                  </span>
                </div>

                {/* Story & Verification */}
                <div className="p-4 bg-[#F8F8FC] rounded-xl border border-[#E8E8F2] text-xs space-y-2">
                  <div>
                    <span className="font-bold text-[#202033]">Artisan Craft Bio:</span>
                    <p className="text-[#6B6B7B] mt-0.5 italic">"{item.story_bio}"</p>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-[#E8E8F2] text-[#6B6B7B]">
                    <div>FSSAI / Reg: <strong className="text-[#202033] font-mono">{item.fssai_or_reg_number || 'N/A'}</strong></div>
                    <div>Years Active: <strong className="text-[#202033]">{item.years_in_business} yr(s)</strong></div>
                    <div>Delivery Radius: <strong className="text-[#202033]">{item.delivery_radius_km} km</strong></div>
                  </div>
                </div>

                {/* Sample Menu Items preview */}
                {item.items && item.items.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-[#202033] uppercase tracking-wider mb-2">
                      Submitted Catalogue Items ({item.items.length})
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {item.items.map((prod) => (
                        <div key={prod.id} className="p-3 bg-[#F8F8FC] rounded-xl border border-[#E8E8F2] text-xs flex items-center gap-2.5">
                          <img src={prod.image_url} alt={prod.title} className="w-10 h-10 rounded-lg object-cover" />
                          <div>
                            <div className="font-bold text-[#202033] line-clamp-1">{prod.title}</div>
                            <div className="font-mono text-[#5B4CF0] font-bold">₹{prod.price}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Moderation Actions Bar */}
                <div className="pt-4 border-t border-[#E8E8F2] flex flex-col sm:flex-row items-center justify-between gap-4">
                  <input
                    type="text"
                    placeholder="Feedback / moderation note for the maker..."
                    value={actionNotes[item.id] || ''}
                    onChange={(e) => setActionNotes({ ...actionNotes, [item.id]: e.target.value })}
                    className="w-full sm:w-80 text-xs p-2.5 border border-[#E8E8F2] rounded-xl outline-hidden focus:border-[#5B4CF0] text-[#202033]"
                  />

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => handleModerateAction(item.id, 'REJECT')}
                      disabled={processingId === item.id}
                      className="flex-1 sm:flex-none bg-[#FDF2F2] hover:bg-[#FCEBEB] text-[#D64545] text-xs font-bold px-4 py-2.5 rounded-xl transition border border-[#D64545]/20 cursor-pointer"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleModerateAction(item.id, 'REQUEST_CHANGES')}
                      disabled={processingId === item.id}
                      className="flex-1 sm:flex-none bg-[#FFF7EB] hover:bg-[#FFEACC] text-[#D98207] text-xs font-bold px-4 py-2.5 rounded-xl transition border border-[#FFB84D]/30 cursor-pointer"
                    >
                      Request Edits
                    </button>
                    <button
                      onClick={() => handleModerateAction(item.id, 'APPROVE')}
                      disabled={processingId === item.id}
                      className="flex-1 sm:flex-none bg-[#15A37D] hover:bg-[#118A6A] text-white text-xs font-bold px-5 py-2.5 rounded-xl transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{processingId === item.id ? 'Processing...' : 'Approve & Publish'}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 2: Approved Active Storefronts */}
      {activeTab === 'approved' && (
        <div className="bg-white rounded-2xl p-6 border border-[#E8E8F2] shadow-card space-y-4">
          <h3 className="text-lg font-bold text-[#202033]">
            Active Verified Storefronts ({approvedListings.length})
          </h3>

          <div className="divide-y divide-[#E8E8F2]">
            {approvedListings.map((listing) => (
              <div key={listing.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={listing.logo_image || 'https://images.unsplash.com/photo-1583338917451-face2751d8d5?w=120'}
                    alt={listing.business_name}
                    className="w-12 h-12 rounded-xl object-cover border border-[#E8E8F2]"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-[#202033]">{listing.business_name}</h4>
                      {listing.is_featured && (
                        <span className="bg-[#FFF7EB] text-[#D98207] text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-0.5 border border-[#FFB84D]/30">
                          <Sparkles className="w-3 h-3 text-[#FFB84D]" />
                          <span>Spotlight</span>
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#6B6B7B]">
                      {listing.category?.name} • {listing.area_locality}, {listing.city}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleModerateAction(listing.id, 'TOGGLE_FEATURED')}
                    className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition cursor-pointer ${
                      listing.is_featured
                        ? 'bg-[#FFF7EB] text-[#D98207] border-[#FFB84D]/40'
                        : 'bg-[#F8F8FC] text-[#6B6B7B] border-[#E8E8F2] hover:bg-[#EEECFE] hover:text-[#5B4CF0]'
                    }`}
                  >
                    {listing.is_featured ? '⭐ Featured on Home' : 'Feature Listing'}
                  </button>

                  <button
                    onClick={() => onNavigate('listing-detail', { slug: listing.slug })}
                    className="bg-[#5B4CF0] hover:bg-[#4A3BE0] text-white text-xs font-bold px-3.5 py-1.5 rounded-xl transition cursor-pointer shadow-xs"
                  >
                    View Store
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: System Audit Trail */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-2xl p-6 border border-[#E8E8F2] shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#202033]">
              System Audit & Compliance Log
            </h3>
            <span className="text-xs text-[#6B6B7B]">{auditLogs.length} events recorded</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#E8E8F2] text-[#6B6B7B] uppercase font-bold text-[10px]">
                  <th className="py-3 px-2">Timestamp</th>
                  <th className="py-3 px-2">Actor</th>
                  <th className="py-3 px-2">Action</th>
                  <th className="py-3 px-2">Target Entity</th>
                  <th className="py-3 px-2">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E8F2]">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#F8F8FC]">
                    <td className="py-3 px-2 text-[#6B6B7B] font-mono text-[11px] whitespace-nowrap">
                      {log.created_at_formatted}
                    </td>
                    <td className="py-3 px-2 font-semibold text-[#202033]">
                      {log.actor_email}
                    </td>
                    <td className="py-3 px-2">
                      <span className="bg-[#F8F8FC] text-[#202033] px-2 py-0.5 rounded font-mono text-[10px] border border-[#E8E8F2]">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-[#202033] font-medium">
                      {log.target_label || log.target_model}
                    </td>
                    <td className="py-3 px-2 text-[#6B6B7B] font-mono text-[10px] max-w-xs truncate">
                      {JSON.stringify(log.details)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminApprovalPage;
