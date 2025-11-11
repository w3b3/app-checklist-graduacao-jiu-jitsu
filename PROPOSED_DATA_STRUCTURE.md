# Proposed Data Structure for Cross-Belt Technique System

## Core Concept

Instead of tracking progress per belt+requirement, track progress per **technique**. Each technique knows which belt requirements it fulfills.

---

## TypeScript Type Definitions

```typescript
// New types
export interface Technique {
  id: string;
  name: string;
  position?: string; // e.g., "Guarda Fechada", "Montada"
  category: string; // e.g., "Finalizações", "Raspagem"

  // Which belt requirements this technique fulfills
  countsToward: BeltRequirementMapping[];

  // Optional metadata
  videoUrl?: string;
  description?: string;
  difficulty?: 'basic' | 'intermediate' | 'advanced';
}

export interface BeltRequirementMapping {
  belt: 'azul' | 'roxa' | 'marrom' | 'preta';

  // For Blue belt: specific category (e.g., "Guarda Fechada")
  // For Purple+: count-based category (e.g., "armlocks", "triangulos")
  requirementId: string;

  // Display name for this requirement
  requirementName: string;
}

export interface BeltRequirement {
  id: string;
  belt: 'azul' | 'roxa' | 'marrom' | 'preta';
  category: string;
  name: string;
  targetCount?: number; // For count-based requirements (Purple+)

  // Function to check if a technique counts toward this requirement
  matchesTechnique: (technique: Technique) => boolean;
}

// Updated progress store
export interface TechniqueProgress {
  techniqueId: string;
  completed: boolean;
  note: string;
  mediaUrl: string;
  completedAt?: Date;
}

// Store structure
export interface AppState {
  selectedBelt: string;

  // Changed from belt→requirement→progress
  // To: technique→progress
  progress: Record<string, TechniqueProgress>;

  expandedCategories: Set<string>;
  expandedRequirements: Set<string>;

  // Helper methods
  getTechniquesForBelt: (beltId: string) => Technique[];
  getProgressForBelt: (beltId: string) => BeltProgress;
  toggleTechnique: (techniqueId: string) => void;
}

export interface BeltProgress {
  requirements: RequirementProgress[];
  overallPercent: number;
}

export interface RequirementProgress {
  requirementId: string;
  requirementName: string;
  completed: number;
  total: number;
  isComplete: boolean;
  techniques: Technique[]; // Which techniques count toward this
}
```

---

## Example Data: Arm Lock Techniques

