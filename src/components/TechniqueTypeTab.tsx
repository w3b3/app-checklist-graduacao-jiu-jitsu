import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { TechniqueType } from '../types';

interface TechniqueTypeTabProps {
  type: TechniqueType;
  isActive: boolean;
  onPress: () => void;
}

const TECHNIQUE_LABELS: Record<TechniqueType, string> = {
  finalizacoes: 'Finalizações',
  quedas: 'Quedas',
  raspagens: 'Raspagens',
  passagens: 'Passagens',
  outros: 'Outros',
};

export const TechniqueTypeTab: React.FC<TechniqueTypeTabProps> = ({ type, isActive, onPress }) => {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        isActive && styles.activeContainer,
      ]}
      onPress={onPress}
      accessibilityRole="tab"
      accessibilityState={{ selected: isActive }}
    >
      <Text
        style={[
          styles.label,
          isActive && styles.activeLabel,
        ]}
      >
        {TECHNIQUE_LABELS[type]}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    minWidth: 90,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    backgroundColor: 'transparent',
  },
  activeContainer: {
    borderBottomColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  activeLabel: {
    color: '#1E40AF',
    fontWeight: '700',
    fontSize: 15,
  },
});
