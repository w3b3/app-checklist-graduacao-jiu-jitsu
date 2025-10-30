import { Belt } from '../types';

export const BELT_COLORS: Record<string, Belt> = {
  azul: {
    id: 'azul',
    displayName: 'Azul',
    color: '#1E40AF',
    textColor: '#1E3A8A',
    lightColor: '#DBEAFE',
  },
  roxa: {
    id: 'roxa',
    displayName: 'Roxa',
    color: '#7C3AED',
    textColor: '#5B21B6',
    lightColor: '#EDE9FE',
  },
  marrom: {
    id: 'marrom',
    displayName: 'Marrom',
    color: '#92400E',
    textColor: '#78350F',
    lightColor: '#FEF3C7',
  },
  preta: {
    id: 'preta',
    displayName: 'Preta',
    color: '#1F2937',
    textColor: '#111827',
    lightColor: '#F3F4F6',
  },
};

export const BELT_ORDER: Belt[] = [
  BELT_COLORS.azul,
  BELT_COLORS.roxa,
  BELT_COLORS.marrom,
  BELT_COLORS.preta,
];
