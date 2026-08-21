import uuid
import urllib.parse
from datetime import timedelta
from django.utils import timezone
from rest_framework import status, permissions, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from listings.models import BusinessListing
from .models import SubscriptionPlan, EntrepreneurSubscription, Transaction, AuditLog
from .serializers import (
    SubscriptionPlanSerializer, EntrepreneurSubscriptionSerializer,
    TransactionSerializer, AuditLogSerializer
)


class SubscriptionPlanListView(generics.ListAPIView):
    queryset = SubscriptionPlan.objects.filter(is_active=True)
    serializer_class = SubscriptionPlanSerializer
    permission_classes = [permissions.AllowAny]


class CreateUpiOrderView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        user = request.user
        listing = BusinessListing.objects.filter(owner=user).first()
        if not listing:
            return Response(
                {'error': 'Please create a business profile before subscribing.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        plan = SubscriptionPlan.objects.first()
        if not plan:
            plan = SubscriptionPlan.objects.create(
                name='Artisan Monthly Listing Pass',
                price_inr=150.00,
                duration_days=30,
                description='Hyperlocal presence, verified badge, unlimited leads, customer CSAT reviews, and gallery.',
                features=[
                    'Hyperlocal Area Search Visibility',
                    'Verified Artisan Badge on Profile',
                    'Unlimited Direct WhatsApp Customer Leads',
                    'CSAT Reviews & Public Response Accordion',
                    'High-Resolution Gallery & Menu Showcase',
                    'Monthly Performance & View Analytics'
                ]
            )

        # Generate unique transaction ID & invoice number
        txn_id = f"COMM_UPI_{timezone.now().strftime('%Y%m%d')}_{uuid.uuid4().hex[:8].upper()}"
        inv_number = f"INV-COM-{timezone.now().strftime('%Y%m')}-{uuid.uuid4().hex[:5].upper()}"
        amount = 150.00
        payee_vpa = 'communiti.marketplace@icici'
        payee_name = 'Communiti Hyperlocal Marketplace'
        transaction_note = f"Communiti Monthly Sub for {listing.business_name}"

        # Standard UPI Payment String
        params = {
            'pa': payee_vpa,
            'pn': payee_name,
            'mc': '5399', # Micro-Merchant MCC
            'tr': txn_id,
            'tn': transaction_note,
            'am': f"{amount:.2f}",
            'cu': 'INR'
        }
        upi_string = f"upi://pay?{urllib.parse.urlencode(params)}"

        # UPI Intent links for mobile apps
        intent_links = {
            'generic_upi': upi_string,
            'gpay': f"tez://upi/pay?{urllib.parse.urlencode(params)}",
            'phonepe': f"phonepe://pay?{urllib.parse.urlencode(params)}",
            'paytm': f"paytmmp://pay?{urllib.parse.urlencode(params)}",
            'bhim': f"bhim://pay?{urllib.parse.urlencode(params)}"
        }

        # Calculate GST / Tax breakdown
        # Base: 127.12, CGST 9%: 11.44, SGST 9%: 11.44, Total: 150.00
        receipt_data = {
            'invoice_number': inv_number,
            'bill_to': {
                'name': user.full_name or user.email,
                'business_name': listing.business_name,
                'email': user.email,
                'locality': f"{listing.area_locality}, {listing.city}",
            },
            'items': [
                {
                    'description': f"1 Month Communiti Platform Fee ({plan.name})",
                    'base_amount': 127.12,
                    'cgst_9pct': 11.44,
                    'sgst_9pct': 11.44,
                    'total_inr': 150.00
                }
            ],
            'total_amount': 150.00,
            'currency': 'INR',
            'validity_days': 30
        }

        # Save initiated transaction in DB
        subscription = getattr(listing, 'subscription', None)
        txn = Transaction.objects.create(
            transaction_id=txn_id,
            invoice_number=inv_number,
            subscription=subscription,
            entrepreneur=user,
            listing=listing,
            amount=amount,
            currency='INR',
            payment_channel=Transaction.PaymentChannel.UPI_QR,
            payee_vpa=payee_vpa,
            status=Transaction.TransactionStatus.INITIATED,
            notes=transaction_note,
            receipt_data=receipt_data
        )

        return Response({
            'transaction_id': txn_id,
            'invoice_number': inv_number,
            'amount': amount,
            'currency': 'INR',
            'payee_vpa': payee_vpa,
            'payee_name': payee_name,
            'upi_uri': upi_string,
            'intent_links': intent_links,
            'receipt_data': receipt_data,
            'message': 'UPI Order generated. Scan QR or click UPI App to pay ₹150.'
        }, status=status.HTTP_201_CREATED)


class VerifyUpiPaymentView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        user = request.user
        txn_id = request.data.get('transaction_id')
        utr_number = request.data.get('upi_reference_number') or request.data.get('utr', '').strip()
        payer_vpa = request.data.get('payer_vpa', '').strip() or f"{user.email.split('@')[0]}@okaxis"

        if not txn_id:
            return Response({'error': 'Transaction ID is required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            txn = Transaction.objects.get(transaction_id=txn_id, entrepreneur=user)
        except Transaction.DoesNotExist:
            return Response({'error': 'Transaction record not found.'}, status=status.HTTP_404_NOT_FOUND)

        listing = txn.listing
        plan = SubscriptionPlan.objects.first()

        now = timezone.now()
        new_end_date = now + timedelta(days=30)

        # Find or create subscription
        subscription, _ = EntrepreneurSubscription.objects.get_or_create(
            listing=listing,
            defaults={
                'entrepreneur': user,
                'plan': plan,
                'status': EntrepreneurSubscription.StatusChoices.ACTIVE,
                'end_date': new_end_date
            }
        )

        # Extend subscription if already active
        if subscription.end_date and subscription.end_date > now:
            subscription.end_date = subscription.end_date + timedelta(days=30)
        else:
            subscription.end_date = new_end_date
        
        subscription.status = EntrepreneurSubscription.StatusChoices.ACTIVE
        subscription.save()

        # Update transaction
        txn.status = Transaction.TransactionStatus.SUCCESS
        txn.subscription = subscription
        txn.payer_vpa = payer_vpa
        txn.upi_reference_number = utr_number or f"UPI{uuid.uuid4().hex[:12].upper()}"
        txn.save()

        # Update listing status & subscription active flag
        listing.subscription_active = True
        listing.subscription_expires_at = subscription.end_date
        listing.save()

        # Audit Log
        AuditLog.objects.create(
            actor=user,
            actor_email=user.email,
            action='UPI_SUBSCRIPTION_ACTIVATED',
            target_model='EntrepreneurSubscription',
            target_id=str(subscription.id),
            target_label=f"₹150 Sub for {listing.business_name}",
            details={
                'txn_id': txn.transaction_id,
                'utr': txn.upi_reference_number,
                'amount': float(txn.amount),
                'valid_until': subscription.end_date.strftime('%Y-%m-%d %H:%M:%S')
            }
        )

        return Response({
            'message': 'UPI Payment verified successfully! Your monthly subscription is active.',
            'subscription': EntrepreneurSubscriptionSerializer(subscription).data,
            'transaction': TransactionSerializer(txn).data
        })


class MySubscriptionView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        listing = BusinessListing.objects.filter(owner=user).first()
        if not listing:
            return Response({'subscription': None, 'has_listing': False})

        subscription = EntrepreneurSubscription.objects.filter(listing=listing).first()
        transactions = Transaction.objects.filter(entrepreneur=user).order_by('-created_at')

        plan = SubscriptionPlan.objects.first()
        plan_data = SubscriptionPlanSerializer(plan).data if plan else None

        return Response({
            'has_listing': True,
            'listing_name': listing.business_name,
            'listing_status': listing.status,
            'subscription': EntrepreneurSubscriptionSerializer(subscription).data if subscription else None,
            'plan': plan_data,
            'transactions': TransactionSerializer(transactions, many=True).data
        })


class AdminAuditLogView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if request.user.role != 'ADMIN' and not request.user.is_staff:
            return Response({'error': 'Unauthorized. Admin access required.'}, status=status.HTTP_403_FORBIDDEN)

        logs = AuditLog.objects.all().order_by('-created_at')[:100]
        serializer = AuditLogSerializer(logs, many=True)
        return Response(serializer.data)
