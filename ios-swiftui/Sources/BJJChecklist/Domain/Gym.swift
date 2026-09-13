import Foundation

public struct Gym: Identifiable, Codable, Hashable, Sendable {
    public let id: String
    public let name: String
    public let isDefault: Bool
    public let academyDescription: String?

    public init(
        id: String,
        name: String,
        isDefault: Bool = false,
        academyDescription: String? = nil
    ) {
        self.id = id
        self.name = name
        self.isDefault = isDefault
        self.academyDescription = academyDescription
    }

    public static let defaultGym = Gym(
        id: "default",
        name: "Currículo Padrão",
        isDefault: true,
        academyDescription: "Seu plano de progresso faixa a faixa."
    )
}
