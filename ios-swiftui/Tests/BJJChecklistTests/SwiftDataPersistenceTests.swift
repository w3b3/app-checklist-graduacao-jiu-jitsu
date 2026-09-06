import XCTest
import SwiftData
@testable import BJJChecklist

@MainActor
final class SwiftDataPersistenceTests: XCTestCase {
    var stack: SwiftDataStack!
    var repository: CurriculumRepository!

    override func setUp() async throws {
        stack = SwiftDataStack(inMemory: true)
        repository = CurriculumRepository()
    }

    func testCreateAndFetchProgressItemEntity() throws {
        let entity = ProgressItemEntity(
            gymId: "default",
            beltId: "azul",
            techniqueKey: "azul-quedas-1",
            isCompleted: true,
            notes: "Excelente entrada",
            mediaUrl: "https://example.com"
        )
        stack.context.insert(entity)
        try stack.context.save()

        let fetched = try repository.fetchProgressItem(
            compoundKey: "default#azul#azul-quedas-1",
            context: stack.context
        )
        XCTAssertNotNil(fetched)
        XCTAssertEqual(fetched?.compoundKey, "default#azul#azul-quedas-1")
        XCTAssertEqual(fetched?.isCompleted, true)
        XCTAssertEqual(fetched?.notes, "Excelente entrada")
    }

    func testUpsertUpdatesExistingEntity() throws {
        _ = try repository.upsertProgress(
            gymId: "default",
            beltId: "azul",
            techniqueKey: "azul-quedas-1",
            isCompleted: true,
            notes: "Nota inicial",
            mediaUrl: "",
            context: stack.context
        )

        // Update with new note and completed false
        _ = try repository.upsertProgress(
            gymId: "default",
            beltId: "azul",
            techniqueKey: "azul-quedas-1",
            isCompleted: false,
            notes: "Nota atualizada",
            mediaUrl: "https://video.com",
            context: stack.context
        )

        let items = try repository.fetchProgressItems(gymId: "default", context: stack.context)
        XCTAssertEqual(items.count, 1)
        XCTAssertEqual(items.first?.notes, "Nota atualizada")
        XCTAssertEqual(items.first?.isCompleted, false)
        XCTAssertEqual(items.first?.mediaUrl, "https://video.com")
    }

    func testResetBeltPersisted() throws {
        _ = try repository.upsertProgress(
            gymId: "default",
            beltId: "azul",
            techniqueKey: "azul-quedas-1",
            isCompleted: true,
            notes: "Nota 1",
            mediaUrl: "",
            context: stack.context
        )
        _ = try repository.upsertProgress(
            gymId: "default",
            beltId: "azul",
            techniqueKey: "azul-quedas-2",
            isCompleted: true,
            notes: "Nota 2",
            mediaUrl: "",
            context: stack.context
        )

        try repository.resetBelt(gymId: "default", beltId: "azul", context: stack.context)

        let items = try repository.fetchProgressItems(gymId: "default", context: stack.context)
        XCTAssertEqual(items.count, 2)
        XCTAssertTrue(items.allSatisfy { !$0.isCompleted })
        // Notes should be preserved
        XCTAssertEqual(items.first(where: { $0.techniqueKey == "azul-quedas-1" })?.notes, "Nota 1")
    }

    func testEngineSynchronizesWithSwiftData() throws {
        let engine = ProgressEngine(repository: repository, modelContext: stack.context)
        let reqs = engine.requirements(for: engine.selectedBelt, category: "Quedas")
        guard let firstReq = reqs.first else {
            XCTFail("Missing requirement")
            return
        }

        // Toggle on engine
        engine.toggleCompletion(for: firstReq)
        XCTAssertTrue(engine.isCompleted(techniqueKey: firstReq.id))

        // Create new engine with same context to simulate app relaunch
        let reloadedEngine = ProgressEngine(repository: repository, modelContext: stack.context)
        XCTAssertTrue(reloadedEngine.isCompleted(techniqueKey: firstReq.id))
        XCTAssertEqual(reloadedEngine.currentBeltProgress.completedCount, 1)
    }
}
