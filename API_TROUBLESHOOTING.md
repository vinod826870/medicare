# 🔧 API Troubleshooting Guide

## Issue: No Medicines Showing When Searching

If you search for medicines and see "0 found" or no results, follow these steps:

---

## ✅ Step 1: Check Browser Console

1. **Open Browser DevTools** (Press F12)
2. **Go to Console tab**
3. **Search for a medicine** (e.g., "paracetamol")
4. **Look for these messages:**

### Expected Console Output:
```
Fetching from API for: paracetamol
API returned 10 medicines
```

### If You See Errors:
```
Error calling Edge Function: ...
Edge Function error: ...
```

This means the Edge Function is not responding correctly.

---

## ✅ Step 2: Check Network Tab

1. **Open Browser DevTools** (Press F12)
2. **Go to Network tab**
3. **Search for a medicine**
4. **Look for request to:** `fetch-medicines`

### Expected Request:
```
Request URL: https://[your-project].supabase.co/functions/v1/fetch-medicines?action=search&search=paracetamol
Status: 200 OK
```

### Check Response:
Click on the request and view the Response tab:

**Expected Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "rx-161",
      "name": "Acetaminophen",
      "image_url": "https://rximage.nlm.nih.gov/...",
      "rxcui": "161",
      ...
    }
  ]
}
```

### If Status is 401 Unauthorized:
- Check that your Supabase environment variables are correct
- Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env`

### If Status is 500 Internal Server Error:
- The Edge Function has an error
- Check Edge Function logs in Supabase Dashboard

---

## ✅ Step 3: Verify Environment Variables

Check your `.env` file:

```bash
VITE_SUPABASE_URL=https://[your-project].supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### How to Get These Values:

1. **Go to Supabase Dashboard**
2. **Select your project**
3. **Go to Settings → API**
4. **Copy:**
   - Project URL → `VITE_SUPABASE_URL`
   - anon/public key → `VITE_SUPABASE_ANON_KEY`

### After Updating .env:

```bash
# Restart the development server
# The server should restart automatically
```

---

## ✅ Step 4: Check Edge Function Status

1. **Go to Supabase Dashboard**
2. **Navigate to Edge Functions**
3. **Find `fetch-medicines` function**
4. **Check Status:** Should be "Active"

### If Function is Not Deployed:

The function should already be deployed. If not, it will be deployed automatically when needed.

---

## ✅ Step 5: Test Edge Function Directly

Test the Edge Function directly using curl or browser:

```bash
# Replace [YOUR_PROJECT_URL] and [YOUR_ANON_KEY] with your values

# Test popular medicines
curl "https://[YOUR_PROJECT_URL]/functions/v1/fetch-medicines?action=popular" \
  -H "Authorization: Bearer [YOUR_ANON_KEY]"

# Test search
curl "https://[YOUR_PROJECT_URL]/functions/v1/fetch-medicines?action=search&search=paracetamol" \
  -H "Authorization: Bearer [YOUR_ANON_KEY]"
