import Foundation

public struct TechniqueRequirement: Identifiable, Codable, Hashable, Sendable {
    public let id: String
    public let gymId: String
    public let beltId: String
    public let category: String
    public let name: String
    public let techniqueType: TechniqueType
    public let canonicalTechniqueId: String?
    public let targetCount: Int?
    public let orderIndex: Int
    public let description: String?
    public let videoUrl: String?

    public init(
        id: String,
        gymId: String = "default",
        beltId: String,
        category: String,
        name: String,
        techniqueType: TechniqueType,
        canonicalTechniqueId: String? = nil,
        targetCount: Int? = nil,
        orderIndex: Int,
        description: String? = nil,
        videoUrl: String? = nil
    ) {
        self.id = id
        self.gymId = gymId
        self.beltId = beltId
        self.category = category
        self.name = name
        self.techniqueType = techniqueType
        self.canonicalTechniqueId = canonicalTechniqueId
        self.targetCount = targetCount
        self.orderIndex = orderIndex
        self.description = description
        self.videoUrl = videoUrl
    }

    public var compoundKey: String {
        "\(gymId)#\(beltId)#\(id)"
    }
}
