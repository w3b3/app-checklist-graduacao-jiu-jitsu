#!/usr/bin/env bash
set -euo pipefail

icon_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
source_svg="$icon_root/assets/icon.svg"

command -v rsvg-convert >/dev/null || {
  echo 'rsvg-convert is required to render the app icon' >&2
  exit 1
}

targets=(
  "$icon_root/assets/icon.png"
  "$icon_root/assets/adaptive-icon.png"
  "$icon_root/ios-swiftui/Sources/BJJChecklist/Resources/Assets.xcassets/AppIcon.appiconset/AppIcon.png"
)

# Expo's ios/ directory is generated and may not exist in a fresh clone.
legacy_icon="$icon_root/ios/BJJChecklist/Images.xcassets/AppIcon.appiconset/App-Icon-1024x1024@1x.png"
if [[ -d "$(dirname "$legacy_icon")" ]]; then
  targets+=("$legacy_icon")
fi

for target in "${targets[@]}"
do
  rsvg-convert --format png --width 1024 --height 1024 "$source_svg" --output "$target"
done
