<<<<<<< HEAD
# 🌿 Communiti — Hyperlocal Micro-Segment Business & Artisan Discovery Platform

**Communiti** is a production-ready, full-stack hyperlocal marketplace and discovery platform designed specifically for home-based makers and micro-segment creators across India (Home Bakers, Bean-to-Bar Chocolatiers, Bespoke Gifting Curators, Studio Potters & Crafters, Artisanal Gourmet Preserves, Handmade Jewellery Designers, and Homemade Botanical Winemakers).

---

## 🚀 Key Functional Integrations

### 1. 🔐 Email Authentication & Role-Based Access Control
- **Roles Supported**: `CUSTOMER`, `ENTREPRENEUR` (Micro-Business Owner), `ADMIN` (Platform Moderator).
- **JWT Authentication** via Django REST Framework SimpleJWT with token lifecycle management.
- Quick **1-Click Demo Persona Switcher** on the top navigation bar for instant switching between Customer, Entrepreneur, and Admin profiles.

### 2. 🛡️ Admin Page for Listing Approvals & Quality Control
- **Live Moderation Queue**: Dedicated portal for administrators to review newly submitted micro-businesses.
- **Verification Inspector**: Review applicant bios, FSSAI / MSME / Hallmark registration certificates, location coverage, and menu offerings.
- **One-Click Actions**:
  - `Approve & Publish` (Instantly publishes storefront to live search with verified badge)
  - `Reject Listing` (With custom feedback note)
  - `Request Corrections` (Notify entrepreneur of required photo/menu revisions)
  - `Toggle Spotlight` (Feature high-CSAT artisans on the homepage)
- **Immutable Audit Trail**: System-wide event ledger recording all moderation decisions, payment verifications, and status changes.

### 3. ⭐ Customer CSAT Reviews & Interactive Rating Cards
- **CSAT Calculation Engine**: Real-time positive CSAT percentage (`98% Positive CSAT`), 5-star rating aggregates, and rating distribution breakdown (5★, 4★, 3★, 2★, 1★).
- **Sub-Criteria CSAT Benchmarks**:
  - 🌟 Product Quality & Taste
  - 📦 Packaging & Presentation Aesthetics
  - 💎 Value for Craft
  - ⚡ Maker Responsiveness
- **Interactive Review Cards**: Displays verified buyer badges, ordered item tags, review headlines, and public **Maker Response Threads**.
- **Interactive Review Submission Modal**: Allows customers to score star ratings, sub-criteria sliders, and submit feedback.

### 4. 📍 Hyperlocal Search by Location Name & Neighborhood Area
- **Multi-Level Location Search**: Search by Locality / Neighborhood / Landmark / City (e.g., *Indiranagar, Bengaluru*, *Bandra West, Mumbai*, *Koramangala*, *Colaba*, *Connaught Place, Delhi*, *Anna Nagar, Chennai*, *Panaji Fontainhas, Goa*).
- **Curated 7 Micro-Categories**:
  1. 🍰 **Home Bakers** (Sourdough, brioche, custom fondant wedding cakes)
  2. 🍫 **Chocolate Creations** (Bean-to-bar single-estate bars, hand-painted bonbons)
  3. 🎁 **Bespoke Gifting** (Curated festival hampers, luxury bridesmaid gift boxes)
  4. 🧶 **Handcrafted & Crafts** (Studio ceramics, terracotta planters, botanical resin)
  5. 🎨 **Artisanal Gourmet** (Small-batch fruit preserves, chilli crisp, pesto)
  6. 💍 **Jewellery Designers** (925 sterling silver filigree, baroque pearl jewelry)
  7. 🍷 **Homemade Wines & Botanical Brews** (Spiced ginger wine, mulberry botanical brews)
- **Filters**: Distance radius, Price Tier (`₹`, `₹₹`, `₹₹₹`), Minimum CSAT rating (4.0+), Home Delivery vs. Self Pickup, and Dietary/Handmade tags.

### 5. 💳 Entrepreneur ₹150/Month Subscription & UPI Payment Gateway
- **Fair Platform Fee**: Flat ₹150 / month platform fee for entrepreneurs with zero order commission.
- **Dynamic UPI QR Code Generator**: Generates standard UPI QR strings (`upi://pay?pa=communiti.marketplace@icici&pn=...&am=150.00&tr=...`) with dynamic QR canvas rendering.
- **UPI App Intent Triggers**: Direct checkout triggers for **Google Pay**, **PhonePe**, **Paytm**, and **BHIM UPI**.
- **UTR Reference Verification**: Real-time 12-digit UPI UTR verification engine with simulated auto-activation.
- **GST Tax Invoices & Transaction History**: Instant receipt generator showing base fee ₹127.12 + 18% CGST/SGST ₹22.88 = ₹150.00.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide React, Axios, QRCode.react, Canvas-Confetti
- **Backend**: Python 3.13, Django 6.1, Django REST Framework, SimpleJWT, Django-CORS-Headers
- **Database**: PostgreSQL configured (`communiti_db`) with automatic SQLite fallback for zero-friction local development.

---

## 🔑 Demo Credentials

| Role | Email | Password | Access & Capabilities |
| :--- | :--- | :--- | :--- |
| **Platform Administrator** | `admin@communiti.in` | `Admin@123` | Approvals queue, moderation, audit logs, MRR stats |
| **Micro-Entrepreneur** | `ananya.bakes@example.com` | `Entrepreneur@123` | Indiranagar Home Baker storefront, ₹150 UPI pass, leads |
| **Customer** | `riya.sharma@example.com` | `Customer@123` | Local discovery, CSAT review submission, bookmarks |

---

## ⚡ How to Run Locally

### 1. Start Django Backend (Port 8000)
```powershell
cd backend
python manage.py migrate
python manage.py seed_communiti_data
python manage.py runserver 127.0.0.1:8000
```

### 2. Start React Frontend (Port 5173)
```powershell
cd frontend
$env:PATH = "C:\Program Files\nodejs;" + $env:PATH
npm run dev
```

Open `http://localhost:5173` in your browser to experience **Communiti**. 
=======
# MarketPlace
>>>>>>> 3dd367490e6f2fb585747e52a7117e8f5884c061
