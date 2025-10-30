import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BeltId, BeltProgress, RequirementProgress } from '../types';

interface AppState {
  // Current selected belt
  selectedBelt: BeltId;
  setSelectedBelt: (belt: BeltId) => void;

  // Progress data for all belts
  progress: {
    [beltId: string]: BeltProgress;
  };

  // Toggle requirement completion
  toggleRequirement: (beltId: BeltId, requirementId: string) => void;

  // Update requirement note
  updateNote: (beltId: BeltId, requirementId: string, note: string) => void;

  // Update requirement media URL
  updateMediaUrl: (beltId: BeltId, requirementId: string, mediaUrl: string) => void;

  // Get requirement progress
  getRequirementProgress: (beltId: BeltId, requirementId: string) => RequirementProgress;

  // Reset belt progress
  resetBeltProgress: (beltId: BeltId) => void;

  // Expanded requirements (for accordion)
  expandedRequirements: Set<string>;
  toggleExpanded: (requirementId: string) => void;

  // Expanded categories
  expandedCategories: Set<string>;
  toggleCategory: (category: string) => void;
}

const defaultRequirementProgress: RequirementProgress = {
  completed: false,
  note: '',
  mediaUrl: '',
};

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      selectedBelt: 'azul',
      progress: {},
      expandedRequirements: new Set(),
      expandedCategories: new Set(['Quedas']), // First category expanded by default

      setSelectedBelt: (belt: BeltId) => set({ selectedBelt: belt }),

      toggleRequirement: (beltId: BeltId, requirementId: string) => {
        const state = get();
        const beltProgress = state.progress[beltId] || {};
        const reqProgress = beltProgress[requirementId] || { ...defaultRequirementProgress };

        set({
          progress: {
            ...state.progress,
            [beltId]: {
              ...beltProgress,
              [requirementId]: {
                ...reqProgress,
                completed: !reqProgress.completed,
              },
            },
          },
        });
      },

      updateNote: (beltId: BeltId, requirementId: string, note: string) => {
        const state = get();
        const beltProgress = state.progress[beltId] || {};
        const reqProgress = beltProgress[requirementId] || { ...defaultRequirementProgress };

        set({
          progress: {
            ...state.progress,
            [beltId]: {
              ...beltProgress,
              [requirementId]: {
                ...reqProgress,
                note,
              },
            },
          },
        });
      },

      updateMediaUrl: (beltId: BeltId, requirementId: string, mediaUrl: string) => {
        const state = get();
        const beltProgress = state.progress[beltId] || {};
        const reqProgress = beltProgress[requirementId] || { ...defaultRequirementProgress };

        set({
          progress: {
            ...state.progress,
            [beltId]: {
              ...beltProgress,
              [requirementId]: {
                ...reqProgress,
                mediaUrl,
              },
            },
          },
        });
      },

      getRequirementProgress: (beltId: BeltId, requirementId: string) => {
        const state = get();
        const beltProgress = state.progress[beltId] || {};
        return beltProgress[requirementId] || { ...defaultRequirementProgress };
      },

      resetBeltProgress: (beltId: BeltId) => {
        const state = get();
        set({
          progress: {
            ...state.progress,
            [beltId]: {},
          },
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
      name: 'bjj-checklist-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // Custom serialization for Sets
      partialize: (state) => ({
        selectedBelt: state.selectedBelt,
        progress: state.progress,
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
