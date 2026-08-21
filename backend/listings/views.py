from rest_framework import status, permissions, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Q, Avg, Count
from django.utils import timezone
from .models import (
    Category, BusinessListing, ProductServiceItem,
    ListingGalleryImage, Review, CustomerInquiry, Bookmark
)
from .serializers import (
    CategorySerializer, BusinessListingListSerializer,
    BusinessListingDetailSerializer, ProductServiceItemSerializer,
    ReviewSerializer, CustomerInquirySerializer, BookmarkSerializer
)
from subscriptions.models import AuditLog


class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]


class HyperlocalListingSearchView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        queryset = BusinessListing.objects.filter(
            status=BusinessListing.StatusChoices.APPROVED
        ).select_related('category', 'owner').prefetch_related('reviews', 'items')

        # 1. Location / Area search
        location_query = request.query_params.get('location', '').strip()
        if location_query:
            queryset = queryset.filter(
                Q(area_locality__icontains=location_query) |
                Q(city__icontains=location_query) |
                Q(address_line__icontains=location_query) |
                Q(pincode__icontains=location_query)
            )

        # 2. City filter
        city = request.query_params.get('city', '').strip()
        if city:
            queryset = queryset.filter(city__iexact=city)

        # 3. Category filter
        category_slug = request.query_params.get('category', '').strip()
        if category_slug and category_slug != 'all':
            queryset = queryset.filter(
                Q(category__slug=category_slug) | Q(category__name__icontains=category_slug)
            )

        # 4. Search query (keyword)
        q = request.query_params.get('q', '').strip()
        if q:
            queryset = queryset.filter(
                Q(business_name__icontains=q) |
                Q(tagline__icontains=q) |
                Q(story_bio__icontains=q) |
                Q(area_locality__icontains=q) |
                Q(category__name__icontains=q) |
                Q(items__title__icontains=q)
            ).distinct()

        # 5. Price tier
        price_tier = request.query_params.get('price_tier', '').strip()
        if price_tier:
            queryset = queryset.filter(price_tier=price_tier)

        # 6. Delivery & Pickup flags
        offers_delivery = request.query_params.get('delivery')
        if offers_delivery == 'true':
            queryset = queryset.filter(offers_delivery=True)

        offers_pickup = request.query_params.get('pickup')
        if offers_pickup == 'true':
            queryset = queryset.filter(offers_pickup=True)

        # 7. Verified only
        verified = request.query_params.get('verified')
        if verified == 'true':
            queryset = queryset.filter(is_verified=True)

        # 8. Sorting
        sort_by = request.query_params.get('sort', 'featured')
        if sort_by == 'newest':
            queryset = queryset.order_by('-created_at')
        elif sort_by == 'views':
            queryset = queryset.order_by('-view_count')
        elif sort_by == 'rating':
            queryset = queryset.annotate(avg_r=Avg('reviews__rating')).order_by('-avg_r')
        else: # default: featured first, then created_at
            queryset = queryset.order_by('-is_featured', '-is_verified', '-created_at')

        serializer = BusinessListingListSerializer(queryset, many=True)
        return Response({
            'count': queryset.count(),
            'location_searched': location_query or 'All Localities',
            'results': serializer.data
        })


