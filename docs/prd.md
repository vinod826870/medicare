# Online Medicine Website Requirements Document

## 1. Website Name
MediCare Online Pharmacy

## 2. Website Description
An online medicine platform that enables users to conveniently browse, search, and purchase medicines while providing administrators with comprehensive management capabilities through an enhanced admin dashboard. The website emphasizes user convenience, secure transactions, streamlined inventory updates, and rich interactive features. Medicine data is retrieved from Supabase database.

## 3. Core Features

### 3.1 User Features
\n#### 3.1.1 Account & Authentication
- **User Registration & Login**: Allow users to create accounts and securely log in to access personalized services
- **Social Login**: Quick login via Google, Facebook, or Apple accounts
- **Two-Factor Authentication**: Optional2FA for enhanced account security
- **Password Recovery**: Email-based password reset functionality
\n#### 3.1.2 Medicine Discovery & Shopping
- **Medicine Search & Browse**: Enable users to search for medicines by name, category, manufacturer, or composition, and browse through organized medicine catalogs retrieved from Supabase database. Each medicine listing displays information from the medicine_data table. Search functionality is optimized for fast performance across large dataset\n- **Advanced Filters**: Filter by price range, manufacturer, medicine type, pack size, and availability\n- **Voice Search**: Search medicines using voice commands for hands-free convenience
- **Barcode Scanner**: Scan medicine barcodes to quickly find products and check authenticity
- **Shopping Cart Management**: Users can add medicines to cart, modify quantities, and remove items before checkout
- **Save for Later**: Move items from cart to a'Save for Later' list\n- **Cart Sharing**: Share cart contents via link with family members or caregivers

#### 3.1.3 Order & Delivery
- **Order Management**: Users can place orders, view order history, track order status, and manage their purchases
- **Order Tracking**: Real-time order tracking with status updates from order placement to delivery
- **Delivery Scheduling**: Choose preferred delivery time slots\n- **Express Delivery**: Option for same-day or next-day delivery for urgent needs
- **Prescription Upload**: Users can upload prescription images for verification before purchasing prescription medicines
- **Auto-Refill Reminders**: Set automatic reminders for recurring medicine purchases
- **Order Notifications**: SMS and email notifications for order confirmation, shipping, and delivery updates

#### 3.1.4 Personalization & Engagement
- **Wishlist**: Users can save medicines to a wishlist for future reference and easy access
- **Product Reviews & Ratings**: Users can rate and review purchased medicines to help other customers make informed decisions
- **Medicine Comparison**: Users can compare up to 4 medicines side-by-side based on price, composition, manufacturer, and other attributes. The comparison feature retrieves medicine data from the medicine_data table in Supabase database, ensuring consistency with the main medicines page. Users can search and add medicines to comparison using the same search functionality that queries the medicine_data table
- **Personalized Recommendations**: AI-powered medicine suggestions based on browsing and purchase history
- **Recently Viewed**: Quick access to recently browsed medicines\n- **Price Drop Alerts**: Get notified when wishlist items go on sale
- **Loyalty Program**: Earn points on purchases and redeem for discounts
- **Referral Program**: Invite friends and earn rewards for successful referrals

#### 3.1.5 Health & Wellness
- **Health Blog**: Access informative articles about health tips, medicine usage guidelines, and wellness advice. Blog articles are stored and managed in the Supabase database, allowing administrators to create, edit, and publish content through the admin dashboard
- **Medicine Reminders**: Set daily reminders for taking medicines with dosage information
- **Health Tracker**: Track vital health metrics like blood pressure, blood sugar, and weight
- **Symptom Checker**: Interactive tool to check symptoms and get medicine suggestions (disclaimer included)
- **Medicine Interaction Checker**: Check potential interactions between multiple medicines
- **Dosage Calculator**: Calculate appropriate dosage based on age, weight, and condition
- **First Aid Guide**: Quick access to first aid instructions for common emergencies

#### 3.1.6 Communication & Support
- **Contact Form**: Users can submit inquiries or feedback through a contact form. Form submissions will be stored in the database and automatically sent via email to vinod826870@gmail.com
- **Live Chat Support**: Real-time chat with customer support representatives
- **Chatbot Assistant**: AI-powered chatbot for instant answers to common questions
- **Video Consultation**: Book online consultations with pharmacists or healthcare professionals
- **Community Forum**: Discuss health topics and share experiences with other users
\n#### 3.1.7 User Profile & Settings
- **User Profile Management**: Users can update personal information, manage addresses, view order history, and track loyalty points
- **Multiple Addresses**: Save and manage multiple delivery addresses
- **Family Profiles**: Create sub-profiles for family members with separate medicine lists
- **Health Records**: Securely store and manage medical prescriptions and health documents
- **Notification Preferences**: Customize email, SMS, and push notification settings
- **Language Selection**: Choose preferred language for the interface

