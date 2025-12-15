# Online Medicine Website Requirements Document
\n## 1. Website Name\nMediCare Online Pharmacy

## 2. Website Description
An online medicine platform that enables users to conveniently browse, search, and purchase medicines while providing administrators with comprehensive management capabilities through an enhanced admin dashboard. The website emphasizes user convenience, secure transactions, streamlined inventory updates, and rich interactive features. Medicine data is retrieved from Supabase database.

## 3. Core Features

### 3.1 User Features
- **User Registration & Login**: Allow users to create accounts and securely log in to access personalized services
- **Medicine Search & Browse**: Enable users to search for medicines by name, category, manufacturer, or composition, and browse through organized medicine catalogs retrieved from Supabase database. Each medicine listing displays information from the medicine_data table. Search functionality is optimized for fast performance across large dataset
- **Shopping Cart Management**: Users can add medicines to cart, modify quantities, and remove items before checkout
- **Order Management**: Users can place orders, view order history, track order status, and manage their purchases
- **Contact Form**: Users can submit inquiries or feedback through a contact form. Form submissions will be stored in the database and automatically sent via email to vinod826870@gmail.com
- **Wishlist**: Users can save medicines to a wishlist for future reference and easy access
- **Product Reviews & Ratings**: Users can rate and review purchased medicines to help other customers make informed decisions
- **Medicine Comparison**: Users can compare up to 4 medicines side-by-side based on price, composition, manufacturer, and other attributes
- **Health Blog**: Access informative articles about health tips, medicine usage guidelines, and wellness advice
- **Prescription Upload**: Users can upload prescription images for verification before purchasing prescription medicines
- **Order Tracking**: Real-time order tracking with status updates from order placement to delivery
- **User Profile Management**: Users can update personal information, manage addresses, view order history, and track loyalty points

### 3.2 Admin Features
\n#### 3.2.1 Enhanced Admin Dashboard
- **Dashboard Overview**: Comprehensive dashboard displaying key metrics including:
  - Total sales revenue (daily, weekly, monthly)
  - Number of orders (pending, processing, completed, cancelled)
  - Total registered users and new user registrations
  - Low stock alerts and out-of-stock items count
  - Top-selling medicines and categories
  - Revenue charts and sales trends visualization
  - Recent customer reviews and ratings summary
\n#### 3.2.2 Inventory Management
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
- **Blog Management**: Create, edit, and publish health-related blog articles
- **Banner Management**: Manage homepage banners and promotional slides
- **Category Management**: Add, edit, or remove medicine categories
\n#### 3.2.6 Analytics & Reports
- **Sales Reports**: Generate detailed sales reports by date range, category, or product
- **Customer Analytics**: Analyze customer demographics, behavior, and preferences
- **Inventory Reports**: Track stock movement, turnover rates, and inventory valuation
- **Revenue Analytics**: Monitor revenue streams, profit margins, and financial performance

#### 3.2.7 Settings & Configuration
- **Payment Settings**: Configure Stripe payment gateway settings
- **Email Settings**: Manage email templates and notification preferences
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
- Implement optimized search functionality with the following features:\n  - Search across name, manufacturer_name, short_composition1, and salt_composition fields
  - Use indexed queries for fast search performance
  - Implement debouncing to reduce API calls during typing
  - Support partial matching and case-insensitive search\n- Enable category filtering based on the type column with dynamic category list generation
- Support pagination for efficient loading of large dataset (recommended page size: 20-50 items)
- Implement lazy loading or infinite scroll for smooth user experience
- Add loading states and skeleton screens while data is being fetched\n\n### 4.5 Search Optimization
- Utilize Supabase full-text search capabilities for faster query results
- Implement client-side caching to reduce repeated API calls
- Use query parameters for filtering and sorting to minimize data transfer
- Consider implementing search result ranking based on relevance\n\n## 5. Medicine Categories
The platform will organize medicines based on the'type' column in the medicine_data table, covering various medicine categories dynamically retrieved from the database. Category filters will be displayed in the sidebar for easy navigation.\n
## 6. Payment Configuration

