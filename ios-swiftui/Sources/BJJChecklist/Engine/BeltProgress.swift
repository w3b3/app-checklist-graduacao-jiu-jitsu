import Foundation

public struct BeltProgress: Hashable, Sendable {
    public let belt: Belt
    public let completedCount: Int
    public let totalCount: Int

    public init(belt: Belt, completedCount: Int, totalCount: Int) {
        self.belt = belt
        self.completedCount = completedCount
        self.totalCount = totalCount
    }

    public var percentage: Double {
        guard totalCount > 0 else { return 0.0 }
        return Double(completedCount) / Double(totalCount)
    }

    public var isCompleted: Bool {
        totalCount > 0 && completedCount >= totalCount
    }

    public var formattedPercentage: String {
        "\(Int(percentage * 100))%"
    }

    public var formattedCount: String {
        "\(completedCount) de \(totalCount) técnicas"
    }
}
