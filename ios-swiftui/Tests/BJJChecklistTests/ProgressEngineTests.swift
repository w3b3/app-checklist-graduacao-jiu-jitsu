import XCTest
@testable import BJJChecklist

@MainActor
final class ProgressEngineTests: XCTestCase {
    func testInitialEngineState() {
        let engine = ProgressEngine()
        XCTAssertEqual(engine.selectedBelt.id, "azul")
        XCTAssertEqual(engine.activeGym.id, "default")
        XCTAssertTrue(engine.completedKeys.isEmpty)
        XCTAssertEqual(engine.currentBeltProgress.completedCount, 0)
        XCTAssertEqual(engine.currentBeltProgress.percentage, 0.0)
    }

    func testToggleCompletionO1Lookup() {
        let engine = ProgressEngine()
        let azulReqs = engine.requirements(for: engine.selectedBelt, category: "Quedas")
        guard let firstReq = azulReqs.first else {
            XCTFail("Missing Quedas requirement")
            return
        }

        XCTAssertFalse(engine.isCompleted(for: firstReq))
        XCTAssertFalse(engine.isCompleted(techniqueKey: firstReq.id))

        engine.toggleCompletion(for: firstReq)
        XCTAssertTrue(engine.isCompleted(for: firstReq))
        XCTAssertTrue(engine.isCompleted(techniqueKey: firstReq.id))
        XCTAssertTrue(engine.completedKeys.contains(firstReq.compoundKey))
        XCTAssertEqual(engine.currentBeltProgress.completedCount, 1)

        engine.toggleCompletion(for: firstReq)
        XCTAssertFalse(engine.isCompleted(for: firstReq))
        XCTAssertFalse(engine.isCompleted(techniqueKey: firstReq.id))
        XCTAssertFalse(engine.completedKeys.contains(firstReq.compoundKey))
        XCTAssertEqual(engine.currentBeltProgress.completedCount, 0)
    }

    func testCategoryProgressComputation() {
        let engine = ProgressEngine()
        let category = "Quedas"
        let reqs = engine.requirements(for: engine.selectedBelt, category: category)
        XCTAssertFalse(reqs.isEmpty)

        let initialProgress = engine.progress(for: engine.selectedBelt, category: category)
        XCTAssertEqual(initialProgress.completedCount, 0)
        XCTAssertEqual(initialProgress.totalCount, reqs.count)

        for req in reqs {
            engine.toggleCompletion(for: req)
        }

        let completeProgress = engine.progress(for: engine.selectedBelt, category: category)
        XCTAssertEqual(completeProgress.completedCount, reqs.count)
        XCTAssertTrue(completeProgress.isCompleted)
    }

    func testNotesAndMediaUrlUpdate() {
        let engine = ProgressEngine()
        let reqs = engine.requirements(for: engine.selectedBelt, category: "Quedas")
        guard let req = reqs.first else {
            XCTFail("Missing technique")
            return
        }

        XCTAssertFalse(engine.hasNotesOrMedia(for: req))
        XCTAssertEqual(engine.note(for: req), "")
        XCTAssertEqual(engine.mediaUrl(for: req), "")

        engine.updateNotesAndMedia(
            for: req,
            notes: "Pegada firme no joelho ao atacar",
            mediaUrl: "https://youtube.com/watch?v=12345",
            isCompleted: true
        )

        XCTAssertTrue(engine.hasNotesOrMedia(for: req))
        XCTAssertEqual(engine.note(for: req), "Pegada firme no joelho ao atacar")
        XCTAssertEqual(engine.mediaUrl(for: req), "https://youtube.com/watch?v=12345")
        XCTAssertTrue(engine.isCompleted(for: req))
    }

    func testSearchFiltering() {
        let engine = ProgressEngine()
        engine.searchText = "Double Leg"
        let searchResults = engine.requirements(for: engine.selectedBelt, category: "Quedas")
        XCTAssertEqual(searchResults.count, 1)
        XCTAssertEqual(searchResults.first?.name, "Double Leg")

        engine.searchText = "termo_inexistente_123"
        let emptyResults = engine.requirements(for: engine.selectedBelt, category: "Quedas")
        XCTAssertTrue(emptyResults.isEmpty)

        engine.searchText = ""
        let allResults = engine.requirements(for: engine.selectedBelt, category: "Quedas")
        XCTAssertEqual(allResults.count, 2)
    }

