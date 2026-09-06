import Foundation
import SwiftData

@MainActor
public final class SwiftDataStack {
    public static let shared = SwiftDataStack(inMemory: false)
    public let container: ModelContainer
    public var context: ModelContext {
        container.mainContext
    }

    public init(inMemory: Bool = false) {
        let schema = Schema([ProgressItemEntity.self])
        let configuration = ModelConfiguration(
            isStoredInMemoryOnly: inMemory
        )
        do {
            self.container = try ModelContainer(for: schema, configurations: [configuration])
        } catch {
            fatalError("Failed to initialize ModelContainer: \(error.localizedDescription)")
        }
    }
}
