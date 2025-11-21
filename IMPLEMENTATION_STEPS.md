# Implementation Steps - Google Forms Migration

## ✅ COMPLETED

1. Created `src/services/googleForms.ts` - Google Forms submission service
2. Created `src/components/FeedbackModal.tsx` - In-app feedback modal
3. Modified `src/components/JoinClassBetaButton.tsx` - Removed browser redirect, added modal
4. Installed dependencies: `expo-constants`, `expo-device`
5. TypeScript compilation verified

---

## 🚀 TODO: Complete These Steps to Ship

### Step 1: Create Google Form (15 minutes)

1. Go to https://forms.google.com/create
2. Add these fields:

**Field 1: Tipo de Feedback**
- Type: Multiple choice
- Options: "Bug Report", "Feature Request", "General Feedback"
- Required: Yes

**Field 2: Mensagem**
- Type: Paragraph text
- Validation: Max 500 characters
- Required: Yes

**Field 3: Email**
- Type: Short answer
- Description: "Deixe seu email se quiser uma resposta (opcional)"
- Required: No

**Field 4: Faixa** (Hidden from user view)
- Type: Short answer
- Required: No

**Field 5: Versão do App** (Hidden)
- Type: Short answer
- Required: No

**Field 6: Dispositivo** (Hidden)
- Type: Short answer
- Required: No

3. Link form to Google Sheets:
   - Click "Responses" tab
   - Click green Sheets icon
   - Create new spreadsheet

---

### Step 2: Extract Entry IDs (5 minutes)

1. Open your Google Form
2. Click "Preview" (eye icon)
3. Right-click anywhere → "Inspect Element"
4. In the Elements tab, search (Cmd+F) for `entry.`
5. Find each field's entry ID:

```html
<!-- Example HTML you'll see: -->
<select name="entry.123456789">  <!-- Tipo de Feedback -->
<textarea name="entry.987654321">  <!-- Mensagem -->
<input name="entry.555555555">    <!-- Email -->
<input name="entry.111111111">    <!-- Faixa -->
<input name="entry.222222222">    <!-- Versão do App -->
<input name="entry.333333333">    <!-- Dispositivo -->
```

6. Also find the form action URL:
```html
<form action="https://docs.google.com/forms/d/e/1FAIpQLSc.../formResponse">
```

---

### Step 3: Update googleForms.ts with Real Values (2 minutes)

Open `src/services/googleForms.ts` and replace:

```typescript
const FORM_CONFIG = {
  feedbackFormUrl: 'https://docs.google.com/forms/d/e/YOUR_ACTUAL_FORM_ID/formResponse', // ← Paste your form URL here
  entryIds: {
    feedbackType: 'entry.123456789',  // ← Replace with your actual entry ID
    message: 'entry.987654321',        // ← Replace
    email: 'entry.555555555',          // ← Replace
    belt: 'entry.111111111',           // ← Replace
    appVersion: 'entry.222222222',     // ← Replace
    device: 'entry.333333333',         // ← Replace
  },
};
```

**Save the file.**

---

### Step 4: Test in Development (5 minutes)

```bash
# Start Expo dev server
npm start

# Open on iOS simulator or physical device
# - Tap "Entrar na Turma" button
# - Fill out feedback form
# - Submit

# Check Google Sheets
# - Refresh your linked spreadsheet
# - Verify new row appeared with:
#   - Timestamp
#   - Your feedback message
#   - Belt (e.g., "azul")
#   - App version (e.g., "1.0.0")
#   - Device info (e.g., "iOS 17.0 | iPhone 14 Pro")
```

**If row appears in Google Sheets → SUCCESS! Move to next step.**

**If row does NOT appear:**
- Double-check entry IDs match exactly (case-sensitive)
- Verify form URL is correct
- Check that form accepts responses (not closed)

---

### Step 5: Add Analytics Event Tracking (15 minutes)

**Option A: Use Existing Analytics Service** (if you have one)

Check if `src/services/analytics.ts` exists and add these events:

```typescript
// In FeedbackModal.tsx, add imports:
import { logEvent } from '../services/analytics';

// Add tracking to FeedbackModal:

// When modal opens:
useEffect(() => {
  if (visible) {
    logEvent('feedback_modal_opened', {});
  }
}, [visible]);

// When user starts typing message:
<TextInput
  onFocus={() => logEvent('form_start', { field_name: 'message' })}
  // ... rest of props
/>

// In handleSubmit function (after submitFeedback):
await submitFeedback({ ... });
await logEvent('form_submit', {
  feedback_type: feedbackType,
  has_email: !!email.trim(),
});
```

**Option B: Set Up Firebase Analytics** (if no analytics exist)

See `GOOGLE_FORMS_MIGRATION.md` Phase 3 for full Firebase setup instructions.

For now, you can skip this and add it later. The form will still work without analytics.

---

### Step 6: Test TypeScript Build (2 minutes)

```bash
npx tsc --noEmit
```

**Expected output:** No errors (silent success)

**If you see errors:**
- Check imports in FeedbackModal.tsx
- Verify all components exported correctly

---

### Step 7: Deploy to TestFlight/Internal Testing (10 minutes)

**For iOS:**
```bash
# Increment version in app.json first
# Change "version": "1.0.0" → "1.1.0"

eas build --platform ios --profile production
```

**For Android:**
```bash
eas build --platform android --profile production
```

**After build completes:**
```bash
eas submit --platform ios
eas submit --platform android
```

