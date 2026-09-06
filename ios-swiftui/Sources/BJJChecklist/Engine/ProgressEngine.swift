import SwiftUI
import SwiftData

@MainActor
@Observable
public final class ProgressEngine {
    public var activeGym: Gym
    public var selectedBelt: Belt
    public var completedKeys: Set<String> = []
    public var progressEntities: [String: ProgressItemEntity] = [:]
    public var curriculum: CurriculumData
    public var expandedCategories: Set<String> = []
    public var searchText: String = ""

    // Modal Presentation States
    public var selectedTechniqueForDetail: TechniqueRequirement? = nil
    public var isCompletionCelebrationPresented: Bool = false
    public var celebrationBelt: Belt? = nil
    public var isResetConfirmationPresented: Bool = false

    public let repository: CurriculumRepository
    public var modelContext: ModelContext?

    public init(
        repository: CurriculumRepository = CurriculumRepository(),
        modelContext: ModelContext? = nil,
        initialBelt: Belt = .azul
    ) {
        self.repository = repository
        self.modelContext = modelContext
        let data = repository.loadCurriculum()
        self.curriculum = data
        self.activeGym = data.gym
        self.selectedBelt = initialBelt

        // Expand all categories by default
        self.expandedCategories = Set(data.requirements.map { $0.category })

        // Load persisted items if context exists
        if let context = modelContext {
            self.loadPersistedProgress(context: context)
        }
    }

    public func setModelContext(_ context: ModelContext) {
        self.modelContext = context
        self.loadPersistedProgress(context: context)
    }

    public func loadPersistedProgress(context: ModelContext) {
        do {
            let items = try repository.fetchProgressItems(gymId: activeGym.id, context: context)
            var newCompleted: Set<String> = []
            var newEntities: [String: ProgressItemEntity] = [:]
            for item in items {
                newEntities[item.compoundKey] = item
                if item.isCompleted {
                    newCompleted.insert(item.compoundKey)
                }
            }
            self.progressEntities = newEntities
            self.completedKeys = newCompleted
        } catch {
            print("Error loading persisted progress: \(error.localizedDescription)")
        }
    }

    // MARK: - O(1) Lookups

    public func isCompleted(for requirement: TechniqueRequirement) -> Bool {
        completedKeys.contains(requirement.compoundKey)
    }

    public func isCompleted(techniqueKey: String) -> Bool {
        let key = ProgressItemEntity.makeCompoundKey(gymId: activeGym.id, beltId: selectedBelt.id, techniqueKey: techniqueKey)
        return completedKeys.contains(key)
    }

    public func isCompleted(gymId: String, beltId: String, techniqueKey: String) -> Bool {
        let key = ProgressItemEntity.makeCompoundKey(gymId: gymId, beltId: beltId, techniqueKey: techniqueKey)
        return completedKeys.contains(key)
    }

    public func note(for requirement: TechniqueRequirement) -> String {
        progressEntities[requirement.compoundKey]?.notes ?? ""
    }

    public func mediaUrl(for requirement: TechniqueRequirement) -> String {
        progressEntities[requirement.compoundKey]?.mediaUrl ?? ""
    }

    public func hasNotesOrMedia(for requirement: TechniqueRequirement) -> Bool {
        if let entity = progressEntities[requirement.compoundKey] {
            return !entity.notes.isEmpty || !entity.mediaUrl.isEmpty
        }
        return false
    }

    // MARK: - Progress Calculations

    public func progress(for belt: Belt) -> BeltProgress {
        let reqs = curriculum.requirements.filter { $0.beltId == belt.id }
        let total = reqs.count
        let completed = reqs.filter { completedKeys.contains($0.compoundKey) }.count
        return BeltProgress(belt: belt, completedCount: completed, totalCount: total)
    }

    public func progress(for belt: Belt, category: String) -> CategoryProgress {
        let reqs = curriculum.requirements.filter { $0.beltId == belt.id && $0.category == category }
        let total = reqs.count
        let completed = reqs.filter { completedKeys.contains($0.compoundKey) }.count
        return CategoryProgress(category: category, completedCount: completed, totalCount: total)
    }

    public var currentBeltProgress: BeltProgress {
        progress(for: selectedBelt)
    }

    // MARK: - Curriculum Queries

    public func categories(for belt: Belt) -> [String] {
        var orderedCats: [String] = []
        var seen = Set<String>()
        for req in curriculum.requirements where req.beltId == belt.id {
            if !seen.contains(req.category) {
                seen.insert(req.category)
                orderedCats.append(req.category)
            }
        }
        return orderedCats
    }

    public func requirements(for belt: Belt, category: String) -> [TechniqueRequirement] {
        let filtered = curriculum.requirements.filter { $0.beltId == belt.id && $0.category == category }
        let query = searchText.trimmingCharacters(in: .whitespacesAndNewlines)
        if query.isEmpty {
            return filtered
        }
        return filtered.filter { req in
            req.name.localizedSearchMatches(query) ||
            req.category.localizedSearchMatches(query) ||
            (progressEntities[req.compoundKey]?.notes.localizedSearchMatches(query) ?? false)
        }
    }

