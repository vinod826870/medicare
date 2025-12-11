# MediCare Online Pharmacy

## 🎉 FULLY FUNCTIONAL - Complete E-Commerce Solution!

### ✅ Professional Payment System Added! 💳
**Perfect for college projects and demonstrations!**
- ✅ **Multiple Payment Methods** - Card, UPI, Cash on Delivery
- ✅ **Professional UI** - Secure checkout design with animations
- ✅ **Free Mock Payment** - No API keys or payment gateway needed
- ✅ **Complete Flow** - Cart → Payment → Order confirmation

### ✅ Complete Shopping Experience
The entire e-commerce flow is **fully working**:
- ✅ Add items to cart without errors
- ✅ Update quantities and remove items
- ✅ **Professional payment page with multiple options**
- ✅ View order history
- ✅ Track order status

**Important:** Clear your browser cache (Ctrl+Shift+Delete) and refresh the page to see the changes!

📖 **See [PAYMENT_DEMO_GUIDE.md](./PAYMENT_DEMO_GUIDE.md) for payment demo guide** ⭐ **NEW!**
📖 **See [CART_TESTING_GUIDE.md](./CART_TESTING_GUIDE.md) for cart testing**
📖 **See [COMPLETE_TESTING_GUIDE.md](./COMPLETE_TESTING_GUIDE.md) for full testing guide**

---

## 🚀 Quick Start

### ⚠️ IMPORTANT: First Time Setup
**Custom authentication forms with visible input fields and English language!**

1. **Register**: Navigate to `/register` and fill out the form:
   - Full Name
   - Email
   - Password (min 6 characters)
   - Confirm Password
2. **First User = Admin**: The first person to register automatically becomes an administrator
3. **Sign In**: Go to `/login` and enter your email and password
4. **Start Shopping**: Browse and search for real medicines from the FDA database

### ✨ Authentication Features
- ✅ **Visible Input Fields** - All form fields display properly
- ✅ **English Language** - No more Chinese text
- ✅ **Full Name Field** - Your name is saved to the database
- ✅ **Password Confirmation** - Ensures you typed your password correctly
- ✅ **Clear Error Messages** - Helpful feedback in English
- ✅ **Loading States** - Visual feedback during submission

### 💳 Payment Features
- ✅ **Credit/Debit Card** - Professional card payment interface
- ✅ **UPI Payment** - Indian UPI payment simulation
- ✅ **Cash on Delivery** - Pay when order arrives
- ✅ **Secure Design** - SSL badges and security indicators
- ✅ **Processing Animation** - Professional loading states
- ✅ **Success Confirmation** - Beautiful success animation
- ✅ **Pre-filled Demo Data** - Ready for instant demonstration

### 📞 Contact & Support Features ✅ EMAIL ACTIVE!
- ✅ **Contact Form** - Easy-to-use contact form with validation
- ✅ **Database Storage** - All submissions saved to database
- ✅ **Email Notifications** - Admin receives email for each submission (CONFIGURED!)
- ✅ **Pre-filled Fields** - Auto-fills name and email for logged-in users
- ✅ **Contact Information** - Email, phone, and business hours
- ✅ **FAQ Section** - Quick answers to common questions
- ✅ **Multiple Access Points** - Available from home page and footer
- ✅ **Responsive Design** - Works perfectly on all devices
- 📧 **Emails sent to:** vinod826870@gmail.com

### 🛒 Shopping Features
- ✅ **Add to Cart** - Successfully add medicines to your cart
- ✅ **Quantity Management** - Update quantities and remove items
- ✅ **Persistent Storage** - Cart items saved to database
- ✅ **Professional Checkout** - Multi-step checkout with payment
- ✅ **Order History** - View all your past orders
- ✅ **Order Tracking** - Track order status (pending/completed/cancelled)

### 📋 Complete Feature List
- ✅ **User Authentication** - Secure login and registration
- ✅ **Medicine Search** - Search real FDA medicines
- ✅ **Shopping Cart** - Add, update, remove items
- ✅ **Payment Gateway** - Multiple payment methods (mock)
- ✅ **Order Management** - View and track orders
- ✅ **Contact Support** - Contact form with FAQ section
- ✅ **Admin Dashboard** - Manage orders and view all users (admin only)

📖 **See [STRIPE_SETUP_GUIDE.md](./STRIPE_SETUP_GUIDE.md) for FREE Stripe setup** 💳 **PERFECT FOR COLLEGE!**
📖 **See [CORS_FIX.md](./CORS_FIX.md) for CORS error resolution** ✅ **FIXED!**
📖 **See [TEST_EMAIL_NOW.md](./TEST_EMAIL_NOW.md) for testing instructions** ⭐ **START HERE!**
📖 **See [EMAIL_TROUBLESHOOTING.md](./EMAIL_TROUBLESHOOTING.md) for debugging help** 🔧
📖 **See [EMAIL_READY.md](./EMAIL_READY.md) for email setup confirmation**
📖 **See [EMAIL_SETUP_GUIDE.md](./EMAIL_SETUP_GUIDE.md) for detailed setup guide**
📖 **See [PAYMENT_DEMO_GUIDE.md](./PAYMENT_DEMO_GUIDE.md) for payment demo**

