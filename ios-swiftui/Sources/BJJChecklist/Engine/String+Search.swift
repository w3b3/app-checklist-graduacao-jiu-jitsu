import Foundation

extension String {
    /// Performs a case-insensitive and diacritic-insensitive search against the query.
    /// Handles Portuguese accented characters (e.g. "saida" matches "Saída", "triangulo" matches "Triângulo")
    /// and normalized punctuation/spacing (e.g. "mata leao" matches "Mata-Leão", "armlock" matches "Arm lock").
    public func localizedSearchMatches(_ query: String) -> Bool {
        let cleanQuery = query.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !cleanQuery.isEmpty else { return true }

        // 1. Direct case- and diacritic-insensitive range match
        if self.range(of: cleanQuery, options: [.caseInsensitive, .diacriticInsensitive]) != nil {
            return true
        }

        // 2. Normalized alphanumeric match (stripping hyphens, slashes, whitespace)
        let selfNormalized = self.folding(options: [.caseInsensitive, .diacriticInsensitive], locale: .current)
            .replacingOccurrences(of: "[\\W_]+", with: "", options: .regularExpression)
        let queryNormalized = cleanQuery.folding(options: [.caseInsensitive, .diacriticInsensitive], locale: .current)
            .replacingOccurrences(of: "[\\W_]+", with: "", options: .regularExpression)

        if !queryNormalized.isEmpty && selfNormalized.contains(queryNormalized) {
            return true
        }

        return false
    }
}
