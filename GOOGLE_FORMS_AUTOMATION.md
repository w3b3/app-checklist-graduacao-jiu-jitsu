# Google Forms Automation Guide

This document explains how to use the automated Google Forms system to create and integrate analytics forms into the BJJ Checklist app.

## Overview

The automation system enables you to create Google Forms for analytics tracking in **~30 seconds** with zero manual work:

1. Create a form config JSON file
2. Run `npm run create-form`
3. Form is created, entry IDs extracted, TypeScript code generated
4. Ready to use in app immediately

**Before automation:** 15 minutes manual work
**After automation:** 30 seconds automated

---

## Prerequisites

### One-Time Setup (30 minutes)

#### 1. Google Cloud Project

1. Go to https://console.cloud.google.com
2. Create new project: "BJJ Checklist Analytics"
3. Enable APIs:
   - Google Forms API
   - Google Drive API

#### 2. OAuth Credentials

1. In Google Cloud Console → "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth 2.0 Client ID"
3. Application type: **Desktop app**
4. Name: "BJJ Checklist Forms Automation"
5. Click "Create"
6. Download `credentials.json`
7. Move to project root: `/path/to/project/credentials.json`

#### 3. Authenticate

```bash
npm run google-auth
```

This will:
- Open browser for Google OAuth consent
- Save refresh token to `.google-tokens.json`
- Tokens are automatically refreshed when needed

---

## Creating a New Form

### Step 1: Create Form Config

Create a JSON file in `forms/` directory:

**Example:** `forms/myNewForm.config.json`

```json
{
  "name": "myNewForm",
  "title": "My New Form Title",
  "description": "What this form tracks",
  "fields": [
    {
      "name": "fieldName",
      "label": "Field Label (shown in form)",
      "type": "text",
      "required": true
    },
    {
      "name": "choiceField",
      "label": "Multiple Choice Field",
      "type": "choice",
      "required": true,
      "options": ["Option 1", "Option 2", "Option 3"]
    },
    {
      "name": "paragraphField",
      "label": "Long Text Field",
      "type": "paragraph",
      "required": false
    }
  ],
  "linkToSheets": true,
  "batching": {
    "enabled": true,
    "flushInterval": 30000,
    "batchSize": 10
  }
}
```

#### Field Types

- **`text`**: Short answer (single line)
- **`paragraph`**: Long answer (multi-line)
- **`choice`**: Multiple choice (radio buttons)
  - Requires `options` array

#### Batching Configuration

For high-frequency events (like technique checks/unchecks):

```json
"batching": {
  "enabled": true,
  "flushInterval": 30000,  // Flush every 30 seconds
  "batchSize": 10          // OR every 10 events (whichever first)
}
```

For low-frequency events (like feedback):

```json
"batching": {
  "enabled": false
}
```

### Step 2: Run Automation

```bash
npm run create-form -- --config forms/myNewForm.config.json
```

**What happens:**
1. ✅ Creates form via Google Forms API
2. ✅ Adds all fields with proper types
3. ✅ Launches headless browser
4. ✅ Extracts entry IDs from form HTML
5. ✅ Generates `src/services/forms/myNewForm.ts`
6. ✅ Updates `src/services/forms/index.ts`
7. ✅ Updates `.forms-registry.json`

**Output:**
```
✅ Form created successfully!

Form URL: https://docs.google.com/forms/d/e/FORM_ID/viewform
Response URL: https://docs.google.com/forms/d/e/FORM_ID/formResponse

📊 Next steps:
1. Open the form and manually link to Google Sheets
2. Import in your app:
   import { submitMyNewForm } from '../services/forms';
```

### Step 3: Link to Google Sheets (Manual)

1. Open the form URL from output
2. Click "Responses" tab
3. Click green Sheets icon
4. Create new spreadsheet (or select existing)

**Why manual?** Google Forms API doesn't support programmatic Sheets linking yet.

### Step 4: Use in Your App

Generated file: `src/services/forms/myNewForm.ts`

```typescript
import { submitMyNewForm } from '../services/forms';

// In your component
const handleEvent = async () => {
  await submitMyNewForm({
    fieldName: 'some value',
    choiceField: 'Option 1',
    paragraphField: 'Long text here',
  });
};
```

**Type safety:** TypeScript will enforce required fields and validate choice options!

---

## Example Forms

### 1. Technique Analytics (High-Frequency, Batched)

**Config:** `forms/techniqueAnalytics.config.json`

```json
{
  "name": "techniqueAnalytics",
  "title": "BJJ Technique Analytics",
  "description": "Track which techniques users interact with",
  "fields": [
    {
      "name": "techniqueId",
      "label": "Technique ID",
      "type": "text",
      "required": true
    },
    {
      "name": "techniqueName",
      "label": "Technique Name",
      "type": "text",
      "required": true
    },
    {
      "name": "action",
      "label": "Action Type",
      "type": "choice",
      "required": true,
      "options": ["Checked", "Unchecked"]
    },
    {
      "name": "belt",
      "label": "Belt Level",
      "type": "choice",
      "required": true,
      "options": ["Azul", "Roxa", "Marrom", "Preta"]
    },
    {
      "name": "category",
      "label": "Technique Category",
      "type": "text",
      "required": true
    },
    {
      "name": "timestamp",
      "label": "Timestamp",
      "type": "text",
      "required": true
    },
    {
      "name": "sessionId",
      "label": "Session ID",
      "type": "text",
      "required": true
    }
  ],
  "linkToSheets": true,
  "batching": {
    "enabled": true,
    "flushInterval": 30000,
    "batchSize": 10
  }
}
```

