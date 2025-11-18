# Android Keystore Recovery Guide

## 🚨 Problem: "The Android App Bundle was signed with the wrong key"

**What happened:**
During debugging, a new Android keystore was created in EAS. When you tried to submit an update to Google Play Store, it rejected the APK/AAB because it was signed with a different key than the original app submission.

**Why this is critical:**
- Google Play Store requires ALL app updates to be signed with the SAME keystore as the original
- If you can't recover the original keystore, you cannot update your app
- Worst case: You'd need to publish a completely new app with a different package name

---

## Step 1: Identify the Problem

### Current Situation

Based on your earlier `eas credentials` output:

**Available Keystore in EAS:**
- **Key Alias:** `dblefbabcfad98449353ccbe6b45f63f`
- **Configuration:** `q0UhEid_2U` (Default)
- **Type:** JKS
- **Updated:** 18 days ago
- **SHA256 Fingerprint:** `18:F1:41:89:42:9C:0C:80:D5:22:9E:0B:11:DE:EC:3A:65:9A:20:AD:4D:D1:F8:41:D4:9D:CC:C1:7A:10:46:E3`

**Questions to determine:**
1. Is this the ORIGINAL keystore or the NEW one created during debugging?
2. Does Google Play Console have the original keystore fingerprint?
3. Is Google Play App Signing enabled for your app?

---

## Step 2: Check Google Play Console Settings

### 2A: Check if Play App Signing is Enabled

**Go to Google Play Console:**
1. Navigate to: https://play.google.com/console
2. Select your app: **BJJ Checklist - Graduação**
3. Go to: **Setup → App integrity → App signing**

**You'll see one of two scenarios:**

#### Scenario A: Play App Signing is ENABLED ✅ (Easy Fix)

If you see:
- "App signing by Google Play" status: **Active**
- **App signing key certificate** (managed by Google)
- **Upload key certificate** (what you use to sign uploads)

**This is GOOD NEWS!** Recovery is simple:
- Google holds the real signing key
- You just need to register your new upload certificate
- Your app can still be updated

**Proceed to:** Recovery Path A (below)

#### Scenario B: Play App Signing is DISABLED ❌ (Harder)

If you see:
- "App signing by Google Play" status: **Not active**
- Or only one certificate shown

**This means:**
- Your upload keystore IS the app signing key
- You MUST use the original keystore
- Need to find it in EAS backups

**Proceed to:** Recovery Path B (below)

---

## Recovery Path A: Play App Signing Enabled (Recommended)

### What This Means

When Play App Signing is enabled:
- **App signing key:** Managed by Google, never changes
- **Upload key:** You can change this if needed
- **Solution:** Register your new keystore as the new upload certificate

### Steps to Fix

#### Step 1: Generate Upload Certificate from New Keystore

Run this command to get the new keystore's certificate:

```bash
# This will prompt you interactively
eas credentials

# Select:
# > Android
# > production
# > Keystore: Manage everything needed to build your project
# > Download credentials (Keystore)
```

**Save the keystore file somewhere secure** (e.g., `~/bjj-keystore-backup.jks`)

#### Step 2: Extract Certificate from Keystore

```bash
# Replace with your actual keystore path and alias
keytool -export -rfc \
  -keystore ~/bjj-keystore-backup.jks \
  -alias dblefbabcfad98449353ccbe6b45f63f \
  -file upload_certificate.pem

# When prompted for password, check EAS (it's shown in credentials output)
```

#### Step 3: Register New Upload Certificate in Play Console

1. Go to: **Play Console → Setup → App integrity → App signing**
2. Scroll to: **Upload key certificate**
3. Click: **Request upload key reset**
4. Follow the prompts and upload `upload_certificate.pem`
5. Google will review (usually approved within 24 hours)

**Once approved:**
- ✅ Your new keystore becomes the official upload key
- ✅ Future builds with this keystore will be accepted
- ✅ App signing key (managed by Google) remains unchanged
- ✅ Users can still update the app seamlessly

---

## Recovery Path B: Play App Signing Disabled (Original Keystore Required)

### What This Means

Your upload keystore IS the app signing key. You MUST find and restore the original keystore.

### Step 1: List All Available Keystores in EAS

**Check EAS credential history:**

```bash
# Run this and select options interactively:
eas credentials

# Navigate to:
# > Android
# > production
# > Keystore: Manage everything needed to build your project
# > Show keystore information
```

**Look for:**
- Multiple keystore configurations
- Creation dates
- Fingerprints

### Step 2: Identify the Original Keystore

**Get the original keystore fingerprint from Play Console:**

1. Go to: **Play Console → Setup → App integrity → App signing**
2. Under **App signing key certificate**, note the **SHA-256 certificate fingerprint**
3. Compare with the SHA-256 from EAS credentials

**Example comparison:**
```
Play Console SHA-256: 18:F1:41:89:42:9C:0C:80:D5:22:9E:0B...
EAS Keystore SHA-256: 18:F1:41:89:42:9C:0C:80:D5:22:9E:0B...
```

**If they match:** ✅ You already have the right keystore!
**If they don't match:** ❌ Need to find the original

### Step 3: Search for Original Keystore

**Option A: Check older EAS build credentials**

```bash
# Check builds from before the debugging session
eas build:list --platform android --limit 20

# Note the build ID of a SUCCESSFUL submission to Play Store
# Then check what keystore that build used
```

Go to Expo dashboard:
- https://expo.dev/accounts/willisbrown/projects/bjj-checklist/builds
- Find a build that was successfully submitted to Play Store
- Check which credential configuration it used