```typescript
export const TECHNIQUES: Technique[] = [
  {
    id: 'armlock-guarda-fechada',
    name: 'Arm lock',
    position: 'Guarda Fechada',
    category: 'Finalizações',
    countsToward: [
      {
        belt: 'azul',
        requirementId: 'azul-guarda-fechada',
        requirementName: 'Guarda Fechada'
      },
      {
        belt: 'roxa',
        requirementId: 'roxa-armlocks',
        requirementName: '03 Arm Locks em diferentes posições'
      },
      {
        belt: 'marrom',
        requirementId: 'marrom-armlocks',
        requirementName: '04 Arm Locks em diferentes posições'
      },
      {
        belt: 'preta',
        requirementId: 'preta-armlocks',
        requirementName: '04 Arm Locks em diferentes posições'
      }
    ]
  },

  {
    id: 'armlock-montada',
    name: 'Arm lock',
    position: 'Montada',
    category: 'Finalizações',
    countsToward: [
      {
        belt: 'azul',
        requirementId: 'azul-montada',
        requirementName: 'Montada'
      },
      {
        belt: 'roxa',
        requirementId: 'roxa-armlocks',
        requirementName: '03 Arm Locks em diferentes posições'
      },
      {
        belt: 'marrom',
        requirementId: 'marrom-armlocks',
        requirementName: '04 Arm Locks em diferentes posições'
      },
      {
        belt: 'preta',
        requirementId: 'preta-armlocks',
        requirementName: '04 Arm Locks em diferentes posições'
      }
    ]
  },

  {
    id: 'armlock-cem-kilos',
    name: 'Arm lock',
    position: 'Cem Kilos',
    category: 'Finalizações',
    countsToward: [
      {
        belt: 'azul',
        requirementId: 'azul-cem-kilos',
        requirementName: 'Cem Kilos'
      },
      {
        belt: 'roxa',
        requirementId: 'roxa-armlocks',
        requirementName: '03 Arm Locks em diferentes posições'
      },
      {
        belt: 'roxa',
        requirementId: 'roxa-final-100kg',
        requirementName: '03 Finalizações no 100kg'
      },
      {
        belt: 'marrom',
        requirementId: 'marrom-armlocks',
        requirementName: '04 Arm Locks em diferentes posições'
      },
      {
        belt: 'preta',
        requirementId: 'preta-armlocks',
        requirementName: '04 Arm Locks em diferentes posições'
      }
      // Note: Does NOT count toward marrom/preta-estrang-100kg (choke requirement)
    ]
  },

  {
    id: 'armlock-joelho-barriga',
    name: 'Arm lock',
    position: 'Joelho na Barriga',
    category: 'Finalizações',
    countsToward: [
      {
        belt: 'azul',
        requirementId: 'azul-joelho-barriga',
        requirementName: 'Joelho na Barriga'
      },
      {
        belt: 'roxa',
        requirementId: 'roxa-armlocks',
        requirementName: '03 Arm Locks em diferentes posições'
      },
      {
        belt: 'marrom',
        requirementId: 'marrom-armlocks',
        requirementName: '04 Arm Locks em diferentes posições'
      },
      {
        belt: 'marrom',
        requirementId: 'marrom-final-joelho',
        requirementName: '03 Finalizações com joelho na barriga'
      },
      {
        belt: 'preta',
        requirementId: 'preta-armlocks',
        requirementName: '04 Arm Locks em diferentes posições'
      },
      {
        belt: 'preta',
        requirementId: 'preta-final-joelho',
        requirementName: '03 Finalizações com joelho na barriga'
      }
    ]
  }
];
```

---

## Belt Requirements Definition

```typescript
export const BELT_REQUIREMENTS: BeltRequirement[] = [
  // BLUE BELT - Category-based (must learn ALL techniques in category)
  {
    id: 'azul-guarda-fechada',
    belt: 'azul',
    category: 'Guarda Fechada',
    name: 'Guarda Fechada',
    targetCount: 5, // Must know all 5 specific techniques
    matchesTechnique: (tech) =>
      tech.countsToward.some(ct => ct.requirementId === 'azul-guarda-fechada')
  },

  {
    id: 'azul-montada',
    belt: 'azul',
    category: 'Montada',
    name: 'Montada',
    targetCount: 4,
    matchesTechnique: (tech) =>
      tech.countsToward.some(ct => ct.requirementId === 'azul-montada')
  },

  // PURPLE BELT - Count-based (need N techniques with specific tag)
  {
    id: 'roxa-armlocks',
    belt: 'roxa',
    category: 'Finalizações',
    name: '03 Arm Locks em diferentes posições',
    targetCount: 3,
    matchesTechnique: (tech) =>
      tech.countsToward.some(ct => ct.requirementId === 'roxa-armlocks')
  },

  {
    id: 'roxa-triangulos',
    belt: 'roxa',
    category: 'Finalizações',
    name: '02 Triângulos',
    targetCount: 2,
    matchesTechnique: (tech) =>
      tech.countsToward.some(ct => ct.requirementId === 'roxa-triangulos')
  },

  // BROWN BELT
  {
    id: 'marrom-armlocks',
    belt: 'marrom',
    category: 'Finalizações',
    name: '04 Arm Locks em diferentes posições',
    targetCount: 4,
    matchesTechnique: (tech) =>
      tech.countsToward.some(ct => ct.requirementId === 'marrom-armlocks')
  },

  // BLACK BELT (same as Brown but expects detailed explanation)
  {
    id: 'preta-armlocks',
    belt: 'preta',
    category: 'Finalizações',
    name: '04 Arm Locks em diferentes posições',
    targetCount: 4,
    matchesTechnique: (tech) =>
      tech.countsToward.some(ct => ct.requirementId === 'preta-armlocks')
  }
];
```

