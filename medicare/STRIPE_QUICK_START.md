# 💳 Stripe Quick Start (3 Minutes)

## 🎓 100% FREE for College Students!

---

## Step 1: Create Stripe Account (1 minute)

1. Go to: **https://stripe.com**
2. Click **"Sign up"**
3. Enter your email and create password
4. ✅ **No credit card needed!**

---

## Step 2: Get FREE Test API Key (1 minute)

1. After signup, you're automatically in **TEST MODE** ✅
2. Go to: **Developers** → **API keys**
   - Or visit: https://dashboard.stripe.com/test/apikeys
3. Find **"Secret key"** (starts with `sk_test_`)
4. Click **"Reveal test key"**
5. **Copy the key** (it looks like: `sk_test_51Abc123...`)

---

## Step 3: Add to Supabase (1 minute)

1. Go to: **https://supabase.com/dashboard**
2. Select your project
3. Navigate to: **Project Settings** → **Edge Functions** → **Secrets**
4. Click **"Add new secret"**
5. Enter:
   - **Name:** `STRIPE_SECRET_KEY`
   - **Value:** (paste your `sk_test_...` key)
6. Click **"Save"**

---

## ✅ Done! Test It Now

### Test Payment:

1. Go to your website
2. Add items to cart
3. Click checkout
4. Select **"Stripe Checkout (Recommended)"**
5. Click **"Continue to Stripe Checkout"**
6. Use this **FREE test card:**

```
Card Number: 4242 4242 4242 4242
Expiry: 12/25 (any future date)
CVC: 123 (any 3 digits)
ZIP: 12345 (any 5 digits)
```

7. Click **"Pay"**
8. ✅ Payment successful!

---

## 💰 Cost: $0.00 (FREE!)

- ✅ Test mode is **100% FREE**
- ✅ Unlimited test transactions
- ✅ No credit card required
- ✅ No expiration
- ✅ Perfect for college projects!

---

## 🎯 More Test Cards

**Always Successful:**
- `4242 4242 4242 4242` - Visa

**Test Declined:**
- `4000 0000 0000 0002` - Card declined

**Full list:** https://stripe.com/docs/testing

---

## 🔧 Troubleshooting

### "Stripe is not configured"

**Fix:**
1. Verify you added `STRIPE_SECRET_KEY` to Supabase
2. Wait 1-2 minutes for changes to apply
3. Try again

### Can't find API key

**Fix:**
1. Make sure **TEST MODE** toggle is ON (top-right in Stripe Dashboard)
2. Go to **Developers** → **API keys**
3. Click **"Reveal test key"**

---

## 📚 Full Guide

For detailed instructions, see: **[STRIPE_SETUP_GUIDE.md](./STRIPE_SETUP_GUIDE.md)**

---

## ✨ What You Get

- ✅ Real Stripe checkout experience
- ✅ Professional payment processing
- ✅ Industry-standard security
- ✅ Perfect for college portfolio
- ✅ Used by Amazon, Google, Shopify

---

**🎓 Free for students! 💳 No credit card needed! 🚀 Ready in 3 minutes!**

**Test card: 4242 4242 4242 4242**
