---
name: publish-app
description: >-
  Use this skill when preparing, building, or submitting a new release of the app to the Apple App Store or Google Play Store via EAS Build.
---

# Publishing App to Production

Follow this runbook when building or releasing a new version of the BJJ Belt Progression Checklist app.

## Step 1: Pre-flight Checks

1. Verify working directory is clean:
   ```bash
   git status
   ```
2. Check `app.json` version:
   - Ask the user if the version needs to be bumped (e.g., from `1.0.0` to `1.0.1`).
   - If bumping, update `"version": "x.y.z"` in `app.json`.
3. Verify store submission assets:
   - App icon (1024x1024px PNG)
   - Privacy policy link:
     `https://raw.githubusercontent.com/w3b3/app-checklist-graduacao-jiu-jitsu/main/PRIVACY_POLICY.md`

## Step 2: Cloud Builds with EAS

Trigger production builds:

```bash
# iOS Production Build
eas build --platform ios --profile production

# Android Production Build
eas build --platform android --profile production
```

Monitor build progress:
```bash
eas build:list --limit 3
```

## Step 3: Store Submission

Once the EAS builds succeed:

```bash
# Submit to App Store
eas submit --platform ios

# Submit to Google Play Store
eas submit --platform android
```

## Step 4: Verification

Check submission status on:
- [App Store Connect](https://appstoreconnect.apple.com/)
- [Google Play Console](https://play.google.com/console/)
- EAS Project Dashboard: `https://expo.dev/accounts/[username]/projects/[project-name]`
