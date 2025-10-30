import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { BeltId } from '../types';
import { BELT_COLORS } from '../data/belts';
import { useEffect } from 'react';

interface ProgressBarProps {
  current: number;
  total: number;
  percentage: number;
  beltId: BeltId;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  total,
  percentage,
  beltId,
}) => {
  const belt = BELT_COLORS[beltId];
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withSpring(percentage / 100, {
      damping: 20,
      stiffness: 90,
    });
  }, [percentage]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: `${progress.value * 100}%`,
    };
  });

  return (
    <View style={styles.container} accessibilityRole="progressbar" accessibilityLabel={`${current} de ${total} requisitos concluídos, ${percentage} porcento`}>
      <View style={styles.textContainer}>
        <Text style={styles.primaryText}>
          {current} / {total} concluídos
        </Text>
        <Text style={[styles.percentageText, { color: belt.color }]}>
          {percentage}%
        </Text>
      </View>
      <View style={styles.track}>
        <Animated.View
          style={[
            styles.fill,
            { backgroundColor: belt.color },
            animatedStyle,
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F9FAFB',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  textContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  primaryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  percentageText: {
    fontSize: 20,
    fontWeight: '700',
  },
  track: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 4,
  },
});
