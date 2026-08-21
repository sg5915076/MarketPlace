from django.db import models
from django.conf import settings
from django.utils.text import slugify


class Category(models.Model):
    name = models.CharField(max_length=120, unique=True)
    slug = models.SlugField(max_length=140, unique=True, blank=True)
    icon = models.CharField(max_length=50, default='Sparkles', help_text='Lucide icon name')
    badge_color = models.CharField(max_length=50, default='amber')
    description = models.TextField(blank=True, default='')
    hero_image = models.URLField(max_length=500, blank=True, default='')
    display_order = models.PositiveIntegerField(default=0)

    class Meta:
        verbose_name_plural = 'Categories'
        ordering = ['display_order', 'name']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class BusinessListing(models.Model):
    class StatusChoices(models.TextChoices):
        DRAFT = 'DRAFT', 'Draft'
        PENDING_APPROVAL = 'PENDING_APPROVAL', 'Pending Admin Approval'
        APPROVED = 'APPROVED', 'Approved & Published'
        REJECTED = 'REJECTED', 'Rejected'
        CHANGES_REQUESTED = 'CHANGES_REQUESTED', 'Changes Requested'

    class PriceTier(models.TextChoices):
        AFFORDABLE = '₹', 'Affordable (₹)'
        MODERATE = '₹₹', 'Moderate (₹₹)'
        PREMIUM = '₹₹₹', 'Artisanal / Premium (₹₹₹)'

    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='listings'
    )
    category = models.ForeignKey(
        Category,
        on_delete=models.PROTECT,
        related_name='listings'
    )
    business_name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, unique=True, blank=True)
    tagline = models.CharField(max_length=255, blank=True, default='')
    story_bio = models.TextField(
        blank=True,
        default='',
        help_text='The artisan story, craft journey, and philosophy'
    )
    
    # Location & Hyperlocal info
    city = models.CharField(max_length=100, default='Bengaluru')
    area_locality = models.CharField(
        max_length=150,
        help_text='Locality / Area Name (e.g. Indiranagar, Bandra West, Koramangala)'
    )
    address_line = models.CharField(max_length=255, blank=True, default='')
    pincode = models.CharField(max_length=20, blank=True, default='')
    latitude = models.DecimalField(max_digits=10, decimal_places=7, null=True, blank=True, default=12.9783)
    longitude = models.DecimalField(max_digits=10, decimal_places=7, null=True, blank=True, default=77.6408)
    
    # Contact & Channels
    contact_phone = models.CharField(max_length=25, blank=True, default='')
    whatsapp_number = models.CharField(max_length=25, blank=True, default='')
    instagram_handle = models.CharField(max_length=100, blank=True, default='')
    website_url = models.URLField(max_length=300, blank=True, default='')
    
    # Visuals
    logo_image = models.URLField(max_length=500, blank=True, default='')
    banner_image = models.URLField(max_length=500, blank=True, default='')
    
    # Operational Details
    price_tier = models.CharField(
        max_length=10,
        choices=PriceTier.choices,
        default=PriceTier.MODERATE
    )
    subcategories = models.JSONField(
        default=list,
        blank=True,
        help_text='Tags like Sourdough, Gluten-Free, Bean-to-Bar, Terracotta'
    )
    fssai_or_reg_number = models.CharField(max_length=100, blank=True, default='')
    years_in_business = models.PositiveIntegerField(default=1)
    delivery_radius_km = models.DecimalField(max_digits=5, decimal_places=1, default=15.0)
    offers_delivery = models.BooleanField(default=True)
    offers_pickup = models.BooleanField(default=True)
    operating_hours = models.CharField(max_length=120, default='10:00 AM - 8:00 PM (Tue-Sun)')
    
    # Moderation & Platform Flags
    status = models.CharField(
        max_length=25,
        choices=StatusChoices.choices,
        default=StatusChoices.PENDING_APPROVAL
    )
    moderation_notes = models.TextField(blank=True, default='')
    is_featured = models.BooleanField(default=False)
    is_verified = models.BooleanField(default=False)
    
    # Subscription status (₹150/mo)
    subscription_active = models.BooleanField(default=True)
    subscription_expires_at = models.DateTimeField(null=True, blank=True)
    
    # Analytics Counters
    view_count = models.PositiveIntegerField(default=0)
    lead_count = models.PositiveIntegerField(default=0)
    bookmark_count = models.PositiveIntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-is_featured', '-created_at']

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.business_name)
            slug = base_slug
            counter = 1
            while BusinessListing.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.business_name} ({self.area_locality}, {self.city})"