```

### Expected Response:
```json
{
  "success": true,
  "data": [...]
}
```

### If You Get Error:
```json
{
  "success": false,
  "error": "..."
}
```

Check the error message for details.

---

## ✅ Step 6: Check RxNorm API Availability

The Edge Function calls the RxNorm API. Let's verify it's working:

### Test RxNorm API Directly:

Open this URL in your browser:
```
https://rxnav.nlm.nih.gov/REST/drugs.json?name=paracetamol
```

### Expected Response:
You should see JSON data with drug information.

### If RxNorm API is Down:
- This is rare, but the NIH servers might be temporarily unavailable
- Wait a few minutes and try again
- Check https://rxnav.nlm.nih.gov/ to see if the service is up

---

## ✅ Step 7: Clear Cache

The application caches API results for 10 minutes. To clear the cache:

1. **Hard refresh the page:**
   - Windows/Linux: `Ctrl + Shift + R`
   - Mac: `Cmd + Shift + R`

2. **Or clear browser cache:**
   - Open DevTools (F12)
   - Right-click the refresh button
   - Select "Empty Cache and Hard Reload"

---

## ✅ Step 8: Check for CORS Errors

### In Browser Console, Look For:
```
Access to fetch at '...' from origin '...' has been blocked by CORS policy
```

### If You See CORS Errors:

This shouldn't happen because we're using an Edge Function to bypass CORS. But if it does:

1. **Verify the Edge Function is deployed**
2. **Check that you're calling the Edge Function, not the NIH APIs directly**
3. **Verify the Edge Function has CORS headers** (it should)

---

## 🐛 Common Issues and Solutions

### Issue 1: "0 medicines found" but no errors

**Cause:** The search term might not match any medicines in the RxNorm database.

**Solution:** Try these searches that definitely work:
- `paracetamol` or `acetaminophen`
- `ibuprofen`
- `aspirin`
- `amoxicillin`
- `metformin`

### Issue 2: Images not loading

**Cause:** RxImage API might not have images for all medicines.

**Solution:** This is normal. The app shows a default image when no actual drug image is available.

### Issue 3: Slow loading

**Cause:** The Edge Function needs to call multiple APIs (RxNorm + RxImage for each medicine).

**Solution:** 
- First search is slower (10-20 seconds)
- Subsequent searches use cache (instant)
- This is expected behavior

### Issue 4: Environment variables not working

**Cause:** `.env` file not loaded or incorrect format.

**Solution:**
1. Verify `.env` file is in the root directory
2. Check that variables start with `VITE_`
3. Restart the development server
4. Hard refresh the browser

---

## 📊 Debug Checklist

Before asking for help, verify:

- [ ] Browser console shows no errors
- [ ] Network tab shows request to `fetch-medicines`
- [ ] Request returns status 200
- [ ] Response has `"success": true`
- [ ] Response has `"data"` array
- [ ] Environment variables are set correctly
- [ ] Edge Function is deployed and active
- [ ] RxNorm API is accessible
- [ ] Cache has been cleared
- [ ] Using a known medicine name (paracetamol, ibuprofen, etc.)

---

## 🆘 Still Not Working?

### Check Edge Function Logs:

1. **Go to Supabase Dashboard**
2. **Navigate to Edge Functions**
3. **Click on `fetch-medicines`**
4. **View Logs**
5. **Look for errors**

### Common Log Errors:

**"RxNorm API error: 404"**
- The medicine name doesn't exist in RxNorm database
- Try a different search term

**"Could not fetch image for rxcui: ..."**
- This is normal - not all medicines have images
- Default image will be used

**"Error searching medicines: ..."**
- Check the specific error message
- Might be a network issue or API timeout

---

## ✅ Quick Fix Commands

```bash
# 1. Verify environment variables
cat .env

# 2. Check if variables are loaded
echo $VITE_SUPABASE_URL

# 3. Restart development server
# (Server should restart automatically when you save files)

# 4. Clear npm cache (if needed)
npm cache clean --force

# 5. Reinstall dependencies (if needed)
rm -rf node_modules
npm install
```

---

## 🧪 Test API Integration

### Test 1: Load Medicines Page
1. Navigate to `/medicines`
2. Should see popular medicines automatically
3. If you see "0 medicines found", there's an issue

### Test 2: Search for "paracetamol"
1. Type "paracetamol" in search box
2. Press Enter
3. Should see results within 10-20 seconds
4. Check console for logs

### Test 3: Check Network Request
1. Open DevTools → Network tab
2. Search for a medicine
3. Find `fetch-medicines` request
4. Verify status 200 and response data

---

## 📞 Getting Help

If you're still having issues, provide:

1. **Browser console errors** (screenshot or copy-paste)
2. **Network tab screenshot** showing the `fetch-medicines` request
3. **Edge Function logs** from Supabase Dashboard
4. **Environment variables** (hide sensitive parts)
5. **Search term used** (e.g., "paracetamol")
6. **Expected vs actual behavior**

---

## 🎯 Expected Behavior

### When Everything Works:

1. **Load Medicines Page:**
   - Shows popular medicines automatically
   - 10-20 medicines displayed
   - All with images (real or default)

2. **Search for "paracetamol":**
   - Takes 10-20 seconds (first time)
   - Returns 5-20 results
   - Shows "Acetaminophen" and related products
   - All with images

3. **Search for "ibuprofen":**
   - Uses cache if searched recently (instant)
   - Returns multiple ibuprofen products
   - Different strengths and formulations

4. **Click Medicine Card:**
   - Opens detail page
   - Shows large image
   - Displays complete information

---

**🔧 Follow these steps and your API integration should work perfectly!**

**💊 Real medicines from NIH! 🖼️ Actual drug images! 🌐 Working API!**
