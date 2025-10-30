export type BeltId = 'azul' | 'roxa' | 'marrom' | 'preta';

export interface Requirement {
  id: string;
  belt: BeltId;
  category: string;
  name: string;
  targetCount?: number;
  notes?: string;
  mediaUrl?: string;
}

export interface Belt {
  id: BeltId;
  displayName: string;
  color: string;
  textColor: string;
  lightColor: string;
}

export interface RequirementProgress {
  completed: boolean;
  note: string;
  mediaUrl: string;
}

export interface BeltProgress {
  [requirementId: string]: RequirementProgress;
}

export interface AppState {
  progress: {
    [beltId: string]: BeltProgress;
  };
}
