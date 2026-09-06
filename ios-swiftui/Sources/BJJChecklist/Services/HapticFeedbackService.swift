import Foundation
#if canImport(UIKit)
import UIKit
#endif

public final class HapticFeedbackService: @unchecked Sendable {
    public static let shared = HapticFeedbackService()

    private init() {}

    public func playImpactLight() {
        #if canImport(UIKit) && !os(watchOS) && !os(tvOS)
        let generator = UIImpactFeedbackGenerator(style: .light)
        generator.prepare()
        generator.impactOccurred()
        #endif
    }

    public func playImpactMedium() {
        #if canImport(UIKit) && !os(watchOS) && !os(tvOS)
        let generator = UIImpactFeedbackGenerator(style: .medium)
        generator.prepare()
        generator.impactOccurred()
        #endif
    }

    public func playCelebration() {
        #if canImport(UIKit) && !os(watchOS) && !os(tvOS)
        let generator = UINotificationFeedbackGenerator()
        generator.prepare()
        generator.notificationOccurred(.success)
        #endif
    }

    public func playWarning() {
        #if canImport(UIKit) && !os(watchOS) && !os(tvOS)
        let generator = UINotificationFeedbackGenerator()
        generator.prepare()
        generator.notificationOccurred(.warning)
        #endif
    }
}
