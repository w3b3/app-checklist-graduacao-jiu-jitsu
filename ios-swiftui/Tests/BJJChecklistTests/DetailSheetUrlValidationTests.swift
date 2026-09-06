import XCTest
@testable import BJJChecklist

@MainActor
final class DetailSheetUrlValidationTests: XCTestCase {
    func testValidMediaURLNormalization() {
        let engine = ProgressEngine()
        guard let req = engine.curriculum.requirements.first else {
            XCTFail("Missing requirement")
            return
        }

        // Test with standard https URL
        let sheet1 = TechniqueDetailSheet(requirement: req, belt: .azul, engine: engine)
        // By default empty
        XCTAssertNil(sheet1.validMediaURL)

        // Test with String extension directly
        XCTAssertTrue("Saída da Montada".localizedSearchMatches("saida"))
        XCTAssertTrue("Saída da Montada".localizedSearchMatches("SAIDA"))
        XCTAssertTrue("Triângulo".localizedSearchMatches("triangulo"))
        XCTAssertTrue("Mata-Leão".localizedSearchMatches("mata leao"))
        XCTAssertTrue("Arm lock".localizedSearchMatches("armlock"))
        XCTAssertTrue("100 Kilos".localizedSearchMatches("100 kilos"))
        XCTAssertFalse("Double Leg".localizedSearchMatches("armlock"))
    }
}
