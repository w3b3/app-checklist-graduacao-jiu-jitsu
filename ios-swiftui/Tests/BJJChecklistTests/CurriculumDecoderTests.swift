import XCTest
@testable import BJJChecklist

final class CurriculumDecoderTests: XCTestCase {
    func testCurriculumLoaderLoadsData() {
        let repo = CurriculumRepository()
        let data = repo.loadCurriculum()

        XCTAssertEqual(data.gym.id, "default")
        XCTAssertEqual(data.belts.count, 4)
        XCTAssertGreaterThan(data.requirements.count, 100)

        let azulReqs = data.requirements.filter { $0.beltId == "azul" }
        XCTAssertEqual(azulReqs.count, 49)

        let roxaReqs = data.requirements.filter { $0.beltId == "roxa" }
        XCTAssertEqual(roxaReqs.count, 40)

        let marromReqs = data.requirements.filter { $0.beltId == "marrom" }
        XCTAssertEqual(marromReqs.count, 58)

        let pretaReqs = data.requirements.filter { $0.beltId == "preta" }
        XCTAssertEqual(pretaReqs.count, 58)
    }

    func testCurriculumContainsCanonicalTechniques() {
        let repo = CurriculumRepository()
        let data = repo.loadCurriculum()

        let doubleLeg = data.requirements.first { $0.id == "azul-quedas-1" }
        XCTAssertNotNil(doubleLeg)
        XCTAssertEqual(doubleLeg?.name, "Double Leg")
        XCTAssertEqual(doubleLeg?.category, "Quedas")
        XCTAssertEqual(doubleLeg?.canonicalTechniqueId, "queda-double-leg")
        XCTAssertEqual(doubleLeg?.techniqueType, .quedas)

        let berimbolo = data.requirements.first { $0.id == "roxa-costas-1" }
        XCTAssertNotNil(berimbolo)
        XCTAssertEqual(berimbolo?.canonicalTechniqueId, "costas-berimbolo")
    }

    func testCategoriesStructure() {
        let repo = CurriculumRepository()
        let data = repo.loadCurriculum()

        let azulCategories = Set(data.requirements.filter { $0.beltId == "azul" }.map { $0.category })
        XCTAssertTrue(azulCategories.contains("Quedas"))
        XCTAssertTrue(azulCategories.contains("Passagem"))
        XCTAssertTrue(azulCategories.contains("Cem Kilos"))
        XCTAssertTrue(azulCategories.contains("Guarda Fechada"))
        XCTAssertTrue(azulCategories.contains("Fundamentos"))
    }
}