---

## Progress Calculation Logic

```typescript
// Store methods
export const useBJJStore = create<AppState>()(
  persist(
    (set, get) => ({
      selectedBelt: 'azul',
      progress: {},
      expandedCategories: new Set(),
      expandedRequirements: new Set(),

      // Get all techniques available for a belt
      getTechniquesForBelt: (beltId: string) => {
        return TECHNIQUES.filter(tech =>
          tech.countsToward.some(ct => ct.belt === beltId)
        );
      },

      // Calculate progress for a belt
      getProgressForBelt: (beltId: string) => {
        const state = get();
        const requirements = BELT_REQUIREMENTS.filter(req => req.belt === beltId);

        const requirementProgress = requirements.map(req => {
          // Find all techniques that count toward this requirement
          const relevantTechniques = TECHNIQUES.filter(tech =>
            req.matchesTechnique(tech)
          );

          // Count how many are completed
          const completedCount = relevantTechniques.filter(tech =>
            state.progress[tech.id]?.completed
          ).length;

          return {
            requirementId: req.id,
            requirementName: req.name,
            completed: completedCount,
            total: req.targetCount || relevantTechniques.length,
            isComplete: completedCount >= (req.targetCount || relevantTechniques.length),
            techniques: relevantTechniques
          };
        });

        const totalRequirements = requirementProgress.length;
        const completedRequirements = requirementProgress.filter(r => r.isComplete).length;

        return {
          requirements: requirementProgress,
          overallPercent: totalRequirements > 0
            ? (completedRequirements / totalRequirements) * 100
            : 0
        };
      },

      // Toggle a technique completion
      toggleTechnique: (techniqueId: string) => {
        set(state => {
          const current = state.progress[techniqueId];
          const newCompleted = !current?.completed;

          return {
            progress: {
              ...state.progress,
              [techniqueId]: {
                techniqueId,
                completed: newCompleted,
                note: current?.note || '',
                mediaUrl: current?.mediaUrl || '',
                completedAt: newCompleted ? new Date() : undefined
              }
            }
          };
        });
      }
    }),
    {
      name: 'bjj-progress',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        selectedBelt: state.selectedBelt,
        progress: state.progress,
        expandedCategories: Array.from(state.expandedCategories)
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.expandedCategories = new Set(state.expandedCategories as any);
          state.expandedRequirements = new Set();
        }
      }
    }
  )
);
```

---

## UI Example: Showing Cross-Belt Impact

```typescript
// When displaying a technique in the UI
function TechniqueItem({ techniqueId }: { techniqueId: string }) {
  const technique = TECHNIQUES.find(t => t.id === techniqueId);
  const progress = useBJJStore(state => state.progress[techniqueId]);
  const toggleTechnique = useBJJStore(state => state.toggleTechnique);

  return (
    <View>
      <Checkbox
        checked={progress?.completed}
        onPress={() => toggleTechnique(techniqueId)}
      />

      <Text>{technique.name}</Text>
      {technique.position && <Text>from {technique.position}</Text>}

      {/* Show which belts this counts toward */}
      <View style={{ flexDirection: 'row', gap: 4 }}>
        {technique.countsToward.map(ct => (
          <BeltBadge key={`${ct.belt}-${ct.requirementId}`} belt={ct.belt} />
        ))}
      </View>

      {/* Show the specific requirements */}
      <Text style={{ fontSize: 12, color: 'gray' }}>
        Counts toward: {technique.countsToward.map(ct => ct.requirementName).join(', ')}
      </Text>
    </View>
  );
}

// Belt badge component
function BeltBadge({ belt }: { belt: string }) {
  const colors = {
    azul: '🔵',
    roxa: '🟣',
    marrom: '🟤',
    preta: '⚫'
  };

  return <Text>{colors[belt]}</Text>;
}
```

