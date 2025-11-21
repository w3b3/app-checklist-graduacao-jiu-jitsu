# Google Forms Automation - Quick Start

## ✅ What We Built

A complete automation system for creating analytics forms with Google Forms as a zero-backend solution.

**Time saved:** 15 minutes → 30 seconds per form

---

## 🚀 First-Time Setup (30 minutes)

### Step 1: Google Cloud Project

1. Visit https://console.cloud.google.com
2. Create project: "BJJ Checklist Analytics"
3. Enable APIs:
   - Google Forms API
   - Google Drive API

### Step 2: OAuth Credentials

1. APIs & Services → Credentials
2. Create Credentials → OAuth 2.0 Client ID
3. Application type: **Desktop app**
4. Download `credentials.json`
5. Save to project root

### Step 3: Authenticate

```bash
npm run google-auth
```

Opens browser for consent → Saves tokens to `.google-tokens.json`

✅ **Done!** You're ready to create forms.

---

## 📝 Creating Your First Form (30 seconds)

### Example: Technique Analytics Form

```bash
npm run create-form -- --config forms/techniqueAnalytics.config.json
```

**Output:**
```
✅ Form created successfully!

Form URL: https://docs.google.com/forms/d/e/FORM_ID/viewform
Response URL: https://docs.google.com/forms/d/e/FORM_ID/formResponse

Generated: src/services/forms/techniqueAnalytics.ts
```

### Link to Google Sheets (Manual - 30 seconds)

1. Open form URL
2. Click "Responses" → Green Sheets icon
3. Create new spreadsheet

### Use in App

```typescript
import { submitTechniqueAnalytics } from '../services/forms';

const handleEvent = async () => {
  await submitTechniqueAnalytics({
    techniqueId: 'req-1',
    techniqueName: 'Double Leg',
    action: 'Checked',
    belt: 'Azul',
    category: 'Quedas',
    timestamp: new Date().toISOString(),
    sessionId: await getSessionId(),
  });
};
```

---

## 📊 Available Forms

We've created 3 example configs:

### 1. Technique Analytics (High-Frequency, Batched)
**Config:** `forms/techniqueAnalytics.config.json`
**Use case:** Track technique checks/unchecks
**Batching:** Every 30s OR 10 events

### 2. Feature Requests (Low-Frequency, Immediate)
**Config:** `forms/featureRequest.config.json`
**Use case:** Collect feature ideas from users
**Batching:** Disabled (submit immediately)

### 3. Session Telemetry (Low-Frequency, Immediate)
**Config:** `forms/sessionTelemetry.config.json`
**Use case:** Track session duration, engagement
**Batching:** Disabled (submit on session end)

---

## 🎯 Next Steps

### Create All Forms

```bash
npm run create-form -- --config forms/techniqueAnalytics.config.json
npm run create-form -- --config forms/featureRequest.config.json
npm run create-form -- --config forms/sessionTelemetry.config.json
```

### Test Submissions

Submit test data and verify it appears in Google Sheets.

### Integrate Session Tracking

Add to `App.tsx`:

```typescript
import { startSession, endSession } from './services/sessionTracking';
import { processOfflineQueue } from './services/forms/queues/offlineQueue';

export default function App() {
  useEffect(() => {
    startSession();
    processOfflineQueue(); // Process any queued submissions

    return () => {
      endSession();
    };
  }, []);

  // ... rest of app
}
```

### Add Tracking to Components

See `GOOGLE_FORMS_AUTOMATION.md` for complete integration examples.

---

## 🔧 Troubleshooting

### "credentials.json not found"
Download OAuth credentials from Google Cloud Console.

### "Authentication failed"
```bash
rm .google-tokens.json
npm run google-auth
```

### TypeScript errors
```bash
npx tsc --noEmit
```

---

## 📚 Full Documentation

- **GOOGLE_FORMS_AUTOMATION.md** - Complete guide
- **forms/*.config.json** - Example form configurations

---

## 🎉 Success!

You now have a fully automated Google Forms analytics system. Create unlimited forms in 30 seconds each!

**Questions?** See GOOGLE_FORMS_AUTOMATION.md for detailed documentation.
