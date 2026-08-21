import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for JWT
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('communiti_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token if expired/invalid
      // localStorage.removeItem('communiti_token');
      // localStorage.removeItem('communiti_user');
    }
    return Promise.reject(error);
  }
);

export const api = {
  // Auth
  login: (email, password) => apiClient.post('/auth/login/', { email, password }),
  register: (data) => apiClient.post('/auth/register/', data),
  getMe: () => apiClient.get('/auth/me/'),
  updateProfile: (data) => apiClient.put('/auth/me/', data),

  // Listings & Categories
  getCategories: () => apiClient.get('/listings/categories/'),
  searchListings: (params) => apiClient.get('/listings/search/', { params }),
  getListingDetail: (slug) => apiClient.get(`/listings/listing/${slug}/`),
  
  // Entrepreneur Listing Management
  getMyListing: () => apiClient.get('/listings/entrepreneur/listing/'),
  saveMyListing: (data) => apiClient.post('/listings/entrepreneur/listing/', data),
  addProductItem: (data) => apiClient.post('/listings/entrepreneur/items/', data),
  deleteProductItem: (id) => apiClient.delete(`/listings/entrepreneur/items/${id}/`),

  // Reviews & CSAT
  submitReview: (listingId, data) => apiClient.post(`/listings/listing/${listingId}/review/`, data),
  replyReview: (reviewId, reply) => apiClient.post(`/listings/reviews/${reviewId}/reply/`, { reply }),

  // Customer Inquiries & Leads
  submitInquiry: (listingId, data) => apiClient.post(`/listings/listing/${listingId}/inquiry/`, data),
  getEntrepreneurLeads: () => apiClient.get('/listings/entrepreneur/leads/'),
  updateLeadStatus: (leadId, data) => apiClient.patch(`/listings/entrepreneur/leads/${leadId}/`, data),

  // Bookmarks
  getBookmarks: () => apiClient.get('/listings/bookmarks/'),
  toggleBookmark: (listingId) => apiClient.post(`/listings/bookmarks/${listingId}/`),

  // Subscriptions & UPI Payments
  getSubscriptionPlans: () => apiClient.get('/subscriptions/plans/'),
  createUpiOrder: () => apiClient.post('/subscriptions/create-order/'),
  verifyUpiPayment: (data) => apiClient.post('/subscriptions/verify-upi/', data),
  getMySubscription: () => apiClient.get('/subscriptions/my-subscription/'),

  // Admin Moderation & Audit
  getAdminModerationQueue: (status = 'ALL') => apiClient.get('/listings/admin/moderation-queue/', { params: { status } }),
  moderateListing: (listingId, data) => apiClient.post(`/listings/admin/moderate/${listingId}/`, data),
  getAdminAuditLogs: () => apiClient.get('/subscriptions/admin/audit-logs/'),
};

export default apiClient;
