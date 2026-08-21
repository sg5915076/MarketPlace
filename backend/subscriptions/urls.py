from django.urls import path
from .views import (
    SubscriptionPlanListView, CreateUpiOrderView,
    VerifyUpiPaymentView, MySubscriptionView, AdminAuditLogView
)

urlpatterns = [
    path('plans/', SubscriptionPlanListView.as_view(), name='subscription-plans'),
    path('create-order/', CreateUpiOrderView.as_view(), name='subscription-create-order'),
    path('verify-upi/', VerifyUpiPaymentView.as_view(), name='subscription-verify-upi'),
    path('my-subscription/', MySubscriptionView.as_view(), name='subscription-my-subscription'),
    path('admin/audit-logs/', AdminAuditLogView.as_view(), name='admin-audit-logs'),
]
