import Foundation
import SwiftData

public final class CurriculumRepository: @unchecked Sendable {
    private var cachedCurriculum: CurriculumData?

    public init() {}

    public func loadCurriculum() -> CurriculumData {
        if let cached = cachedCurriculum {
            return cached
        }

        // 1. Try Bundle.module (SwiftPM package resource)
        #if SWIFT_PACKAGE
        if let url = Bundle.module.url(forResource: "default_curriculum", withExtension: "json"),
           let data = try? Data(contentsOf: url),
           let curriculum = try? JSONDecoder().decode(CurriculumData.self, from: data) {
            self.cachedCurriculum = curriculum
            return curriculum
        }
        #endif

        // 2. Try Bundle.main
        if let url = Bundle.main.url(forResource: "default_curriculum", withExtension: "json"),
           let data = try? Data(contentsOf: url),
           let curriculum = try? JSONDecoder().decode(CurriculumData.self, from: data) {
            self.cachedCurriculum = curriculum
            return curriculum
        }

        // 3. Search all active bundles
        for bundle in Bundle.allBundles {
            if let url = bundle.url(forResource: "default_curriculum", withExtension: "json"),
               let data = try? Data(contentsOf: url),
               let curriculum = try? JSONDecoder().decode(CurriculumData.self, from: data) {
                self.cachedCurriculum = curriculum
                return curriculum
            }
        }

        // 4. Fallback in-memory curriculum
        let fallback = Self.makeFallbackCurriculum()
        self.cachedCurriculum = fallback
        return fallback
    }

    public func fetchProgressItems(gymId: String, context: ModelContext) throws -> [ProgressItemEntity] {
        let descriptor = FetchDescriptor<ProgressItemEntity>(
            predicate: #Predicate<ProgressItemEntity> { item in
                item.gymId == gymId
            }
        )
        return try context.fetch(descriptor)
    }

    public func fetchProgressItem(compoundKey: String, context: ModelContext) throws -> ProgressItemEntity? {
        let descriptor = FetchDescriptor<ProgressItemEntity>(
            predicate: #Predicate<ProgressItemEntity> { item in
                item.compoundKey == compoundKey
            }
        )
        let matches = try context.fetch(descriptor)
        return matches.first
    }

    @discardableResult
    public func upsertProgress(
        gymId: String,
        beltId: String,
        techniqueKey: String,
        isCompleted: Bool,
        notes: String,
        mediaUrl: String,
        context: ModelContext
    ) throws -> ProgressItemEntity {
        let key = ProgressItemEntity.makeCompoundKey(gymId: gymId, beltId: beltId, techniqueKey: techniqueKey)
        if let existing = try fetchProgressItem(compoundKey: key, context: context) {
            existing.isCompleted = isCompleted
            existing.notes = notes
            existing.mediaUrl = mediaUrl
            existing.updatedAt = Date()
            try context.save()
            return existing
        } else {
            let newEntity = ProgressItemEntity(
                gymId: gymId,
                beltId: beltId,
                techniqueKey: techniqueKey,
                isCompleted: isCompleted,
                notes: notes,
                mediaUrl: mediaUrl
            )
            context.insert(newEntity)
            try context.save()
            return newEntity
        }
    }

    public func resetBelt(gymId: String, beltId: String, context: ModelContext) throws {
        let descriptor = FetchDescriptor<ProgressItemEntity>(
            predicate: #Predicate<ProgressItemEntity> { item in
                item.gymId == gymId && item.beltId == beltId
            }
        )
        let items = try context.fetch(descriptor)
        for item in items {
            item.isCompleted = false
            item.updatedAt = Date()
        }
        try context.save()
    }

    private static func makeFallbackCurriculum() -> CurriculumData {
        let gym = Gym.defaultGym
        let belts = Belt.defaultBelts
        var reqs: [TechniqueRequirement] = []
        var order = 1

        let blueTechs = [
            ("Double Leg", "Quedas", TechniqueType.quedas),
            ("Single Leg", "Quedas", TechniqueType.quedas),
            ("Passagem guarda fechada", "Passagem", TechniqueType.passagens),
            ("Americana", "Cem Kilos", TechniqueType.finalizacoes),
            ("Arm lock", "Guarda Fechada", TechniqueType.finalizacoes)
        ]

        for (name, cat, type) in blueTechs {
            reqs.append(
                TechniqueRequirement(
                    id: "azul-fallback-\(order)",
                    gymId: gym.id,
                    beltId: "azul",
                    category: cat,
                    name: name,
                    techniqueType: type,
                    orderIndex: order
                )
            )
            order += 1
        }

        return CurriculumData(gym: gym, belts: belts, requirements: reqs)
    }
}
