import SwiftUI
import SwiftData

@main
struct BJJChecklistApp: App {
    @State private var engine: ProgressEngine
    private let stack = SwiftDataStack.shared

    init() {
        let stack = SwiftDataStack.shared
        let repository = CurriculumRepository()
        let initialEngine = ProgressEngine(repository: repository, modelContext: stack.context)
        _engine = State(initialValue: initialEngine)
    }

    var body: some Scene {
        WindowGroup {
            ChecklistHomeView(engine: engine)
                .modelContainer(stack.container)
        }
    }
}
