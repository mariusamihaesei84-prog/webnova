# Vercel Environment Variables Setup

## Required Environment Variables

Add these in Vercel Dashboard → Settings → Environment Variables:

### 1. Convex URL (Public - expus în browser)
```
NEXT_PUBLIC_CONVEX_URL=https://opulent-elk-138.convex.cloud
```
**Environments:** Production, Preview, Development

### 2. Google Gemini API Key (Private - server-side only)
```
GOOGLE_GEMINI_API_KEY=<your-api-key-here>
```
**Environments:** Production, Preview, Development

### 3. Google Indexing API Key (Optional - pentru auto-indexing)
```
GOOGLE_INDEXING_KEY=<service-account-json>
```
**Environments:** Production

---

## How to Add in Vercel:

1. Go to: https://vercel.com/dashboard
2. Select your **webnova** project
3. Navigate to **Settings** → **Environment Variables**
4. Click **Add New**
5. Enter:
   - Name: `NEXT_PUBLIC_CONVEX_URL`
   - Value: `https://opulent-elk-138.convex.cloud`
   - Environments: Check all (Production, Preview, Development)
6. Click **Save**
7. Repeat for `GOOGLE_GEMINI_API_KEY`

---

## After Adding Variables:

Vercel will automatically trigger a new deployment. 
If not, you can manually trigger one:

```bash
git commit --allow-empty -m "Trigger Vercel redeploy after env vars"
git push
```

Or click **Redeploy** in Vercel Dashboard.

---

## Verify Setup:

Once deployed, check:
- ✅ Build succeeds
- ✅ No "No address provided to ConvexReactClient" error
- ✅ App loads at your-domain.vercel.app