---

## UI Example: Belt Progress Display

```typescript
function BeltProgressView({ beltId }: { beltId: string }) {
  const progress = useBJJStore(state => state.getProgressForBelt(beltId));

  return (
    <View>
      <Text>Overall: {progress.overallPercent.toFixed(0)}%</Text>

      {progress.requirements.map(req => (
        <View key={req.requirementId}>
          <Text>{req.requirementName}</Text>
          <Text>{req.completed}/{req.total} {req.isComplete ? '✓' : ''}</Text>

          {/* Show which techniques count */}
          <FlatList
            data={req.techniques}
            renderItem={({ item }) => <TechniqueItem techniqueId={item.id} />}
          />
        </View>
      ))}
    </View>
  );
}
```

---

## Migration Strategy

```typescript
// One-time migration from old structure to new
async function migrateProgressData() {
  try {
    // Read old progress format
    const oldProgress = await AsyncStorage.getItem('bjj-progress');
    if (!oldProgress) return;

    const oldData = JSON.parse(oldProgress);
    const newProgress: Record<string, TechniqueProgress> = {};

    // Map old requirement IDs to new technique IDs
    const oldToNewMapping: Record<string, string> = {
      'azul-guarda-1': 'armlock-guarda-fechada',
      'azul-guarda-2': 'omoplata-guarda-fechada',
      'azul-guarda-3': 'triangulo-guarda-fechada',
      // ... full mapping for all 60 Blue belt techniques
    };

    // Convert old progress
    Object.entries(oldData.progress || {}).forEach(([beltId, requirements]) => {
      Object.entries(requirements as any).forEach(([reqId, reqProgress]) => {
        const newTechniqueId = oldToNewMapping[reqId];
        if (newTechniqueId) {
          newProgress[newTechniqueId] = {
            techniqueId: newTechniqueId,
            completed: (reqProgress as any).completed,
            note: (reqProgress as any).note || '',
            mediaUrl: (reqProgress as any).mediaUrl || ''
          };
        }
      });
    });

    // Save new format
    const newData = {
      selectedBelt: oldData.selectedBelt,
      progress: newProgress,
      expandedCategories: oldData.expandedCategories || []
    };

    await AsyncStorage.setItem('bjj-progress', JSON.stringify(newData));
    console.log('Migration successful!');

  } catch (error) {
    console.error('Migration failed:', error);
    // Optionally: keep old data and prompt user to manually reset
  }
}
```

---

## Summary of Changes Required

### 1. Data Files
- Create `src/data/techniques.ts` - Master technique library (~95 techniques)
- Create `src/data/beltRequirements.ts` - Belt requirement definitions
- Update `src/types.ts` - New type definitions

### 2. Store Changes
- Refactor `src/store/index.ts`:
  - Change `progress` from `belt→requirement→progress` to `technique→progress`
  - Add `getTechniquesForBelt()` method
  - Add `getProgressForBelt()` method
  - Update `toggleTechnique()` logic

### 3. UI Components
- Update `RequirementItem.tsx` to show cross-belt badges
- Update progress calculation in `HomeScreen.tsx`
- Add migration prompt/logic on first launch

### 4. Migration
- Write migration script
- Test with sample data
- Add user notification: "We've restructured requirements. Some progress may be preserved."

### 5. Testing
- Test that checking one technique updates multiple belt requirements
- Verify progress percentages calculate correctly
- Ensure AsyncStorage persistence works with new structure
