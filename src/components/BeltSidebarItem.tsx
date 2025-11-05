import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Belt } from '../types';

interface BeltSidebarItemProps {
  belt: Belt;
  isActive: boolean;
  progress?: number;
  onPress: () => void;
}

export const BeltSidebarItem: React.FC<BeltSidebarItemProps> = ({
  belt,
  isActive,
  progress = 0,
  onPress
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        isActive && { backgroundColor: belt.lightColor, borderLeftColor: belt.color },
      ]}
      onPress={onPress}
      accessibilityRole="tab"
      accessibilityState={{ selected: isActive }}
    >
      <View style={styles.content}>
        <Text
          style={[
            styles.label,
            isActive ? { color: belt.textColor, fontWeight: '700' } : styles.inactiveLabel,
          ]}
        >
          {belt.displayName}
        </Text>

        {progress > 0 && (
          <View style={styles.progressContainer}>
            <View style={[styles.progressCircle, { borderColor: belt.color }]}>
              <Text style={[styles.progressText, { color: belt.textColor }]}>
                {Math.round(progress)}%
              </Text>
            </View>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: 64,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderLeftWidth: 4,
    borderLeftColor: 'transparent',
    backgroundColor: 'transparent',
    marginBottom: 4,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  inactiveLabel: {
    color: '#6B7280',
    fontWeight: '600',
  },
  progressContainer: {
    marginLeft: 12,
  },
  progressCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressText: {
    fontSize: 12,
    fontWeight: '700',
  },
});