    func testSearchWithPortugueseDiacriticsAndNormalization() {
        let engine = ProgressEngine()

        // 1. "saida" without accent matches "Saída da Montada" in category "Saídas"
        engine.searchText = "saida"
        let saidasResults = engine.requirements(for: engine.selectedBelt, category: "Saídas")
        XCTAssertFalse(saidasResults.isEmpty, "Query 'saida' must match 'Saída da Montada' despite missing accent")
        XCTAssertTrue(saidasResults.contains(where: { $0.name.contains("Saída da Montada") }))

        // 2. "mata leao" without hyphen and without accent matches "Mata-Leão" in "Costas"
        engine.searchText = "mata leao"
        let costasResults = engine.requirements(for: engine.selectedBelt, category: "Costas")
        XCTAssertFalse(costasResults.isEmpty, "Query 'mata leao' must match 'Mata-Leão'")
        XCTAssertTrue(costasResults.contains(where: { $0.name == "Mata-Leão" }))

        // 3. "armlock" without space matches "Arm lock"
        engine.searchText = "armlock"
        let armlockResults = engine.requirements(for: engine.selectedBelt, category: "Guarda Fechada")
        XCTAssertFalse(armlockResults.isEmpty, "Query 'armlock' must match 'Arm lock'")

        // 4. "pe" without accent matches "Ataque de Pé"
        engine.searchText = "pe"
        let peResults = engine.requirements(for: engine.selectedBelt, category: "Ataque de Pé")
        XCTAssertFalse(peResults.isEmpty, "Query 'pe' must match category 'Ataque de Pé'")

        // 5. Searching notes with diacritics
        if let firstReq = engine.requirements(for: engine.selectedBelt, category: "Quedas").first {
            engine.updateNotesAndMedia(
                for: firstReq,
                notes: "Atenção especial à flexão de joelho e pressão contínua",
                mediaUrl: ""
            )
            // Search "pressao" (no accent) matches "pressão" in note
            engine.searchText = "pressao"
            let noteMatch = engine.requirements(for: engine.selectedBelt, category: "Quedas")
            XCTAssertFalse(noteMatch.isEmpty, "Query 'pressao' must match note with 'pressão'")
        }
    }

    func testResetCurrentBelt() {
        let engine = ProgressEngine()
        let reqs = engine.requirements(for: engine.selectedBelt, category: "Quedas")
        for req in reqs {
            engine.toggleCompletion(for: req)
        }
        XCTAssertEqual(engine.currentBeltProgress.completedCount, reqs.count)

        engine.resetCurrentBelt()
        XCTAssertEqual(engine.currentBeltProgress.completedCount, 0)
        XCTAssertFalse(engine.isCompletionCelebrationPresented)
        XCTAssertNil(engine.celebrationBelt)
    }

    func testCompletionCelebrationTriggersAt100Percent() {
        let engine = ProgressEngine()
        let beltReqs = engine.curriculum.requirements.filter { $0.beltId == engine.selectedBelt.id }

        XCTAssertFalse(engine.isCompletionCelebrationPresented)

        // Complete all except the last one
        for req in beltReqs.dropLast() {
            engine.toggleCompletion(for: req)
        }
        XCTAssertFalse(engine.isCompletionCelebrationPresented)

        // Complete the final requirement
        if let lastReq = beltReqs.last {
            engine.toggleCompletion(for: lastReq)
            XCTAssertTrue(engine.isCompletionCelebrationPresented)
            XCTAssertEqual(engine.celebrationBelt?.id, engine.selectedBelt.id)
        }
    }

    func testCelebrationTriggersViaUpdateNotesAndMedia() {
        let engine = ProgressEngine()
        let beltReqs = engine.curriculum.requirements.filter { $0.beltId == engine.selectedBelt.id }

        // Complete all except the last one
        for req in beltReqs.dropLast() {
            engine.toggleCompletion(for: req)
        }
        XCTAssertFalse(engine.isCompletionCelebrationPresented)

        // Complete the final requirement via updateNotesAndMedia
        if let lastReq = beltReqs.last {
            engine.updateNotesAndMedia(
                for: lastReq,
                notes: "Final técnica para a graduação",
                mediaUrl: "https://youtube.com/watch?v=final",
                isCompleted: true
            )
            XCTAssertTrue(engine.isCompletionCelebrationPresented)
            XCTAssertEqual(engine.celebrationBelt?.id, engine.selectedBelt.id)

            // Updating notes again should NOT re-trigger celebration while already at 100%
            engine.isCompletionCelebrationPresented = false
            engine.updateNotesAndMedia(
                for: lastReq,
                notes: "Nota revisada",
                mediaUrl: "https://youtube.com/watch?v=final",
                isCompleted: true
            )
            XCTAssertFalse(engine.isCompletionCelebrationPresented)
        }
    }

    func testCrossBeltCompletionLookup() {
        let engine = ProgressEngine()
        XCTAssertEqual(engine.selectedBelt.id, "azul")

        // Grab a roxa requirement
        guard let roxaReq = engine.curriculum.requirements.first(where: { $0.beltId == "roxa" }),
              let azulReq = engine.curriculum.requirements.first(where: { $0.beltId == "azul" }) else {
            XCTFail("Missing belt requirements")
            return
        }

        XCTAssertFalse(engine.isCompleted(for: roxaReq))
        XCTAssertFalse(engine.isCompleted(for: azulReq))

        // Complete roxa technique while azul is the selected tab
        engine.toggleCompletion(for: roxaReq)
        XCTAssertTrue(engine.isCompleted(for: roxaReq))
        XCTAssertFalse(engine.isCompleted(for: azulReq))

        // Belt progress reflects correct belt
        let roxaProgress = engine.progress(for: .roxa)
        XCTAssertEqual(roxaProgress.completedCount, 1)
        let azulProgress = engine.progress(for: .azul)
        XCTAssertEqual(azulProgress.completedCount, 0)
    }

    func testExpandAndCollapseAllCategories() {
        let engine = ProgressEngine()
        XCTAssertFalse(engine.expandedCategories.isEmpty)

        engine.collapseAllCategories()
        XCTAssertTrue(engine.expandedCategories.isEmpty)

        engine.expandAllCategories()
        let totalCategories = Set(engine.curriculum.requirements.map { $0.category })
        XCTAssertEqual(engine.expandedCategories, totalCategories)
    }
}
