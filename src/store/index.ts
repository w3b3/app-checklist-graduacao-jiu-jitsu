import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system/legacy';
import { BeltId, BeltProgress, RequirementProgress, TechniqueType } from '../types';

interface AppState {
  // Current selected belt
  selectedBelt: BeltId;
  setSelectedBelt: (belt: BeltId) => void;

  // Current selected technique tab
  selectedTechniqueTab: TechniqueType;
  setSelectedTechniqueTab: (tab: TechniqueType) => void;

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

  // Update requirement photo
  updatePhoto: (beltId: BeltId, requirementId: string, photoUri: string) => void;

  // Remove requirement photo
  removePhoto: (beltId: BeltId, requirementId: string) => Promise<void>;

  // Get requirement progress
  getRequirementProgress: (beltId: BeltId, requirementId: string) => RequirementProgress;

  // Reset belt progress
  resetBeltProgress: (beltId: BeltId) => Promise<void>;

  // Expanded requirements (for accordion)
  expandedRequirements: Set<string>;
  toggleExpanded: (requirementId: string) => void;
}

const defaultRequirementProgress: RequirementProgress = {
  completed: false,
  note: '',
  mediaUrl: '',
  photoUri: undefined,
};

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      selectedBelt: 'azul',
      selectedTechniqueTab: 'finalizacoes',
      progress: {},
      expandedRequirements: new Set(),

      setSelectedBelt: (belt: BeltId) => set({ selectedBelt: belt }),

      setSelectedTechniqueTab: (tab: TechniqueType) => set({ selectedTechniqueTab: tab }),

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

      updatePhoto: (beltId: BeltId, requirementId: string, photoUri: string) => {
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
                photoUri,
              },
            },
          },
        });
      },

      removePhoto: async (beltId: BeltId, requirementId: string) => {
        const state = get();
        const beltProgress = state.progress[beltId] || {};
        const reqProgress = beltProgress[requirementId] || { ...defaultRequirementProgress };

        // Delete file from file system if it exists
        if (reqProgress.photoUri) {
          try {
            const fileInfo = await FileSystem.getInfoAsync(reqProgress.photoUri);
            if (fileInfo.exists) {
              await FileSystem.deleteAsync(reqProgress.photoUri);
            }
          } catch (error) {
            console.warn('Failed to delete photo file:', error);
          }
        }

        set({
          progress: {
            ...state.progress,
            [beltId]: {
              ...beltProgress,
              [requirementId]: {
                ...reqProgress,
                photoUri: undefined,
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

      resetBeltProgress: async (beltId: BeltId) => {
        const state = get();
        const beltProgress = state.progress[beltId] || {};

        // Delete all photos for this belt
        const deletePromises = Object.entries(beltProgress).map(async ([_, reqProgress]) => {
          if (reqProgress.photoUri) {
            try {
              const fileInfo = await FileSystem.getInfoAsync(reqProgress.photoUri);
              if (fileInfo.exists) {
                await FileSystem.deleteAsync(reqProgress.photoUri);
              }
            } catch (error) {
              console.warn('Failed to delete photo file:', error);
            }
          }
        });

        await Promise.all(deletePromises);

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
    }),
    {
      name: 'bjj-checklist-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        selectedBelt: state.selectedBelt,
        selectedTechniqueTab: state.selectedTechniqueTab,
        progress: state.progress,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Initialize expandedRequirements (not persisted)
          state.expandedRequirements = new Set();
        }
      },
    }
  )
);
