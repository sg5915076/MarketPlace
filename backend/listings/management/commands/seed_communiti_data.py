import uuid
from datetime import timedelta
from django.core.management.base import BaseCommand
from django.utils import timezone
from django.contrib.auth import get_user_model
from listings.models import (
    Category, BusinessListing, ProductServiceItem,
    ListingGalleryImage, Review, CustomerInquiry
)
from subscriptions.models import (
    SubscriptionPlan, EntrepreneurSubscription, Transaction, AuditLog
)

User = get_user_model()


class Command(BaseCommand):
    help = 'Seeds realistic data for Communiti Hyperlocal Discovery Platform'

    def handle(self, *args, **options):
        self.stdout.write(self.style.NOTICE('Seeding Communiti database...'))

        # 1. Create Subscription Plan (₹150/mo)
        plan, _ = SubscriptionPlan.objects.get_or_create(
            name='Artisan Monthly Listing Pass',
            defaults={
                'price_inr': 150.00,
                'duration_days': 30,
                'description': 'Hyperlocal presence, verified badge, unlimited leads, customer CSAT reviews, and gallery.',
                'features': [
                    'Hyperlocal Area Search Visibility',
                    'Verified Artisan Badge on Profile',
                    'Direct WhatsApp & Call Customer Inquiries',
                    'Customer CSAT Reviews & Rating Breakdown',
                    'High-Resolution Gallery & Menu Showcase',
                    'Real-time Lead Inbox & Status Management'
                ]
            }
        )

        # 2. Create Categories
        categories_data = [
            {
                'name': 'Home Bakers',
                'slug': 'home-bakers',
                'icon': 'Cake',
                'badge_color': 'amber',
                'description': 'Handcrafted sourdough loaves, custom celebration cakes, gluten-free tea bakes, and fresh French macarons.',
                'hero_image': 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&auto=format&fit=crop&q=80',
                'display_order': 1,
            },
            {
                'name': 'Chocolate Creations',
                'slug': 'chocolate-creations',
                'icon': 'Cookie',
                'badge_color': 'yellow',
                'description': 'Single-origin bean-to-bar chocolate slabs, hand-painted bonbons, vegan truffles, and artisanal fudge.',
                'hero_image': 'https://images.unsplash.com/photo-1548907040-4baa42d10919?w=800&auto=format&fit=crop&q=80',
                'display_order': 2,
            },
            {
                'name': 'Bespoke Gifting',
                'slug': 'bespoke-gifting',
                'icon': 'Gift',
                'badge_color': 'rose',
                'description': 'Curated festival hampers, personalized bridesmaid boxes, handcrafted wooden trays, and luxury celebration gifts.',
                'hero_image': 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=800&auto=format&fit=crop&q=80',
                'display_order': 3,
            },
            {
                'name': 'Handcrafted & Crafts',
                'slug': 'handcrafted-crafts',
                'icon': 'Palette',
                'badge_color': 'emerald',
                'description': 'Studio pottery, macrame wall hangings, botanical resin coasters, hand-poured soy candles, and crochet wonders.',
                'hero_image': 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&auto=format&fit=crop&q=80',
                'display_order': 4,
            },
            {
                'name': 'Artisanal Gourmet',
                'slug': 'artisanal-gourmet',
                'icon': 'Utensils',
                'badge_color': 'orange',
                'description': 'Organic small-batch fruit preserves, cold-pressed chilli oils, artisanal pickles, fermented hot sauces, and fresh pestos.',
                'hero_image': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80',
                'display_order': 5,
            },
            {
                'name': 'Jewellery Designers',
                'slug': 'jewellery-designers',
                'icon': 'Sparkles',
                'badge_color': 'purple',
                'description': 'Handmade silver filigree, terracotta earrings, beaded boho neckpieces, floral resin rings, and vintage brass jewellery.',
                'hero_image': 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&auto=format&fit=crop&q=80',
                'display_order': 6,
            },
            {
                'name': 'Homemade Wines & Botanical Brews',
                'slug': 'homemade-wines',
                'icon': 'Wine',
                'badge_color': 'red',
                'description': 'Traditional spiced ginger wines, mulberry & jamun botanical elixirs, fermented kombuchas, and herbal nectar brews.',
                'hero_image': 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&auto=format&fit=crop&q=80',
                'display_order': 7,
            },
        ]

        cat_objs = {}
        for cdata in categories_data:
            cat, _ = Category.objects.update_or_create(
                slug=cdata['slug'],
                defaults=cdata
            )
            cat_objs[cdata['slug']] = cat

        # 3. Create Users
        # Admin
        admin_user, _ = User.objects.get_or_create(
            email='admin@communiti.in',
            defaults={
                'full_name': 'Platform Admin',
                'role': User.RoleChoices.ADMIN,
                'is_staff': True,
                'is_superuser': True,
                'preferred_city': 'Bengaluru',
                'preferred_locality': 'Indiranagar'
            }
        )
        admin_user.set_password('Admin@123')
        admin_user.save()

        # Customer
        cust_user, _ = User.objects.get_or_create(
            email='riya.sharma@example.com',
            defaults={
                'full_name': 'Riya Sharma',
                'role': User.RoleChoices.CUSTOMER,
                'phone': '+91 98201 45678',
                'preferred_city': 'Bengaluru',
                'preferred_locality': 'Indiranagar',
                'avatar_url': 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
            }
        )
        cust_user.set_password('Customer@123')
        cust_user.save()

        # Customer 2
        cust2, _ = User.objects.get_or_create(
            email='arjun.mehta@example.com',
            defaults={
                'full_name': 'Arjun Mehta',
                'role': User.RoleChoices.CUSTOMER,
                'phone': '+91 98450 11223',
                'preferred_city': 'Mumbai',
                'preferred_locality': 'Bandra West',
                'avatar_url': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
            }
        )
        cust2.set_password('Customer@123')
        cust2.save()

        # 4. Create Micro-Entrepreneurs & Listings
        listings_seed = [
            {
                'email': 'ananya.bakes@example.com',
                'name': 'Ananya Roy',
                'phone': '+91 98765 43210',
                'business_name': 'The Sourdough & Flour Studio',
                'tagline': 'Artisanal slow-fermented sourdough, brioche buns, and bespoke wedding cakes in Indiranagar',
                'category': cat_objs['home-bakers'],
                'story_bio': 'Started during the quiet afternoons of 2021, The Sourdough & Flour Studio is a 100% micro-batch home bakery. Every single loaf of sourdough undergoes a 36-hour wild fermentation using organic stoneground wheat. We use no artificial preservatives, zero refined sugar for our breads, and farm-fresh butter.',
                'city': 'Bengaluru',
                'area_locality': 'Indiranagar',
                'address_line': '12th Main Road, 4th Cross, Indiranagar',
                'pincode': '560038',
                'latitude': 12.9716,
                'longitude': 77.6412,
                'price_tier': '₹₹',
                'subcategories': ['Wild Sourdough', 'French Patisserie', 'Custom Wedding Cakes', 'Eggless Specials'],
                'fssai_or_reg_number': 'FSSAI-21223014000492',
                'years_in_business': 4,
                'delivery_radius_km': 12.0,
                'offers_delivery': True,
                'offers_pickup': True,
                'operating_hours': '9:00 AM - 7:00 PM (Tue-Sun)',
                'banner_image': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1000&auto=format&fit=crop&q=80',
                'logo_image': 'https://images.unsplash.com/photo-1583338917451-face2751d8d5?w=200&auto=format&fit=crop&q=80',
                'status': BusinessListing.StatusChoices.APPROVED,
                'is_featured': True,
                'is_verified': True,
                'items': [
                    {
                        'title': 'Country Artisan Sourdough Loaf (750g)',
                        'description': '36-hour cold fermented sourdough with a crisp blistered crust and an airy, chewy crumb.',
                        'price': 340.00,
                        'image_url': 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?w=400&auto=format&fit=crop&q=80',
                        'is_bestseller': True,
                        'lead_time_days': 1,
                        'dietary_or_custom_tags': ['Vegan', 'Natural Starter', 'No Preservatives']
                    },
                    {
                        'title': 'Belgian Dark Chocolate Sea Salt Babka',
                        'description': 'Laminated sweet brioche dough layered with 70% dark Belgian cocoa ganache and Maldon sea salt flakes.',
                        'price': 550.00,
                        'image_url': 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=400&auto=format&fit=crop&q=80',
                        'is_bestseller': True,
                        'lead_time_days': 1,
                        'dietary_or_custom_tags': ['Bestseller', 'Contains Butter']
                    },
                    {
                        'title': 'Bespoke Vintage Buttercream Cake (1 kg)',
                        'description': 'Custom tiered celebration sponge with pure Madagascar vanilla bean and Swiss meringue buttercream piping.',
                        'price': 1650.00,
                        'image_url': 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?w=400&auto=format&fit=crop&q=80',
                        'is_bestseller': False,
                        'lead_time_days': 2,
                        'dietary_or_custom_tags': ['Eggless Available', 'Custom Decor']
                    }
                ],
                'reviews': [
                    {
                        'name': 'Priya Nair',
                        'rating': 5,
                        'csat': 100,
                        'sub_ratings': {'quality': 5, 'packaging': 5, 'value': 5, 'responsiveness': 5},
                        'title': 'The best sourdough in Indiranagar by a mile!',
                        'text': 'Ananya is an absolute sourdough wizard. The loaf stays fresh for days and the babka is out of this world. Delivered warm right on time for Sunday brunch.',
                        'ordered_items': 'Country Artisan Sourdough, Babka',
                        'reply': 'Thank you so much Priya! Baking with whole grains for wonderful neighbors like you is our daily joy.'
                    },
                    {
                        'name': 'Rahul Varma',
                        'rating': 5,
                        'csat': 100,
                        'sub_ratings': {'quality': 5, 'packaging': 5, 'value': 4, 'responsiveness': 5},
                        'title': 'Outstanding anniversary cake!',
                        'text': 'Ordered the bespoke vintage buttercream cake for my wife’s birthday. The detailing and texture were better than 5-star bakery standards.',
                        'ordered_items': 'Vintage Buttercream Cake',
                        'reply': 'Happy birthday to your wife! Thank you for trusting our home oven with your special day!'
                    }
                ]
            },
            {
                'email': 'rohit.chocolates@example.com',
                'name': 'Rohit Deshmukh',
                'phone': '+91 98199 87654',
                'business_name': 'Cocoa Alchemy Artisanal Chocolatiers',
                'tagline': 'Hand-painted bonbons, single-estate Idukki cacao bars, and vegan ganache truffles in Bandra',
                'category': cat_objs['chocolate-creations'],
                'story_bio': 'Cocoa Alchemy creates small-batch micro-lot chocolates in our Bandra home studio. We directly source our cacao beans from biodynamic farms in Idukki, Kerala. Each bonbon is hand-tempered, shell-casted and hand-painted with organic cocoa butter paints.',
                'city': 'Mumbai',
                'area_locality': 'Bandra West',
                'address_line': 'Pali Hill, Near Union Park, Bandra West',
                'pincode': '400050',
                'latitude': 19.0600,
                'longitude': 72.8285,
                'price_tier': '₹₹₹',
                'subcategories': ['Bean-to-Bar', 'Hand-painted Bonbons', 'Vegan Truffles', 'Luxury Tasting Boxes'],
                'fssai_or_reg_number': 'FSSAI-11522002001189',
                'years_in_business': 3,
                'delivery_radius_km': 20.0,
                'offers_delivery': True,
                'offers_pickup': True,
                'operating_hours': '11:00 AM - 9:00 PM (Daily)',
                'banner_image': 'https://images.unsplash.com/photo-1548907040-4baa42d10919?w=1000&auto=format&fit=crop&q=80',
                'logo_image': 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=200&auto=format&fit=crop&q=80',
                'status': BusinessListing.StatusChoices.APPROVED,
                'is_featured': True,
                'is_verified': True,
                'items': [
                    {
                        'title': 'Signature Galaxy Bonbon Box (12 pcs)',
                        'description': 'Hand-painted jewel bonbons with fillings like Salted Caramel, Passionfruit Gelee, and Pistachio Praline.',
                        'price': 980.00,
                        'image_url': 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=400&auto=format&fit=crop&q=80',
                        'is_bestseller': True,
                        'lead_time_days': 1,
                        'dietary_or_custom_tags': ['Gluten-Free', 'Artisanal Design']
                    },
                    {
                        'title': '72% Single Origin Malabar Cacao Bar (80g)',
                        'description': 'Stone-ground for 48 hours with hints of red berries and toasted hazelnuts. Unrefined raw cane sugar.',
                        'price': 320.00,
                        'image_url': 'https://images.unsplash.com/photo-1575372587186-5012e8878b2a?w=400&auto=format&fit=crop&q=80',
                        'is_bestseller': True,
                        'lead_time_days': 1,
                        'dietary_or_custom_tags': ['Vegan', 'Direct Trade']
                    }
                ],
                'reviews': [
                    {
                        'name': 'Tanvi Seth',
                        'rating': 5,
                        'csat': 100,
                        'sub_ratings': {'quality': 5, 'packaging': 5, 'value': 4, 'responsiveness': 5},
                        'title': 'Works of edible art!',
                        'text': 'The bonbons look like gemstones and taste even better. The passionfruit ganache is legendary. Ordered for corporate Diwali gifts and received rave compliments.',
                        'ordered_items': 'Galaxy Bonbon Box',
                        'reply': 'Thank you Tanvi! We put our heart into the temper and design of every piece.'
                    }
                ]
            },
            {
                'email': 'kavya.crafts@example.com',
                'name': 'Kavya Sundaram',
                'phone': '+91 99002 33445',
                'business_name': 'Mitti & Kiln Studio Ceramics',
                'tagline': 'Hand-thrown stoneware coffee mugs, ceramic planters, and minimalist dinnerware crafted in Koramangala',
                'category': cat_objs['handcrafted-crafts'],
                'story_bio': 'Every piece at Mitti & Kiln is wheel-thrown or hand-pinched using natural high-fire stoneware clay and food-safe, non-toxic studio glazes. We believe in wabi-sabi — finding warmth and character in the subtle organic textures made by human hands.',
                'city': 'Bengaluru',
                'area_locality': 'Koramangala',
                'address_line': '5th Block, Near Jyoti Nivas College, Koramangala',
                'pincode': '560095',
                'latitude': 12.9352,
                'longitude': 77.6245,
                'price_tier': '₹₹',
                'subcategories': ['Studio Pottery', 'Stoneware Mugs', 'Botanical Planters', 'Ceramic Tableware'],
                'fssai_or_reg_number': 'MSME-UDYAM-KR-03-009214',
                'years_in_business': 3,
                'delivery_radius_km': 15.0,
                'offers_delivery': True,
                'offers_pickup': True,
                'operating_hours': '10:00 AM - 6:00 PM (Mon-Sat)',
                'banner_image': 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=1000&auto=format&fit=crop&q=80',
                'logo_image': 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=200&auto=format&fit=crop&q=80',
                'status': BusinessListing.StatusChoices.APPROVED,
                'is_featured': True,
                'is_verified': True,
                'items': [
                    {
                        'title': 'Speckled Oat Studio Coffee Mug (320ml)',
                        'description': 'Wheel-thrown speckled clay mug with a comfortable thumb-rest handle and matte reactive glaze.',
                        'price': 680.00,
                        'image_url': 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&auto=format&fit=crop&q=80',
                        'is_bestseller': True,
                        'lead_time_days': 2,
                        'dietary_or_custom_tags': ['Microwave Safe', 'Dishwasher Safe']
                    },
                    {
                        'title': 'Textured Terracotta Planter Pot with Saucer',
                        'description': 'Hand-carved terracotta succulent bowl with drainage hole and glazed matching base saucer.',
                        'price': 850.00,
                        'image_url': 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&auto=format&fit=crop&q=80',
                        'is_bestseller': False,
                        'lead_time_days': 1,
                        'dietary_or_custom_tags': ['Eco-Friendly', 'Porous Clay']
                    }
                ],
                'reviews': [
                    {
                        'name': 'Deepak Gowda',
                        'rating': 5,
                        'csat': 100,
                        'sub_ratings': {'quality': 5, 'packaging': 5, 'value': 5, 'responsiveness': 5},
                        'title': 'My daily coffee feels like a ritual now!',
                        'text': 'The weight and feel of the speckled oat mug is perfection. Packaged with zero plastic and compostable wood shavings. Love supporting local makers like Kavya!',
                        'ordered_items': 'Speckled Oat Studio Coffee Mug',
                        'reply': 'Thank you Deepak! Hope your morning brew always brings comfort.'
                    }
                ]
            },
            {
                'email': 'zoya.jewels@example.com',
                'name': 'Zoya Merchant',
                'phone': '+91 98200 66789',
                'business_name': 'Zoya Silver & Handcrafted Filigree',
                'tagline': 'Bespoke 925 sterling silver jewelry, freshwater pearl earrings, and contemporary filigree in Colaba',
                'category': cat_objs['jewellery-designers'],
                'story_bio': 'Zoya Silver honors centuries-old Indian filigree techniques reimagined for modern aesthetic sensibilities. Every pendant and earring is meticulously bent, soldered, and hand-finished in our small Colaba atelier.',
                'city': 'Mumbai',
                'area_locality': 'Colaba',
                'address_line': 'Arthur Bunder Road, Near Radio Club, Colaba',
                'pincode': '400005',
                'latitude': 18.9150,
                'longitude': 72.8258,
                'price_tier': '₹₹₹',
                'subcategories': ['925 Sterling Silver', 'Handmade Filigree', 'Baroque Pearls', 'Custom Bridal Rings'],
                'fssai_or_reg_number': 'BIS-HALLMARK-MH-925-8812',
                'years_in_business': 5,
                'delivery_radius_km': 25.0,
                'offers_delivery': True,
                'offers_pickup': True,
                'operating_hours': '11:00 AM - 7:30 PM (Mon-Sat)',
                'banner_image': 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=1000&auto=format&fit=crop&q=80',
                'logo_image': 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=200&auto=format&fit=crop&q=80',
                'status': BusinessListing.StatusChoices.APPROVED,
                'is_featured': True,
                'is_verified': True,
                'items': [
                    {
                        'title': 'Crescent Filigree 925 Silver Danglers',
                        'description': 'Delicate spun silver wirework with tiny freshwater seed pearl droplets. Hallmarked 92.5 pure silver.',
                        'price': 2400.00,
                        'image_url': 'https://images.unsplash.com/photo-1630019852942-f89202989a59?w=400&auto=format&fit=crop&q=80',
                        'is_bestseller': True,
                        'lead_time_days': 2,
                        'dietary_or_custom_tags': ['Hallmarked 925', 'Hypoallergenic']
                    }
                ],
                'reviews': [
                    {
                        'name': 'Meera Kulkarni',
                        'rating': 5,
                        'csat': 100,
                        'sub_ratings': {'quality': 5, 'packaging': 5, 'value': 4, 'responsiveness': 5},
                        'title': 'Unmatched craftsmanship and authenticity',
                        'text': 'The silver work is so lightweight yet sturdy. Received in a velvet travel pouch with a silver polishing cloth and certificate.',
                        'ordered_items': 'Crescent Filigree Danglers',
                        'reply': 'Thank you Meera! It is an honor creating pieces that become family keepsakes.'
                    }
                ]
            },
            {
                'email': 'maria.wines@example.com',
                'name': 'Maria Fernandes',
                'phone': '+91 98221 44556',
                'business_name': 'Fernandes Heritage Botanical & Berry Brews',
                'tagline': 'Authentic Goan homemade spiced ginger wines, wild mulberry elixirs, and heritage botanical nectars',
                'category': cat_objs['homemade-wines'],
                'story_bio': 'Following our grandmother 80-year-old Portuguese-Goan family recipe, we slow-brew fruit wines in ceramic demijohns using local tropical fruits, wild mulberries, and fragrant whole spices like cinnamon, clove, and nutmeg.',
                'city': 'Goa',
                'area_locality': 'Panaji / Fontainhas',
                'address_line': '31st January Road, Latin Quarter Fontainhas, Panaji',
                'pincode': '403001',
                'latitude': 15.4989,
                'longitude': 73.8278,
                'price_tier': '₹₹',
                'subcategories': ['Spiced Ginger Wine', 'Mulberry Botanical Brew', 'Goan Heritage', 'Festive Port Style'],
                'fssai_or_reg_number': 'EXCISE-GA-COTTAGE-2024-81',
                'years_in_business': 8,
                'delivery_radius_km': 30.0,
                'offers_delivery': True,
                'offers_pickup': True,
                'operating_hours': '10:00 AM - 8:00 PM (Daily)',
                'banner_image': 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=1000&auto=format&fit=crop&q=80',
                'logo_image': 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=200&auto=format&fit=crop&q=80',
                'status': BusinessListing.StatusChoices.APPROVED,
                'is_featured': True,
                'is_verified': True,
                'items': [
                    {
                        'title': 'Heritage Spiced Ginger Holiday Wine (750ml)',
                        'description': 'Aged 6 months with sun-dried Cochin ginger, organic jaggery, whole cinnamon bark, and citrus peel.',
                        'price': 650.00,
                        'image_url': 'https://images.unsplash.com/photo-1558001373-7b93ee48ffa0?w=400&auto=format&fit=crop&q=80',
                        'is_bestseller': True,
                        'lead_time_days': 1,
                        'dietary_or_custom_tags': ['Naturally Fermented', 'Traditional Recipe']
                    }
                ],
                'reviews': [
                    {
                        'name': 'Clive D’Souza',
                        'rating': 5,
                        'csat': 100,
                        'sub_ratings': {'quality': 5, 'packaging': 5, 'value': 5, 'responsiveness': 5},
                        'title': 'Tastes exactly like Christmas at home in Goa!',
                        'text': 'Warm, spicy, and perfectly balanced sweetness. We order 6 bottles every festive season. Maria is the warmest host in Fontainhas!',
                        'ordered_items': 'Heritage Spiced Ginger Wine',
                        'reply': 'Viva Goa! Thank you Clive, bless you and your family for supporting our home craft!'
                    }
                ]
            },
            {
                'email': 'pooja.gifting@example.com',
                'name': 'Pooja Kapoor',
                'phone': '+91 98110 55667',
                'business_name': 'Aarambh Bespoke Hampers & Keepsakes',
                'tagline': 'Hand-curated festive boxes, artisanal bridesmaid hampers, and sustainable luxury corporate gifts in Connaught Place',
                'category': cat_objs['bespoke-gifting'],
                'story_bio': 'Aarambh curates emotion-first gift boxes combining handcrafted brass diyas, organic local honey, artisanal teas, and hand-embroidered silk pouches. Designed for weddings, festivities, and milestones.',
                'city': 'Delhi NCR',
                'area_locality': 'Connaught Place',
                'address_line': 'Inner Circle, Connaught Place, New Delhi',
                'pincode': '110001',
                'latitude': 28.6304,
                'longitude': 77.2177,
                'price_tier': '₹₹₹',
                'subcategories': ['Wedding Hampers', 'Festive Boxes', 'Corporate Gifting', 'Custom Monograms'],
                'fssai_or_reg_number': 'GSTIN-07AABCP8812R1Z8',
                'years_in_business': 4,
                'delivery_radius_km': 30.0,
                'offers_delivery': True,
                'offers_pickup': True,
                'operating_hours': '10:00 AM - 7:00 PM (Mon-Sat)',
                'banner_image': 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=1000&auto=format&fit=crop&q=80',
                'logo_image': 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=200&auto=format&fit=crop&q=80',
                'status': BusinessListing.StatusChoices.APPROVED,
                'is_featured': False,
                'is_verified': True,
                'items': [
                    {
                        'title': 'The Royal Amber Celebration Hamper',
                        'description': 'Handcrafted pine wood box with brass clasp, saffron honey, brass incense holder, and hand-poured soy candle.',
                        'price': 2250.00,
                        'image_url': 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400&auto=format&fit=crop&q=80',
                        'is_bestseller': True,
                        'lead_time_days': 2,
                        'dietary_or_custom_tags': ['Custom Tag', 'Luxury Wooden Box']
                    }
                ],
                'reviews': [
                    {
                        'name': 'Simran Sethi',
                        'rating': 5,
                        'csat': 100,
                        'sub_ratings': {'quality': 5, 'packaging': 5, 'value': 4, 'responsiveness': 5},
                        'title': 'Breathtaking presentation and bespoke attention to detail',
                        'text': 'Pooja customized 40 bridesmaid boxes with individualized initials. The packaging made everyone gasp with joy.',
                        'ordered_items': 'Royal Amber Celebration Hamper',
                        'reply': 'Thank you Simran! Making your wedding squad feel treasured was an honor.'
                    }
                ]
            },
            {
                'email': 'aditya.gourmet@example.com',
                'name': 'Aditya Krishnan',
                'phone': '+91 94440 88990',
                'business_name': 'Hillside Pantry Small-Batch Artisanal Preserves',
                'tagline': 'Sun-ripened organic fruit preserves, cold-pressed chilli garlic crisp, and fermented gourmet condiments in Anna Nagar',
                'category': cat_objs['artisanal-gourmet'],
                'story_bio': 'We preserve the seasonal bounty of South India. Slow-cooked in copper pans in small batches of 20 jars at a time without pectin, artificial colors, or chemical preservatives.',
                'city': 'Chennai',
                'area_locality': 'Anna Nagar',
                'address_line': '2nd Avenue, Anna Nagar West, Chennai',
                'pincode': '600040',
                'latitude': 13.0850,
                'longitude': 80.2101,
                'price_tier': '₹',
                'subcategories': ['Organic Preserves', 'Chilli Crisp', 'Fermented Sauces', 'Gourmet Dips'],
                'fssai_or_reg_number': 'FSSAI-12421008000342',
                'years_in_business': 2,
                'delivery_radius_km': 15.0,
                'offers_delivery': True,
                'offers_pickup': True,
                'operating_hours': '9:30 AM - 6:30 PM (Mon-Sat)',
                'banner_image': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1000&auto=format&fit=crop&q=80',
                'logo_image': 'https://images.unsplash.com/photo-1528750997573-59b89d56f4f7?w=200&auto=format&fit=crop&q=80',
                'status': BusinessListing.StatusChoices.APPROVED,
                'is_featured': False,
                'is_verified': True,
                'items': [
                    {
                        'title': 'Kodaikanal Plum & Star Anise Jam (280g)',
                        'description': 'Wild plums from organic orchards simmered with whole spices and raw cane sugar.',
                        'price': 280.00,
                        'image_url': 'https://images.unsplash.com/photo-1590779033100-9f60a05a013d?w=400&auto=format&fit=crop&q=80',
                        'is_bestseller': True,
                        'lead_time_days': 1,
                        'dietary_or_custom_tags': ['Vegan', 'Low Sugar', 'No Pectin']
                    }
                ],
                'reviews': [
                    {
                        'name': 'Gautam Ram',
                        'rating': 5,
                        'csat': 100,
                        'sub_ratings': {'quality': 5, 'packaging': 5, 'value': 5, 'responsiveness': 5},
                        'title': 'Real fruit flavor, nothing like commercial jams',
                        'text': 'The plum and star anise preserve on hot sourdough toast is breakfast heaven. Will keep ordering monthly!',
                        'ordered_items': 'Kodaikanal Plum & Star Anise Jam',
                        'reply': 'Thank you Gautam! Pure fruits and time are our only ingredients.'
                    }
                ]
            },
            # Pending Moderation Demo Listing
            {
                'email': 'neha.pending@example.com',
                'name': 'Neha Shah',
                'phone': '+91 98200 99881',
                'business_name': 'Flourish Botanical Cakes & Macarons',
                'tagline': 'Organic edible floral cakes, bespoke tea macarons, and French tarts in Juhu',
                'category': cat_objs['home-bakers'],
                'story_bio': 'Flourish blends French pastry craftsmanship with pressed organic edible flowers grown in our balcony garden. We specialize in delicate rosewater macarons, matcha tarts, and lavender sponge cakes.',
                'city': 'Mumbai',
                'area_locality': 'Juhu',
                'address_line': 'Gulmohar Cross Road 4, Juhu Scheme',
                'pincode': '400049',
                'latitude': 19.1075,
                'longitude': 72.8263,
                'price_tier': '₹₹',
                'subcategories': ['Edible Flowers', 'French Macarons', 'Botanical Tarts'],
                'fssai_or_reg_number': 'FSSAI-21524011000912',
                'years_in_business': 1,
                'delivery_radius_km': 15.0,
                'offers_delivery': True,
                'offers_pickup': True,
                'operating_hours': '10:00 AM - 7:00 PM (Wed-Sun)',
                'banner_image': 'https://images.unsplash.com/photo-1557925923-cd4648e211a0?w=1000&auto=format&fit=crop&q=80',
                'logo_image': 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=200&auto=format&fit=crop&q=80',
                'status': BusinessListing.StatusChoices.PENDING_APPROVAL, # For admin moderation queue
                'is_featured': False,
                'is_verified': False,
                'items': [
                    {
                        'title': 'Box of 6 Botanical Floral Macarons',
                        'description': 'Assorted macarons infused with lavender honey, Persian rose, and elderflower.',
                        'price': 520.00,
                        'image_url': 'https://images.unsplash.com/photo-1569864358642-9d1684040f43?w=400&auto=format&fit=crop&q=80',
                        'is_bestseller': True,
                        'lead_time_days': 1,
                        'dietary_or_custom_tags': ['Gluten-Free Almond Flour']
                    }
                ],
                'reviews': []
            }
        ]

        for sdata in listings_seed:
            # Create entrepreneur user
            user, _ = User.objects.get_or_create(
                email=sdata['email'],
                defaults={
                    'full_name': sdata['name'],
                    'role': User.RoleChoices.ENTREPRENEUR,
                    'phone': sdata['phone'],
                    'preferred_city': sdata['city'],
                    'preferred_locality': sdata['area_locality'],
                    'avatar_url': sdata['logo_image']
                }
            )
            user.set_password('Entrepreneur@123')
            user.save()

            # Create or update BusinessListing
            listing, _ = BusinessListing.objects.update_or_create(
                owner=user,
                defaults={
                    'business_name': sdata['business_name'],
                    'tagline': sdata['tagline'],
                    'category': sdata['category'],
                    'story_bio': sdata['story_bio'],
                    'city': sdata['city'],
                    'area_locality': sdata['area_locality'],
                    'address_line': sdata['address_line'],
                    'pincode': sdata['pincode'],
                    'latitude': sdata['latitude'],
                    'longitude': sdata['longitude'],
                    'contact_phone': sdata['phone'],
                    'whatsapp_number': sdata['phone'],
                    'price_tier': sdata['price_tier'],
                    'subcategories': sdata['subcategories'],
                    'fssai_or_reg_number': sdata['fssai_or_reg_number'],
                    'years_in_business': sdata['years_in_business'],
                    'delivery_radius_km': sdata['delivery_radius_km'],
                    'offers_delivery': sdata['offers_delivery'],
                    'offers_pickup': sdata['offers_pickup'],
                    'operating_hours': sdata['operating_hours'],
                    'banner_image': sdata['banner_image'],
                    'logo_image': sdata['logo_image'],
                    'status': sdata['status'],
                    'is_featured': sdata['is_featured'],
                    'is_verified': sdata['is_verified'],
                    'subscription_active': True,
                    'subscription_expires_at': timezone.now() + timedelta(days=28),
                    'view_count': 142,
                    'lead_count': 18,
                    'bookmark_count': 34
                }
            )

            # Create Items
            ProductServiceItem.objects.filter(listing=listing).delete()
            for item in sdata.get('items', []):
                ProductServiceItem.objects.create(
                    listing=listing,
                    title=item['title'],
                    description=item['description'],
                    price=item['price'],
                    image_url=item['image_url'],
                    is_bestseller=item['is_bestseller'],
                    lead_time_days=item['lead_time_days'],
                    dietary_or_custom_tags=item['dietary_or_custom_tags']
                )

            # Create Reviews
            Review.objects.filter(listing=listing).delete()
            for r in sdata.get('reviews', []):
                Review.objects.create(
                    listing=listing,
                    customer=cust_user,
                    customer_name=r['name'],
                    customer_locality=sdata['area_locality'],
                    customer_avatar='https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
                    rating=r['rating'],
                    csat_score=r['csat'],
                    sub_ratings=r['sub_ratings'],
                    review_title=r['title'],
                    review_text=r['text'],
                    ordered_items=r['ordered_items'],
                    entrepreneur_reply=r.get('reply', ''),
                    reply_timestamp=timezone.now() if r.get('reply') else None,
                    is_verified_buyer=True,
                    status=Review.ReviewStatus.PUBLISHED
                )

            # Create Sample Customer Inquiry
            CustomerInquiry.objects.get_or_create(
                listing=listing,
                name='Pooja Singhania',
                defaults={
                    'email': 'pooja.s@example.com',
                    'phone': '+91 98450 99887',
                    'occasion': 'Birthday Celebration Hamper',
                    'event_date': '2026-09-15',
                    'budget_range': '₹2,000 - ₹5,000',
                    'message': 'Hi! Looking to order a custom tasting box with gift packaging for my sister in your area. Can we customize the flavors?',
                    'status': CustomerInquiry.LeadStatus.NEW
                }
            )

            # Create ₹150 Monthly Subscription & UPI Transaction Record
            sub, _ = EntrepreneurSubscription.objects.update_or_create(
                listing=listing,
                defaults={
                    'entrepreneur': user,
                    'plan': plan,
                    'status': EntrepreneurSubscription.StatusChoices.ACTIVE,
                    'start_date': timezone.now() - timedelta(days=2),
                    'end_date': timezone.now() + timedelta(days=28),
                    'auto_renew': True
                }
            )

            txn_id = f"COMM_UPI_{timezone.now().strftime('%Y%m')}_{uuid.uuid4().hex[:6].upper()}"
            inv_no = f"INV-COM-2026-{uuid.uuid4().hex[:4].upper()}"
            
            Transaction.objects.update_or_create(
                listing=listing,
                defaults={
                    'transaction_id': txn_id,
                    'invoice_number': inv_no,
                    'subscription': sub,
                    'entrepreneur': user,
                    'amount': 150.00,
                    'currency': 'INR',
                    'payment_channel': Transaction.PaymentChannel.UPI_QR,
                    'payee_vpa': 'communiti.marketplace@icici',
                    'payer_vpa': f"{user.email.split('@')[0]}@okhdfcbank",
                    'upi_reference_number': f"UTR{uuid.uuid4().hex[:12].upper()}",
                    'status': Transaction.TransactionStatus.SUCCESS,
                    'notes': f"Monthly Subscription Fee for {listing.business_name}",
                    'receipt_data': {
                        'invoice_number': inv_no,
                        'bill_to': {'name': user.full_name, 'business_name': listing.business_name, 'locality': listing.area_locality},
                        'items': [{'description': 'Artisan Monthly Listing Pass (1 Month)', 'base_amount': 127.12, 'cgst_9pct': 11.44, 'sgst_9pct': 11.44, 'total_inr': 150.00}],
                        'total_amount': 150.00,
                        'currency': 'INR'
                    }
                }
            )

            # Seed Audit Log
            AuditLog.objects.create(
                actor=user,
                actor_email=user.email,
                action='SUBSCRIPTION_ACTIVATED_UPI',
                target_model='EntrepreneurSubscription',
                target_id=str(sub.id),
                target_label=f"Rs.150 Sub for {listing.business_name}",
                details={'amount': 150.0, 'validity_days': 30, 'channel': 'UPI_QR'}
            )

        self.stdout.write(self.style.SUCCESS('Successfully seeded Communiti database with 7 micro-categories, rich listings, CSAT reviews, Rs.150 UPI subscriptions and audit records!'))
