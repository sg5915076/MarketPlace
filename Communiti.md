Communiti Website Build Requirement



Based on the technical requirements, communiti will be built as a lightweight, mobile-first, SEO-friendly directory and lead-generation platform.



1\. Required Website Experiences



Public user experience

Home page with keyword, category and locality search

Browse by city, area, community and category

Search results with verification, rating and featured filters

SEO-friendly listing detail pages

Service catalogue and image gallery

Business contact options, including phone and WhatsApp

Bookmark listings

Submit enquiries

Submit ratings and reviews

Mobile-responsive navigation and accessible forms



2\. Entrepreneur portal



Registration and email or mobile validation

Business profile creation

Listing, service and gallery management

Listing submission for moderation

Monthly Subscription of Rs.250 as a Platform Fee

Verification-status tracking

Enquiry and lead inbox

Lead status management:

New

Contacted

Qualified

Converted

Closed

Basic listing views, enquiries and bookmark analytics



3\. Admin and moderator portal



User and role management

Category and subcategory management

Listing approval, rejection and correction requests

Review moderation

Business verification

Featured-listing management

Platform activity and engagement monitoring



4\. Technical Architecture



Frontend : Next.js responsive web application

Backend : 	Django REST Framework

Database : 	PostgreSQL

Cache : 	Redis (Open-Source)

Authentication: JWT using DRF SimpleJWT

Administration: Django Admin with custom admin APIs

Notifications:	SMS and WhatsApp provider

API communication: REST with JSON

Background processing: Celery when asynchronous processing is required (optional)



5\. Main Website Pages



Home and hyperlocal discovery

Search results

Category and locality landing pages with specific tiles for each category

Business listing details

Registration and login

Entrepreneur business profile

Listing creation and editing

Service and gallery management

Entrepreneur lead dashboard

Bookmarks

Review submission

Admin moderation queue



6\. Core Build Flow



Next.js Web Application

|

| REST/JSON

v

Django REST Framework

|

+-- PostgreSQL

+-- Redis

+-- Object Storage

+-- SMS/WhatsApp

+-- Django Admin



7\. Listing lifecycle





Draft → Submitted → Under Review → Approved → Published

|

+→ Rejected / Changes Required



8\. Customer journey



Search → Filter → View Listing → Bookmark / Contact / Review / Enquiry



9\. Enquiry journey



Submit Enquiry → Validate and Spam Check → Store Lead→ Notify Entrepreneur → Display in Lead Dashboard



10. Essential API Integration



The frontend should consume the following API groups:



Authentication and user registration

Business profile

Categories and subcategories

Listings

Services

Gallery images

Search and filtering

Reviews

Enquiries

Entrepreneur leads

Bookmarks

Verification

Moderation and administration

Analytics events



11. Production Requirements



Role-based authorization for end users, entrepreneurs, moderators and administrators

Object-level ownership validation

File type and upload-size restrictions <=1MB

Enquiry, review and anonymous-search rate limiting

CAPTCHA or server-side abuse detection

Audit fields and moderation history

PostgreSQL indexes and paginated search

Stable listing slugs, metadata and structured SEO content

Accessible forms, keyboard navigation and sufficient colour contrast