### 3.2 Admin Features

#### 3.2.1 Enhanced Admin Dashboard
- **Dashboard Overview**: Comprehensive dashboard displaying key metrics including:
  - Total sales revenue (daily, weekly, monthly)
  - Number of orders (pending, processing, completed, cancelled)
  - Total registered users and new user registrations
  - Low stock alerts and out-of-stock items count
  - Top-selling medicines and categories
  - Revenue charts and sales trends visualization
  - Recent customer reviews and ratings summary
\n#### 3.2.2Inventory Management
- **Stock Management**: Monitor inventory status, update stock quantities, set reorder levels, and manage stock information from the medicine_data table
- **Add/Edit/Delete Medicines**: Full CRUD operations for medicine records including bulk upload capability
- **Stock Alerts**: Automated notifications for low stock and out-of-stock items
- **Supplier Management**: Manage supplier information and track purchase orders
\n#### 3.2.3 Order Management
- **Order Processing**: View and manage customer orders with filtering options (by status, date, customer)\n- **Order Status Updates**: Update order status (pending, confirmed, shipped, delivered, cancelled)
- **Invoice Generation**: Automatically generate and send invoices to customers
- **Refund Management**: Process refunds and manage return requests
\n#### 3.2.4 Customer Management
- **User Database**: View and manage registered users with search and filter capabilities
- **Customer Activity**: Track customer purchase history, order frequency, and spending patterns
- **Customer Support**: Manage customer inquiries from contact form submissions
- **User Verification**: Verify prescription uploads and approve prescription medicine orders

#### 3.2.5 Content Management
- **Blog Management**: Create, edit, publish, and delete health-related blog articles. Blog posts are stored in a dedicated blog_posts table in the Supabase database with the following structure:
  - **id**: Unique identifier for each blog post
  - **title**: Blog post title
  - **content**: Full article content (supports rich text/HTML)\n  - **author**: Author name or admin user ID
  - **category**: Blog category (e.g., Health Tips, Medicine Guide, Wellness)
  - **featured_image**: Image URL for the blog post thumbnail
  - **published_date**: Publication date and time
  - **status**: Draft or Published
  - **tags**: Comma-separated tags for categorization
  - **views**: Number of views counter
  - **created_at**: Timestamp of creation\n  - **updated_at**: Timestamp of last update
- Admin can perform full CRUD operations on blog posts through the admin dashboard
- **Banner Management**: Manage homepage banners and promotional slides
- **Category Management**: Add, edit, or remove medicine categories

#### 3.2.6 Analytics & Reports
- **Sales Reports**: Generate detailed sales reports by date range, category, or product
- **Customer Analytics**: Analyze customer demographics, behavior, and preferences
- **Inventory Reports**: Track stock movement, turnover rates, and inventory valuation
- **Revenue Analytics**: Monitor revenue streams, profit margins, and financial performance

#### 3.2.7 Settings & Configuration
- **Payment Settings**: Configure Stripe payment gateway settings\n- **Email Settings**: Manage email templates and notification preferences
- **Shipping Settings**: Configure shipping zones, rates, and delivery options
- **Tax Configuration**: Set up tax rates and rules
- **Admin User Management**: Manage admin roles and permissions

## 4. Medicine Data Source

### 4.1 Google Sheets Data Import
- **Source Spreadsheet**: https://docs.google.com/spreadsheets/d/1tTY-Yc2asdqIreWBBrWPgr8ijs-hja0fCpvya3R7F6s/edit?gid=431348946#gid=431348946
- **Import Target**: Supabase database table named medicine_data
- **Import Method**: The data from the Google Sheets should be imported into the Supabase medicine_data table. This can be achieved through:\n  - Manual CSV export from Google Sheets and import to Supabase
  - Automated sync using Google Sheets API integration
  - One-time bulk import during initial setup
- **Data Mapping**: Ensure column headers in Google Sheets match the table structure defined in section 4.2

