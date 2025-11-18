# Publishing to App Stores - Step by Step Guide

## ✅ What's Already Done
- ✅ App fully built and functional
- ✅ EAS configuration created
- ✅ Privacy policy written
- ✅ Store descriptions ready (Portuguese + English)
- ✅ You have active Apple + Google developer accounts

## 🚀 Steps to Publish TODAY

### Step 1: Test the App (5-10 minutes)

Your Expo dev server is running. In your terminal window (not browser), you should see:
- A QR code
- Or a URL like `exp://127.0.0.1:8081`

**To test:**
1. Open **Expo Go** app on your phone (install from App Store/Play Store if needed)
2. Scan the QR code from your terminal
3. App will load on your phone
4. Test: Check boxes, switch belts, add notes, complete a belt

**If you don't see a QR code**, press `r` in the terminal to reload.

---

### Step 2: Create App Icon (10-15 minutes)

You need a **1024×1024px** icon. Simple options:

**Option A - Use Canva (Free):**
1. Go to canva.com
2. Create "App Icon" template (1024×1024)
3. Use BJJ belt colors or simple gi/belt graphic
4. Export as PNG

**Option B - Use Figma (Free):**
1. Create 1024×1024 frame
2. Add circle with belt color gradient
3. Add text "BJJ" or belt graphic
4. Export as PNG

**Option C - Ultra Simple:**
Create a solid color square with the word "BJJ" in white text.

**Save as:**
- `assets/icon.png` (1024×1024)
- `assets/adaptive-icon.png` (same file for Android)

**Then update app.json:**
```json
{
  "expo": {
    "icon": "./assets/icon.png",
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#1E40AF"
      }
    }
  }
}
```

---

### Step 3: Install EAS CLI and Login (2 minutes)

```bash
# Install EAS globally
npm install -g eas-cli

# Login to your Expo account (create one if needed - it's free)
eas login

# Link project
eas build:configure
```

This creates an Expo account if you don't have one. **It's free** - you don't pay Expo anything.

---

### Step 4: Update app.json with Store Info (5 minutes)

```bash
# Edit app.json and add:
{
  "expo": {
    "name": "BJJ Checklist - Graduação",
    "slug": "bjj-checklist",
    "version": "1.0.0",
    "icon": "./assets/icon.png",
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.brothersfight.bjjchecklist",
      "buildNumber": "1"
    },
    "android": {
      "package": "com.brothersfight.bjjchecklist",
      "versionCode": 1,
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#1E40AF"
      }
    },
    "privacy": "unlisted"
  }
}
```

---

### Step 5: Build for iOS and Android (30-45 minutes - happens in cloud)

```bash
# Build both platforms at once
eas build --platform all --profile production

# Or build separately:
eas build --platform ios --profile production
eas build --platform android --profile production
```

**What happens:**
- Builds happen on Expo's servers (not your Mac)
- Takes 20-30 minutes per platform
- You'll get download links when done
- **iOS**: You get an `.ipa` file
- **Android**: You get an `.aab` file

**Wait for builds to complete before next step.**

---

### Step 6: Submit to Apple App Store (10-15 minutes)

**You have 2 options:**

#### Option A: Use EAS Submit (Easier)
```bash
# This automates the upload to App Store Connect
eas submit --platform ios

# You'll need:
# - Apple ID email
# - App-specific password (generate at appleid.apple.com)
# - Accept prompts
```

#### Option B: Manual Upload via Transporter
1. Download the `.ipa` file from EAS build
2. Open **Transporter** app (Mac App Store - free)
3. Drag `.ipa` file into Transporter
4. Click "Deliver"

**Then in App Store Connect:**
1. Go to appstoreconnect.apple.com
2. Click "My Apps" → "+" → "New App"
3. Fill in:
   - Name: BJJ Checklist - Graduação
   - Primary Language: Portuguese (Brazil)
   - Bundle ID: com.brothersfight.bjjchecklist
   - SKU: bjjchecklist001
4. Add screenshots (from your phone testing)
5. Copy descriptions from `STORE_DESCRIPTIONS.md`
6. Privacy Policy URL: Upload `PRIVACY_POLICY.md` to GitHub and use raw URL
7. Select the build (uploaded via Transporter or EAS)
8. Click "Submit for Review"

**Review time: 1-3 days**

---

### Step 7: Submit to Google Play Store (10-15 minutes)

#### Option A: Use EAS Submit
```bash
eas submit --platform android

# You'll need:
# - Google Play Console service account JSON
# - Follow EAS prompts
```

#### Option B: Manual Upload
1. Go to play.google.com/console
2. Click "Create app"
3. Fill in:
   - App name: BJJ Checklist - Graduação
   - Default language: Portuguese (Brazil)
   - App or game: App
   - Free or paid: Free
