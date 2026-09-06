# Release & Version Management Rules

## Version Bumping Constraint
- **`app.json` Version Check**: Before initiating any production cloud build or store release command, always confirm with the user whether the `version` field in `app.json` should be incremented.
- The App Store and Google Play require an incremented version string for updates.
- EAS auto-increments internal build numbers (`ios.buildNumber`, `android.versionCode`) via `autoIncrement: true`, but marketing versions in `app.json` require intentional updates.

## Store Submission Prerequisites
- Check and verify assets before submitting:
  1. App icon (1024x1024 px without alpha channel)
  2. Screenshots (physical device captures)
  3. Hosted privacy policy link
