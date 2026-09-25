# Minha Próxima Faixa by tatame0 — App Store Connect

## App identity

- App Store Connect app ID: `6754972177`
- Bundle ID: `com.brothersfight.bjjchecklist`
- Apple Developer team: `Q39UF8B7S5`
- Primary locale: `pt-BR`
- Category, age rating, pricing, availability, and App Privacy: inherited from the approved 2.0.2 listing; reconfirm with the data controller if app behavior or processors change.

## Store copy and review materials

- Name: Minha Próxima Faixa by tatame0
- Subtitle: Seu caminho na graduação BJJ
- Description and keywords: retained from the approved 2.0.2 listing; draft copy is in [APP_STORE_METADATA_PT-BR.md](APP_STORE_METADATA_PT-BR.md).
- 2.0.3 What's New: Novo ícone com uma faixa de Jiu-Jitsu e graus, criado para deixar o app mais fácil de reconhecer na tela inicial.
- Support URL: https://tatame0.com/support/
- Privacy policy URL: https://tatame0.com/privacy/
- Marketing URL: https://tatame0.com
- App Review contact: retained in App Store Connect. No demo account is required because the app works offline without login.
- Screenshots: the approved iPhone and iPad screenshot sets carried over to 2.0.3; App Store Connect reported all 10 assets `COMPLETE` on September 25, 2026.
- App Privacy and export compliance: no tracking or new data processor was added by this icon-only release; build 27 is marked `usesNonExemptEncryption: false` in App Store Connect. Confirm privacy/legal copy with the data controller when app behavior changes.

## 2.0.3 release record — September 25, 2026

- Source icon: `assets/icon.svg`; generated 1024px PNGs are aligned across Expo, Android, and this Xcode asset catalog. Re-render with `bash assets/render-icon.sh` from the repository root.
- Version/build: 2.0.3 (27), distribution-signed for team `Q39UF8B7S5`.
- Verification: `xcodebuild test -project ios-swiftui/BJJChecklist.xcodeproj -scheme BJJChecklist -destination 'platform=iOS Simulator,id=7FECDC51-F9DB-41F1-A541-9DA4D6A7EB49' CODE_SIGNING_ALLOWED=NO -quiet` passed. The app installed and launched on a connected iPad Air (5th generation), then the temporary test installation was removed. The exported IPA passed `xcrun altool --validate-app` with no errors.
- App Store Connect build ID: `3d979b3d-cbe9-4fa5-9be8-31bc7fb407f2`; processing state `VALID`.
- App Store version ID: `73b5287a-9893-42dc-9888-014d12c7b3f0`.
- Review submission ID: `6c22567d-d3ad-4173-9d17-0c27e11d7c77`; submitted September 25, 2026 at 14:28:53 UTC; state `WAITING_FOR_REVIEW` at last check.
- Release setting: `AFTER_APPROVAL`. Apple review is pending; the live listing remains 2.0.2 until approval.

## Submission checklist for future versions

- [ ] Increment marketing version and build number; confirm bundle ID and team.
- [ ] Run tests, smoke test on device, archive, export, and inspect the signed IPA.
- [ ] Validate and upload the IPA; wait for build processing to become `VALID`.
- [ ] Recheck icon, screenshots, metadata, public support/privacy pages, App Privacy, age rating, export compliance, and App Review access.
- [ ] Attach the exact build to the matching App Store version and submit for review.
- [ ] Record the build and submission IDs, then monitor Apple's decision and live storefront.
