export type BeltId = 'azul' | 'roxa' | 'marrom' | 'preta';

export interface Belt {
  id: BeltId;
  displayName: string;
  color: string;
  textColor: string;
  lightColor: string;
}

// New cross-belt technique system
export interface BeltRequirementMapping {
  belt: BeltId;
  requirementId: string;
  requirementName: string;
}

export interface Technique {
  id: string;
  name: string;
  position?: string; // e.g., "Guarda Fechada", "Montada"
  category: string; // e.g., "Finalizações", "Raspagem"
  countsToward: BeltRequirementMapping[];
  videoUrl?: string;
  description?: string;
}

export interface BeltRequirement {
  id: string;
  belt: BeltId;
  category: string;
  name: string;
  targetCount: number;
}

export interface TechniqueProgress {
  techniqueId: string;
  completed: boolean;
  note: string;
  mediaUrl: string;
  completedAt?: string;
}

export interface RequirementProgress {
  requirementId: string;
  requirementName: string;
  category: string;
  completed: number;
  total: number;
  isComplete: boolean;
  techniques: Technique[];
}

export interface BeltProgressSummary {
  requirements: RequirementProgress[];
  overallPercent: number;
  completedCount: number;
  totalCount: number;
}

// Legacy types (kept for reference during migration)
export interface Requirement {
  id: string;
  belt: BeltId;
  category: string;
  name: string;
  targetCount?: number;
  notes?: string;
  mediaUrl?: string;
}
