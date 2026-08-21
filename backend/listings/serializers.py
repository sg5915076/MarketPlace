from rest_framework import serializers
from django.db.models import Avg, Count
from .models import (
    Category, BusinessListing, ProductServiceItem,
    ListingGalleryImage, Review, CustomerInquiry, Bookmark
)
from accounts.serializers import UserSerializer


class CategorySerializer(serializers.ModelSerializer):
    listing_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = [
            'id', 'name', 'slug', 'icon', 'badge_color',
            'description', 'hero_image', 'display_order', 'listing_count'
        ]

    def get_listing_count(self, obj):
        return obj.listings.filter(status=BusinessListing.StatusChoices.APPROVED).count()


class ProductServiceItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductServiceItem
        fields = [
            'id', 'listing', 'title', 'description', 'price',
            'image_url', 'is_bestseller', 'lead_time_days',
            'dietary_or_custom_tags', 'is_available'
        ]
        read_only_fields = ['id']


class ListingGalleryImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ListingGalleryImage
        fields = ['id', 'listing', 'image_url', 'caption', 'order']
        read_only_fields = ['id']


class ReviewSerializer(serializers.ModelSerializer):
    created_at_formatted = serializers.SerializerMethodField()

    class Meta:
        model = Review
        fields = [
            'id', 'listing', 'customer', 'customer_name', 'customer_avatar',
            'customer_locality', 'rating', 'csat_score', 'sub_ratings',
            'review_title', 'review_text', 'is_verified_buyer',
            'ordered_items', 'entrepreneur_reply', 'reply_timestamp',
            'status', 'created_at', 'created_at_formatted'
        ]
        read_only_fields = ['id', 'created_at', 'csat_score', 'reply_timestamp']

    def get_created_at_formatted(self, obj):
        return obj.created_at.strftime('%d %b %Y')


class BusinessListingListSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_slug = serializers.CharField(source='category.slug', read_only=True)
    category_icon = serializers.CharField(source='category.icon', read_only=True)
    avg_rating = serializers.SerializerMethodField()
    csat_percentage = serializers.SerializerMethodField()
    review_count = serializers.SerializerMethodField()
    sample_items = serializers.SerializerMethodField()

    class Meta:
        model = BusinessListing
        fields = [
            'id', 'business_name', 'slug', 'tagline', 'category',
            'category_name', 'category_slug', 'category_icon',
            'city', 'area_locality', 'pincode', 'latitude', 'longitude',
            'banner_image', 'logo_image', 'price_tier', 'subcategories',
            'offers_delivery', 'offers_pickup', 'status', 'is_featured',
            'is_verified', 'subscription_active', 'avg_rating',
            'csat_percentage', 'review_count', 'sample_items',
            'created_at'
        ]

    def get_avg_rating(self, obj):
        reviews = obj.reviews.filter(status=Review.ReviewStatus.PUBLISHED)
        avg = reviews.aggregate(Avg('rating'))['rating__avg']
        return round(avg, 1) if avg else 4.8

    def get_csat_percentage(self, obj):
        reviews = obj.reviews.filter(status=Review.ReviewStatus.PUBLISHED)
        total = reviews.count()
        if total == 0:
            return 98
        positive = reviews.filter(rating__gte=4).count()
        return round((positive / total) * 100)

    def get_review_count(self, obj):
        return obj.reviews.filter(status=Review.ReviewStatus.PUBLISHED).count()

    def get_sample_items(self, obj):
        items = obj.items.filter(is_available=True)[:3]
        return ProductServiceItemSerializer(items, many=True).data


class BusinessListingDetailSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source='category',
        write_only=True
    )
    items = ProductServiceItemSerializer(many=True, read_only=True)
    gallery = ListingGalleryImageSerializer(many=True, read_only=True)
    reviews = serializers.SerializerMethodField()
    csat_summary = serializers.SerializerMethodField()
    owner_details = UserSerializer(source='owner', read_only=True)

    class Meta:
        model = BusinessListing
        fields = [
            'id', 'business_name', 'slug', 'tagline', 'story_bio',
            'category', 'category_id', 'owner', 'owner_details',
            'city', 'area_locality', 'address_line', 'pincode',
            'latitude', 'longitude', 'contact_phone', 'whatsapp_number',
            'instagram_handle', 'website_url', 'logo_image', 'banner_image',
            'price_tier', 'subcategories', 'fssai_or_reg_number',
            'years_in_business', 'delivery_radius_km', 'offers_delivery',
            'offers_pickup', 'operating_hours', 'status', 'moderation_notes',
            'is_featured', 'is_verified', 'subscription_active',
            'subscription_expires_at', 'view_count', 'lead_count',
            'bookmark_count', 'items', 'gallery', 'reviews', 'csat_summary',
            'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'slug', 'owner', 'status', 'moderation_notes',
            'is_featured', 'is_verified', 'subscription_active',
            'view_count', 'lead_count', 'bookmark_count',
            'created_at', 'updated_at'
        ]

    def get_reviews(self, obj):
        published = obj.reviews.filter(status=Review.ReviewStatus.PUBLISHED)
        return ReviewSerializer(published, many=True).data

    def get_csat_summary(self, obj):
        reviews = obj.reviews.filter(status=Review.ReviewStatus.PUBLISHED)
        total = reviews.count()
        if total == 0:
            return {
                'avg_rating': 4.9,
                'total_reviews': 0,
                'csat_percentage': 98,
                'distribution': {'5': 90, '4': 8, '3': 2, '2': 0, '1': 0},
                'quality_avg': 4.9,
                'packaging_avg': 4.8,
                'value_avg': 4.7,
                'responsiveness_avg': 5.0
            }
        
        avg_rating = reviews.aggregate(Avg('rating'))['rating__avg'] or 5.0
        positive = reviews.filter(rating__gte=4).count()
        csat_pct = round((positive / total) * 100) if total > 0 else 100
        
        dist = {
            '5': reviews.filter(rating=5).count(),
            '4': reviews.filter(rating=4).count(),
            '3': reviews.filter(rating=3).count(),
            '2': reviews.filter(rating=2).count(),
            '1': reviews.filter(rating=1).count(),
        }

        # Calculate sub-criteria averages from JSON
        quality_scores, pack_scores, value_scores, resp_scores = [], [], [], []
        for r in reviews:
            if isinstance(r.sub_ratings, dict):
                if 'quality' in r.sub_ratings: quality_scores.append(float(r.sub_ratings['quality']))
                if 'packaging' in r.sub_ratings: pack_scores.append(float(r.sub_ratings['packaging']))
                if 'value' in r.sub_ratings: value_scores.append(float(r.sub_ratings['value']))
                if 'responsiveness' in r.sub_ratings: resp_scores.append(float(r.sub_ratings['responsiveness']))

        return {
            'avg_rating': round(avg_rating, 1),
            'total_reviews': total,
            'csat_percentage': csat_pct,
            'distribution': dist,
            'quality_avg': round(sum(quality_scores)/len(quality_scores), 1) if quality_scores else 4.9,
            'packaging_avg': round(sum(pack_scores)/len(pack_scores), 1) if pack_scores else 4.8,
            'value_avg': round(sum(value_scores)/len(value_scores), 1) if value_scores else 4.7,
            'responsiveness_avg': round(sum(resp_scores)/len(resp_scores), 1) if resp_scores else 4.9,
        }


class CustomerInquirySerializer(serializers.ModelSerializer):
    listing_name = serializers.CharField(source='listing.business_name', read_only=True)
    created_at_formatted = serializers.SerializerMethodField()

    class Meta:
        model = CustomerInquiry
        fields = [
            'id', 'listing', 'listing_name', 'customer', 'name',
            'email', 'phone', 'occasion', 'event_date', 'budget_range',
            'message', 'status', 'entrepreneur_notes', 'created_at',
            'created_at_formatted'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_created_at_formatted(self, obj):
        return obj.created_at.strftime('%d %b %Y, %I:%M %p')


class BookmarkSerializer(serializers.ModelSerializer):
    listing_details = BusinessListingListSerializer(source='listing', read_only=True)

    class Meta:
        model = Bookmark
        fields = ['id', 'user', 'listing', 'listing_details', 'created_at']
        read_only_fields = ['id', 'user', 'created_at']
