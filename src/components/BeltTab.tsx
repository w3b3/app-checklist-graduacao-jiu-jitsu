import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Belt } from '../types';

interface BeltTabProps {
  belt: Belt;
  isActive: boolean;
  progress?: number;
  onPress: () => void;
}

export const BeltTab: React.FC<BeltTabProps> = ({ belt, isActive, progress = 0, onPress }) => {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        isActive && { backgroundColor: belt.lightColor, borderBottomColor: belt.color },
      ]}
      onPress={onPress}
      accessibilityRole="tab"
      accessibilityState={{ selected: isActive }}
    >
      <Text
        style={[
          styles.label,
          isActive ? { color: belt.textColor, fontWeight: '700' } : styles.inactiveLabel,
        ]}
      >
        {belt.displayName}
      </Text>
      {progress > 0 && (
        <View style={[styles.badge, { backgroundColor: belt.color }]}>
          <Text style={styles.badgeText}>{Math.round(progress)}%</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    minWidth: 80,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
    backgroundColor: 'transparent',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
  inactiveLabel: {
    color: '#6B7280',
    fontWeight: '600',
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 32,
    alignItems: 'center',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
});
