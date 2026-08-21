from rest_framework import serializers
from .models import SubscriptionPlan, EntrepreneurSubscription, Transaction, AuditLog


class SubscriptionPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubscriptionPlan
        fields = '__all__'


class TransactionSerializer(serializers.ModelSerializer):
    listing_name = serializers.CharField(source='listing.business_name', read_only=True)
    entrepreneur_email = serializers.CharField(source='entrepreneur.email', read_only=True)
    created_at_formatted = serializers.SerializerMethodField()

    class Meta:
        model = Transaction
        fields = [
            'id', 'transaction_id', 'invoice_number', 'subscription',
            'entrepreneur', 'entrepreneur_email', 'listing', 'listing_name',
            'amount', 'currency', 'payment_channel', 'payee_vpa', 'payer_vpa',
            'upi_reference_number', 'gateway_order_id', 'gateway_payment_id',
            'status', 'notes', 'receipt_data', 'created_at', 'created_at_formatted'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_created_at_formatted(self, obj):
        return obj.created_at.strftime('%d %b %Y, %I:%M %p')


class EntrepreneurSubscriptionSerializer(serializers.ModelSerializer):
    plan_details = SubscriptionPlanSerializer(source='plan', read_only=True)
    listing_name = serializers.CharField(source='listing.business_name', read_only=True)
    days_left = serializers.SerializerMethodField()
    start_date_formatted = serializers.SerializerMethodField()
    end_date_formatted = serializers.SerializerMethodField()
    recent_transactions = serializers.SerializerMethodField()

    class Meta:
        model = EntrepreneurSubscription
        fields = [
            'id', 'entrepreneur', 'listing', 'listing_name', 'plan',
            'plan_details', 'status', 'start_date', 'start_date_formatted',
            'end_date', 'end_date_formatted', 'days_left', 'auto_renew',
            'recent_transactions', 'created_at'
        ]
        read_only_fields = ['id', 'start_date', 'created_at', 'updated_at']

    def get_days_left(self, obj):
        from django.utils import timezone
        if obj.end_date > timezone.now():
            return (obj.end_date - timezone.now()).days
        return 0

    def get_start_date_formatted(self, obj):
        return obj.start_date.strftime('%d %b %Y')

    def get_end_date_formatted(self, obj):
        return obj.end_date.strftime('%d %b %Y')

    def get_recent_transactions(self, obj):
        txns = obj.transactions.order_by('-created_at')[:5]
        return TransactionSerializer(txns, many=True).data


class AuditLogSerializer(serializers.ModelSerializer):
    created_at_formatted = serializers.SerializerMethodField()

    class Meta:
        model = AuditLog
        fields = [
            'id', 'actor', 'actor_email', 'action', 'target_model',
            'target_id', 'target_label', 'details', 'ip_address',
            'created_at', 'created_at_formatted'
        ]
        read_only_fields = ['id', 'created_at']

    def get_created_at_formatted(self, obj):
        return obj.created_at.strftime('%d %b %Y, %I:%M:%S %p')
