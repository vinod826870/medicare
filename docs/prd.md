# Online Medicine Website Requirements Document
\n## 1. Website Name\nMediCare Online Pharmacy

## 2. Website Description
An online medicine platform that enables users to conveniently browse, search, and purchase medicines while providing administrators with efficient stock management capabilities. The website emphasizes user convenience, secure transactions, and streamlined inventory updates. Medicine data is retrieved from Supabase database.

## 3. Core Features

### 3.1 User Features
- **User Registration & Login**: Allow users to create accounts and securely log in to access personalized services
- **Medicine Search & Browse**: Enable users to search for medicines by name, category, manufacturer, or composition, and browse through organized medicine catalogs retrieved from Supabase database. Each medicine listing displays information from the medicine_data table. Search functionality is optimized for fast performance across large dataset\n- **Shopping Cart Management**: Users can add medicines to cart, modify quantities, and remove items before checkout
- **Order Management**: Users can place orders, view order history, track order status, and manage their purchases
- **Contact Form**: Users can submit inquiries or feedback through a contact form. Form submissions will be stored in the database and automatically sent via email to vinod826870@gmail.com\n
### 3.2 Admin Features
- **Stock Management**: Administrators can monitor inventory status and manage stock information from the medicine_data table
- **Order Processing**: View and manage customer orders, update order status
- **Contact Form Management**: View and manage user inquiries submitted through the contact form
\n## 4. Medicine Data Source

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

### 4.3 Table Structure\nCreate database table name: medicine_data

Table columns:\n- **id**: Unique identifier for each medicine
- **name**: Medicine name
- **price**: Medicine price
- **Is_discontinued**: Status indicating if the medicine is discontinued
- **manufacturer_name**: Name of the manufacturer
- **type**: Medicine type/category
- **pack_size_label**: Package size information
- **short_composition1**: Brief composition description
- **salt_composition**: Detailed salt composition
- **side_effects**: Known side effects
- **drug_interactions**: Drug interaction information

### 4.4 Data Display Requirements
- Display medicine data in card-based layout with each card showing key information from the table columns
- Fetch data through Supabase API integration using RESTful API calls
- Implement optimized search functionality with the following features:
  - Search across name, manufacturer_name, short_composition1, and salt_composition fields
  - Use indexed queries for fast search performance
  - Implement debouncing to reduce API calls during typing
  - Support partial matching and case-insensitive search
- Enable category filtering based on the type column with dynamic category list generation
- Support pagination for efficient loading of large dataset (recommended page size: 20-50 items)
- Implement lazy loading or infinite scroll for smooth user experience\n- Add loading states and skeleton screens while data is being fetched

### 4.5 Search Optimization
- Utilize Supabase full-text search capabilities for faster query results
- Implement client-side caching to reduce repeated API calls
- Use query parameters for filtering and sorting to minimize data transfer
- Consider implementing search result ranking based on relevance

## 5. Medicine Categories
The platform will organize medicines based on the 'type' column in the medicine_data table, covering various medicine categories dynamically retrieved from the database. Category filters will be displayed in the sidebar for easy navigation.

## 6. Payment Configuration

### 6.1 Stripe Payment Integration
- **Payment Method**: Stripe payment gateway integration for secure online transactions
- **STRIPE_SECRET_KEY**: The Stripe secret key should be securely stored in environment variables for payment processing authentication
- **Usage**: This key enables the platform to process payments, handle refunds, and manage transaction records through Stripe API
- **Implementation**: Configure Stripe checkout for cart payment processing, supporting major credit/debit cards

## 7. Email Configuration
- **Email Service API Key**: re_cSADr4hj_Lqc4T5x8j92whgXu1RhAxAmC
- **Usage**: This API key should be configured in the email service integration to enable automated email sending functionality
- **Trigger Point**: When users submit the contact form, the system will use this API key to authenticate with the email service and send form submissions to vinod826870@gmail.com
- **Implementation**: The API key should be securely stored in environment variables and used for email service authentication during contact form submission processing

## 8. Design Style

### 8.1 Color Scheme\n- Primary color: Clean medical blue (#2E86DE) conveying trust and professionalism
- Secondary color: Soft green (#27AE60) representing health and wellness
- Background: Light gray (#F5F6FA) for comfortable reading
- Accent color: Warm orange (#E67E22) for call-to-action buttons

### 8.2 Visual Details
- Rounded corners (8px radius) for cards and buttons creating a friendly, approachable feel
- Subtle shadows (02px 8px rgba(0,0,0,0.1)) for depth and hierarchy
- Clean, sans-serif typography for easy readability
- Medicine product cards displaying name, price, manufacturer, type, pack size, and composition from database\n- Loading states with skeleton screens while data is being fetched from Supabase
- Hover effects on cards for better interactivity\n
### 8.3 Layout
- Card-based grid layout for medicine listings (3-4 columns on desktop, responsive on mobile)
- Fixed navigation bar at top for quick access to search, cart, and user account
- Sidebar filters based on medicine type for efficient discovery and category navigation
- Search bar prominently placed at the top with real-time search suggestions
- Spacious whitespace ensuring content clarity and reducing visual clutter
- Pagination controls or infinite scroll at the bottom of the medicine listing page