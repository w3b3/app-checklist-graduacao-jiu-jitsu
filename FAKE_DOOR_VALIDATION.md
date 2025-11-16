# Fake Door Validation Plan - BJJ Checklist v2.0

**Strategy:** Test demand BEFORE building
**Investment:** 1 day coding + 2 weeks measuring
**Cost:** $0-12
**Decision:** Data-driven GO/NO-GO on Day 15

---

## 🎯 The Core Question

**Will users actually use class features, or are you over-engineering?**

Instead of spending 14 weeks building a full platform, spend 1 day adding a fake "Join Class" button that opens a Google Form. Measure clicks. Interview users. Make an informed decision.

---

## 📅 Timeline

| Phase | Duration | Activities |
|-------|----------|------------|
| **Day 1** | 4 hours | Build fake door button + Google Form, ship to production |
| **Days 2-14** | 2 weeks | Measure clicks, collect form responses, interview 10 users |
| **Day 15** | 1 hour | Analyze data, decide GO/NO-GO |
| **Days 16-20** | 5 days | (If GO) Build lean MVP |

---

## 🛠️ Day 1: Implementation (4 Hours)

### Step 1: Create Fake Door Button Component (30 min)

**New file:** `src/components/JoinClassBetaButton.tsx`

```tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import * as Haptics from 'expo-haptics';

export function JoinClassBetaButton() {
  const handlePress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Track click (implement analytics in Step 4)
    // logEvent('join_class_beta_clicked');

    // Open Google Form
    const formUrl = 'https://forms.gle/YOUR_FORM_ID_HERE';
    await Linking.openURL(formUrl);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🎓</Text>
      <Text style={styles.title}>Sua academia usa o BJJ Checklist?</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>Entrar na Turma</Text>
        <View style={styles.betaBadge}>
          <Text style={styles.betaText}>BETA</Text>
        </View>
      </TouchableOpacity>

      <Text style={styles.description}>
        Conecte-se com seus colegas e professor para rastrear progresso em grupo
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 12,
    padding: 16,
    backgroundColor: '#F0F9FF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BAE6FD',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  emoji: {
    fontSize: 32,
    textAlign: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0C4A6E',
    textAlign: 'center',
    marginBottom: 12,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#1E40AF',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  betaBadge: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  betaText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  description: {
    fontSize: 13,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 18,
  },
});
```

**Visual Preview:**
```
┌─────────────────────────────────────────┐
│              🎓                         │
│   Sua academia usa o BJJ Checklist?     │
│                                         │
│   ┌─────────────────────────────────┐  │
│   │ Entrar na Turma        [BETA]  │  │
│   └─────────────────────────────────┘  │
│                                         │
│   Conecte-se com seus colegas e        │
│   professor para rastrear progresso    │
│   em grupo                              │
└─────────────────────────────────────────┘
```

### Step 2: Add to HomeScreen (5 min)

**File:** `src/screens/HomeScreen.tsx`

**Location:** After ProgressBar component (line 287)

```tsx
{/* Progress Bar */}
<ProgressBar
  current={completed}
  total={total}
  percentage={percentage}
  beltId={selectedBelt}
/>

{/* Fake door test - only show if not 100% complete */}
{percentage < 100 && <JoinClassBetaButton />}

{/* Requirements List */}
<SectionList
  // ... existing code
```

**Import at top of file:**
```tsx
import { JoinClassBetaButton } from '../components/JoinClassBetaButton';
```

**Why only show if <100%?** Users who completed everything are outliers and might skew data.

### Step 3: Create Google Form (20 min)

**Go to:** https://forms.google.com → Blank form

**Form Title:** "BJJ Checklist - Interesse em Turmas"

**Questions:**

**Q1: Qual é o código da sua turma?** (Short answer)
- Help text: "Pergunte ao seu professor o código de 5 dígitos. Se ele ainda não usa o app, deixe em branco."
- Not required

**Q2: Seu e-mail** (Email)
- Required: YES
- Description: "Para avisarmos quando o recurso estiver pronto"

**Q3: Nome do seu professor ou academia** (Short answer)
- Help text: "Ex: Professor João Silva - Brothers Fight"
- Not required

**Q4: O que você mais quer em um recurso de turma?** (Multiple choice)
- Ver o progresso dos meus colegas de turma
- Ser verificado pelo meu professor
- Receber planos de aula do professor
- Competir com colegas (ranking/leaderboard)
- Outro: ___________

**Q5: Você pagaria R$5/mês por este recurso?** (Multiple choice)
- Sim, definitivamente
- Talvez, depende dos recursos
- Não, só usaria se fosse grátis

