import SwiftUI

public struct ContentView: View {
    @Bindable var engine: ProgressEngine

    public init(engine: ProgressEngine) {
        self.engine = engine
    }

    public var body: some View {
        ChecklistHomeView(engine: engine)
    }
}