    // MARK: - Actions & Persistence

    public func toggleCompletion(for requirement: TechniqueRequirement) {
        let key = requirement.compoundKey
        let willBeCompleted = !completedKeys.contains(key)

        let targetBelt = curriculum.belts.first(where: { $0.id == requirement.beltId }) ?? selectedBelt
        let previousBeltProgress = progress(for: targetBelt)

        if willBeCompleted {
            completedKeys.insert(key)
        } else {
            completedKeys.remove(key)
        }

        // Update in-memory entity
        if let existing = progressEntities[key] {
            existing.isCompleted = willBeCompleted
            existing.updatedAt = Date()
        } else {
            let entity = ProgressItemEntity(
                gymId: requirement.gymId,
                beltId: requirement.beltId,
                techniqueKey: requirement.id,
                isCompleted: willBeCompleted
            )
            progressEntities[key] = entity
        }

        // Persist to SwiftData if context available
        if let context = modelContext {
            let currentNotes = progressEntities[key]?.notes ?? ""
            let currentMedia = progressEntities[key]?.mediaUrl ?? ""
            _ = try? repository.upsertProgress(
                gymId: requirement.gymId,
                beltId: requirement.beltId,
                techniqueKey: requirement.id,
                isCompleted: willBeCompleted,
                notes: currentNotes,
                mediaUrl: currentMedia,
                context: context
            )
        }

        // Check if belt was completed (0 to 100%)
        let newBeltProgress = progress(for: targetBelt)
        if !previousBeltProgress.isCompleted && newBeltProgress.isCompleted {
            HapticFeedbackService.shared.playCelebration()
            self.celebrationBelt = targetBelt
            self.isCompletionCelebrationPresented = true
        } else {
            HapticFeedbackService.shared.playImpactLight()
        }
    }

    public func updateNotesAndMedia(
        for requirement: TechniqueRequirement,
        notes: String,
        mediaUrl: String,
        isCompleted: Bool? = nil
    ) {
        let key = requirement.compoundKey
        let finalCompleted = isCompleted ?? completedKeys.contains(key)

        let targetBelt = curriculum.belts.first(where: { $0.id == requirement.beltId }) ?? selectedBelt
        let previousBeltProgress = progress(for: targetBelt)

        if finalCompleted {
            completedKeys.insert(key)
        } else {
            completedKeys.remove(key)
        }

        if let existing = progressEntities[key] {
            existing.notes = notes
            existing.mediaUrl = mediaUrl
            existing.isCompleted = finalCompleted
            existing.updatedAt = Date()
        } else {
            let entity = ProgressItemEntity(
                gymId: requirement.gymId,
                beltId: requirement.beltId,
                techniqueKey: requirement.id,
                isCompleted: finalCompleted,
                notes: notes,
                mediaUrl: mediaUrl
            )
            progressEntities[key] = entity
        }

        if let context = modelContext {
            _ = try? repository.upsertProgress(
                gymId: requirement.gymId,
                beltId: requirement.beltId,
                techniqueKey: requirement.id,
                isCompleted: finalCompleted,
                notes: notes,
                mediaUrl: mediaUrl,
                context: context
            )
        }

        // Check if belt was completed (0 to 100%)
        let newBeltProgress = progress(for: targetBelt)
        if !previousBeltProgress.isCompleted && newBeltProgress.isCompleted {
            HapticFeedbackService.shared.playCelebration()
            self.celebrationBelt = targetBelt
            self.isCompletionCelebrationPresented = true
        } else {
            HapticFeedbackService.shared.playImpactLight()
        }
    }

    public func resetCurrentBelt() {
        let beltReqs = curriculum.requirements.filter { $0.beltId == selectedBelt.id }
        for req in beltReqs {
            completedKeys.remove(req.compoundKey)
            if let entity = progressEntities[req.compoundKey] {
                entity.isCompleted = false
                entity.updatedAt = Date()
            }
        }

        if let context = modelContext {
            try? repository.resetBelt(gymId: activeGym.id, beltId: selectedBelt.id, context: context)
        }

        self.isCompletionCelebrationPresented = false
        self.celebrationBelt = nil

        HapticFeedbackService.shared.playWarning()
    }

    public func toggleCategoryExpanded(_ category: String) {
        if expandedCategories.contains(category) {
            expandedCategories.remove(category)
        } else {
            expandedCategories.insert(category)
        }
        HapticFeedbackService.shared.playImpactLight()
    }

    public func isCategoryExpanded(_ category: String) -> Bool {
        expandedCategories.contains(category)
    }

    public func expandAllCategories() {
        expandedCategories = Set(curriculum.requirements.map { $0.category })
    }

    public func collapseAllCategories() {
        expandedCategories.removeAll()
    }

    public func selectBelt(_ belt: Belt) {
        selectedBelt = belt
        HapticFeedbackService.shared.playImpactMedium()
    }
}