## 🎉 Real Medicine API Integration

This application uses **real medicine data** from the **OpenFDA API** - a free, public database maintained by the U.S. Food and Drug Administration.

### ✨ Features
- 🔍 **Search Real Medicines**: Search for Tylenol, Naproxen, Aspirin, Ibuprofen, and thousands more
- 📊 **Official FDA Data**: Get accurate medicine information from FDA-approved drug labels
- 🏥 **Comprehensive Database**: Access 100,000+ prescription and OTC medicines
- 💯 **Completely Free**: No API key required, no subscription fees
- ⚡ **Smart Caching**: Fast performance with intelligent caching
- 🔐 **User Authentication**: Secure login with role-based access control

### 🔎 Try Searching For:
- Tylenol (pain relief)
- Naproxen (anti-inflammatory)
- Aspirin (pain reliever)
- Amoxicillin (antibiotic)
- Ibuprofen (pain relief)
- Metformin (diabetes)
- Omeprazole (acid reflux)

### 📚 Documentation
- **Quick Start**: [QUICK_START.md](./QUICK_START.md) - Get started in 3 steps
- **Authentication**: [AUTHENTICATION_GUIDE.md](./AUTHENTICATION_GUIDE.md) - Complete auth guide
- **FDA API**: [FDA_API_INTEGRATION.md](./FDA_API_INTEGRATION.md) - API integration details

## Project Info

## Project Directory

```
├── README.md # Documentation
├── components.json # Component library configuration
├── eslint.config.js # ESLint configuration
├── index.html # Entry file
├── package.json # Package management
├── postcss.config.js # PostCSS configuration
├── public # Static resources directory
│   ├── favicon.png # Icon
│   └── images # Image resources
├── src # Source code directory
│   ├── App.tsx # Entry file
│   ├── components # Components directory
│   ├── context # Context directory
│   ├── db # Database configuration directory
│   ├── hooks # Common hooks directory
│   ├── index.css # Global styles
│   ├── layout # Layout directory
│   ├── lib # Utility library directory
│   ├── main.tsx # Entry file
│   ├── routes.tsx # Routing configuration
│   ├── pages # Pages directory
│   ├── services # Database interaction directory
│   ├── types # Type definitions directory
├── tsconfig.app.json # TypeScript frontend configuration file
├── tsconfig.json # TypeScript configuration file
├── tsconfig.node.json # TypeScript Node.js configuration file
└── vite.config.ts # Vite configuration file
```

## Tech Stack

Vite, TypeScript, React, Supabase

## Development Guidelines

### How to edit code locally?

You can choose [VSCode](https://code.visualstudio.com/Download) or any IDE you prefer. The only requirement is to have Node.js and npm installed.

### Environment Requirements

```
# Node.js ≥ 20
# npm ≥ 10
Example:
# node -v   # v20.18.3
# npm -v    # 10.8.2
```

### Installing Node.js on Windows

```
# Step 1: Visit the Node.js official website: https://nodejs.org/, click download. The website will automatically suggest a suitable version (32-bit or 64-bit) for your system.
# Step 2: Run the installer: Double-click the downloaded installer to run it.
# Step 3: Complete the installation: Follow the installation wizard to complete the process.
# Step 4: Verify installation: Open Command Prompt (cmd) or your IDE terminal, and type `node -v` and `npm -v` to check if Node.js and npm are installed correctly.
```

### Installing Node.js on macOS

```
# Step 1: Using Homebrew (Recommended method): Open Terminal. Type the command `brew install node` and press Enter. If Homebrew is not installed, you need to install it first by running the following command in Terminal:
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
Alternatively, use the official installer: Visit the Node.js official website. Download the macOS .pkg installer. Open the downloaded .pkg file and follow the prompts to complete the installation.
# Step 2: Verify installation: Open Command Prompt (cmd) or your IDE terminal, and type `node -v` and `npm -v` to check if Node.js and npm are installed correctly.
```

### After installation, follow these steps:

```
# Step 1: Download the code package
# Step 2: Extract the code package
# Step 3: Open the code package with your IDE and navigate into the code directory
# Step 4: In the IDE terminal, run the command to install dependencies: npm i
# Step 5: In the IDE terminal, run the command to start the development server: npm run dev -- --host 127.0.0.1
# Step 6: if step 5 failed, try this command to start the development server: npx vite --host 127.0.0.1
```

### How to develop backend services?

Configure environment variables and install relevant dependencies.If you need to use a database, please use the official version of Supabase.

## Learn More

You can also check the help documentation: Download and Building the app（ [https://intl.cloud.baidu.com/en/doc/MIAODA/s/download-and-building-the-app-en](https://intl.cloud.baidu.com/en/doc/MIAODA/s/download-and-building-the-app-en)）to learn more detailed content.
