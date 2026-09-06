import Foundation

public struct CurriculumData: Codable, Sendable {
    public let gym: Gym
    public let belts: [Belt]
    public let requirements: [TechniqueRequirement]

    public init(gym: Gym, belts: [Belt], requirements: [TechniqueRequirement]) {
        self.gym = gym
        self.belts = belts
        self.requirements = requirements
    }
}
