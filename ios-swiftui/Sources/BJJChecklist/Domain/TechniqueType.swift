import Foundation

public enum TechniqueType: String, Codable, CaseIterable, Identifiable, Sendable {
    case finalizacoes = "finalizacoes"
    case quedas = "quedas"
    case raspagens = "raspagens"
    case passagens = "passagens"
    case outros = "outros"

    public var id: String { rawValue }

    public var displayName: String {
        switch self {
        case .finalizacoes:
            return "Finalizações"
        case .quedas:
            return "Quedas"
        case .raspagens:
            return "Raspagens"
        case .passagens:
            return "Passagens"
        case .outros:
            return "Outros & Fundamentos"
        }
    }

    public var systemImage: String {
        switch self {
        case .finalizacoes:
            return "bolt.shield.fill"
        case .quedas:
            return "figure.wrestling"
        case .raspagens:
            return "arrow.triangle.2.circlepath"
        case .passagens:
            return "arrow.right.to.line"
        case .outros:
            return "star.fill"
        }
    }
}
