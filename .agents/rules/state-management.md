# State Management & Persistence Rules

## Store Architecture (`src/store/index.ts`)
- Use **Zustand** combined with **AsyncStorage** for local-first offline state.
- Do not introduce server synchronization or remote authentication in v1.

## Set Serialization Protocol (Critical)
- JavaScript `Set` instances cannot be JSON-serialized directly by default AsyncStorage storage engines.
- `expandedCategories` is persisted as an array and rehydrated back to a `Set` using Zustand's `onRehydrateStorage` hook.
- `expandedRequirements` is purposefully transient (reset on application restarts) to keep memory fresh.
- When adding new set-based properties to persisted state:
  1. Define a serializer in `partialize` converting `Set` -> `Array`.
  2. Implement rehydration logic in `onRehydrateStorage` restoring `Array` -> `Set`.
