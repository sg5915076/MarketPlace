from django.urls import path
from .views import (
    CategoryListView, HyperlocalListingSearchView,
    ListingDetailView, EntrepreneurListingManageView,
    ProductItemManageView, SubmitReviewView, ReplyReviewView,
    SubmitInquiryView, EntrepreneurLeadsView, BookmarkToggleView,
    AdminModerationQueueView, AdminModerateListingActionView
)

urlpatterns = [
    # Public & Discovery APIs
    path('categories/', CategoryListView.as_view(), name='category-list'),
    path('search/', HyperlocalListingSearchView.as_view(), name='listing-search'),
    path('listing/<slug:slug>/', ListingDetailView.as_view(), name='listing-detail'),
    
    # Review & CSAT APIs
    path('listing/<int:listing_id>/review/', SubmitReviewView.as_view(), name='submit-review'),
    path('reviews/<int:review_id>/reply/', ReplyReviewView.as_view(), name='reply-review'),
    
    # Lead & Inquiry APIs
    path('listing/<int:listing_id>/inquiry/', SubmitInquiryView.as_view(), name='submit-inquiry'),
    path('entrepreneur/leads/', EntrepreneurLeadsView.as_view(), name='entrepreneur-leads'),
    path('entrepreneur/leads/<int:lead_id>/', EntrepreneurLeadsView.as_view(), name='entrepreneur-lead-update'),
    
    # Bookmarks
    path('bookmarks/', BookmarkToggleView.as_view(), name='my-bookmarks'),
    path('bookmarks/<int:listing_id>/', BookmarkToggleView.as_view(), name='toggle-bookmark'),
    
    # Entrepreneur Listing Profile
    path('entrepreneur/listing/', EntrepreneurListingManageView.as_view(), name='entrepreneur-listing-manage'),
    path('entrepreneur/items/', ProductItemManageView.as_view(), name='entrepreneur-item-add'),
    path('entrepreneur/items/<int:pk>/', ProductItemManageView.as_view(), name='entrepreneur-item-delete'),
    
    # Admin Moderation Queue
    path('admin/moderation-queue/', AdminModerationQueueView.as_view(), name='admin-moderation-queue'),
    path('admin/moderate/<int:listing_id>/', AdminModerateListingActionView.as_view(), name='admin-moderate-action'),
]
