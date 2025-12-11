# 🔧 Email Troubleshooting Guide

## Issue: Not Receiving Emails

Your contact form has been updated with detailed logging to help diagnose email issues.

---

## ✅ What's Been Fixed

### 1. Enhanced Error Handling
- Better error messages in console
- Email status feedback to user
- Detailed logging in Edge Function

### 2. Improved Edge Function
- Logs every step of the process
- Shows API key status
- Displays Resend API responses
- Clear error messages

### 3. Updated Contact Form
- Shows email success/failure status
- Logs submission details
- Better user feedback

---

## 🔍 How to Debug

### Step 1: Submit a Test Form

1. Go to your website
2. Navigate to `/contact`
3. Fill out the form with test data
4. Click "Send Message"
5. **Open Browser Console** (Press F12)

### Step 2: Check Browser Console

Look for these messages:

```
✅ Good Signs:
- "Contact submission saved to database: {...}"
- "Email notification sent successfully"
- Toast: "Message sent successfully! Email notification sent to admin."

⚠️ Warning Signs:
- "Email notification failed: ..."
- Toast: "Message saved! (Email notification pending)"
- Any error messages
```

### Step 3: Check Supabase Edge Function Logs

1. Go to Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Navigate to: **Edge Functions** → **send_contact_email** → **Logs**
4. Look for the latest execution

**What to Look For:**

```
✅ Success Logs:
=== send_contact_email Edge Function called ===
Received submission: {...}
Admin email: vinod826870@gmail.com
API key configured: YES
API key length: 41
Attempting to send email via Resend API...
Resend API response status: 200
Email sent successfully via Resend: {...}

⚠️ Problem Logs:
API key configured: NO
⚠️ RESEND_API_KEY not configured
Resend API response status: 401 (or other error)
Resend API error response: {...}
```

---

## 🔑 Verify API Key Configuration

### Check if API Key is Set

Run this test in your browser console after submitting a form:

1. Open browser console (F12)
2. Submit contact form
3. Look for log: "API key configured: YES" or "NO"

### If API Key Shows "NO"

The API key might not be properly configured. Let me verify:

**Your API Key:** `re_cSADr4hj_Lqc4T5x8j92whgXu1RhAxAmC`

**To Re-add the API Key:**

1. Go to Supabase Dashboard
2. Navigate to: **Project Settings** → **Edge Functions** → **Secrets**
3. Look for `RESEND_API_KEY`
4. If it exists, verify the value
5. If it doesn't exist, add it:
   - Name: `RESEND_API_KEY`
   - Value: `re_cSADr4hj_Lqc4T5x8j92whgXu1RhAxAmC`

---

## 📧 Verify Resend Account

### Check Resend Dashboard

1. Log in to https://resend.com
2. Go to "Emails" section
3. Check if any emails were sent
4. Look for error messages

### Verify API Key

1. Go to "API Keys" section in Resend
2. Check if your API key is active
3. Verify it hasn't been revoked
4. Check usage limits

---

## 🧪 Test Email Sending Directly

### Test 1: Check Database

```sql
-- Run this in Supabase SQL Editor
SELECT * FROM contact_submissions 
ORDER BY created_at DESC 
LIMIT 5;
```

**Expected:** You should see your test submissions

### Test 2: Check Edge Function Logs

1. Supabase Dashboard → Edge Functions → send_contact_email → Logs
2. Look for recent executions
3. Check for errors

### Test 3: Manual API Test

You can test the Resend API directly:

```bash
curl -X POST 'https://api.resend.com/emails' \
  -H 'Authorization: Bearer re_cSADr4hj_Lqc4T5x8j92whgXu1RhAxAmC' \
  -H 'Content-Type: application/json' \
  -d '{
    "from": "MediCare <onboarding@resend.dev>",
    "to": "vinod826870@gmail.com",
    "subject": "Test Email",
    "html": "<p>This is a test email</p>"
  }'
```

**Expected Response:**
```json
{
  "id": "some-email-id",
  "from": "MediCare <onboarding@resend.dev>",
  "to": "vinod826870@gmail.com",
  "created_at": "2024-..."
}
```

---

## 🚨 Common Issues & Solutions

### Issue 1: API Key Not Configured

**Symptoms:**
- Edge Function logs show: "API key configured: NO"
- Console shows: "Email logged (no API key configured)"

**Solution:**
1. Go to Supabase Dashboard
2. Project Settings → Edge Functions → Secrets
3. Add `RESEND_API_KEY` with value: `re_cSADr4hj_Lqc4T5x8j92whgXu1RhAxAmC`
4. Wait 1-2 minutes for changes to propagate
5. Test again

### Issue 2: Resend API Error 401 (Unauthorized)

**Symptoms:**
- Edge Function logs show: "Resend API response status: 401"
- Error: "Unauthorized"