class ListingDetailView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, slug):
        try:
            listing = BusinessListing.objects.select_related('category', 'owner').prefetch_related(
                'items', 'gallery', 'reviews'
            ).get(slug=slug)
        except BusinessListing.DoesNotExist:
            return Response(
                {'error': 'Listing not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        # Increment view count
        BusinessListing.objects.filter(id=listing.id).update(view_count=listing.view_count + 1)
        
        serializer = BusinessListingDetailSerializer(listing)
        return Response(serializer.data)


class EntrepreneurListingManageView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        listing = BusinessListing.objects.filter(owner=request.user).first()
        if not listing:
            return Response({'listing': None})
        serializer = BusinessListingDetailSerializer(listing)
        return Response({'listing': serializer.data})

    def post(self, request):
        # Create or update listing for entrepreneur
        user = request.user
        listing = BusinessListing.objects.filter(owner=user).first()

        data = request.data.copy()
        category_id = data.get('category_id') or data.get('category')

        if not category_id:
            category = Category.objects.first()
            category_id = category.id if category else None

        if listing:
            serializer = BusinessListingDetailSerializer(listing, data=data, partial=True)
        else:
            data['owner'] = user.id
            serializer = BusinessListingDetailSerializer(data=data)

        if serializer.is_valid():
            saved_listing = serializer.save(owner=user, category_id=category_id)
            
            # If status was draft or newly submitted, mark as PENDING_APPROVAL
            if saved_listing.status == BusinessListing.StatusChoices.DRAFT:
                saved_listing.status = BusinessListing.StatusChoices.PENDING_APPROVAL
                saved_listing.save()

            AuditLog.objects.create(
                actor=user,
                actor_email=user.email,
                action='LISTING_SUBMITTED',
                target_model='BusinessListing',
                target_id=str(saved_listing.id),
                target_label=saved_listing.business_name,
                details={'locality': saved_listing.area_locality, 'status': saved_listing.status}
            )

            return Response({
                'message': 'Listing submitted for moderation successfully!',
                'listing': BusinessListingDetailSerializer(saved_listing).data
            }, status=status.HTTP_200_OK if listing else status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProductItemManageView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        listing = BusinessListing.objects.filter(owner=request.user).first()
        if not listing:
            return Response({'error': 'Create your business listing first.'}, status=status.HTTP_400_BAD_REQUEST)
        
        data = request.data.copy()
        data['listing'] = listing.id
        serializer = ProductServiceItemSerializer(data=data)
        if serializer.is_valid():
            item = serializer.save()
            return Response(ProductServiceItemSerializer(item).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            item = ProductServiceItem.objects.get(pk=pk, listing__owner=request.user)
            item.delete()
            return Response({'message': 'Item deleted successfully.'})
        except ProductServiceItem.DoesNotExist:
            return Response({'error': 'Item not found.'}, status=status.HTTP_404_NOT_FOUND)


class SubmitReviewView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, listing_id):
        try:
            listing = BusinessListing.objects.get(id=listing_id)
        except BusinessListing.DoesNotExist:
            return Response({'error': 'Listing not found.'}, status=status.HTTP_404_NOT_FOUND)

        data = request.data.copy()
        rating = int(data.get('rating', 5))
        if rating < 1 or rating > 5:
            return Response({'error': 'Rating must be between 1 and 5 stars.'}, status=status.HTTP_400_BAD_REQUEST)

        # CSAT score calculation
        csat_score = 100 if rating == 5 else (80 if rating == 4 else (60 if rating == 3 else (40 if rating == 2 else 20)))

        customer = request.user if request.user.is_authenticated else None
        customer_name = data.get('customer_name') or (customer.full_name if customer and customer.full_name else 'Verified Customer')
        customer_avatar = data.get('customer_avatar', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80')

        review = Review.objects.create(
            listing=listing,
            customer=customer,
            customer_name=customer_name,
            customer_avatar=customer_avatar,
            customer_locality=data.get('customer_locality', listing.area_locality),
            rating=rating,
            csat_score=csat_score,
            sub_ratings=data.get('sub_ratings', {
                'quality': rating,
                'packaging': rating,
                'value': rating,
                'responsiveness': rating
            }),
            review_title=data.get('review_title', ''),
            review_text=data.get('review_text', ''),
            ordered_items=data.get('ordered_items', ''),
            is_verified_buyer=True
        )

        AuditLog.objects.create(
            actor=customer,
            actor_email=customer.email if customer else customer_name,
            action='REVIEW_SUBMITTED',
            target_model='Review',
            target_id=str(review.id),
            target_label=f"{rating}★ review on {listing.business_name}",
            details={'rating': rating, 'csat': csat_score}
        )

        return Response({
            'message': 'Thank you! Your CSAT review has been published.',
            'review': ReviewSerializer(review).data
        }, status=status.HTTP_201_CREATED)


class ReplyReviewView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, review_id):
        try:
            review = Review.objects.get(id=review_id, listing__owner=request.user)
        except Review.DoesNotExist:
            return Response({'error': 'Review not found or unauthorized.'}, status=status.HTTP_404_NOT_FOUND)

        reply_text = request.data.get('reply', '').strip()
        if not reply_text:
            return Response({'error': 'Reply text cannot be empty.'}, status=status.HTTP_400_BAD_REQUEST)

        review.entrepreneur_reply = reply_text
        review.reply_timestamp = timezone.now()
        review.save()

        return Response({
            'message': 'Reply posted successfully.',
            'review': ReviewSerializer(review).data
        })


class SubmitInquiryView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, listing_id):
        try:
            listing = BusinessListing.objects.get(id=listing_id)
        except BusinessListing.DoesNotExist:
            return Response({'error': 'Listing not found.'}, status=status.HTTP_404_NOT_FOUND)

        data = request.data.copy()
        data['listing'] = listing.id
        if request.user.is_authenticated:
            data['customer'] = request.user.id

        serializer = CustomerInquirySerializer(data=data)
        if serializer.is_valid():
            inquiry = serializer.save()
            
            # Increment lead count on listing
            BusinessListing.objects.filter(id=listing.id).update(lead_count=listing.lead_count + 1)

            # Generate direct WhatsApp quick link payload
            whatsapp_clean = ''.join(filter(str.isdigit, listing.whatsapp_number or listing.contact_phone))
            if not whatsapp_clean.startswith('91') and len(whatsapp_clean) == 10:
                whatsapp_clean = '91' + whatsapp_clean
            
            msg_text = f"Hi {listing.business_name}! I found your artisanal store on Communiti. Inquiry: {inquiry.message} (From: {inquiry.name}, Phone: {inquiry.phone})"
            wa_link = f"https://wa.me/{whatsapp_clean}?text={msg_text.replace(' ', '%20')}" if whatsapp_clean else None

            return Response({
                'message': 'Inquiry sent directly to the entrepreneur!',
                'inquiry': CustomerInquirySerializer(inquiry).data,
                'whatsapp_direct_url': wa_link
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class EntrepreneurLeadsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        leads = CustomerInquiry.objects.filter(
            listing__owner=request.user
        ).order_by('-created_at')
        serializer = CustomerInquirySerializer(leads, many=True)
        return Response(serializer.data)

    def patch(self, request, lead_id):
        try:
            lead = CustomerInquiry.objects.get(id=lead_id, listing__owner=request.user)
        except CustomerInquiry.DoesNotExist:
            return Response({'error': 'Lead not found.'}, status=status.HTTP_404_NOT_FOUND)

        status_val = request.data.get('status')
        notes = request.data.get('entrepreneur_notes')
        if status_val:
            lead.status = status_val
        if notes is not None:
            lead.entrepreneur_notes = notes
        lead.save()

        return Response({
            'message': 'Lead updated successfully.',
            'lead': CustomerInquirySerializer(lead).data
        })


class BookmarkToggleView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, listing_id):
        try:
            listing = BusinessListing.objects.get(id=listing_id)
        except BusinessListing.DoesNotExist:
            return Response({'error': 'Listing not found.'}, status=status.HTTP_404_NOT_FOUND)

        bookmark, created = Bookmark.objects.get_or_create(user=request.user, listing=listing)
        if not created:
            bookmark.delete()
            BusinessListing.objects.filter(id=listing.id).update(
                bookmark_count=max(0, listing.bookmark_count - 1)
            )
            return Response({'bookmarked': False, 'message': 'Listing removed from bookmarks.'})
        else:
            BusinessListing.objects.filter(id=listing.id).update(
                bookmark_count=listing.bookmark_count + 1
            )
            return Response({'bookmarked': True, 'message': 'Listing saved to bookmarks!'})

    def get(self, request):
        bookmarks = Bookmark.objects.filter(user=request.user).select_related('listing')
        serializer = BookmarkSerializer(bookmarks, many=True)
        return Response(serializer.data)


class AdminModerationQueueView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        # Check if user is staff or admin
        if request.user.role != 'ADMIN' and not request.user.is_staff:
            return Response({'error': 'Unauthorized. Admin access required.'}, status=status.HTTP_403_FORBIDDEN)

        status_filter = request.query_params.get('status', 'ALL')
        listings = BusinessListing.objects.select_related('category', 'owner').prefetch_related('items')
        
        if status_filter != 'ALL':
            listings = listings.filter(status=status_filter)
        
        listings = listings.order_by('-created_at')

        # Overall admin stats
        total_count = BusinessListing.objects.count()
        pending_count = BusinessListing.objects.filter(status=BusinessListing.StatusChoices.PENDING_APPROVAL).count()
        approved_count = BusinessListing.objects.filter(status=BusinessListing.StatusChoices.APPROVED).count()
        rejected_count = BusinessListing.objects.filter(status=BusinessListing.StatusChoices.REJECTED).count()

        all_reviews = Review.objects.filter(status=Review.ReviewStatus.PUBLISHED)
        avg_csat = all_reviews.aggregate(Avg('rating'))['rating__avg'] or 4.9

        serializer = BusinessListingDetailSerializer(listings, many=True)
        return Response({
            'stats': {
                'total_listings': total_count,
                'pending_approvals': pending_count,
                'approved_active': approved_count,
                'rejected_listings': rejected_count,
                'platform_avg_csat': round(avg_csat, 2),
                'active_subscriptions_estimate': approved_count,
                'monthly_mrr_inr': approved_count * 150
            },
            'listings': serializer.data
        })


class AdminModerateListingActionView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, listing_id):
        if request.user.role != 'ADMIN' and not request.user.is_staff:
            return Response({'error': 'Unauthorized. Admin access required.'}, status=status.HTTP_403_FORBIDDEN)

        try:
            listing = BusinessListing.objects.get(id=listing_id)
        except BusinessListing.DoesNotExist:
            return Response({'error': 'Listing not found.'}, status=status.HTTP_404_NOT_FOUND)

        action = request.data.get('action') # APPROVE, REJECT, REQUEST_CHANGES, TOGGLE_FEATURED, TOGGLE_VERIFIED
        notes = request.data.get('notes', '').strip()

        old_status = listing.status
        if action == 'APPROVE':
            listing.status = BusinessListing.StatusChoices.APPROVED
            listing.is_verified = True
            listing.moderation_notes = notes or 'Listing approved by Communiti Quality Team.'
        elif action == 'REJECT':
            listing.status = BusinessListing.StatusChoices.REJECTED
            listing.moderation_notes = notes or 'Listing rejected due to incomplete business verification.'
        elif action == 'REQUEST_CHANGES':
            listing.status = BusinessListing.StatusChoices.CHANGES_REQUESTED
            listing.moderation_notes = notes or 'Please provide high-resolution images and authentic menu items.'
        elif action == 'TOGGLE_FEATURED':
            listing.is_featured = not listing.is_featured
        elif action == 'TOGGLE_VERIFIED':
            listing.is_verified = not listing.is_verified
        else:
            return Response({'error': 'Invalid moderation action.'}, status=status.HTTP_400_BAD_REQUEST)

        listing.save()

        # Audit Log
        AuditLog.objects.create(
            actor=request.user,
            actor_email=request.user.email,
            action=f"ADMIN_{action}",
            target_model='BusinessListing',
            target_id=str(listing.id),
            target_label=listing.business_name,
            details={
                'old_status': old_status,
                'new_status': listing.status,
                'notes': listing.moderation_notes,
                'is_featured': listing.is_featured,
                'is_verified': listing.is_verified
            }
        )

        return Response({
            'message': f"Listing {listing.business_name} updated successfully ({action}).",
            'listing': BusinessListingDetailSerializer(listing).data
        })
