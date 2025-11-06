import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BeltId } from '../types';
import { BELT_COLORS } from '../data/belts';

interface CategoryHeaderProps {
  title: string;
  completedCount: number;
  totalCount: number;
  isExpanded: boolean;
  onToggle: () => void;
  beltId: BeltId;
}

export const CategoryHeader: React.FC<CategoryHeaderProps> = ({
  title,
  completedCount,
  totalCount,
  isExpanded,
  onToggle,
  beltId,
}) => {
  const belt = BELT_COLORS[beltId];
  const isComplete = completedCount === totalCount && totalCount > 0;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onToggle}
      accessibilityRole="button"
      accessibilityLabel={`${title}, ${completedCount} de ${totalCount} concluídos${isExpanded ? ', expandido' : ', recolhido'}`}
      accessibilityHint="Toque duas vezes para alternar"
    >
      <Text style={styles.title}>{title}</Text>
      <View style={styles.rightContainer}>
        <View
          style={[
            styles.badge,
            isComplete && { backgroundColor: belt.lightColor },
          ]}
        >
          <Text
            style={[
              styles.badgeText,
              isComplete && { color: belt.textColor },
            ]}
          >
            {completedCount}/{totalCount}
          </Text>
        </View>
        <Ionicons
          name="chevron-down"
          size={20}
          color="#4B5563"
          style={[
            styles.chevron,
            isExpanded && styles.chevronExpanded,
          ]}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 52,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F3F4F6',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#FEF3C7',
    minWidth: 48,
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#92400E',
  },
  chevron: {
    transform: [{ rotate: '0deg' }],
  },
  chevronExpanded: {
    transform: [{ rotate: '180deg' }],
  },
});
