# React Native & Expo Rules

## Ecosystem & Compatibility
- **Expo SDK Version**: SDK 54 compatibility.
- **TypeScript**: Must remain on `~5.9.2` to adhere to Expo SDK 54 requirements. Do not downgrade.
- **Babel Plugin Ordering**: `babel.config.js` MUST list `react-native-reanimated/plugin` as the **last** plugin in the plugins array.

## Responsive & Tablet Layout
- **Landscape Detection**: Uses multi-strategy orientation detection (`expo-screen-orientation` primary, `Dimensions.get('screen')` fallback, aspect ratio > 1.2).
- **Split-View Threshold**: 768px screen width (iPad Mini and up).
- **Screen vs Window Dimensions**: Always use `Dimensions.get('screen')`, not `'window'`, for orientation and breakpoint checks on Android to avoid navigation/status bar sizing discrepancies.

## UI & Native Patterns
- Prefer native primitives: `Alert.prompt` (iOS) with graceful fallback on Android for notes/links.
- Keep the single-screen architecture lean; avoid introducing unnecessary nested navigation or heavy third-party modal libraries for v1.
- Haptics:
  - Checkbox toggle: `Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)`
  - Belt completion/share: `Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)`
