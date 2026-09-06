import XCTest
@testable import BJJChecklist

final class DomainModelTests: XCTestCase {
    func testDefaultBeltsCountAndOrder() {
        let belts = Belt.defaultBelts
        XCTAssertEqual(belts.count, 4)
        XCTAssertEqual(belts.map { $0.id }, ["azul", "roxa", "marrom", "preta"])
        XCTAssertEqual(belts.map { $0.order }, [1, 2, 3, 4])
    }

    func testBeltColors() {
        let azul = Belt.azul
        XCTAssertEqual(azul.colorHex, "#1E40AF")
        XCTAssertEqual(azul.textHex, "#1E3A8A")
        XCTAssertEqual(azul.lightHex, "#DBEAFE")

        let roxa = Belt.roxa
        XCTAssertEqual(roxa.colorHex, "#7C3AED")

        let marrom = Belt.marrom
        XCTAssertEqual(marrom.colorHex, "#92400E")

        let preta = Belt.preta
        XCTAssertEqual(preta.colorHex, "#1F2937")
    }

    func testGymDefault() {
        let gym = Gym.defaultGym
        XCTAssertEqual(gym.id, "default")
        XCTAssertTrue(gym.isDefault)
        XCTAssertTrue(gym.name.contains("Brothers Fight"))
    }

    func testTechniqueTypeProperties() {
        XCTAssertEqual(TechniqueType.finalizacoes.displayName, "Finalizações")
        XCTAssertEqual(TechniqueType.quedas.displayName, "Quedas")
        XCTAssertEqual(TechniqueType.raspagens.displayName, "Raspagens")
        XCTAssertEqual(TechniqueType.passagens.displayName, "Passagens")
        XCTAssertEqual(TechniqueType.outros.displayName, "Outros & Fundamentos")
    }

    func testTechniqueRequirementCompoundKey() {
        let req = TechniqueRequirement(
            id: "queda-double-leg",
            gymId: "default",
            beltId: "azul",
            category: "Quedas",
            name: "Double Leg",
            techniqueType: .quedas,
            canonicalTechniqueId: "queda-double-leg",
            orderIndex: 1
        )
        XCTAssertEqual(req.compoundKey, "default#azul#queda-double-leg")
    }

    func testBeltProgressCalculation() {
        let belt = Belt.azul
        let progress = BeltProgress(belt: belt, completedCount: 30, totalCount: 60)
        XCTAssertEqual(progress.percentage, 0.5, accuracy: 0.001)
        XCTAssertFalse(progress.isCompleted)
        XCTAssertEqual(progress.formattedPercentage, "50%")
        XCTAssertEqual(progress.formattedCount, "30 de 60 técnicas")

        let completed = BeltProgress(belt: belt, completedCount: 60, totalCount: 60)
        XCTAssertEqual(completed.percentage, 1.0, accuracy: 0.001)
        XCTAssertTrue(completed.isCompleted)
        XCTAssertEqual(completed.formattedPercentage, "100%")

        let empty = BeltProgress(belt: belt, completedCount: 0, totalCount: 0)
        XCTAssertEqual(empty.percentage, 0.0)
        XCTAssertFalse(empty.isCompleted)
    }

    func testCategoryProgressCalculation() {
        let progress = CategoryProgress(category: "Passagem", completedCount: 2, totalCount: 4)
        XCTAssertEqual(progress.percentage, 0.5, accuracy: 0.001)
        XCTAssertFalse(progress.isCompleted)
        XCTAssertEqual(progress.formattedCount, "2/4")

        let full = CategoryProgress(category: "Passagem", completedCount: 4, totalCount: 4)
        XCTAssertTrue(full.isCompleted)
    }
}
