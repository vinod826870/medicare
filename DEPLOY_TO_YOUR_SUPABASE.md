# 🚀 Deploy Edge Function to Your Supabase Account

## ⚠️ Important Notice

The Edge Function needs to be deployed to **YOUR** Supabase project:
- **Your Project**: `vbslaaisgoiwvkymaohu.supabase.co`
- **Current Status**: Edge Function not deployed to your account yet

---

## 📋 Prerequisites

1. **Supabase CLI** installed
2. **Your Supabase credentials** (already in `.env`)
3. **Terminal access**

---

## 🔧 Step-by-Step Deployment

### Step 1: Install Supabase CLI

```bash
# Using npm
npm install -g supabase

# Or using homebrew (Mac)
brew install supabase/tap/supabase
```

### Step 2: Login to Supabase

```bash
supabase login
```

This will open a browser window. Login with your Supabase account.

### Step 3: Link Your Project

```bash
cd /workspace/app-84tul5br4fsx
supabase link --project-ref vbslaaisgoiwvkymaohu
```

When prompted, enter your database password.

### Step 4: Deploy the Edge Function

```bash
supabase functions deploy fetch-medicines
```

### Step 5: Verify Deployment

```bash
supabase functions list
```

You should see `fetch-medicines` in the list with status `ACTIVE`.

---

## ✅ Test the Deployment

After deployment, test the API:

```bash
curl "https://vbslaaisgoiwvkymaohu.supabase.co/functions/v1/fetch-medicines?action=popular" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZic2xhYWlzZ29pd3ZreW1hb2h1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU1MTYyODcsImV4cCI6MjA4MTA5MjI4N30.aDbk9vpF374nxXZpL36SYeBYhmWeZmaUthtEu_7jLVs"
```

Expected response:
```json
{
  "success": true,
  "data": [...]
}
```

---

## 🎯 Alternative: Deploy via Supabase Dashboard

If you prefer using the web interface:

1. Go to https://supabase.com/dashboard/project/vbslaaisgoiwvkymaohu
2. Click on **Edge Functions** in the left sidebar
3. Click **New Function**
4. Name it: `fetch-medicines`
5. Copy the code from `supabase/functions/fetch-medicines/index.ts`
6. Click **Deploy**

---

## 🔍 Troubleshooting

### Error: "Project not linked"

```bash
supabase link --project-ref vbslaaisgoiwvkymaohu
```

### Error: "Function already exists"

```bash
supabase functions delete fetch-medicines
supabase functions deploy fetch-medicines
```

### Error: "Authentication failed"

```bash
supabase logout
supabase login
```

---

## 📝 Edge Function Code

The Edge Function code is located at:
```
supabase/functions/fetch-medicines/index.ts
```

It includes:
- ✅ Comprehensive CORS headers
- ✅ OpenFDA, RxNorm, DailyMed API integration
- ✅ Image fetching from RxImage API
- ✅ Error handling
- ✅ Caching support

---

## 🎉 After Deployment

Once deployed, your application will:
- ✅ Work without CORS errors
- ✅ Fetch real medicine data from government APIs
- ✅ Display actual medicine images
- ✅ Work on localhost and production

---

**Need help? Check the Supabase CLI documentation: https://supabase.com/docs/guides/cli**