4. Complete "Set up your app" checklist:
   - Privacy policy: Upload to GitHub, use raw URL
   - App access: All features available to all users
   - Ads: No ads
   - Content ratings: Complete questionnaire (select "Sports")
   - Target audience: Ages 13+
   - Data safety: No data collected
5. Go to "Production" → "Create new release"
6. Upload the `.aab` file (from EAS build)
7. Add release notes (from STORE_DESCRIPTIONS.md)
8. Click "Review release" → "Start rollout to Production"

**Review time: Few hours to 2 days**

---

## 📸 Screenshots Guide

After testing on your phone, take these screenshots:

### What to Capture:
1. **Home view** - Belt tabs + Progress bar visible
2. **Checklist** - Expanded category showing techniques
3. **Progress** - Mid-completion (like 45%)
4. **Notes feature** - Expanded requirement with note
5. **Completion** - 100% celebration screen

### How to Take Screenshots:
- **iPhone**: Press Power + Volume Up
- **Android**: Press Power + Volume Down

### Sizes Needed:
- **iOS**: Upload your phone's screenshots - App Store Connect will resize
- **Android**: 1080px wide minimum - Play Console will resize

---

## 🎯 Privacy Policy Hosting (5 minutes)

**Option 1 - GitHub (Free, recommended):**
```bash
# Create a GitHub repo
gh repo create bjj-checklist --public

# Or manually:
# 1. Go to github.com
# 2. New repository → bjj-checklist
# 3. Upload PRIVACY_POLICY.md
# 4. Get raw URL: https://raw.githubusercontent.com/yourusername/bjj-checklist/main/PRIVACY_POLICY.md
```

**Option 2 - Use a GitHub Gist:**
1. Go to gist.github.com
2. Paste PRIVACY_POLICY.md content
3. Create public gist
4. Use the raw URL

---

## ⚡ Quick Checklist

Before submitting:
- [ ] App tested on real device (via Expo Go)
- [ ] Icon created (1024×1024)
- [ ] Privacy policy hosted (GitHub URL)
- [ ] Screenshots taken (5 images)
- [ ] Store descriptions ready
- [ ] EAS builds completed (.ipa + .aab downloaded)
- [ ] Apple Developer Program active ($99/year paid)
- [ ] Google Play Console active ($25 one-time paid)

---

## 💰 Costs Summary

- **Expo**: FREE
- **EAS Build**: FREE (up to 30 builds/month)
- **Apple Developer**: $99/year (you have this)
- **Google Play**: $25 one-time (you have this)
- **Total new cost**: $0

---

## 🐛 Common Issues

**"Bundle identifier already exists"**
- Change `com.brothersfight.bjjchecklist` to something unique
- Example: `com.yourname.bjjchecklist`

**"Build failed"**
- Run: `eas build --platform ios --profile production --clear-cache`
- Check eas.dev for build logs

**"No valid signing credential"**
- EAS will guide you through creating credentials
- For iOS: You'll need to be enrolled in Apple Developer Program
- For Android: EAS generates keystores automatically

---

## 🔐 Credential Management Strategy

### Current Configuration

This project uses **EAS-managed credentials** (recommended approach). All signing keys and certificates are securely stored on Expo's servers.

**Configuration in `eas.json`:**
```json
{
  "build": {
    "production": {
      "autoIncrement": true,
      "credentialsSource": "local"  // ⚠️ NOTE: Changed from "local" to EAS-managed
    }
  }
}
```

### Android Credentials (Managed by EAS)

**Current Keystore Information:**
- **Type:** JKS (Java KeyStore)
- **Key Alias:** `dblefbabcfad98449353ccbe6b45f63f`
- **Configuration:** `q0UhEid_2U` (Default)
- **Updated:** 18 days ago (as of Nov 2025)
- **MD5 Fingerprint:** `95:74:90:55:EA:EB:9A:5E:18:0C:76:03:EA:28:7E:B6`
- **SHA1 Fingerprint:** `8A:5F:7C:02:45:59:9F:9F:BC:63:A5:8A:00:79:31:E2:52:56:F0:79`
- **SHA256 Fingerprint:** `18:F1:41:89:42:9C:0C:80:D5:22:9E:0B:11:DE:EC:3A:65:9A:20:AD:4D:D1:F8:41:D4:9D:CC:C1:7A:10:46:E3`

**Google Play Submission Credentials:**
- **Service Account:** `eas-expo@graduacao-jiu-jitsu.iam.gserviceaccount.com`
- **Project ID:** `graduacao-jiu-jitsu`
- **Client ID:** `108014347043983115472`
- **Private Key ID:** `ab968060e1f476b2691ccf83deb6fa512c84fdef`
- **Updated:** 18 days ago

