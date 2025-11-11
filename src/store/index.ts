import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BeltId, TechniqueProgress, BeltProgressSummary, RequirementProgress } from '../types';
import { TECHNIQUES } from '../data/techniques';
import { BELT_REQUIREMENTS } from '../data/beltRequirements';

interface AppState {
  // Current selected belt
  selectedBelt: BeltId;
  setSelectedBelt: (belt: BeltId) => void;

  // Progress data (technique-based, not belt-based)
  progress: {
    [techniqueId: string]: TechniqueProgress;
  };

  // Flag to track if user has seen the upgrade announcement
  hasSeenUpgradeAnnouncement: boolean;
  setHasSeenUpgradeAnnouncement: (seen: boolean) => void;

  // Toggle technique completion
  toggleTechnique: (techniqueId: string) => void;

  // Update technique note
  updateNote: (techniqueId: string, note: string) => void;

  // Update technique media URL
  updateMediaUrl: (techniqueId: string, mediaUrl: string) => void;

  // Get technique progress
  getTechniqueProgress: (techniqueId: string) => TechniqueProgress;

  // Get all techniques for a belt
  getTechniquesForBelt: (beltId: BeltId) => any[];

  // Get progress summary for a belt
  getProgressForBelt: (beltId: BeltId) => BeltProgressSummary;

  // Reset ALL progress (all techniques across all belts)
  resetAllProgress: () => void;

  // Expanded requirements (for accordion)
  expandedRequirements: Set<string>;
  toggleExpanded: (requirementId: string) => void;

  // Expanded categories
  expandedCategories: Set<string>;
  toggleCategory: (category: string) => void;
}

const defaultTechniqueProgress: TechniqueProgress = {
  techniqueId: '',
  completed: false,
  note: '',
  mediaUrl: '',
};

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      selectedBelt: 'azul',
      progress: {},
      hasSeenUpgradeAnnouncement: false,
      expandedRequirements: new Set(),
      expandedCategories: new Set(['Quedas']), // First category expanded by default

      setSelectedBelt: (belt: BeltId) => set({ selectedBelt: belt }),

      setHasSeenUpgradeAnnouncement: (seen: boolean) => set({ hasSeenUpgradeAnnouncement: seen }),

      toggleTechnique: (techniqueId: string) => {
        const state = get();
        const current = state.progress[techniqueId] || { ...defaultTechniqueProgress, techniqueId };
        const newCompleted = !current.completed;

        set({
          progress: {
            ...state.progress,
            [techniqueId]: {
              ...current,
              completed: newCompleted,
              completedAt: newCompleted ? new Date().toISOString() : undefined,
            },
          },
        });
      },

      updateNote: (techniqueId: string, note: string) => {
        const state = get();
        const current = state.progress[techniqueId] || { ...defaultTechniqueProgress, techniqueId };

        set({
          progress: {
            ...state.progress,
            [techniqueId]: {
              ...current,
              note,
            },
          },
        });
      },

      updateMediaUrl: (techniqueId: string, mediaUrl: string) => {
        const state = get();
        const current = state.progress[techniqueId] || { ...defaultTechniqueProgress, techniqueId };

        set({
          progress: {
            ...state.progress,
            [techniqueId]: {
              ...current,
              mediaUrl,
            },
          },
        });
      },

      getTechniqueProgress: (techniqueId: string) => {
        const state = get();
        return state.progress[techniqueId] || { ...defaultTechniqueProgress, techniqueId };
      },

      getTechniquesForBelt: (beltId: BeltId) => {
        return TECHNIQUES.filter(tech =>
          tech.countsToward.some(ct => ct.belt === beltId)
        );
      },

      getProgressForBelt: (beltId: BeltId) => {
        const state = get();
        const requirements = BELT_REQUIREMENTS.filter(req => req.belt === beltId);

        const requirementProgress: RequirementProgress[] = requirements.map(req => {
          // Find all techniques that count toward this requirement
          const relevantTechniques = TECHNIQUES.filter(tech =>
            tech.countsToward.some(ct => ct.requirementId === req.id)
          );

          // Count how many are completed
          const completedCount = relevantTechniques.filter(tech =>
            state.progress[tech.id]?.completed
          ).length;

          return {
            requirementId: req.id,
            requirementName: req.name,
            category: req.category,
            completed: completedCount,
            total: req.targetCount,
            isComplete: completedCount >= req.targetCount,
            techniques: relevantTechniques,
          };
        });

        const totalRequirements = requirementProgress.length;
        const completedRequirements = requirementProgress.filter(r => r.isComplete).length;

        return {
          requirements: requirementProgress,
          overallPercent: totalRequirements > 0
            ? (completedRequirements / totalRequirements) * 100
            : 0,
          completedCount: completedRequirements,
          totalCount: totalRequirements,
        };
      },

      resetAllProgress: () => {
        set({
          progress: {},
          expandedRequirements: new Set(),
        });
      },

      toggleExpanded: (requirementId: string) => {
        const state = get();
        const newExpanded = new Set(state.expandedRequirements);
        if (newExpanded.has(requirementId)) {
          newExpanded.delete(requirementId);
        } else {
          newExpanded.add(requirementId);
        }
        set({ expandedRequirements: newExpanded });
      },

      toggleCategory: (category: string) => {
        const state = get();
        const newExpanded = new Set(state.expandedCategories);
        if (newExpanded.has(category)) {
          newExpanded.delete(category);
        } else {
          newExpanded.add(category);
        }
        set({ expandedCategories: newExpanded });
      },
    }),
    {
      name: 'bjj-checklist-storage-v2', // Changed key to force reset
      storage: createJSONStorage(() => AsyncStorage),
      // Custom serialization for Sets
      partialize: (state) => ({
        selectedBelt: state.selectedBelt,
        progress: state.progress,
        hasSeenUpgradeAnnouncement: state.hasSeenUpgradeAnnouncement,
        expandedCategories: Array.from(state.expandedCategories),
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Convert arrays back to Sets
          state.expandedCategories = new Set(state.expandedCategories as any);
          state.expandedRequirements = new Set();
        }
      },
    }
  )
);
