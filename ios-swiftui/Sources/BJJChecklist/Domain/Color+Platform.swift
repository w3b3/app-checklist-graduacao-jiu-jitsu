import SwiftUI

#if canImport(UIKit)
import UIKit
#elseif canImport(AppKit)
import AppKit
#endif

extension Color {
    #if canImport(UIKit)
    public static let appSystemBackground = Color(uiColor: .systemBackground)
    public static let appSecondarySystemBackground = Color(uiColor: .secondarySystemBackground)
    public static let appTertiarySystemFill = Color(uiColor: .tertiarySystemFill)
    public static let appSystemGroupedBackground = Color(uiColor: .systemGroupedBackground)
    #elseif canImport(AppKit)
    public static let appSystemBackground = Color(nsColor: .windowBackgroundColor)
    public static let appSecondarySystemBackground = Color(nsColor: .controlBackgroundColor)
    public static let appTertiarySystemFill = Color(nsColor: .quaternaryLabelColor)
    public static let appSystemGroupedBackground = Color(nsColor: .underPageBackgroundColor)
    #endif
}
