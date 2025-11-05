# Local Build Plan for Expo (EAS)

## Objectives
- Gain full control over build infrastructure while staying inside the Expo ecosystem.
- Avoid Expo cloud concurrency and usage limits by running `eas build --local`.
- Preserve automated signing, submissions, and update workflows wherever possible.

## Prerequisites
- Apple Developer account with required roles.
- Google Play Console account with admin access.
- macOS with Xcode (matching minimum version in Expo SDK release notes) and Command Line Tools installed.
- Android Studio (or standalone command-line tools) with Android SDK Platform and Build Tools versions required by the Expo SDK.
- Homebrew for dependency management.
- Node.js LTS (managed by `nvm` or `fnm`), `yarn` or `npm`, and Watchman (`brew install watchman`).
- Latest Expo CLI and EAS CLI (`npm install -g expo-cli eas-cli` or project-level scripts).
- Ruby toolchain with Fastlane and CocoaPods available (`brew install fastlane cocoapods` or add to a `Gemfile` and run `bundle install`; confirm `fastlane --version` and `pod --version` work in your shell).

## Environment Setup
1. **Validate macOS tools**
   - Launch Xcode once so CLI tools agree to the license (`sudo xcodebuild -license` if prompted).
   - Confirm `xcode-select -p` points to the active Xcode bundle.
2. **Android SDK**
   - Open Android Studio → SDK Manager → install latest `Android SDK Platform` for the Expo target (check `eas build:configure` output) plus `Google Play services` and `Android SDK Build-Tools`.
   - Ensure `ANDROID_HOME` (or `ANDROID_SDK_ROOT`) and `JAVA_HOME` are exported in the shell profile used for builds.
3. **Verify CLI versions**
   - `eas --version` and `expo --version` should match the minimum versions in the Expo SDK release blog.
   - Add project scripts, e.g. `"eas:build:ios:local": "eas build --platform ios --local"`, to keep usage consistent.

## Credential Management
1. Run `eas credentials` to confirm distribution certificate, provisioning profile, and Android keystore exist in Expo’s credential store.
2. For iOS local builds:
   - Keep “Use remote credentials” enabled during `eas build --local`; Expo will download the certs/profiles into `~/Library/Developer/Xcode/DerivedData/ExpoLocalApp/`.
   - Optional: run `eas credentials:download --platform ios` to cache copies in `credentials/ios/` for backup.
3. For Android local builds:
   - Download the keystore once via `eas credentials:download --platform android` and store it in `credentials/android/`.
   - Update `gradle.properties` entries (`MYAPP_UPLOAD_STORE_FILE`, etc.) if you migrate to the bare workflow.

## Running Local Builds
1. **Base command structure**
   ```bash
   eas build --platform ios --profile production --local
   eas build --platform android --profile production --local
   ```
2. **First run checks**
   - CLI will prompt to install additional tools (CocoaPods, Ruby gems). Approve and note any manual steps.
   - If the iOS build fails because of keychain access, unlock the login keychain and re-run.
   - For Android, confirm Gradle caches under `~/.gradle` are writable.
3. **Artifact locations**
   - iOS: `dist/ios/*.ipa`
   - Android: `dist/android/*.aab` and optionally `.apk` depending on profile.
4. **Logs and debugging**
   - Use `--verbose` for more output.
   - Inspect native project directories generated under `./build` for temporary build assets (cleanable via `rm -rf build`).

## Store Submission Automation
1. Gather store API credentials early:
   - App Store Connect: create API key with `App Manager` role and store `AuthKey_*.p8`, issuer ID, and key ID.
   - Google Play: service account JSON key with `Release Manager` or higher.
2. Add submission scripts:
   ```bash
   eas submit --platform ios --path dist/ios/*.ipa --profile production --local
   eas submit --platform android --path dist/android/*.aab --profile production --local
   ```
3. Store API keys securely (e.g., in macOS Keychain or 1Password) and reference via environment variables (`EXPO_IOS_APP_STORE_API_KEY_PATH`, `EXPO_ANDROID_KEYSTORE_PASSWORD`, etc.).
4. Document checklist steps for each release (version bump, changelog, OTA updates) in `PUBLISHING_GUIDE.md` and reference this plan.

## Automation & CI
- Optional: wire up GitHub Actions or another CI runner on a macOS host to execute the same `--local` commands, giving you reproducible builds without Expo queues.
- Cache `node_modules`, `~/.gradle`, and CocoaPods (`~/Library/Caches/CocoaPods`) between runs to shorten build times.
- For CI signing, store downloaded credentials in the CI secrets manager and inject them during the build step.

## Maintenance Tasks
- Track Expo SDK release notes for required Xcode/Android toolchain updates.
- Rotate Apple distribution certificates and provisioning profiles annually (Expo CLI will prompt before expiry; schedule a maintenance reminder).
- Back up downloaded credentials in encrypted storage.
- Periodically clean Derived Data (`rm -rf ~/Library/Developer/Xcode/DerivedData/*`) if Xcode-related build issues appear.
- Monitor build logs for warnings about deprecated Gradle plugins or iOS build settings and resolve them before they break future releases.