**Or:** Upload manually to App Store Connect / Google Play Console

---

### Step 8: Monitor First Submissions (Week 1)

Once app is live with real users:

1. **Check Google Sheets daily** for new submissions
2. **Calculate conversion metrics:**
   - How many users clicked "Entrar na Turma"? (check analytics)
   - How many submissions in Google Sheets?
   - Conversion rate = (submissions / clicks) × 100

3. **Respond to users who left email** (within 24-48 hours)

4. **Look for patterns:**
   - Which belt levels are most interested?
   - Any recurring bug reports?
   - Any quick-win feature requests?

---

## 📊 Expected Results (First 30 Days)

**Baseline (before migration):**
- External Google Form in browser
- Estimated conversion: 5-15%
- Zero visibility into drop-off

**Target (after migration):**
- In-app modal form
- Expected conversion: 40-60%
- Full funnel tracking with analytics

**Success = 3-4x increase in submissions**

---

## 🚨 Common Issues & Fixes

### Issue 1: Modal not opening

**Symptoms:** Button click does nothing

**Fix:**
1. Check browser console for errors
2. Verify FeedbackModal is imported in JoinClassBetaButton.tsx
3. Check that `visible={showModal}` prop is correct

---

### Issue 2: Form submits but no data in Google Sheets

**Symptoms:** Success screen shows, but no row in Sheets

**Possible causes:**
- Entry IDs don't match (check spelling/case)
- Form URL is wrong (check for typos)
- Form is closed to responses (check form settings)

**Fix:**
1. Re-inspect Google Form HTML to get correct entry IDs
2. Copy-paste form URL carefully (no extra spaces)
3. Check form settings: "Responses" → "Accepting responses" = ON

---

### Issue 3: TypeScript errors after changes

**Symptoms:** `tsc --noEmit` shows errors

**Fix:**
```bash
# Check which files have errors
npx tsc --noEmit

# Common fixes:
# - Add missing imports
# - Check for typos in component names
# - Verify all required props passed to components
```

---

### Issue 4: Modal keyboard covers text input (iOS)

**Symptoms:** Keyboard hides textarea when typing

**Fix:** FeedbackModal already wraps content in `KeyboardAvoidingView` with `behavior="padding"`. If still broken:

```typescript
// In FeedbackModal.tsx, try:
<KeyboardAvoidingView
  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
  keyboardVerticalOffset={100} // ← Add this
  style={styles.container}
>
```

---

### Issue 5: Modal won't close on Android back button

**Symptoms:** Android hardware back button doesn't close modal

**Fix:** Already handled via `onRequestClose={handleClose}` prop in Modal. If broken, verify:

```typescript
<Modal
  visible={visible}
  animationType="slide"
  presentationStyle="pageSheet"
  onRequestClose={handleClose} // ← Must be present
>
```

---

## 🎯 Next Steps After Basic Implementation Works

### Quick Win #1: Add Feedback Button to Header

Add a "💬" icon to HomeScreen header that opens FeedbackModal:

```typescript
// In HomeScreen.tsx:
import { FeedbackModal } from '../components/FeedbackModal';

export const HomeScreen: React.FC = () => {
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  // In render:
  <View style={styles.header}>
    <Text style={styles.headerTitle}>Checklist de Graduação</Text>
    <TouchableOpacity onPress={() => setShowFeedbackModal(true)}>
      <Text style={{ fontSize: 20, padding: 8 }}>💬</Text>
    </TouchableOpacity>
  </View>

  {/* At bottom of component, before closing tag: */}
  <FeedbackModal
    visible={showFeedbackModal}
    onClose={() => setShowFeedbackModal(false)}
  />
}
```

**Expected impact:** 2x more feedback (users can now report bugs/suggestions from anywhere)

---

### Quick Win #2: Pre-fill Message Based on Context

Allow components to pass a default message:

```typescript
// Update FeedbackModal.tsx props:
interface FeedbackModalProps {
  visible: boolean;
  onClose: () => void;
  defaultMessage?: string; // ← Add this
}

export function FeedbackModal({ visible, onClose, defaultMessage }: FeedbackModalProps) {
  const [message, setMessage] = useState(defaultMessage || '');

  // When modal closes, reset:
  useEffect(() => {
    if (!visible) {
      setMessage(defaultMessage || '');
    }
  }, [visible, defaultMessage]);

  // ... rest of component
}
```

**Usage:**
```typescript
// In CompletionScreen.tsx:
<FeedbackModal
  visible={showModal}
  onClose={() => setShowModal(false)}
  defaultMessage="Completei a faixa azul! 🥳"
/>
```

**Expected impact:** 10-20% higher conversion (less typing = less friction)

---

## 📋 Final Checklist Before Shipping to Production

- [ ] Google Form created and tested manually
- [ ] Entry IDs extracted and added to googleForms.ts
- [ ] Test submission in dev environment (check Google Sheets)
- [ ] TypeScript compilation passes (`npx tsc --noEmit`)
- [ ] Privacy policy updated (if needed)
- [ ] App Store/Play Store privacy disclosures updated
- [ ] Version incremented in app.json
- [ ] Built with EAS: `eas build --platform ios --platform android`
- [ ] Submitted to stores: `eas submit`
- [ ] Monitoring plan in place (daily Google Sheets check for Week 1)

---

**Questions? Issues? Check GOOGLE_FORMS_MIGRATION.md for detailed explanations.**

**Ready to ship? Run Step 1 (create Google Form) and you'll be done in 15 minutes.** 🚀