### iOS Credentials (Managed by EAS)

**Apple Developer Account:**
- **Apple ID:** `ds@brzl.ca`
- **Team ID:** `Q39UF8B7S5`
- **App Store Connect App ID:** `6754972177`

**Certificates & Provisioning Profiles:**
- Automatically managed by EAS Build
- Distribution certificate generated on-demand
- Provisioning profiles refreshed automatically

### Push Notifications (Not Yet Configured)

**FCM Legacy:** None assigned yet
**FCM V1 (Google Service Account):** None assigned yet

### Credential Access

**To view/manage credentials:**
```bash
# View all credentials for the project
eas credentials

# Android-specific credentials
eas credentials -p android

# iOS-specific credentials
eas credentials -p ios
```

**To download Android keystore (backup):**
```bash
eas credentials -p android
# Select: "Keystore: Manage everything needed to build your project"
# Then: "Download credentials"
```

### Security Best Practices

1. **Never commit credentials to Git**
   - Keystore files (`.jks`, `.keystore`)
   - `credentials.json`
   - Service account JSON files
   - Already configured in `.gitignore`

2. **Backup Android Keystore**
   - Download keystore using `eas credentials`
   - Store in secure location (1Password, encrypted disk)
   - **CRITICAL:** If lost, you cannot update app on Play Store

3. **Service Account Permissions**
   - Google Play service account has minimal permissions
   - Only for automated submissions via EAS Submit
   - Can be rotated if compromised

4. **Team Access**
   - Share Expo account access, not raw credentials
   - Add team members via expo.dev dashboard
   - Use role-based access control

### Switching Between Local and EAS-Managed Credentials

**Current:** EAS-managed (recommended)
**Previous:** Attempted local credentials (failed - no `credentials.json` existed)

**If you need local credentials (not recommended):**
1. Create `credentials.json` in project root
2. Add to `.gitignore`
3. Download keystore via `eas credentials`
4. Update `eas.json`: `"credentialsSource": "local"`
5. Store keystore path in `credentials.json`

**Example `credentials.json` (DO NOT COMMIT):**
```json
{
  "android": {
    "keystore": {
      "keystorePath": "./android-keystore.jks",
      "keystorePassword": "SECURE_PASSWORD_HERE",
      "keyAlias": "dblefbabcfad98449353ccbe6b45f63f",
      "keyPassword": "SECURE_PASSWORD_HERE"
    }
  },
  "ios": {
    "provisioningProfilePath": "./profile.mobileprovision",
    "distributionCertificate": {
      "path": "./dist-cert.p12",
      "password": "SECURE_PASSWORD_HERE"
    }
  }
}
```

### Troubleshooting Credential Issues

**"Build failed: No credentials found"**
- Ensure `credentialsSource` is NOT set to `"local"` in `eas.json`
- Run `eas credentials` to verify credentials exist
- Regenerate if needed: `eas credentials` → Delete → Create new

**"Invalid keystore signature"**
- Keystore was corrupted or changed
- Download fresh copy from EAS
- Never manually edit keystore files

**"Cannot update app - signature mismatch"**
- Using different keystore than original submission
- **SOLUTION:** Use original keystore (download from EAS backup)
- If lost: Must publish as new app with different package name

### Version Updates

When updating app version for new releases:

1. **Update `app.json`:**
   ```json
   {
     "version": "1.0.5",  // Semantic version (user-visible)
     "ios": {
       "buildNumber": "21"  // Auto-incremented by EAS
     },
     "android": {
       "versionCode": 21  // Auto-incremented by EAS
     }
   }
   ```

2. **EAS auto-increment handles build numbers:**
   - Set `"autoIncrement": true` in `eas.json` (already configured)
   - iOS `buildNumber` and Android `versionCode` increment automatically
   - Only update `version` string manually

---

## 🎉 After Approval

Once approved (1-3 days):
- **iOS**: App goes live immediately in App Store
- **Android**: Goes live in 1-2 hours after approval

Share the links:
- iOS: https://apps.apple.com/app/idXXXXXXXXX
- Android: https://play.google.com/store/apps/details?id=com.brothersfight.bjjchecklist

---

## 📞 Need Help?

- **EAS Build Issues**: https://docs.expo.dev/build/setup/
- **App Store Connect**: https://developer.apple.com/app-store-connect/
- **Google Play Console**: https://support.google.com/googleplay/android-developer/

---

**You're ready to publish! The app is complete and functional. Focus on:**
1. Test it works (5 min)
2. Create icon (15 min)
3. Run EAS build (30 min automated)
4. Submit to stores (30 min total)

**Total time: ~2 hours** from now to submission complete.