## Troubleshooting: EAS Local Build Issues

### Issue: Certificate Import Failures
If `eas build --local` fails with certificate import errors to temporary keychain:

**Workaround: Direct Xcode Build**

1. **Import certificate to login keychain**
   ```bash
   security import credentials/ios/dist-cert.p12 \
     -k ~/Library/Keychains/login.keychain-db \
     -P "PASSWORD_FROM_CREDENTIALS_JSON" \
     -T /usr/bin/codesign \
     -T /usr/bin/security
   ```

2. **Install provisioning profile**
   ```bash
   # Get UUID from profile
   PROFILE_UUID=$(security cms -D -i credentials/ios/profile.mobileprovision | \
     grep -A 1 "UUID" | grep "string" | sed 's/.*<string>\(.*\)<\/string>.*/\1/')

   # Copy to standard location
   cp credentials/ios/profile.mobileprovision \
     ~/Library/MobileDevice/Provisioning\ Profiles/${PROFILE_UUID}.mobileprovision
   ```

3. **Configure Xcode project for manual signing**

   Edit `ios/BJJChecklist.xcodeproj/project.pbxproj` in the Release configuration:
   ```xml
   CODE_SIGN_IDENTITY = "iPhone Distribution";
   CODE_SIGN_STYLE = Manual;
   DEVELOPMENT_TEAM = YOUR_TEAM_ID;
   PROVISIONING_PROFILE_SPECIFIER = "PROFILE_NAME_FROM_MOBILEPROVISION";
   ```

   Get team ID and profile name:
   ```bash
   # Team ID
   security cms -D -i credentials/ios/profile.mobileprovision | \
     grep -A 2 "TeamIdentifier" | grep "string"

   # Profile name
   security cms -D -i credentials/ios/profile.mobileprovision | \
     grep -A 1 "<key>Name</key>" | grep "string"
   ```

4. **Ensure babel-preset-expo is installed**
   ```bash
   npm install --save-dev babel-preset-expo
   ```

5. **Build archive**
   ```bash
   xcodebuild -workspace ios/BJJChecklist.xcworkspace \
     -scheme BJJChecklist \
     -configuration Release \
     -archivePath build/BJJChecklist.xcarchive \
     archive
   ```

6. **Export to IPA**

   Create `build/ExportOptions.plist`:
   ```xml
   <?xml version="1.0" encoding="UTF-8"?>
   <!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
   <plist version="1.0">
   <dict>
       <key>method</key>
       <string>app-store</string>
       <key>teamID</key>
       <string>YOUR_TEAM_ID</string>
       <key>provisioningProfiles</key>
       <dict>
           <key>com.yourapp.bundleid</key>
           <string>PROFILE_NAME</string>
       </dict>
       <key>signingCertificate</key>
       <string>iPhone Distribution</string>
       <key>signingStyle</key>
       <string>manual</string>
       <key>uploadBitcode</key>
       <false/>
       <key>uploadSymbols</key>
       <true/>
   </dict>
   </plist>
   ```

   Export:
   ```bash
   xcodebuild -exportArchive \
     -archivePath build/BJJChecklist.xcarchive \
     -exportOptionsPlist build/ExportOptions.plist \
     -exportPath build/output
   ```

   IPA will be at: `build/output/BJJChecklist.ipa`

## Expo SDK Upgrades

### SDK 51 → 54 Migration Notes

**Major version changes:**
- React: 18.2.0 → 19.1.0
- React Native: 0.74.5 → 0.81.5
- TypeScript: 5.3.x → 5.9.x
- Minimum iOS: 13+ → 15.1+
- Minimum Xcode: 15.0 → 16.1+

**Upgrade process:**
```bash
# 1. Upgrade Expo
npm install expo@^54.0.0

# 2. Update all dependencies
npx expo install --fix

# 3. Update dev dependencies
npm install --save-dev @types/react@~19.1.10 typescript@~5.9.2 babel-preset-expo

# 4. Run doctor
npx expo-doctor

# 5. Update iOS pods (if ios/ exists)
npx pod-install

# 6. Clean build
rm -rf node_modules package-lock.json
npm install
```

**Common issues:**
- Missing `expo-font`: Required by `@expo/vector-icons` - install with `npx expo install expo-font`
- TypeScript errors: Update parameter types to be explicit (e.g., `text?: string` instead of implicit `any`)
- Prebuild conflict warning: Normal when `ios/` folder exists with app.json config - can ignore

## Next Steps
1. Run a trial `eas build --platform ios --local` to confirm environment readiness.
2. If EAS local build fails with certificate errors, use the Direct Xcode Build workaround above.
3. Follow with `eas submit --platform ios --local` using a sandbox build to validate the submission path.
4. Repeat for Android, ensuring the Play Console service account works end-to-end.
5. Update `PUBLISHING_GUIDE.md` with any project-specific deltas discovered during the dry runs.