**Form Settings:**
- Click gear icon (⚙️)
- ✅ Collect email addresses
- ✅ Response receipts → "Respondents can request a receipt"
- ❌ Limit to 1 response (allow people from multiple academies)
- ✅ Edit after submit (let them update answers)

**Confirmation Message:**
```
Obrigado! 🙏

Você está na lista de espera para o recurso de Turmas.

Entraremos em contato quando estiver pronto para teste (estimativa: 2-3 semanas).

Enquanto isso, continue rastreando seu progresso! 🥋
```

**Get Shareable Link:**
1. Click "Send" button
2. Click link icon (🔗)
3. ✅ Shorten URL
4. Copy the `forms.gle/XXXXXXX` link
5. Update `formUrl` in `JoinClassBetaButton.tsx`

### Step 4: Analytics Tracking (45 min)

**Two Options:**

---

#### Option A: Firebase Analytics (Recommended)

**Pros:** Free forever, real-time dashboard, industry standard
**Cons:** Requires Firebase setup (15 min)

**Install:**
```bash
npx expo install @react-native-firebase/app @react-native-firebase/analytics
```

**Firebase Console Setup:**
1. Go to https://console.firebase.google.com
2. Click "Add project"
3. Project name: "BJJ Checklist"
4. Disable Google Analytics for Firebase (we only need basic analytics)
5. Click "Create project"

**Add iOS App:**
1. Click iOS icon
2. Bundle ID: `com.brothersfight.bjjchecklist` (from app.json)
3. App nickname: "BJJ Checklist iOS"
4. Download `GoogleService-Info.plist`
5. Save to project root (will be auto-linked by Expo)

**Add Android App:**
1. Click Android icon
2. Package name: `com.brothersfight.bjjchecklist` (from app.json)
3. Download `google-services.json`
4. Save to project root

**Update app.json:**
```json
{
  "expo": {
    "plugins": [
      "./plugins/withOrientation.js",
      "@react-native-firebase/app",
      "@react-native-firebase/analytics"
    ],
    "ios": {
      "googleServicesFile": "./GoogleService-Info.plist"
    },
    "android": {
      "googleServicesFile": "./google-services.json"
    }
  }
}
```

**Create Analytics Service:**

**New file:** `src/services/analytics.ts`

```typescript
import analytics from '@react-native-firebase/analytics';

export async function logEvent(eventName: string, params?: Record<string, any>) {
  try {
    await analytics().logEvent(eventName, params);
  } catch (error) {
    console.warn('Analytics error:', error);
  }
}

export async function setUserProperty(name: string, value: string) {
  try {
    await analytics().setUserProperty(name, value);
  } catch (error) {
    console.warn('Analytics error:', error);
  }
}

export async function logScreenView(screenName: string) {
  try {
    await analytics().logScreenView({ screen_name: screenName });
  } catch (error) {
    console.warn('Analytics error:', error);
  }
}
```

**Update JoinClassBetaButton.tsx:**
```tsx
import { logEvent } from '../services/analytics';

// In handlePress:
const handlePress = async () => {
  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

  // Track click
  await logEvent('join_class_beta_clicked', {
    timestamp: Date.now(),
  });

  const formUrl = 'https://forms.gle/YOUR_FORM_ID_HERE';
  await Linking.openURL(formUrl);
};
```

**Track screen views in HomeScreen:**
```tsx
import { logScreenView } from '../services/analytics';

useEffect(() => {
  logScreenView('home_screen');
}, []);
```

**View Dashboard:**
- Go to Firebase Console → Analytics → Events
- See `join_class_beta_clicked` count in real-time

---

#### Option B: Local Tracking (No external dependencies)

**Pros:** Zero setup, no third-party service
**Cons:** No dashboard, manual export

**New file:** `src/services/localAnalytics.ts`

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Event {
  name: string;
  timestamp: number;
  params?: Record<string, any>;
}

const EVENTS_KEY = 'analytics_events';

export async function logEvent(eventName: string, params?: Record<string, any>) {
  try {
    const event: Event = {
      name: eventName,
      timestamp: Date.now(),
      params
    };

    const existing = await AsyncStorage.getItem(EVENTS_KEY);
    const events: Event[] = existing ? JSON.parse(existing) : [];
    events.push(event);

    await AsyncStorage.setItem(EVENTS_KEY, JSON.stringify(events));
  } catch (error) {
    console.warn('Local analytics error:', error);
  }
}