class ProductServiceItem(models.Model):
    listing = models.ForeignKey(
        BusinessListing,
        on_delete=models.CASCADE,
        related_name='items'
    )
    title = models.CharField(max_length=180)
    description = models.TextField(blank=True, default='')
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image_url = models.URLField(max_length=500, blank=True, default='')
    is_bestseller = models.BooleanField(default=False)
    lead_time_days = models.PositiveIntegerField(default=1, help_text='Days required to prepare')
    dietary_or_custom_tags = models.JSONField(default=list, blank=True)
    is_available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} - ₹{self.price} ({self.listing.business_name})"


class ListingGalleryImage(models.Model):
    listing = models.ForeignKey(
        BusinessListing,
        on_delete=models.CASCADE,
        related_name='gallery'
    )
    image_url = models.URLField(max_length=500)
    caption = models.CharField(max_length=200, blank=True, default='')
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order', 'id']


class Review(models.Model):
    class ReviewStatus(models.TextChoices):
        PUBLISHED = 'PUBLISHED', 'Published'
        FLAGGED = 'FLAGGED', 'Flagged'
        REMOVED = 'REMOVED', 'Removed'

    listing = models.ForeignKey(
        BusinessListing,
        on_delete=models.CASCADE,
        related_name='reviews'
    )
    customer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='reviews'
    )
    customer_name = models.CharField(max_length=150)
    customer_avatar = models.URLField(max_length=500, blank=True, default='')
    customer_locality = models.CharField(max_length=100, blank=True, default='')
    
    # CSAT metrics
    rating = models.PositiveSmallIntegerField(
        help_text='Rating out of 5 (1=Poor to 5=Exceptional)'
    )
    csat_score = models.PositiveSmallIntegerField(
        default=100,
        help_text='Calculated CSAT % rating (e.g. 100 for 5-star, 80 for 4-star, etc.)'
    )
    sub_ratings = models.JSONField(
        default=dict,
        blank=True,
        help_text='Sub-ratings breakdown: {"quality": 5, "packaging": 5, "value": 4, "responsiveness": 5}'
    )
    review_title = models.CharField(max_length=200, blank=True, default='')
    review_text = models.TextField()
    is_verified_buyer = models.BooleanField(default=True)
    ordered_items = models.CharField(max_length=255, blank=True, default='')
    
    # Entrepreneur response
    entrepreneur_reply = models.TextField(blank=True, default='')
    reply_timestamp = models.DateTimeField(null=True, blank=True)
    
    status = models.CharField(
        max_length=20,
        choices=ReviewStatus.choices,
        default=ReviewStatus.PUBLISHED
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.rating}★ by {self.customer_name} on {self.listing.business_name}"


class CustomerInquiry(models.Model):
    class LeadStatus(models.TextChoices):
        NEW = 'NEW', 'New Inquiry'
        CONTACTED = 'CONTACTED', 'Contacted'
        QUALIFIED = 'QUALIFIED', 'Qualified'
        CONVERTED = 'CONVERTED', 'Converted Order'
        CLOSED = 'CLOSED', 'Closed / Dismissed'

    listing = models.ForeignKey(
        BusinessListing,
        on_delete=models.CASCADE,
        related_name='inquiries'
    )
    customer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='inquiries'
    )
    name = models.CharField(max_length=150)
    email = models.EmailField(blank=True, default='')
    phone = models.CharField(max_length=25)
    occasion = models.CharField(max_length=150, blank=True, default='')
    event_date = models.CharField(max_length=50, blank=True, default='')
    budget_range = models.CharField(max_length=100, blank=True, default='')
    message = models.TextField()
    status = models.CharField(
        max_length=20,
        choices=LeadStatus.choices,
        default=LeadStatus.NEW
    )
    entrepreneur_notes = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = 'Customer Inquiries'
        ordering = ['-created_at']

    def __str__(self):
        return f"Lead from {self.name} for {self.listing.business_name} ({self.status})"


class Bookmark(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='bookmarks'
    )
    listing = models.ForeignKey(
        BusinessListing,
        on_delete=models.CASCADE,
        related_name='bookmarked_by'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'listing')

    def __str__(self):
        return f"{self.user.email} saved {self.listing.business_name}"