### 4.2 Supabase Database Configuration
- **Database Platform**: Supabase (https://supabase.com/dashboard)
- **Table Name**: medicine_data
- **Total Records**: Approximately 253,973 medicine entries (after import from Google Sheets)
\n### 4.3 Table Structure
Create database table name: medicine_data

Table columns:
- **id**: Unique identifier for each medicine
- **name**: Medicine name
- **price**: Medicine price
- **Is_discontinued**: Status indicating if the medicine is discontinued
- **manufacturer_name**: Name of the manufacturer
- **type**: Medicine type/category
- **pack_size_label**: Package size information
- **short_composition1**: Brief composition description
- **salt_composition**: Detailed salt composition\n- **side_effects**: Known side effects
- **drug_interactions**: Drug interaction information
\n### 4.4 Data Display Requirements
- Display medicine data in card-based layout with each card showing key information from the table columns
- Fetch data through Supabase API integration using RESTful API calls
- Implement optimized search functionality with the following features:
  - Search across name, manufacturer_name, short_composition1, and salt_composition fields
  - Use indexed queries for fast search performance
  - Implement debouncing to reduce API calls during typing
  - Support partial matching and case-insensitive search
- Enable category filtering based on the type column with dynamic category list generation
- Support pagination for efficient loading of large dataset (recommended page size: 20-50 items)
- Implement lazy loading or infinite scroll for smooth user experience
- Add loading states and skeleton screens while data is being fetched
- **Compare Page Data Source**: The medicine comparison feature uses the same medicine_data table and search functionality as the main medicines page, ensuring data consistency across the platform

### 4.5 Search Optimization
- Utilize Supabase full-text search capabilities for faster query results
- Implement client-side caching to reduce repeated API calls
- Use query parameters for filtering and sorting to minimize data transfer
- Consider implementing search result ranking based on relevance\n\n## 5. Medicine Categories
The platform will organize medicines based on the'type' column in the medicine_data table, covering various medicine categories dynamically retrieved from the database. Category filters will be displayed in the sidebar for easy navigation.

## 6. Payment Configuration

### 6.1 Stripe Payment Integration
- **Payment Method**: Stripe payment gateway integration for secure online transactions
- **STRIPE_SECRET_KEY**: The Stripe secret key should be securely stored in environment variables for payment processing authentication
- **Usage**: This key enables the platform to process payments, handle refunds, and manage transaction records through Stripe API
- **Implementation**: Configure Stripe checkout for cart payment processing, supporting major credit/debit cards\n
## 7. Email Configuration
- **Email Service API Key**: re_cSADr4hj_Lqc4T5x8j92whgXu1RhAxAmC\n- **Usage**: This API key should be configured in the email service integration to enable automated email sending functionality
- **Trigger Point**: When users submit the contact form, the system will use this API key to authenticate with the email service and send form submissions to vinod826870@gmail.com\n- **Implementation**: The API key should be securely stored in environment variables and used for email service authentication during contact form submission processing

## 8. Additional Pages
\n### 8.1 User-Facing Pages
\n#### 8.1.1 Core Shopping Pages
- **Homepage**: Featured medicines, promotional banners, trending products, category highlights, flash deals, and personalized recommendations
- **Product Listing Page**: Grid/list view of medicines with filters, sorting, and pagination (reference design from image.png)
- **Product Detail Page**: Detailed medicine information including composition, usage, side effects, reviews, related products, and alternative medicines
- **Search Results Page**: Display search results with relevant filters and sorting options
- **Category Page**: Browse medicines by specific categories with subcategory navigation
- **Brand Page**: Explore medicines from specific manufacturers\n- **Deals & Offers Page**: View all ongoing promotions, discounts, and special offers
- **New Arrivals Page**: Browse recently added medicines
- **Best Sellers Page**: View top-selling medicines across categories
\n#### 8.1.2 Cart & Checkout Pages
- **Shopping Cart Page**: Cart summary with quantity adjustment, save for later, and checkout button
- **Checkout Page**: Order summary, shipping address, payment method selection, and coupon code application
- **Order Confirmation Page**: Order details, tracking information, and estimated delivery date
- **Payment Success Page**: Payment confirmation with order number and next steps
- **Payment Failed Page**: Error message with retry options
\n#### 8.1.3 User Account Pages
- **User Dashboard**: Overview of orders, wishlist, loyalty points, and quick actions
- **Profile Management**: Edit personal information, change password, and manage account settings
- **Order History**: View past orders with filter and search options
- **Track Order**: Real-time order tracking with delivery status updates
- **Wishlist Page**: Saved medicines with add to cart and remove options
- **Compare Page**: Side-by-side comparison of selected medicines with search functionality that retrieves data from the medicine_data table in Supabase database
- **Saved Addresses**: Manage multiple delivery addresses
- **Family Profiles**: Manage family member profiles and their medicine lists
- **Health Records**: View and manage uploaded prescriptions and health documents
- **Loyalty Points**: View points balance, transaction history, and redemption options
- **Referral Dashboard**: Track referrals, rewards earned, and share referral link

#### 8.1.4 Health & Wellness Pages
- **Health Blog**: Browse health articles by category with search functionality. Articles are retrieved from the blog_posts table in Supabase database
- **Blog Article Page**: Read full articles with related posts and comment section
- **Medicine Reminders**: Set and manage medicine reminders with notification settings
- **Health Tracker**: Log and visualize health metrics over time
- **Symptom Checker**: Interactive symptom assessment tool
- **Medicine Interaction Checker**: Check interactions between multiple medicines
- **Dosage Calculator**: Calculate appropriate dosage based on patient information
- **First Aid Guide**: Browse first aid instructions by emergency type
- **Health Tips**: Daily health tips and wellness advice
\n#### 8.1.5 Support & Information Pages
- **Contact Us Page**: Contact form, phone number, email, and live chat access
- **Live Chat**: Real-time chat interface with support representatives
- **FAQ Page**: Frequently asked questions organized by category
- **Help Center**: Comprehensive help documentation with search functionality
- **About Us Page**: Company information, mission statement, and team details
- **How It Works**: Step-by-step guide on using the platform
- **Shipping & Delivery**: Information about shipping policies, delivery times, and charges
- **Returns & Refunds**: Policy details and return request process
- **Privacy Policy**: Data protection and privacy information
- **Terms & Conditions**: User agreement and terms of service
- **Prescription Policy**: Guidelines for uploading and verifying prescriptions

#### 8.1.6 Interactive & Engagement Pages
- **Community Forum**: Discussion boards for health topics with categories and threads
- **Forum Thread Page**: View and participate in discussions
- **Video Consultation**: Book and manage video consultations with healthcare professionals
- **Consultation History**: View past consultations and notes
- **Notifications Center**: View all notifications with filter options
- **Saved Items**: Quick access to saved medicines, articles, and forum posts
- **Recently Viewed**: History of recently browsed medicines and pages
\n#### 8.1.7 Special Feature Pages
- **Voice Search**: Voice-activated search interface
- **Barcode Scanner**: Camera-based barcode scanning interface
- **Medicine Finder**: Advanced search tool with multiple filter options
- **Price Comparison**: Compare prices of same medicine across different pack sizes
- **Subscription Management**: Manage auto-refill subscriptions\n- **Gift Cards**: Purchase and redeem gift cards\n- **Seasonal Health**: Seasonal health tips and relevant medicine recommendations

### 8.2 Admin Pages\n- **Admin Login Page**: Secure login for administrators\n- **Dashboard Home**: Overview with key metrics and charts
- **Inventory Management Page**: Medicine list with add/edit/delete functionality
- **Order Management Page**: Order list with status update and filtering options
- **Customer Management Page**: User list and customer details
- **Analytics Page**: Sales reports, revenue charts, and performance metrics
- **Blog Management Page**: Create, edit, publish, and manage blog posts stored in the blog_posts table. Admin interface includes:
  - List view of all blog posts with filters (published/draft, category, date)\n  - Create new blog post form with rich text editor
  - Edit existing blog posts
  - Delete blog posts
  - Preview blog posts before publishing
  - Manage blog categories and tags\n  - View blog analytics (views, engagement)\n- **Settings Page**: System configuration and preferences
\n## 9. Design Style\n
### 9.1 Color Scheme
- Primary color: Clean medical blue (#2E86DE) conveying trust and professionalism
- Secondary color: Soft green (#27AE60) representing health and wellness
- Background: Light gray (#F5F6FA) for comfortable reading
- Accent color: Warm orange (#E67E22) for call-to-action buttons

### 9.2 Visual Details
- Rounded corners (8px radius) for cards and buttons creating a friendly, approachable feel
- Subtle shadows (02px 8px rgba(0,0,0,0.1)) for depth and hierarchy
- Clean, sans-serif typography for easy readability
- Medicine product cards displaying name, price, manufacturer, type, pack size, and composition from database
- Loading states with skeleton screens while data is being fetched from Supabase
- Hover effects on cards for better interactivity
- Star ratings display for product reviews
- Badge indicators for 'Best Seller', 'New Arrival', and discount percentages
- Smooth transitions and micro-animations for enhanced user experience

### 9.3 Layout\n- Card-based grid layout for medicine listings (3-4 columns on desktop, responsive on mobile) as shown in image.png
- Fixed navigation bar at top for quick access to search, cart, and user account\n- Sidebar filters based on medicine type for efficient discovery and category navigation
- Search bar prominently placed at the top with real-time search suggestions
- Spacious whitespace ensuring content clarity and reducing visual clutter
- Pagination controls or infinite scroll at the bottom of the medicine listing page
- Admin dashboard with sidebar navigation and main content area displaying widgets and charts
- Mobile-first responsive design ensuring optimal experience across all devices

## 10. Reference Images
- **image.png**: Product listing page design reference showing card-based layout, filters, ratings, and pricing display