**Solution:**
1. Verify API key is correct
2. Check if API key is active in Resend dashboard
3. Make sure there are no extra spaces in the API key
4. Try regenerating the API key in Resend

### Issue 3: Resend API Error 429 (Rate Limit)

**Symptoms:**
- Edge Function logs show: "Resend API response status: 429"
- Error: "Too many requests"

**Solution:**
- You've hit the rate limit (100 emails/day on free tier)
- Wait 24 hours for limit to reset
- Check Resend dashboard for usage stats

### Issue 4: Email Goes to Spam

**Symptoms:**
- Email sent successfully (logs show 200 status)
- But not in inbox

**Solution:**
1. Check spam/junk folder
2. Add sender to contacts
3. Mark as "Not Spam"
4. Check email filters

### Issue 5: Edge Function Not Called

**Symptoms:**
- No logs in Edge Function
- Form submits but nothing happens

**Solution:**
1. Check browser console for errors
2. Verify Supabase connection
3. Check network tab for failed requests
4. Verify Edge Function is deployed

---

## 📊 Expected Flow

### Successful Email Flow

```
1. User submits form
   ↓
2. Browser Console:
   "Contact submission saved to database: {...}"
   ↓
3. Edge Function Logs:
   "=== send_contact_email Edge Function called ==="
   "API key configured: YES"
   "Attempting to send email via Resend API..."
   "Resend API response status: 200"
   "Email sent successfully via Resend: {...}"
   ↓
4. Browser Console:
   "Email notification sent successfully"
   ↓
5. User sees toast:
   "Message sent successfully! Email notification sent to admin."
   ↓
6. Email arrives at vinod826870@gmail.com
```

---

## 🔍 Detailed Debugging Steps

### Step-by-Step Debugging

1. **Submit Form**
   - Fill out contact form
   - Click "Send Message"

2. **Check Browser Console (F12)**
   ```
   Look for:
   - "Contact submission saved to database"
   - "Email notification sent successfully" OR error message
   ```

3. **Check Supabase Edge Function Logs**
   ```
   Dashboard → Edge Functions → send_contact_email → Logs
   
   Look for:
   - "Edge Function called"
   - "API key configured: YES/NO"
   - "Resend API response status: 200" (success)
   - Any error messages
   ```

4. **Check Resend Dashboard**
   ```
   https://resend.com → Emails
   
   Look for:
   - Recent email sent
   - Delivery status
   - Any errors
   ```

5. **Check Email Inbox**
   ```
   vinod826870@gmail.com
   
   Check:
   - Inbox
   - Spam folder
   - All mail
   ```

---

## 📞 What to Check Right Now

### Immediate Checks

1. **Browser Console**
   - Open your website
   - Press F12
   - Submit a contact form
   - Look for error messages

2. **Supabase Logs**
   - Go to Supabase Dashboard
   - Edge Functions → send_contact_email → Logs
   - Check latest execution
   - Copy any error messages

3. **Resend Dashboard**
   - Log in to https://resend.com
   - Check "Emails" section
   - Verify API key is active

---

## 📧 Contact Form Status

### Current Configuration

- ✅ Database: Working (submissions saved)
- ✅ Edge Function: Deployed with enhanced logging
- ✅ API Key: Configured (re_cSADr4hj_Lqc4T5x8j92whgXu1RhAxAmC)
- ✅ Admin Email: vinod826870@gmail.com
- ✅ Error Handling: Enhanced
- ✅ Logging: Detailed

### What to Do Next

1. **Submit a test form**
2. **Check browser console** for errors
3. **Check Supabase Edge Function logs**
4. **Check Resend dashboard**
5. **Check email inbox (including spam)**

---

## 🆘 If Still Not Working

### Collect This Information

1. **Browser Console Output**
   - Copy all messages after form submission
   - Include any errors

2. **Edge Function Logs**
   - Copy the latest execution logs
   - Include full error messages

3. **Resend Dashboard Status**
   - Screenshot of Emails section
   - API key status

4. **Form Submission Details**
   - What data you entered
   - What message you saw
   - What happened after submission

---

## ✅ Quick Checklist

- [ ] Form submits successfully
- [ ] Database entry created
- [ ] Browser console shows "Email notification sent successfully"
- [ ] Edge Function logs show "API key configured: YES"
- [ ] Edge Function logs show "Resend API response status: 200"
- [ ] Resend dashboard shows email sent
- [ ] Email received at vinod826870@gmail.com

---

## 🎯 Next Steps

1. **Test the form now** with the enhanced logging
2. **Check browser console** for detailed error messages
3. **Check Supabase Edge Function logs** for API key status
4. **Verify Resend API key** is active and correct
5. **Check email inbox** (including spam folder)

The enhanced logging will help us identify exactly where the issue is!

---

**The system is now configured with detailed logging to help diagnose the email issue.** 🔍

Submit a test form and check the logs to see what's happening!
