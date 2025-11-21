import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { TechniqueType } from '../types';

interface TechniqueTypeSidebarProps {
  selectedType: TechniqueType;
  onSelectType: (type: TechniqueType) => void;
}

const TECHNIQUE_TYPES: Array<{ type: TechniqueType; label: string }> = [
  { type: 'finalizacoes', label: 'Finalizações' },
  { type: 'quedas', label: 'Quedas' },
  { type: 'raspagens', label: 'Raspagens' },
  { type: 'passagens', label: 'Passagens' },
  { type: 'outros', label: 'Outros' },
];

export const TechniqueTypeSidebar: React.FC<TechniqueTypeSidebarProps> = ({
  selectedType,
  onSelectType,
}) => {
  return (
    <View style={styles.container}>
      {TECHNIQUE_TYPES.map(({ type, label }) => {
        const isActive = selectedType === type;
        return (
          <TouchableOpacity
            key={type}
            style={[
              styles.item,
              isActive && styles.activeItem,
            ]}
            onPress={() => onSelectType(type)}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
          >
            <Text
              style={[
                styles.label,
                isActive && styles.activeLabel,
              ]}
            >
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    gap: 4,
  },
  item: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  activeItem: {
    backgroundColor: '#EFF6FF',
    borderLeftWidth: 3,
    borderLeftColor: '#2563EB',
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6B7280',
  },
  activeLabel: {
    color: '#1E40AF',
    fontWeight: '700',
  },
});