export async function getEvents(): Promise<Event[]> {
  try {
    const data = await AsyncStorage.getItem(EVENTS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.warn('Error fetching events:', error);
    return [];
  }
}

export async function exportEvents(): Promise<string> {
  const events = await getEvents();
  return JSON.stringify(events, null, 2);
}

export async function clearEvents(): Promise<void> {
  await AsyncStorage.removeItem(EVENTS_KEY);
}
```

**Add export button to Profile screen later:**
```tsx
// In ProfileScreen or SettingsScreen:
import { exportEvents } from '../services/localAnalytics';
import * as Sharing from 'expo-sharing';

const handleExportAnalytics = async () => {
  const data = await exportEvents();
  const fileUri = `${FileSystem.documentDirectory}analytics.json`;
  await FileSystem.writeAsStringAsync(fileUri, data);
  await Sharing.shareAsync(fileUri);
};

// Button:
<Button onPress={handleExportAnalytics}>Export Analytics</Button>
```

**To check data:**
- Use Expo dev tools
- Or share JSON file via email

---

### Step 5: Auto-Email Responder (15 min)

**Option A: Google Apps Script (Automated, Free)**

1. Open your Google Form
2. Click "Responses" tab
3. Click green Sheets icon → "Create spreadsheet"
4. In the new Google Sheet: **Extensions → Apps Script**
5. Delete default code, paste this:

```javascript
function onFormSubmit(e) {
  // Get form response values
  var classCode = e.values[1];     // Q1: Class code
  var email = e.values[2];         // Q2: Email
  var academyName = e.values[3];   // Q3: Professor/Academy
  var wantedFeature = e.values[4]; // Q4: Most wanted feature
  var willingToPay = e.values[5];  // Q5: Payment willingness

  // Email subject
  var subject = "Obrigado por se inscrever no BJJ Checklist - Turmas Beta!";

  // Email body
  var body = "Olá!\n\n" +
             "Obrigado por demonstrar interesse no recurso de Turmas do BJJ Checklist. 🥋\n\n" +
             "Você está oficialmente na lista de espera! Entraremos em contato nas próximas 2-3 semanas quando o recurso estiver pronto para teste.\n\n" +
             "Enquanto isso:\n" +
             "• Continue rastreando seu progresso no app\n" +
             "• Compartilhe o app com seus colegas de treino\n" +
             "• Se você conhece outros professores interessados, peça para eles baixarem também!\n\n" +
             "Link do app:\n" +
             "iOS: https://apps.apple.com/app/[seu-app-id]\n" +
             "Android: https://play.google.com/store/apps/details?id=com.brothersfight.bjjchecklist\n\n" +
             "Oss! 🙏\n" +
             "Equipe BJJ Checklist";

  // Send email
  try {
    MailApp.sendEmail(email, subject, body);
    Logger.log('Email sent to: ' + email);
  } catch (error) {
    Logger.log('Error sending email: ' + error);
  }
}
```

6. Click **Deploy → Test deployments → Install add-on**
7. **Triggers (clock icon):**
   - Click "Add Trigger"
   - Function: `onFormSubmit`
   - Event source: "From spreadsheet"
   - Event type: "On form submit"
   - Click "Save"
8. Authorize the script (Google will ask for permissions)

**Test:**
- Submit a test response to your form
- Check if you receive the auto-email

**Option B: Manual (No automation)**

If you prefer not to automate:
- Check form responses daily
- Manually email respondents using a template
- Takes 5-10 min/day

---

### Step 6: Test in Development (15 min)

**Run in Expo Go:**
```bash
npm start
```

**Test Checklist:**
- [ ] Button appears on HomeScreen below ProgressBar
- [ ] Button has correct styling (blue, with BETA badge)
- [ ] Clicking button triggers haptic feedback
- [ ] Google Form opens in browser
- [ ] Form can be submitted successfully
- [ ] Auto-responder sends email (if using Apps Script)
- [ ] Analytics event is logged (check Firebase console or AsyncStorage)

**Test on both iOS and Android if possible**

---

### Step 7: Ship to Production (30 min)

**Update version:**

**File:** `app.json`
```json
{
  "expo": {
    "version": "1.0.3"
  }
}
```

**Rebuild with EAS:**
```bash
# iOS
eas build --platform ios --profile production

# Android
eas build --platform android --profile production

# Check status
eas build:list --limit 2
```

**Expected build time:** 10-20 minutes

**After builds complete:**
```bash
# Submit iOS
eas submit --platform ios

# Submit Android
eas submit --platform android
```

**Review Timeline:**
- **iOS:** 24-48 hours (usually)
- **Android:** 2-4 hours (usually)

**Rollout Strategy:**
- iOS: Release immediately to 100%
- Android: Staged rollout (10% → 50% → 100% over 3 days via Google Play Console)

---

## 📊 Measurement (Days 2-14)

### Primary Metrics to Track

**Daily (takes 5 min):**

1. **Total App Users:** Check App Store Connect / Google Play Console
2. **Button Clicks:** Firebase Analytics → Events → `join_class_beta_clicked`
3. **Form Submissions:** Google Forms → Responses tab (count)
4. **Click-Through Rate:** (Clicks / Total Users) × 100

**Weekly (takes 30 min):**

5. **Form Response Analysis:**
   - Export responses to CSV
   - Count responses per question
   - Identify patterns (same academy, common features wanted)

6. **Interview Progress:**
   - How many interviews completed?
   - Key insights from each

### Google Sheet Dashboard Template

**Create new spreadsheet: "BJJ Checklist - Fake Door Metrics"**

**Sheet 1: Daily Tracking**

| Date | Total Users | Button Clicks | Click Rate % | Form Submissions | Conversion % | Interviews | Notes |
|------|-------------|---------------|--------------|------------------|--------------|------------|-------|
| 2025-01-15 | 100 | 3 | 3% | 2 | 67% | 0 | Launch day |
| 2025-01-16 | 102 | 7 | 6.9% | 5 | 71% | 1 | Posted /r/bjj |
| 2025-01-17 | 105 | 12 | 11.4% | 9 | 75% | 2 | Strong signal! |
| ... | ... | ... | ... | ... | ... | ... | ... |

**Formulas:**
- Click Rate: `=(C2/B2)*100`
- Conversion: `=(E2/C2)*100`

**Sheet 2: Form Response Summary**

| Question | Answer | Count | % |
|----------|--------|-------|---|
| Q4: Most wanted feature | Ver progresso dos colegas | 8 | 67% |
| Q4: Most wanted feature | Ser verificado pelo professor | 3 | 25% |
| Q4: Most wanted feature | Planos de aula | 1 | 8% |
| Q5: Willing to pay | Sim, definitivamente | 5 | 42% |
| Q5: Willing to pay | Talvez | 4 | 33% |
| Q5: Willing to pay | Não | 3 | 25% |

**Update this weekly by exporting Google Form responses**

---

## 🗣️ User Interviews (Days 3-14)

### Goal: 10 Interviews Minimum

**Who to Interview:**

1. **Form Respondents (Priority 1):**
   - Email everyone who submitted form
   - Target: 5 interviews from respondents

2. **Reddit /r/bjj Community:**
   - Post: "Built a BJJ belt tracker app, considering class features - quick 15 min call?"
   - Target: 3 interviews

3. **Local Academy Visits:**
   - Visit 2-3 academies, demo app to professors
   - Target: 2 professor interviews

**Email Template for Form Respondents:**

```
Subject: [BJJ Checklist] Rápida conversa sobre recurso de Turmas?

Olá [Nome],

Vi que você se inscreveu para o recurso de Turmas no BJJ Checklist. Muito obrigado pelo interesse! 🙏

Estou conversando com alguns usuários antes de começar a construir isso. Você teria 15 minutos para uma chamada rápida esta semana?

Quero entender:
• Como você acompanha seu progresso atualmente
• Se o professor da sua academia acompanha o progresso dos alunos
• Que recursos tornariam o app mais útil para você

Pode ser por chamada de vídeo, telefone ou até mensagem de áudio se preferir.

Que dias/horários funcionam para você esta semana?

Abraço,
[Seu nome]

P.S.: Como agradecimento pelo seu tempo, vou adicionar você como beta tester quando o recurso estiver pronto! 🥋
```

**Reddit /r/bjj Post Template:**

```
Title: Built a BJJ belt progression tracker - should I add class features?

Body:
Hey r/bjj! 👋

I built a simple app to track BJJ technique requirements for each belt (blue → black). It's been live for a few months with ~100 users.

Now I'm considering adding class/academy features:
• Students join their academy's "class" with a code
• Professors can see student progress
• Track progress as a group

Before I spend months building this, I want to validate it's actually useful.

Questions:
1. Do you track your own progress toward next belt?
2. Does your professor/academy have a curriculum or is it more organic?
3. Would you want your professor to see your progress in an app?

If you're interested in chatting about this (15 min call), DM me! Happy to share the app too if you want to try it.

Oss! 🥋
```

### Interview Script (15 minutes)

**Introduction (1 min):**
```
Hi [Name], thanks for taking the time to chat! I'm building BJJ Checklist and want to make sure I'm building features people actually want.

This is super informal - no right or wrong answers. I'm just trying to learn how you train and track progress.

Cool if I take notes?
```

**Background (3 min):**
1. How long have you been training BJJ?
2. What belt are you currently?
3. How many times per week do you train?
4. What's your main goal with BJJ? (fun, fitness, competition, self-defense)

**Current Tracking (5 min):**
5. How do you know what techniques you need to learn for your next belt?
   - *Listen for:* Does their academy have a curriculum? Written list? Or just "whatever professor teaches"?

6. Do you track your progress anywhere? (notebook, app, spreadsheet, mental notes)
   - *If yes:* How's that working? What do you like/dislike?
   - *If no:* Why not? Too much effort? Don't see the value?

7. Does your professor track individual student progress?
   - *Listen for:* Is it formal (checklist) or informal (professor remembers)?

8. How does belt promotion work at your academy?
   - *Listen for:* Surprise promotion? Test/evaluation? Professor's discretion?

**Class Feature Validation (5 min):**
9. If there was an app where you could join your academy's "class" with a code, would that be useful?
   - *Probe:* Why or why not?

10. What would make it worth using?
    - *Show options:*
      - A) See classmates' progress (competition/motivation)
      - B) Get verified by professor (official approval)
      - C) See upcoming lesson plans from professor
      - D) Something else?

11. How would you feel about your professor seeing your progress?
    - *Listen for:* Comfortable? Motivating? Invasive? Doesn't care?

**Pricing (2 min):**
12. If this had real value, would you pay for it?
    - *Start high:* R$10/month? R$5/month? One-time R$20?
    - *Listen for:* Price sensitivity, what features would justify cost

13. What about your professor/academy - would they pay?
    - *Probe:* What would make it worth it for them?

**Wrap-up (1 min):**
```
This was super helpful, thank you!

Last question: Is there anyone else I should talk to? Other students or professors who might have thoughts on this?

I'll keep you posted on what I build. Want to be a beta tester when it's ready?
```

**Take detailed notes in a spreadsheet**

### Interview Notes Template

**Google Sheet: "Interview Notes"**

| Date | Name | Belt | Years Training | Current Tracking? | Professor Tracks? | Would Use Class Feature? | Willing to Pay? | Key Insights | Referrals |
|------|------|------|----------------|-------------------|-------------------|-------------------------|----------------|--------------|-----------|
| Jan 15 | João | Azul | 2 years | Notebook | No | Yes - wants verification | Maybe R$5 | Professor doesn't have time to track 40 students | Gave me professor's email |
| Jan 16 | Maria | Roxa | 4 years | Mental only | Yes - informal | Yes - wants to see classmates | Yes R$10 | Competitive, likes gamification | - |

---

## 🚦 Decision Criteria (Day 15)

### Analyze Your Data

**Pull together:**
1. Daily tracking spreadsheet (14 days of data)
2. Form response summary (count per answer)
3. Interview notes (10+ interviews)

**Calculate final metrics:**
- **Total Users:** 100 → ??? (growth over 2 weeks)
- **Click Rate:** Average across 14 days
- **Form Submissions:** Total count
- **Conversion Rate:** Submissions / Clicks
- **Payment Willingness:** % who said "Sim, definitivamente"
- **Professor Interest:** Count of professors interviewed who said "I'd use this"

---

### GO Signal ✅ (Build 5-Day MVP)

**ALL of these must be TRUE:**

| Metric | Threshold | Why it matters |
|--------|-----------|----------------|
| Click Rate | **>10%** | Strong user interest |
| Form Submissions | **>20 responses** | Enough data to validate |
| Professors Interested | **≥2 professors** | Target market validation |
| Payment Willingness | **>20% "Sim"** | Viable revenue model |

**If GO:**
- Proceed to 5-Day MVP (see section below)
- Focus on 1 academy first (Brothers Fight)
- Target: 20-30 students in beta

**Example GO scenario:**
```
Users: 115 (15% growth)
Clicks: 18 (15.7% click rate) ✅
Form Submissions: 25 (139% conversion) ✅
Professors: 3 interested ✅
Payment: 8 said "Sim" (32%) ✅

Decision: GO! Build MVP for Brothers Fight academy.
```

---

### NO-GO Signal ❌ (Pivot or Focus on v1)

**If ANY of these are TRUE:**

| Metric | Threshold | What it means |
|--------|-----------|---------------|
| Click Rate | **<5%** | Users don't care |
| Form Submissions | **<10** | Weak interest |
| Professors Interested | **0** | Wrong target market |
| Payment Willingness | **<10%** | No revenue model |

**If NO-GO:**
- Kill class feature idea entirely
- Focus on growing v1: 100 → 1000 users
- Try different features (see Alternative Pivots section)

**Example NO-GO scenario:**
```
Users: 103 (3% growth)
Clicks: 4 (3.9% click rate) ❌
Form Submissions: 2 ❌
Professors: 0 interested ❌
Payment: 0 said "Sim" (0%) ❌

Decision: NO-GO. Users don't want class features.
Next: Focus on v1 growth (SEO, partnerships, content).
```

---

### MAYBE Signal ⚠️ (Extend Test)

**If results are mixed (5-10% click, some interest but unclear):**

**Next steps:**
1. Extend test 2 more weeks (Days 15-28)
2. Try different messaging/placement
3. Interview 10 MORE users (total 20)
4. Post in more BJJ communities (Facebook groups, forums)
5. Visit local academies in person to demo

**Re-evaluate on Day 30**

---

## 🏗️ The 5-Day MVP (IF Validated)

**Only build this if you got a GO signal**

### Core Features (Absolute Minimum)

**What's IN:**
- ✅ Email/password authentication
- ✅ Professor creates class → gets 5-digit code
- ✅ Student enters code → joins class
- ✅ Class code always visible in header
- ✅ Professor sees list of students
- ✅ Professor taps student → views their checklist (read-only)
- ✅ Student progress auto-syncs when they check techniques

**What's OUT:**
- ❌ Progress verification by professor
- ❌ Lesson planning
- ❌ Analytics dashboard
- ❌ Real-time sync (just sync on app open)
- ❌ Offline queue
- ❌ Push notifications
- ❌ Attendance tracking

### Day-by-Day Build Plan

**Day 1: Firebase Setup (3 hours)**
- Set up Firebase project (if not done for analytics)
- Enable Firestore database
- Enable Authentication (Email/Password)
- Basic security rules

**Day 2: Auth Screens (5 hours)**
- SignInScreen.tsx
- SignUpScreen.tsx
- Role selection (Professor/Student toggle)
- Store user role in Firestore

**Day 3: Class Creation & Joining (6 hours)**
- CreateClassModal (Professor)
  - Generate 5-digit code
  - Store class in Firestore
- JoinClassModal (Student)
  - Enter code
  - Validate code exists
  - Create membership
- ClassCodeBadge header component

**Day 4: Professor View (5 hours)**
- RosterScreen: List students in class
- StudentProgressView: Show student's checklist
- Read-only (no editing/verification)

**Day 5: Sync & Polish (5 hours)**
- Sync student progress to Firestore on checkbox toggle
- Test full flow (professor creates → student joins → progress syncs)
- Fix bugs
- Deploy to TestFlight beta

**Total: ~24 hours of focused coding**

### Tech Stack

**Backend:** Firebase
- Firestore (database)
- Authentication
- Security rules

**State:** Zustand (keep existing store, add sync layer)

**No new navigation** - keep existing tab structure, add screens

### Database Schema (Firestore)

```
/users/{userId}
  - email: string
  - name: string
  - role: "professor" | "student"
  - createdAt: timestamp

/classes/{classId}
  - code: string (5-digit, indexed)
  - name: string
  - professorId: string
  - createdAt: timestamp

/class_memberships/{membershipId}
  - classId: string
  - userId: string
  - role: "student" | "professor"
  - currentBelt: string
  - joinedAt: timestamp

/student_progress/{userId}/progress/{techniqueId}
  - completed: boolean
  - note: string
  - mediaUrl: string
  - photoUri: string
  - lastUpdated: timestamp
```

**Index for fast lookup:** `classes` collection → index on `code`

### Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Users can read/write own profile
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }

    // Classes: anyone can read by code, only creator can write
    match /classes/{classId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth.uid == resource.data.professorId;
    }

    // Memberships: user can join, professor can remove
    match /class_memberships/{membershipId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow delete: if request.auth != null &&
        (request.auth.uid == resource.data.userId ||
         get(/databases/$(database)/documents/classes/$(resource.data.classId)).data.professorId == request.auth.uid);
    }

    // Progress: student owns, professor can read
    match /student_progress/{userId}/progress/{techniqueId} {
      allow read: if request.auth.uid == userId ||
        exists(/databases/$(database)/documents/class_memberships/$(request.auth.uid + '_' + get(/databases/$(database)/documents/student_progress/$(userId)).data.classId));
      allow write: if request.auth.uid == userId;
    }
  }
}
```

### Beta Test Plan

**Week 1 (Day 6-12):**
- Invite Brothers Fight professor
- Onboard 20-30 students
- Monitor for crashes/bugs
- Collect feedback via in-app form

**Week 2 (Day 13-19):**
- Fix critical bugs
- Add 2 more academies (from interviews)
- Total: 50-75 users across 3 academies

**Week 3 (Day 20-26):**
- Analyze usage:
  - Are professors logging in?
  - Are students joining classes?
  - Is progress syncing correctly?
- Decide: scale or pivot

**If successful → Charge $20/month per academy**

---

## 💰 Cost Analysis

### Fake Door Test (Days 1-14)

**Free:**
- Google Forms (unlimited responses)
- Firebase Analytics Free Plan (10K events/day)
- Firebase Authentication Free (unlimited users)
- EAS Build (you have build credits)
- Your time (4 hours)

**Total: $0**

### 5-Day MVP (IF you build it)

**Free (Firebase Spark Plan):**
- Firestore: 50K reads/day, 20K writes/day
- Authentication: Unlimited users
- Hosting: 10GB storage

**Limits:** Good for 100-500 users. Beyond that, upgrade to Blaze (pay-as-you-go)

**Estimated cost at 500 users:**
- $0-5/month (well within free tier)

**Total: $0-5/month**

---

## 📈 Growth Tactics (If NO-GO on Classes)

**If users don't want class features, focus on growing v1:**

### Tactic 1: SEO + Content (Free)

**Blog posts** (host on GitHub Pages or Medium):
- "Complete Blue Belt Requirements for BJJ"
- "How to Track Your Brazilian Jiu-Jitsu Progress"
- "Purple Belt Requirements: What You Need to Know"

**Target keywords:**
- "BJJ belt requirements"
- "Brazilian jiu-jitsu checklist"
- "How to get blue belt in BJJ"

**Backlinks:** Post in /r/bjj, BJJ forums, comment on BJJ YouTube videos

### Tactic 2: Academy Partnerships (Free)

**Reach out to 10 academies:**
```
Subject: Free BJJ Progress Tracker for [Academy Name] Students

Hi Professor [Name],

I built a free app that helps students track technique requirements for belt promotions.

Would your students find this useful? I can customize it with [Academy Name]'s logo and curriculum.

No cost, just want to help students stay motivated!

Check it out: [App Store link]

Oss,
[Your name]
```

**Goal:** 10 academies × 20 students each = 200 new users

### Tactic 3: Referral Feature (3 hours to build)

**Add to CompletionScreen:**
```
"Share with your training partner"
→ Native share sheet
→ Message: "Just completed [Belt] requirements in BJJ Checklist! Download and track your progress: [link]"
```

**Viral coefficient target:** 0.3 (30% of users invite 1 friend)

### Tactic 4: YouTube Demo (4 hours)

**Record 5-min walkthrough:**
1. Intro: "Stop losing track of belt requirements"
2. Demo: Show app, check off techniques
3. Features: Photos, notes, cross-belt progress
4. CTA: "Download link in description"

**Post on:**
- Your channel (if you have one)
- /r/bjj "Showoff Sunday" threads
- BJJ Facebook groups

**Target: 1000 views → 50 downloads (5% conversion)**

---

## 🔄 Alternative Pivots (If Classes Fail)

**If class features aren't wanted, but you have engaged users, try:**

### Pivot 1: Technique Video Library

**Problem:** Users don't know HOW to do techniques, just WHAT to learn

**Solution:**
- Embed YouTube videos for each technique
- Partner with BJJ YouTubers (revenue share or affiliate)
- Premium tier: $5/month for curated videos

**Validation:**
- Add "Watch Tutorial" button (fake door)
- Measure clicks
- If >20% click → build it

### Pivot 2: Competition Tracker

**Problem:** Competitors want to track tournament performance

**Solution:**
- Log competition results (win/loss, submission type)
- Track statistics (success rate per technique)
- Compare with friends
- Premium: $3/month for advanced analytics

**Validation:**
- Survey current users: "Do you compete?"
- If >40% compete → build it

### Pivot 3: White Label for Academies

**Problem:** Academies want branded apps

**Solution:**
- Custom-branded version of your app
- Academy's logo, colors, curriculum
- Pricing: $500 setup + $50/month

**Target market:** 1000+ academies in Brazil

**Validation:**
- Email 50 academies
- If 5+ interested → build it

**Revenue potential:** 10 academies × $50 = $500/month

---

## ✅ Launch Checklist

### Pre-Launch (Night Before)

- [ ] Google Form created and tested
- [ ] Auto-responder script set up (if using)
- [ ] Firebase Analytics configured (or local analytics)
- [ ] JoinClassBetaButton component created
- [ ] Component added to HomeScreen
- [ ] Tested in Expo Go simulator
- [ ] Version bumped to 1.0.3 in app.json
- [ ] Measurement spreadsheet ready

### Launch Day (Day 1)

**Morning:**
- [ ] Build iOS + Android (`eas build`)
- [ ] Submit to App Store + Play Store
- [ ] Verify builds are processing

**Afternoon (After Approval):**
- [ ] Confirm app is live in stores
- [ ] Test button in production app
- [ ] Post announcement on /r/bjj
- [ ] DM 10 BJJ professors on Instagram
- [ ] Email existing users (if you have list)

### Days 2-14

**Daily (5 min):**
- [ ] Check Firebase Analytics for click count
- [ ] Check Google Form response count
- [ ] Update measurement spreadsheet

**3x per week:**
- [ ] Reach out to form respondents for interviews
- [ ] Schedule and conduct interviews
- [ ] Post in BJJ communities for more feedback

**Weekly:**
- [ ] Export form responses to CSV
- [ ] Analyze response patterns
- [ ] Review interview notes
- [ ] Calculate week-over-week growth

### Day 15 (Decision Day)

- [ ] Calculate final metrics (click rate, conversion, etc.)
- [ ] Review all interview notes
- [ ] Make GO/NO-GO decision
- [ ] Document decision and rationale
- [ ] If GO: Plan 5-day MVP sprint
- [ ] If NO-GO: Plan v1 growth tactics

---

## 📊 Success Metrics Cheat Sheet

**Green Light (GO) ✅:**
- Click rate: >10%
- Form submissions: >20
- Professors interested: ≥2
- Payment willingness: >20%

**Red Light (NO-GO) ❌:**
- Click rate: <5%
- Form submissions: <10
- Professors interested: 0
- Payment willingness: <10%

**Yellow Light (MAYBE) ⚠️:**
- Everything in between
- Extend test 2 more weeks
- Interview 10 more people
- Try different messaging

---

## 🎓 What You'll Learn

**After 2 weeks, you'll know:**

1. **Do users want class features?** (Yes/No, with data)
2. **What's the most wanted feature?** (Progress view, verification, lessons, competition)
3. **Will they pay?** (Yes/No, at what price point)
4. **Who's your customer?** (Students, professors, academies)
5. **What's the real pain point?** (Tracking, motivation, accountability, curriculum)

**This data is worth 100× more than building features blindly.**

---

## 🚀 What Happens After

### If GO → 5-Day MVP

**Week 1-2:** Build MVP (see 5-day plan above)
**Week 3:** Beta test with 1 academy (20-30 students)
**Week 4:** Refine based on feedback
**Week 5:** Launch to 5 more academies
**Week 6:** Start charging ($20/month per academy)
**Month 3:** Target 10 paying academies = $200 MRR

### If NO-GO → Focus on v1 Growth

**Month 1:** SEO + content (blog posts, YouTube)
**Month 2:** Academy partnerships (email 50 academies)
**Month 3:** Referral feature + viral loop
**Goal:** 100 → 1000 users in 3 months

**Then try alternative pivots (video library, competition tracker)**

---

## 📝 Final Notes

### Why This Approach Works

**Traditional approach (what you almost did):**
- Spend 14 weeks building full platform
- Launch to crickets
- Realize users don't want it
- Waste 3.5 months

**Fake door approach (this plan):**
- Spend 1 day adding button
- Measure real demand for 2 weeks
- Get data from actual users
- Build only if validated
- Save 13 weeks if it's wrong

**This is exactly how successful startups validate ideas.**

### Common Mistakes to Avoid

❌ **Don't skip the interviews:** Form data alone isn't enough. Talk to people.
❌ **Don't extend test indefinitely:** Decide on Day 15. More data won't help if signal is weak.
❌ **Don't build if NO-GO:** It's tempting to build anyway. Resist. Trust the data.
❌ **Don't over-complicate the button:** Keep it simple. You're testing demand, not design.
❌ **Don't forget to ship:** Analysis paralysis is real. Ship on Day 1.

### When to Revisit Classes

**If NO-GO now, try again in 6 months if:**
- You've grown to 1000+ users
- Multiple users organically ask for class features
- You've partnered with 5+ academies
- You have revenue from other features

**Market timing matters. Maybe users aren't ready yet.**

---

## 🙏 Resources

**Tools:**
- Google Forms: https://forms.google.com
- Firebase: https://console.firebase.google.com
- Reddit /r/bjj: https://reddit.com/r/bjj
- BJJ Professor Database: Search Instagram hashtag #bjjprofessor

**Inspiration:**
- "The Mom Test" by Rob Fitzpatrick (user interview guide)
- "The Lean Startup" by Eric Ries (validation methodology)
- YC Startup School (free course on idea validation)

---

## 📞 Next Steps

**Right now (seriously, right now):**

1. Open Google Forms → Create form (use template above)
2. Open your code editor → Create `JoinClassBetaButton.tsx`
3. Add button to HomeScreen
4. Test in Expo Go
5. Build + submit

**Tomorrow:**
- Wait for app review
- Prepare interview questions
- Draft /r/bjj post

**In 2 weeks:**
- Analyze data
- Make decision
- Build OR pivot

**Stop planning. Start validating. Ship today.**

---

**Document Version:** 1.0
**Last Updated:** 2025-11-15
**Status:** Ready to implement
