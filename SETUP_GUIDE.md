# WebNova.ro - Environment Setup Guide

## Required API Keys

### 1. Google Gemini API Key

**Unde obținem:**
- URL: https://aistudio.google.com/app/apikey

**Pași:**
1. Accesați link-ul de mai sus
2. Autentificați-vă cu contul Google
3. Click pe "Create API Key"
4. Copiați cheia generată

**Adăugare în .env.local:**
```bash
GOOGLE_GEMINI_API_KEY=AIzaSy...
```

---

### 2. Google Indexing API

**Unde configurăm:**
- Google Cloud Console: https://console.cloud.google.com

**Pași detaliați:**

#### Pas 1: Creare/Selectare Proiect
1. Accesați Google Cloud Console
2. Creați un proiect nou sau selectați unul existent
3. Notați Project ID

#### Pas 2: Activare Indexing API
1. Navigați la "APIs & Services" → "Library"
2. Căutați "Indexing API"
3. Click pe "Indexing API"
4. Click "Enable"

#### Pas 3: Creare Service Account
1. Navigați la "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "Service Account"
3. Furnizați detalii:
   - **Name:** webnova-indexing
   - **ID:** webnova-indexing (va fi generat automat)
   - **Description:** Service account for WebNova Indexing API
4. Click "Create and Continue"
5. În "Grant this service account access to project":
   - Rolul: Selectați "Project" → "Owner" (sau custom role cu permissions de Indexing API)
6. Click "Continue" → "Done"

#### Pas 4: Generare JSON Key
1. În lista de Service Accounts, găsiți contul creat
2. Click pe cele 3 puncte (⋮) → "Manage Keys"
3. Click "Add Key" → "Create New Key"
4. Selectați format: **JSON**
5. Click "Create"
6. Fișierul JSON va fi descărcat automat

#### Pas 5: Configurare în .env.local

Deschideți fișierul JSON descărcat. Va arăta astfel:

```json
{
  "type": "service_account",
  "project_id": "webnova-xxxxx",
  "private_key_id": "abc123...",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEv...\n-----END PRIVATE KEY-----\n",
  "client_email": "webnova-indexing@webnova-xxxxx.iam.gserviceaccount.com",
  "client_id": "123456789",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/..."
}
```

**Copiați ÎNTREGUL conținut JSON pe o singură linie și adăugați în .env.local:**

```bash
GOOGLE_INDEXING_KEY='{"type":"service_account","project_id":"webnova-xxxxx",...}'
```

⚠️ **IMPORTANT:** Înlocuiți caracterele newline (`\n`) din private_key cu secvența literală `\\n` (escaped).

#### Pas 6: Verificare permisiuni în Search Console

Pentru ca Indexing API să funcționeze, Service Account-ul trebuie să aibă acces la Google Search Console:

1. Accesați https://search.google.com/search-console
2. Selectați property-ul pentru `webnova.ro`
3. Navigați la "Settings" → "Users and permissions"
4. Click "Add user"
5. Adăugați email-ul Service Account:
   ```
   webnova-indexing@webnova-xxxxx.iam.gserviceaccount.com
   ```
6. Selectați permisiunea: "Owner"
7. Click "Add"

---

## Verificare configurație

După ce ați configurat toate variabilele, fișierul `.env.local` ar trebui să arate astfel:

```bash
# Convex (generat automat)
CONVEX_DEPLOYMENT=dev:tough-fly-260
NEXT_PUBLIC_CONVEX_URL=https://tough-fly-260.convex.cloud

# Google Gemini AI
GOOGLE_GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# Google Indexing API (JSON complet pe o linie)
GOOGLE_INDEXING_KEY='{"type":"service_account","project_id":"...","private_key":"...","client_email":"..."}'
```

---

## Testare configurație

### Test Gemini AI

```bash
# In Convex Dashboard
# Navigate to: Functions → actions → gemini → generateLandingPage
# Args:
{
  "nicheName": "Test Niche",
  "nicheSlug": "test"
}
# Click Run - should return JSON content
```

### Test Google Indexing API

```bash
# In Convex Dashboard
# Navigate to: Functions → actions → indexing → submitUrlToGoogle
# Args:
{
  "url": "https://webnova.ro/test"
}
# Click Run - should return success:true
```

---

## Troubleshooting

### Error: "GOOGLE_GEMINI_API_KEY not found"
- Verificați că ați salvat `.env.local`
- Restartați serverul Convex: `npx convex dev`

### Error: "Invalid Google credentials"
- Verificați că JSON-ul este pe o singură linie
- Verificați că private_key conține `\\n` (escaped) în loc de newline real
- Asigurați-vă că JSON-ul este încadrat între ghilimele simple `'...'`

### Error: "Permission denied" (Indexing API)
- Verificați că Service Account este adăugat în Google Search Console
- Verificați că Indexing API este activată în Google Cloud Console
- Așteptați 5-10 minute după configurare pentru propagarea permisiunilor
