---
name: add-technique
description: >-
  Use this skill when adding, modifying, or removing Brazilian Jiu-Jitsu techniques or requirements across any belt in the curriculum.
---

# Adding or Modifying Belt Techniques

Follow this procedure to update techniques in the curriculum while preserving data integrity.

## Relevant Files
- [requirements.ts](file:///Users/ds/dev/repos/checklist_graduacao/src/data/requirements.ts): Master list of all techniques.
- [types/index.ts](file:///Users/ds/dev/repos/checklist_graduacao/src/types/index.ts): Type definitions for `Requirement`, `BeltId`, etc.

## Steps

1. **Locate the Belt & Category**:
   In `src/data/requirements.ts`, find the belt section:
   - `azul`: Named individual techniques (`id: 'azul-<category>-<index>'`)
   - `roxa`: Count-based requirements with `targetCount`
   - `marrom`: Advanced count-based requirements
   - `preta`: Detailed explanations count-based

2. **Add Requirement Entry**:
   Ensure each new item adheres to:
   ```typescript
   {
     id: '<belt>-<category-slug>-<unique_number>',
     belt: '<beltId>',
     category: '<Category Name>',
     name: '<Technique Name>',
     targetCount?: number, // (only for count-based belts)
     description?: string
   }
   ```
   **ID rule**: IDs must remain unique and immutable across updates to avoid corrupting users' saved AsyncStorage progress.

3. **Verify App Calculations**:
   - Total requirements count in UI automatically adapts to `REQUIREMENTS.filter(r => r.belt === selectedBelt).length`.
   - Run typecheck and bundle check:
     ```bash
     npx tsc --noEmit
     ```