**Usage:**
```typescript
import { techniqueAnalyticsQueue } from '../services/forms/queues/analyticsQueue';

const handleCheckbox = async () => {
  techniqueAnalyticsQueue.add({
    techniqueId: requirement.id,
    techniqueName: requirement.name,
    action: isComplete ? 'Unchecked' : 'Checked',
    belt: selectedBelt,
    category: requirement.category,
    timestamp: new Date().toISOString(),
    sessionId: await getSessionId(),
  });
};
```

### 2. Feature Requests (Low-Frequency, Immediate)

**Config:** `forms/featureRequest.config.json`

**Usage:**
```typescript
import { submitFeatureRequest } from '../services/forms';

const handleSubmit = async () => {
  await submitFeatureRequest({
    featureDescription: description,
    priority: 'High',
    belt: selectedBelt,
    email: userEmail,
    timestamp: new Date().toISOString(),
  });
};
```

---

## File Structure

```
project/
├── forms/                              # Form configs (version controlled)
│   ├── techniqueAnalytics.config.json
│   ├── featureRequest.config.json
│   └── sessionTelemetry.config.json
│
├── scripts/
│   ├── auth/
│   │   └── google-oauth.ts            # OAuth helper
│   └── create-analytics-form.ts       # Main automation script
│
├── src/services/forms/
│   ├── index.ts                       # Central export registry
│   ├── techniqueAnalytics.ts          # Generated by automation
│   ├── featureRequest.ts              # Generated by automation
│   └── sessionTelemetry.ts            # Generated by automation
│
├── credentials.json                   # OAuth credentials (gitignored)
├── .google-tokens.json                # Refresh tokens (gitignored)
└── .forms-registry.json               # Form metadata (gitignored)
```

---

## Troubleshooting

### "credentials.json not found"

You need to download OAuth credentials from Google Cloud Console.

**Solution:**
1. Go to https://console.cloud.google.com
2. Select your project
3. "APIs & Services" → "Credentials"
4. Download OAuth 2.0 client credentials
5. Save as `credentials.json` in project root

### "Authentication failed"

Stored tokens may be expired.

**Solution:**
```bash
rm .google-tokens.json
npm run google-auth
```

### "Could not find entry ID for field"

Playwright may not have found the field in the form HTML.

**Solution:**
1. Open the form URL manually
2. Inspect HTML and verify field exists
3. Check that field label in config matches exactly

### TypeScript errors after generating form

Run TypeScript compilation:

```bash
npx tsc --noEmit
```

If errors persist, check that:
- Field types are correct in config
- Required fields are marked correctly
- Choice options match exactly

---

## Rate Limits

**Google Forms API:**
- Form creation: 100 requests/minute
- BatchUpdate: 100 requests/minute

**Form Submissions (no official limits):**
- Practical limit: ~100 submissions/minute per form
- Daily limit: ~10,000 submissions per form
- Use batching for high-frequency events

---

## Best Practices

### 1. Use Batching for High-Frequency Events

Events like technique checks/unchecks happen frequently. Use batching to reduce submission count:

```json
"batching": {
  "enabled": true,
  "flushInterval": 30000,
  "batchSize": 10
}
```

### 2. Version Control Form Configs

Keep all `forms/*.config.json` files in git. This makes forms reproducible and documents your analytics strategy.

### 3. Don't Edit Generated Files

Generated files have this header:

```typescript
// Auto-generated - DO NOT EDIT MANUALLY
```

If you need changes, update the config and re-run automation.

### 4. Test with Real Data

After creating a form:
1. Submit test data via app
2. Check Google Sheets
3. Verify data appears correctly

### 5. Monitor Google Sheets Row Count

Google Sheets max: 5 million cells

If approaching limit:
- Export to BigQuery
- Create new sheet
- Archive old data

---

## FAQ

**Q: Can I edit forms after creation?**
A: Yes, via Google Forms UI. But you'll need to re-run extraction if you add/remove fields.

**Q: Can I use the same form for multiple apps?**
A: Yes! The form URL is public. Just share entry IDs across apps.

**Q: Do I need to re-authenticate often?**
A: No. Refresh tokens last indefinitely unless revoked.

**Q: Can I create forms without OAuth?**
A: No. Google Forms API requires OAuth 2.0 authentication.

**Q: What if Google Forms API changes?**
A: The submission endpoint (`/formResponse`) has been stable since 2011. Very unlikely to break.

---

## Next Steps

1. ✅ Complete one-time OAuth setup
2. ✅ Create your first form config
3. ✅ Run automation
4. ✅ Link to Sheets
5. ✅ Integrate in app
6. ✅ Test with real data
7. ✅ Analyze results in Google Sheets

For questions or issues, see the troubleshooting section above.