**Option B: Check local backups**

Search your machine for any keystore backups:

```bash
# Search home directory
find ~ -name "*.jks" -o -name "*.keystore" 2>/dev/null

# Common locations:
ls -la ~/.android/
ls -la ~/Downloads/
ls -la ~/Desktop/
```

**Option C: Contact Expo Support**

If you can't find the original:
- Email: support@expo.dev
- Explain: "Accidentally created new keystore, need to restore original"
- Provide: App name, account email, project ID
- They may have backup/history

### Step 4: Restore Original Keystore

**Once you've found the original keystore:**

```bash
eas credentials

# Select:
# > Android
# > production
# > Keystore: Manage everything needed to build your project
# > Remove keystore (CAREFUL: Only if you have the original backed up!)
# > Set up a new keystore
# > Upload existing keystore
```

**Upload your original keystore file** and provide:
- Keystore password
- Key alias
- Key password

### Step 5: Verify Fingerprint Matches

After restoring:

```bash
eas credentials

# View the SHA-256 fingerprint and compare with Play Console
```

**Must match EXACTLY** or submissions will still fail.

---

## Recovery Path C: Original Keystore is Lost (Worst Case)

### If You Cannot Find the Original Keystore

**Unfortunately, if:**
- ❌ Original keystore is permanently lost
- ❌ No backups exist in EAS or locally
- ❌ Play App Signing was not enabled
- ❌ Expo support cannot recover it

**You have NO way to update your app on the current package name.**

### Options (All are painful):

#### Option 1: Publish as New App

**Process:**
1. Change package name in `app.json`:
   ```json
   "android": {
     "package": "com.brothersfight.bjjchecklist2"  // New name
   }
   ```
2. Submit as a completely new app to Play Store
3. Notify existing users to download the new app
4. Eventually unpublish the old app

**Consequences:**
- ❌ Lose all existing reviews/ratings
- ❌ Lose download count/statistics
- ❌ Lose existing user base (must migrate)
- ❌ Start from zero in Play Store rankings
- ❌ Confusing for users (two apps with same name)

#### Option 2: Contact Google Play Support (Long shot)

**As a last resort:**
1. Go to: Play Console → Help → Contact support
2. Explain: "Lost signing key, need to reset"
3. Provide proof of app ownership
4. Google MAY (very rarely) allow a key reset

**Reality:**
- 99% of the time, Google will say "No way to help"
- This is a security feature, not a bug
- You're expected to keep keystores secure

---

## Step 3: Test the Fix

### After Restoring the Correct Keystore

**Run a new build:**

```bash
# Clean build
eas build --platform android --profile production --clear-cache
```

**Wait for build to complete, then:**

```bash
# Submit to Play Store
eas submit --platform android --latest
```

**Expected outcomes:**

✅ **Success:** "Upload successful" → Original keystore restored correctly
❌ **Failure:** "Wrong key error" → Need to retry recovery steps

---

## Step 4: Prevent This From Happening Again

### Immediate Actions

**1. Backup your keystore RIGHT NOW:**

```bash
eas credentials

# Download keystore to secure location:
# - 1Password vault
# - Encrypted cloud storage (iCloud Keychain, Google Drive with encryption)
# - External hard drive (encrypted)
```

**2. Enable Google Play App Signing (if not already enabled):**

Go to: **Play Console → Setup → App integrity → App signing → Opt in**

**Why this helps:**
- Google manages the permanent signing key
- You can reset upload keys if lost
- Much easier recovery process

**3. Document keystore information:**

Add to your password manager:
- Keystore password
- Key alias
- Key password
- SHA-256 fingerprint
- Location of backup file

### Best Practices Going Forward

**Never:**
- ❌ Delete keystores without verification
- ❌ Create new keystores unless absolutely necessary
- ❌ Share keystores via insecure channels
- ❌ Commit keystores to Git (already in .gitignore)

**Always:**
- ✅ Use EAS-managed credentials (current setup)
- ✅ Backup keystores after any changes
- ✅ Verify keystore before submitting to stores
- ✅ Use Google Play App Signing
- ✅ Document keystore passwords in password manager

---

## Quick Diagnostic Commands

**Check current keystore in EAS:**
```bash
eas credentials
# Select Android > production > Show keystore info
```

**Get SHA-256 from keystore file:**
```bash
keytool -list -v -keystore path/to/keystore.jks \
  -alias YOUR_ALIAS | grep SHA256
```

**Check what keystore a build used:**
```bash
eas build:view BUILD_ID
# Look for credential configuration used
```

**Download current keystore:**
```bash
eas credentials
# Android > production > Download keystore
```

---

## Summary Decision Tree

```
┌─ Is Play App Signing enabled? ─┐
│                                  │
YES                               NO
│                                  │
├─ Easy Fix:                      ├─ Hard Fix:
│  1. Generate upload cert        │  1. Find original keystore
│  2. Request key reset           │  2. Compare SHA-256 with Play Console
│  3. Upload new cert             │  3. Restore original in EAS
│  4. Wait 24hrs approval         │  4. Rebuild and submit
│  5. Done! ✅                    │
│                                  │
│                                  ├─ Cannot find original?
│                                  │  1. Contact Expo support
│                                  │  2. Check all backups
│                                  │  3. Last resort: New app ❌
└──────────────────────────────────┘
```

---

## Need Help?

**If you're stuck:**
1. Share the SHA-256 from your current EAS keystore
2. Share the SHA-256 from Play Console (App signing key)
3. Confirm if Play App Signing is enabled or not

I can help determine the exact recovery path.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
