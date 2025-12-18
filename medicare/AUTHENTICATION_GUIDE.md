# 🔐 Authentication Guide - MediCare Online Pharmacy

## How to Sign In

### Step 1: Register a New Account
Since this is a fresh installation, you need to **create an account first** before you can sign in.

1. **Go to the Register page**: `/register`
2. **Enter your email and password**
3. **Click "Sign Up"**
4. **Check your email** for a confirmation link (if email verification is enabled)
5. **Click the confirmation link** to verify your account

### Step 2: Sign In
After registering, you can sign in:

1. **Go to the Login page**: `/login`
2. **Enter your email and password**
3. **Click "Sign In"**
4. You'll be redirected to the home page

## 🎉 First User Becomes Admin

**IMPORTANT**: The **first user** who registers automatically becomes an **administrator** with full access to:
- Admin Dashboard (`/admin`)
- Medicine Management (`/admin/medicines`)
- Order Management (`/admin/orders`)
- User Management (`/admin/users`)

All subsequent users will have regular user access.

## User Roles

### Regular User
- Browse medicines
- Search and filter products
- Add items to cart
- Place orders
- View order history
- Update profile

### Administrator
- All user features PLUS:
- View admin dashboard with statistics
- View medicine catalog (read-only from FDA API)
- Manage all orders
- Manage user accounts
- Change user roles

## Quick Start

### Option 1: Register Through UI
1. Open the application
2. Click "Sign Up" or navigate to `/register`
3. Fill in your email and password
4. Submit the form
5. Verify your email (if required)
6. Sign in at `/login`

### Option 2: Direct Registration
Navigate directly to: `http://localhost:5173/register` (or your deployment URL)

## Troubleshooting

### "Cannot sign in" Error

**Problem**: You're trying to sign in without an account.

**Solution**: 
1. Go to `/register` first
2. Create a new account
3. Then return to `/login`

### Email Verification Required

If Supabase email verification is enabled:
1. Check your email inbox
2. Click the verification link
3. Then you can sign in

### Forgot Password

Currently, password reset is handled through the Supabase auth system:
1. Click "Forgot Password" on the login page (if available)
2. Enter your email
3. Check your email for reset link
4. Follow the instructions

### Account Already Exists

If you see "Account already exists":
1. Go to `/login` instead of `/register`
2. Use your existing credentials

## Demo Accounts

### Creating Test Accounts

For testing purposes, you can create multiple accounts:

**Admin Account** (First user):
- Email: `admin@medicare.com`
- Password: `Admin123!`
- Role: Automatically set to `admin`

**Regular User Account** (Second user):
- Email: `user@medicare.com`
- Password: `User123!`
- Role: Automatically set to `user`

**Note**: These are example credentials. Use your own secure passwords.

## Authentication Flow

```
1. User visits site
   ↓
2. Not authenticated → Redirected to Login
   ↓
3. No account? → Click "Sign Up" → Register page
   ↓
4. Fill registration form
   ↓
5. Submit → Account created
   ↓
6. Email verification (if enabled)
   ↓
7. Return to Login page
   ↓
8. Enter credentials
   ↓
9. Sign in successful → Redirected to Home
   ↓
10. Can now access protected features:
    - Cart
    - Orders
    - Profile
    - Admin panel (if admin)
```

## Protected Routes

These routes require authentication:
- `/cart` - Shopping cart
- `/orders` - Order history
- `/profile` - User profile
- `/admin/*` - Admin panel (requires admin role)

If you try to access these without signing in, you'll be redirected to `/login`.

## Security Features

### Password Requirements
- Minimum 6 characters (Supabase default)
- Recommended: Use strong passwords with:
  - Uppercase letters
  - Lowercase letters
  - Numbers
  - Special characters

### Session Management
- Sessions are managed by Supabase Auth
- Automatic session refresh
- Secure token storage
- Sign out clears all session data

### Role-Based Access Control
- User roles stored in `profiles` table
- Admin role checked before accessing admin routes
- Automatic role assignment on registration

## API Integration

The authentication system uses:
- **Supabase Auth**: For user authentication
- **miaoda-auth-react**: For login/register UI components
- **React Context**: For auth state management

## Common Issues

### 1. "User not found"
**Cause**: Account doesn't exist
**Solution**: Register a new account first

### 2. "Invalid credentials"
**Cause**: Wrong email or password
**Solution**: Double-check your credentials or reset password

### 3. "Email not confirmed"
**Cause**: Email verification pending
**Solution**: Check your email and click verification link

### 4. "Session expired"
**Cause**: Auth session timed out
**Solution**: Sign in again

### 5. "Cannot access admin panel"
**Cause**: User doesn't have admin role
**Solution**: Only the first registered user is admin. Contact admin to change your role.

## Changing User Roles

### As an Admin
1. Go to `/admin/users`
2. Find the user you want to modify
3. Click "Edit" or "Change Role"
4. Select new role (user/admin)
5. Save changes

### Programmatically
Admins can update user roles through the admin panel, which updates the `profiles` table.

## Email Configuration

If you want to customize email templates:
1. Go to Supabase Dashboard
2. Navigate to Authentication → Email Templates
3. Customize:
   - Confirmation email
   - Password reset email
   - Magic link email

## Testing Authentication

### Test Registration
```bash
# Navigate to register page
http://localhost:5173/register

# Fill form:
Email: test@example.com
Password: Test123!

# Submit and verify
```

### Test Login
```bash
# Navigate to login page
http://localhost:5173/login

# Fill form:
Email: test@example.com
Password: Test123!

# Submit
```

### Test Protected Routes
```bash
# Try accessing cart without auth
http://localhost:5173/cart
# Should redirect to /login

# Sign in first, then access
http://localhost:5173/cart
# Should show your cart
```

## Next Steps

1. **Register your admin account** (first user)
2. **Sign in** with your credentials
3. **Explore the application**:
   - Browse medicines from FDA API
   - Add items to cart
   - Place test orders
   - Access admin panel
4. **Create additional test users** if needed
5. **Customize user roles** through admin panel

---

**Need Help?**
- Check Supabase Auth documentation: https://supabase.com/docs/guides/auth
- Review the application logs for error messages
- Ensure Supabase is properly configured in `.env` file

**Status**: ✅ Authentication system is fully functional
**First Step**: Register a new account at `/register`
**Then**: Sign in at `/login`
