import Foundation

public struct CategoryProgress: Hashable, Sendable {
    public let category: String
    public let completedCount: Int
    public let totalCount: Int

    public init(category: String, completedCount: Int, totalCount: Int) {
        self.category = category
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

    public var formattedCount: String {
        "\(completedCount)/\(totalCount)"
    }
}
