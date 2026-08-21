import uuid
from django.db import models
from django.conf import settings
from listings.models import BusinessListing


class SubscriptionPlan(models.Model):
    name = models.CharField(max_length=120, default='Artisan Monthly Listing')
    price_inr = models.DecimalField(max_digits=8, decimal_places=2, default=150.00)
    duration_days = models.PositiveIntegerField(default=30)
    description = models.TextField(default='Hyperlocal presence, verified badge, unlimited leads, customer CSAT reviews, and gallery.')
    features = models.JSONField(
        default=list,
        blank=True
    )
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - ₹{self.price_inr}/month"


class EntrepreneurSubscription(models.Model):
    class StatusChoices(models.TextChoices):
        ACTIVE = 'ACTIVE', 'Active'
        PENDING_PAYMENT = 'PENDING_PAYMENT', 'Pending UPI Payment'
        EXPIRED = 'EXPIRED', 'Expired'
        CANCELLED = 'CANCELLED', 'Cancelled'

    entrepreneur = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='subscriptions'
    )
    listing = models.OneToOneField(
        BusinessListing,
        on_delete=models.CASCADE,
        related_name='subscription'
    )
    plan = models.ForeignKey(
        SubscriptionPlan,
        on_delete=models.PROTECT,
        related_name='active_subscriptions'
    )
    status = models.CharField(
        max_length=25,
        choices=StatusChoices.choices,
        default=StatusChoices.ACTIVE
    )
    start_date = models.DateTimeField(auto_now_add=True)
    end_date = models.DateTimeField()
    auto_renew = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Sub for {self.listing.business_name} ({self.status}) - Ends {self.end_date.strftime('%d %b %Y')}"


class Transaction(models.Model):
    class PaymentChannel(models.TextChoices):
        UPI_QR = 'UPI_QR', 'UPI Dynamic QR'
        UPI_INTENT = 'UPI_INTENT', 'UPI App Intent (GPay/PhonePe/Paytm)'
        RAZORPAY_UPI = 'RAZORPAY_UPI', 'Razorpay UPI Gateway'
        CARD = 'CARD', 'Credit / Debit Card'
        NETBANKING = 'NETBANKING', 'Net Banking'

    class TransactionStatus(models.TextChoices):
        INITIATED = 'INITIATED', 'Initiated'
        PROCESSING = 'PROCESSING', 'Processing'
        SUCCESS = 'SUCCESS', 'Success'
        FAILED = 'FAILED', 'Failed'
        REFUNDED = 'REFUNDED', 'Refunded'

    transaction_id = models.CharField(max_length=64, unique=True, default=uuid.uuid4)
    invoice_number = models.CharField(max_length=64, unique=True, blank=True)
    subscription = models.ForeignKey(
        EntrepreneurSubscription,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='transactions'
    )
    entrepreneur = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='transactions'
    )
    listing = models.ForeignKey(
        BusinessListing,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='transactions'
    )
    amount = models.DecimalField(max_digits=8, decimal_places=2, default=150.00)
    currency = models.CharField(max_length=10, default='INR')
    payment_channel = models.CharField(
        max_length=25,
        choices=PaymentChannel.choices,
        default=PaymentChannel.UPI_QR
    )
    
    # UPI Specific attributes
    payee_vpa = models.CharField(max_length=100, default='communiti.marketplace@icici')
    payer_vpa = models.CharField(max_length=100, blank=True, default='')
    upi_reference_number = models.CharField(
        max_length=50,
        blank=True,
        default='',
        help_text='12-digit UPI Transaction Reference / UTR Number'
    )
    gateway_order_id = models.CharField(max_length=100, blank=True, default='')
    gateway_payment_id = models.CharField(max_length=100, blank=True, default='')
    
    status = models.CharField(
        max_length=20,
        choices=TransactionStatus.choices,
        default=TransactionStatus.INITIATED
    )
    notes = models.TextField(blank=True, default='')
    receipt_data = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.transaction_id} - ₹{self.amount} ({self.status})"


class AuditLog(models.Model):
    actor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='audit_logs'
    )
    actor_email = models.CharField(max_length=255, blank=True, default='System')
    action = models.CharField(max_length=100)
    target_model = models.CharField(max_length=80)
    target_id = models.CharField(max_length=80, blank=True, default='')
    target_label = models.CharField(max_length=255, blank=True, default='')
    details = models.JSONField(default=dict, blank=True)
    ip_address = models.CharField(max_length=50, blank=True, default='127.0.0.1')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"[{self.created_at.strftime('%Y-%m-%d %H:%M')}] {self.actor_email} -> {self.action} on {self.target_label}"
