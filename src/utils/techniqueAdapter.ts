/**
 * Technique Adapter
 *
 * Converts API TechniqueItem objects to local Requirement format
 * used by the UI components.
 */

import { Requirement, BeltId, TechniqueType } from '../types';
import { TechniqueItem } from '../api/lists';
import { getCategoryTechniqueType } from '../data/requirements';

/**
 * Convert a single API TechniqueItem to local Requirement format
 */
export function adaptTechniqueToRequirement(technique: TechniqueItem): Requirement {
  return {
    id: technique.technique_key,
    belt: (technique.belt || 'azul') as BeltId,
    category: technique.category,
    name: technique.name,
    targetCount: technique.target_count ?? undefined,
  };
}

/**
 * Convert API techniques to Requirements and filter by belt and technique type
 */
export function adaptAndFilterTechniques(
  techniques: TechniqueItem[],
  belt: BeltId,
  techniqueType: TechniqueType
): Requirement[] {
  return techniques
    .filter((t) => t.belt === belt)
    .map(adaptTechniqueToRequirement)
    .filter((req) => getCategoryTechniqueType(req.category, belt) === techniqueType);
}

/**
 * Get all requirements from techniques for a specific belt
 */
export function adaptTechniquesForBelt(
  techniques: TechniqueItem[],
  belt: BeltId
): Requirement[] {
  return techniques
    .filter((t) => t.belt === belt)
    .map(adaptTechniqueToRequirement);
}