### 6.1 Stripe Payment Integration
- **Payment Method**: Stripe payment gateway integration for secure online transactions
- **STRIPE_SECRET_KEY**: The Stripe secret key should be securely stored in environment variables for payment processing authentication
- **Usage**: This key enables the platform to process payments, handle refunds, and manage transaction records through Stripe API
- **Implementation**: Configure Stripe checkout for cart payment processing, supporting major credit/debit cards\n
## 7. Email Configuration
- **Email Service API Key**: re_cSADr4hj_Lqc4T5x8j92whgXu1RhAxAmC
- **Usage**: This API key should be configured in the email service integration to enable automated email sending functionality
- **Trigger Point**: When users submit the contact form, the system will use this API key to authenticate with the email service and send form submissions to vinod826870@gmail.com\n- **Implementation**: The API key should be securely stored in environment variables and used for email service authentication during contact form submission processing

## 8. Additional Pages\n\n### 8.1 User-Facing Pages
- **Homepage**: Featured medicines, promotional banners, trending products, and category highlights
- **Product Listing Page**: Grid/list view of medicines with filters, sorting, and pagination (reference design from image.png)
- **Product Detail Page**: Detailed medicine information including composition, usage, side effects, reviews, and related products
- **Shopping Cart Page**: Cart summary with quantity adjustment and checkout button
- **Checkout Page**: Order summary, shipping address, payment method selection\n- **Order Confirmation Page**: Order details and tracking information
- **User Dashboard**: Profile management, order history, wishlist, and saved addresses
- **Wishlist Page**: Saved medicines for future purchase
- **Compare Page**: Side-by-side comparison of selected medicines
- **Blog Page**: Health articles and wellness tips
- **About Us Page**: Company information and mission statement\n- **Contact Us Page**: Contact form and customer support information
- **FAQ Page**: Frequently asked questions about ordering, shipping, and returns

### 8.2 Admin Pages
- **Admin Login Page**: Secure login for administrators\n- **Dashboard Home**: Overview with key metrics and charts
- **Inventory Management Page**: Medicine list with add/edit/delete functionality
- **Order Management Page**: Order list with status update and filtering options
- **Customer Management Page**: User list and customer details
- **Analytics Page**: Sales reports, revenue charts, and performance metrics
- **Blog Management Page**: Create and manage blog posts
- **Settings Page**: System configuration and preferences
\n## 9. Design Style

### 9.1 Color Scheme
- Primary color: Clean medical blue (#2E86DE) conveying trust and professionalism
- Secondary color: Soft green (#27AE60) representing health and wellness
- Background: Light gray (#F5F6FA) for comfortable reading
- Accent color: Warm orange (#E67E22) for call-to-action buttons
\n### 9.2 Visual Details
- Rounded corners (8px radius) for cards and buttons creating a friendly, approachable feel
- Subtle shadows (02px 8px rgba(0,0,0,0.1)) for depth and hierarchy
- Clean, sans-serif typography for easy readability
- Medicine product cards displaying name, price, manufacturer, type, pack size, and composition from database
- Loading states with skeleton screens while data is being fetched from Supabase
- Hover effects on cards for better interactivity
- Star ratings display for product reviews
- Badge indicators for 'Best Seller', 'New Arrival', and discount percentages

### 9.3 Layout\n- Card-based grid layout for medicine listings (3-4 columns on desktop, responsive on mobile) as shown in image.png
- Fixed navigation bar at top for quick access to search, cart, and user account
- Sidebar filters based on medicine type for efficient discovery and category navigation
- Search bar prominently placed at the top with real-time search suggestions
- Spacious whitespace ensuring content clarity and reducing visual clutter
- Pagination controls or infinite scroll at the bottom of the medicine listing page
- Admin dashboard with sidebar navigation and main content area displaying widgets and charts

## 10. Reference Images
- **image.png**: Product listing page design reference showing card-based layout, filters, ratings, and pricing display