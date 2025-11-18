# BJJ Checklist App - Production Debugging Playbook

## 📚 Table of Contents

1. [EAS Build Failures](#eas-build-failures)
2. [Android Keystore Issues](#android-keystore-issues)
3. [JavaScript Bundle Errors](#javascript-bundle-errors)
4. [Missing Native Dependencies](#missing-native-dependencies)
5. [Credential Management](#credential-management)
6. [Local vs Cloud Build Debugging](#local-vs-cloud-build-debugging)

---

## 🎯 Golden Rules

**Before debugging any EAS build failure:**

1. ✅ **Always test locally first** - Run `npx tsc`, `npx expo export`, and `./gradlew assembleRelease`
2. ✅ **Check the warning messages** - EAS gives explicit warnings (e.g., "NODE_ENV will install only production packages")
3. ✅ **Compare local vs EAS config** - If local works but EAS fails, it's a configuration mismatch
4. ✅ **Read the actual error message** - Don't guess; find the exact error in build logs
5. ✅ **One change at a time** - Test each fix individually to identify root cause

---

## EAS Build Failures

### 🔍 Diagnostic Workflow

```bash
# Step 1: Check recent build status
eas build:list --limit 5

# Step 2: Get specific build details
eas build:view BUILD_ID

# Step 3: Test locally
npx tsc --noEmit                    # TypeScript errors?
npx expo export --platform android  # Bundle errors?
npx expo prebuild --platform android # Native config errors?
cd android && ./gradlew assembleRelease # Gradle errors?

# Step 4: Compare configurations
git diff main..HEAD eas.json app.json package.json
```

### Common Build Failures

| Error Message | Root Cause | Solution |
|---------------|------------|----------|
| "Unknown error in Bundle JavaScript phase" | `NODE_ENV=production` preventing devDependencies install | Remove `env.NODE_ENV` from eas.json |
| "No credentials found" | `credentialsSource: "local"` but no credentials.json | Remove credentialsSource or create credentials.json |
| "Missing plugin configuration" | Native module without expo plugin in app.json | Add plugin to app.json plugins array |
| "BUILD SUCCESSFUL locally but fails on EAS" | Configuration mismatch between local and cloud | Check eas.json env variables |

---

## Android Keystore Issues

### 🚨 Problem: "The Android App Bundle was signed with the wrong key"

**What happened:**
During debugging, a new Android keystore was created. Google Play rejected the update because it expects the original keystore.

### Immediate Diagnosis

**Step 1: Check Google Play App Signing Status**

```
Play Console → Setup → App integrity → App signing
```

Look for: **"App signing by Google Play"** status

### Recovery Decision Tree

```
Is Play App Signing enabled?
│
├─ YES (Easy Fix - 5 minutes + 24hr approval)
│  └─ Register new keystore as upload certificate
│     1. Download current keystore from EAS
│     2. Extract certificate: keytool -export -rfc
│     3. Play Console → Request upload key reset
│     4. Upload new certificate
│     5. Wait for Google approval
│     ✅ Done!
│
└─ NO (Harder Fix - Need original keystore)
   ├─ Find original keystore
   │  - Check EAS credential history
   │  - Search local machine: find ~ -name "*.jks"
   │  - Check backups (1Password, iCloud, etc.)
   │  - Contact Expo support
   │
   ├─ Restore original keystore in EAS
   │  - eas credentials
   │  - Remove current keystore
   │  - Upload original keystore
   │
   └─ If original is LOST (Worst case)
      - Option A: Publish new app with different package name
      - Option B: Contact Google Play support (unlikely to help)
      ❌ Cannot update existing app
```

### Commands Reference

**Download keystore from EAS:**
```bash
eas credentials
# Select: Android → production → Download keystore
```

**Extract certificate from keystore:**
```bash
keytool -export -rfc \
  -keystore ~/path/to/keystore.jks \
  -alias YOUR_KEY_ALIAS \
  -file upload_certificate.pem
```

**Get SHA-256 fingerprint:**
```bash
keytool -list -v \
  -keystore ~/path/to/keystore.jks \
  -alias YOUR_KEY_ALIAS | grep SHA256
```

**Compare with Play Console:**
```
Play Console → App integrity → App signing
→ App signing key certificate → SHA-256 fingerprint
```

**Must match EXACTLY or submissions will fail.**

### Prevention Strategy

**Enable Play App Signing NOW:**
1. Go to Play Console → Setup → App integrity
2. Click "Opt in to app signing by Google Play"
3. Follow prompts to enroll

**Benefits:**
- ✅ Google manages permanent signing key
- ✅ Can reset upload keys if lost
- ✅ Much easier recovery
- ✅ Enhanced security

**Backup Your Keystore:**
```bash
# Download from EAS
eas credentials → Download keystore

# Store securely:
# - 1Password vault
# - Encrypted cloud storage
# - External encrypted drive

# Document in password manager:
# - Keystore password
# - Key alias
# - Key password
# - SHA-256 fingerprint
```

---

## JavaScript Bundle Errors

### Problem: "Bundle JavaScript" phase fails on EAS

**Symptom:**
- Local bundle works: `npx expo export` succeeds
- EAS build fails during Bundle JavaScript phase
- Error: "Unknown error" or "Cannot find module"

### Root Cause Analysis

**Common causes:**
1. **NODE_ENV=production in eas.json** (Most common)
2. Missing devDependencies needed for bundling
3. Metro bundler configuration issues
4. Import errors in code

### Step-by-Step Debugging

#### 1. Test Local Bundle

```bash
# Test with default environment
npx expo export --platform android --output-dir /tmp/test-bundle

# Test with NODE_ENV=production
NODE_ENV=production npx expo export --platform android --output-dir /tmp/test-prod

# Expected output:
# ✅ "Bundled XXXXms node_modules/expo/AppEntry.js (1020 modules)"
# ✅ "Exported: /tmp/test-bundle"
```

**If local bundle fails:** Code issue (import errors, syntax)
**If local bundle succeeds:** EAS configuration issue

#### 2. Check eas.json Configuration

**❌ WRONG (causes devDependencies to be skipped):**
```json
{
  "build": {
    "production": {
      "autoIncrement": true,
      "env": {
        "NODE_ENV": "production"  // ← Remove this!
      }
    }
  }
}
```

**✅ CORRECT:**
```json
{
  "build": {
    "production": {
      "autoIncrement": true
      // No env block needed - EAS handles it automatically
    }
  }
}
```

**Why this matters:**
- EAS explicitly warns: *"NODE_ENV=production will make yarn/npm install only production packages"*
- `@babel/core` and `babel-preset-expo` are in devDependencies
- Without these, bundling fails with "Unknown error"
- EAS automatically optimizes production builds without NODE_ENV flag

#### 3. Verify Package Dependencies

**Check that build tools are in devDependencies:**
```json
{
  "devDependencies": {
    "@babel/core": "^7.20.0",
    "babel-preset-expo": "^54.0.6",
    "typescript": "~5.9.2",
    "@types/react": "~19.1.10"
  }
}
```

**These are REQUIRED for bundling:**
- `@babel/core` - Transpiles JavaScript
- `babel-preset-expo` - Expo-specific Babel configuration
- `typescript` - If using TypeScript
- `@types/react` - TypeScript type definitions

#### 4. Local Gradle Test (Android)

```bash
# Clean and regenerate native project
rm -rf android
npx expo prebuild --platform android

# Attempt local Gradle build
cd android
./gradlew assembleRelease --stacktrace

# Expected:
# ✅ "BUILD SUCCESSFUL in Xm XXs"
# ✅ "XXX actionable tasks: XXX executed"
```

**If Gradle succeeds locally:** EAS-specific issue (credentials, env vars)
**If Gradle fails locally:** Native configuration issue

### The Solution (Based on Real Experience)

**Problem:**
```
eas build --platform android --profile production
→ "Unknown error. See logs of the Bundle JavaScript build phase"
```

**Fix:**
```bash
# Edit eas.json - Remove NODE_ENV from production profile
# Before:
"production": {
  "autoIncrement": true,
  "env": {
    "NODE_ENV": "production"
  }
}

# After:
"production": {
  "autoIncrement": true
}
```

**Commit and rebuild:**
```bash
git add eas.json
git commit -m "fix: Remove NODE_ENV=production from EAS build config"
git push
eas build --platform android --profile production
```

**Result:**
- ✅ DevDependencies are installed
- ✅ Babel can transpile JavaScript
- ✅ Bundle JavaScript phase succeeds
- ✅ Build completes successfully

---

## Missing Native Dependencies

### Problem: EAS build fails with "Unknown module" or permission errors

**Symptoms:**
- Local prebuild works
- EAS build fails during native compilation
- Errors mention missing permissions or modules

### Root Cause

**Missing expo config plugins in app.json**

Expo SDK 50+ requires explicit plugin declarations for native modules:
- `expo-image-picker` → Needs plugin for camera/photo permissions
- `expo-file-system` → Needs plugin for storage permissions
- `expo-screen-orientation` → Needs plugin for orientation management
- `expo-localization` → Needs plugin for locale detection

### Diagnosis

**Check app.json plugins section:**
```json
{
  "expo": {
    "plugins": [
      "./plugins/withOrientation.js"
      // ❌ Missing native module plugins!
    ]
  }
}
```

**Check package.json dependencies:**
```json
{
  "dependencies": {
    "expo-image-picker": "~17.0.8",     // Needs plugin
    "expo-file-system": "~19.0.17",     // Needs plugin
    "expo-screen-orientation": "~9.0.7", // Needs plugin
    "expo-localization": "^17.0.7"      // Needs plugin
  }
}
```

### Solution

**Add all required plugins to app.json:**

```json
{
  "expo": {
    "plugins": [
      "./plugins/withOrientation.js",
      [
        "expo-image-picker",
        {
          "photosPermission": "Allow app to access your photos",
          "cameraPermission": "Allow app to access your camera"
        }
      ],
      "expo-file-system",
      "expo-localization",
      "expo-screen-orientation"
    ]
  }
}
```

**Test locally:**
```bash
# Regenerate native projects
rm -rf ios android
npx expo prebuild --platform all

# Check generated permissions (iOS)
grep -A 1 "NSCameraUsageDescription\|NSPhotoLibraryUsageDescription" \
  ios/BJJChecklist/Info.plist

# Expected:
# <key>NSCameraUsageDescription</key>
# <string>Allow app to access your camera</string>

# Check generated permissions (Android)
grep "uses-permission" android/app/src/main/AndroidManifest.xml

# Expected:
# <uses-permission android:name="android.permission.CAMERA"/>
# <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"/>
```

### Verification Checklist

After adding plugins:

- [ ] Run `npx expo prebuild --clean`
- [ ] Check iOS Info.plist has permission strings
- [ ] Check Android Manifest has permission declarations
- [ ] Run `npx tsc --noEmit` (no errors)
- [ ] Commit changes: `git add app.json && git commit`
- [ ] Push: `git push`
- [ ] Rebuild: `eas build --platform all --profile production`

---

## Credential Management

### Current Setup: EAS-Managed Credentials

**Configuration in eas.json:**
```json
{
  "build": {
    "production": {
      "autoIncrement": true
      // No credentialsSource - defaults to EAS-managed
    }
  }
}
```

**What this means:**
- ✅ Android keystore managed by EAS
- ✅ iOS certificates managed by EAS
- ✅ No local credentials.json needed
- ✅ Credentials stored securely on Expo servers

### Android Credentials

**Current keystore (as of Nov 2025):**
- **Type:** JKS
- **Alias:** `dblefbabcfad98449353ccbe6b45f63f`
- **SHA-256:** `18:F1:41:89:42:9C:0C:80:D5:22:9E:0B:11:DE:EC:3A:65:9A:20:AD:4D:D1:F8:41:D4:9D:CC:C1:7A:10:46:E3`
- **Updated:** 18 days ago

**Google Play submission:**
- **Service Account:** `eas-expo@graduacao-jiu-jitsu.iam.gserviceaccount.com`
- **Project ID:** `graduacao-jiu-jitsu`

### iOS Credentials

**Apple Developer:**
- **Apple ID:** `ds@brzl.ca`
- **Team ID:** `Q39UF8B7S5`
- **App Store Connect ID:** `6754972177`

**Certificates:**
- Automatically managed by EAS
- Distribution certificate generated on-demand
- Provisioning profiles auto-refreshed

### Credential Commands

**View all credentials:**
```bash
eas credentials
```

**Android-specific:**
```bash
eas credentials -p android
# Select: production
# Options:
# - Show keystore information
# - Download keystore (for backup)
# - Remove keystore
# - Set up new keystore
```

**iOS-specific:**
```bash
eas credentials -p ios
# Manage certificates and provisioning profiles
```

**Backup keystore (CRITICAL):**
```bash
eas credentials
# Select: Android → production → Download keystore
# Save to secure location:
# - 1Password vault
# - Encrypted cloud storage
# - External encrypted drive
```

### Troubleshooting Credentials

**"No credentials found"**
```bash
# Check if credentialsSource is set to "local"
cat eas.json | grep credentialsSource

# If found, remove it:
# Edit eas.json and delete the line
# Commit and push changes
```

**"Wrong keystore signature"**
```bash
# Get current keystore SHA-256
eas credentials
# → Android → production → Show keystore info

# Compare with Play Console
# → Setup → App integrity → SHA-256 fingerprint

# If mismatch, see KEYSTORE_RECOVERY.md
```

**"Build failed: Missing credentials"**
```bash
# Verify credentials exist in EAS
eas credentials

# If missing, set up new credentials
# → Android → production → Set up new keystore
# → Generate new keystore (EAS creates it)
```

---

## Local vs Cloud Build Debugging

### The Golden Rule

**If local build succeeds but EAS fails:**
→ Configuration mismatch (not a code issue)

### Local Build Testing Matrix

| Test | Command | What It Verifies |
|------|---------|-----------------|
| TypeScript | `npx tsc --noEmit` | No type errors |
| JS Bundle | `npx expo export --platform android` | Metro bundler works |
| Native Config | `npx expo prebuild --platform android` | Plugin configuration correct |
| Android Build | `cd android && ./gradlew assembleRelease` | Gradle build succeeds |
| iOS Build | `cd ios && xcodebuild` | Xcode build succeeds |

**Expected local results:**
```
✅ TypeScript: No errors
✅ JS Bundle: 1020 modules, 3.33 MB
✅ Prebuild: Native projects generated
✅ Gradle: BUILD SUCCESSFUL in 2m 34s
```

**If ALL local tests pass but EAS fails:**
→ Check eas.json configuration
→ Check environment variables
→ Check credential configuration

### Common Configuration Mismatches

**1. Environment Variables**

**❌ Problem:**
```json
// eas.json
"production": {
  "env": {
    "NODE_ENV": "production"  // Breaks devDependencies install
  }
}
```

**✅ Solution:**
```json
"production": {
  "autoIncrement": true
  // Let EAS handle environment automatically
}
```

**2. Credentials Source**

**❌ Problem:**
```json
"production": {
  "credentialsSource": "local"  // Expects credentials.json
}
```

**✅ Solution:**
```json
"production": {
  // No credentialsSource - uses EAS-managed
}
```

**3. Missing Plugins**

**❌ Problem:**
```json
// app.json
"plugins": [
  "./plugins/withOrientation.js"
  // Missing expo-image-picker plugin
]
```

**✅ Solution:**
```json
"plugins": [
  "./plugins/withOrientation.js",
  "expo-image-picker",
  "expo-file-system",
  "expo-screen-orientation"
]
```

### Debug Workflow

```bash
# Step 1: Reproduce locally
npx tsc --noEmit
npx expo export --platform android
rm -rf android && npx expo prebuild --platform android
cd android && ./gradlew assembleRelease

# Step 2: If local succeeds, check configs
git diff main..HEAD eas.json app.json package.json

# Step 3: Identify what's different in EAS
# - Environment variables
# - Credential configuration
# - Plugin configuration

# Step 4: Fix the mismatch
# - Edit eas.json or app.json
# - Commit and push
# - Rebuild on EAS

# Step 5: Verify fix
eas build --platform android --profile production
```

---

## Quick Reference: Build Failure Checklist

When an EAS build fails, run through this checklist:

### ✅ Phase 1: Local Testing (5 minutes)
- [ ] `npx tsc --noEmit` - TypeScript compiles?
- [ ] `npx expo export --platform android` - Bundle works?
- [ ] `npx expo prebuild --platform android` - Native config works?
- [ ] `cd android && ./gradlew assembleRelease` - Gradle builds?

**If any fail:** Code/config issue (fix locally first)
**If all pass:** EAS-specific issue (check config mismatch)

### ✅ Phase 2: Configuration Review (5 minutes)
- [ ] Check eas.json for `NODE_ENV` in production profile (remove it)
- [ ] Check eas.json for `credentialsSource: "local"` (remove it)
- [ ] Check app.json plugins match package.json dependencies
- [ ] Check .gitignore includes credentials files
- [ ] Check package.json devDependencies include build tools

### ✅ Phase 3: Credential Verification (2 minutes)
- [ ] Run `eas credentials` to verify credentials exist
- [ ] For Android: Check keystore SHA-256 matches Play Console
- [ ] For iOS: Verify Apple Team ID is correct
- [ ] Download and backup keystore (if not already done)

### ✅ Phase 4: EAS Build (20-30 minutes)
- [ ] Commit fixes: `git add . && git commit -m "fix: ..."`
- [ ] Push: `git push`
- [ ] Build: `eas build --platform all --profile production`
- [ ] Monitor: `eas build:list --limit 5`
- [ ] If fails: Check build logs for exact error message

### ✅ Phase 5: Submission (10 minutes)
- [ ] Verify build completed successfully
- [ ] For Android: Check keystore matches Play Console
- [ ] Submit: `eas submit --platform android --latest`
- [ ] If "wrong key" error: See KEYSTORE_RECOVERY.md
- [ ] If success: Monitor Play Console review status

---

## Lessons Learned

### What Worked ✅

1. **Local testing catches 90% of issues before EAS build**
   - Always run `npx expo prebuild` locally first
   - Test Gradle build locally: saves 20+ minutes per iteration

2. **Read EAS warnings carefully**
   - Warning about NODE_ENV=production was explicit
   - Warning about credentialsSource was explicit
   - Don't ignore yellow warning text!

3. **One change at a time**
   - Changed plugins → tested → committed
   - Changed credentials → tested → committed
   - Changed NODE_ENV → tested → committed
   - Made it easy to identify root cause

4. **Document everything**
   - SHA-256 fingerprints in PUBLISHING_GUIDE.md
   - Recovery procedures in KEYSTORE_RECOVERY.md
   - This playbook for future debugging

### What Didn't Work ❌

1. **Guessing at solutions**
   - Tried various config changes without testing
   - Wasted time on wrong paths
   - Better: Reproduce locally, then fix

2. **Not checking Play Console settings first**
   - Keystore issue could have been diagnosed faster
   - Play App Signing status is critical info
   - Check web dashboards early

3. **Creating new keystores without verification**
   - Nearly lost ability to update app
   - Always compare SHA-256 before replacing keystore
   - Backup before any credential changes

---

## Emergency Contacts

**Expo Support:**
- Email: support@expo.dev
- Discord: https://chat.expo.dev
- Documentation: https://docs.expo.dev

**Google Play Support:**
- Play Console → Help → Contact Support
- Only for account-level issues
- Cannot help with lost keystores (security policy)

**Apple Support:**
- App Store Connect → Help
- Developer Support: developer.apple.com/support

---

## Version History

**v1.0 - November 2025**
- Initial playbook based on real production debugging
- Covers: Bundle errors, keystore recovery, credential management
- Battle-tested solutions from actual build failures
- All scenarios successfully resolved

**Issues Solved:**
1. ✅ EAS build failing with "Bundle JavaScript" error → Removed NODE_ENV
2. ✅ "No credentials found" → Removed credentialsSource from eas.json
3. ✅ "Wrong key" submission error → Keystore recovery procedure documented
4. ✅ Missing native permissions → Added expo plugins to app.json

---

## Contributing

When you encounter a new build issue and solve it:

1. Add a new section to this playbook
2. Include:
   - Problem description
   - Root cause analysis
   - Step-by-step solution
   - Prevention strategy
3. Commit with descriptive message
4. Share knowledge with the team

**This playbook is living documentation.**
Every build failure is a learning opportunity! 📚

🤖 Generated with [Claude Code](https://claude.com/claude-code)
