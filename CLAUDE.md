# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

BJJ (Brazilian Jiu-Jitsu) belt progression checklist mobile app for Brothers Fight academy. Students track requirements for blue, purple, brown, and black belts. Single-screen React Native (Expo) app that works 100% offline with AsyncStorage persistence.

**Bundle IDs:**
- iOS: `com.brothersfight.bjjchecklist`
- Android: `com.brothersfight.bjjchecklist`

## Development Commands

```bash
# Start Metro bundler for development
npm start
# or
expo start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Test on physical device
# 1. Install Expo Go app on phone
# 2. Run: expo start
# 3. Scan QR code from terminal

# Cloud builds (EAS)
eas build --platform ios --profile production
eas build --platform android --profile production

# Submit to stores
eas submit --platform ios
eas submit --platform android
```

## Architecture

### State Management (Zustand + AsyncStorage)

Single global store at `src/store/index.ts` with AsyncStorage persistence:
- `selectedBelt`: Currently active belt tab
- `progress`: Nested object structure `{ [beltId]: { [requirementId]: RequirementProgress } }`
- `expandedCategories`: Set of expanded category names (persisted as array)
- `expandedRequirements`: Set of expanded requirement IDs (NOT persisted, resets on app restart)

**Critical:** Sets are serialized as arrays during persistence. The `onRehydrateStorage` hook converts them back to Sets on app load.

### Data Model

**Belt structure** (`src/data/belts.ts`):
- 4 belts: azul (blue), roxa (purple), marrom (brown), preta (black)
- Each belt has WCAG AA compliant colors for accessibility
- Colors include: `color` (primary), `textColor` (darker), `lightColor` (background tint)

**Requirements** (`src/data/requirements.ts`):
- 111 total requirements across all belts
- Azul: 60 individual named techniques (no targetCount)
- Roxa: 15 count-based requirements (with targetCount)
- Marrom: 18 count-based requirements
- Preta: Same as Marrom but expects detailed explanations

**Progress tracking:**
```typescript
RequirementProgress {
  completed: boolean;
  note: string;        // User's personal note
  mediaUrl: string;    // YouTube link or other URL
}
```

### Component Hierarchy

```
App.tsx (SafeAreaProvider)
└── HomeScreen (src/screens/HomeScreen.tsx)
    ├── BeltTab × 4 (belt selector tabs)
    ├── ProgressBar (animated with Reanimated)
    ├── SectionList (categories + requirements)
    │   ├── CategoryHeader (collapsible section headers)
    │   └── RequirementItem (checkbox, note, URL)
    ├── ResetBeltButton
    └── CompletionScreen (shows at 100%)
```

### Key Implementation Details

**Input handling:**
- Uses native `Alert.prompt()` for notes and URLs (iOS only API, graceful degradation on Android)
- No custom modals or bottom sheets in v1 for simplicity

**Animations:**
- Progress bar uses React Native Reanimated 3 with spring physics
- `babel.config.js` includes `react-native-reanimated/plugin` at the end

**Haptics:**
- Checkbox toggles trigger `Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)`
- Share action triggers `Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)`

**Sharing:**
- Completion screen uses `expo-sharing` native share sheet
- Shares text message with belt name, date, and app branding

**Performance:**
- Uses `SectionList` for efficient rendering of grouped requirements
- Category headers are sticky

## Configuration Files

**app.json:**
- Version auto-increments via EAS Build (`autoIncrement: true`)
- Build numbers managed by EAS (don't manually edit unless necessary)
- No icon/splash assets yet (blocks submission - see PUBLISHING_GUIDE.md)

**eas.json:**
- `credentialsSource: "local"` - uses credentials.json (gitignored)
- `appVersionSource: "local"` - reads version from app.json
- Production profile auto-increments build numbers

**babel.config.js:**
- MUST have `react-native-reanimated/plugin` as the LAST plugin
- Breaking if removed or reordered

## TypeScript Version

Must use `~5.9.2` to match Expo SDK 54 compatibility. Downgrading causes peer dependency warnings.

## Belt Requirements Reference

**Azul (Blue):** 60 individual techniques across 12 categories (Quedas, Passagem, Cem Kilos, Joelho na Barriga, Montada, Guarda Fechada, Meia Guarda, Costas, Raspagem, Saídas, Fundamentos, Ataque de Pé)

**Roxa (Purple):** 15 count-based requirements (e.g., "06 Quedas com nomes", "02 Triângulos")

**Marrom (Brown):** 18 count-based requirements with more advanced positions (50/50 guard, lapel guard)

**Preta (Black):** Identical to Marrom requirements but expects students to explain each technique in detail

## Publishing

See `PUBLISHING_GUIDE.md` for complete app store submission steps.

**Blockers before submission:**
1. App icon (1024×1024px) - required for both stores
2. Screenshots (5 images) - taken from physical device
3. Privacy policy URL - already hosted on GitHub

**Privacy policy URL:**
```
https://raw.githubusercontent.com/w3b3/app-checklist-graduacao-jiu-jitsu/main/PRIVACY_POLICY.md
```

## Development Philosophy

**Lean MVP approach:**
- No backend, no authentication, no admin panel
- Offline-first with local storage only
- Single screen experience
- Native UI patterns (Alert.prompt, Share sheet)
- No custom bottom sheets or complex modals in v1

**Future v2 features (explicitly cut from v1):**
- Instructor accounts
- Cloud sync
- Photo/video capture
- Push notifications
- Detailed analytics
