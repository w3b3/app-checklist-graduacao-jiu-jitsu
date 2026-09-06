import Foundation
import SwiftData

@Model
public final class ProgressItemEntity {
    @Attribute(.unique) public var compoundKey: String
    public var gymId: String
    public var beltId: String
    public var techniqueKey: String
    public var isCompleted: Bool
    public var notes: String
    public var mediaUrl: String
    public var createdAt: Date
    public var updatedAt: Date

    public init(
        gymId: String,
        beltId: String,
        techniqueKey: String,
        isCompleted: Bool = false,
        notes: String = "",
        mediaUrl: String = "",
        createdAt: Date = Date(),
        updatedAt: Date = Date()
    ) {
        self.compoundKey = Self.makeCompoundKey(gymId: gymId, beltId: beltId, techniqueKey: techniqueKey)
        self.gymId = gymId
        self.beltId = beltId
        self.techniqueKey = techniqueKey
        self.isCompleted = isCompleted
        self.notes = notes
        self.mediaUrl = mediaUrl
        self.createdAt = createdAt
        self.updatedAt = updatedAt
    }

    public static func makeCompoundKey(gymId: String, beltId: String, techniqueKey: String) -> String {
        "\(gymId)#\(beltId)#\(techniqueKey)"
    }
}
