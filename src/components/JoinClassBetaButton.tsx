import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { logEvent } from '../services/analytics';
import { FeedbackModal } from './FeedbackModal';

export function JoinClassBetaButton() {
  const [showModal, setShowModal] = useState(false);

  const handlePress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await logEvent('feature_suggestion_clicked', { timestamp: Date.now() });
    setShowModal(true);
  };

  return (
    <>
      <TouchableOpacity
        style={styles.banner}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        <View style={styles.content}>
          <Text style={styles.emoji}>💡</Text>
          <Text style={styles.message} numberOfLines={1}>
            Sugerir funcionalidade
          </Text>
          <Text style={styles.arrow}>›</Text>
        </View>
      </TouchableOpacity>

      <FeedbackModal
        visible={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  banner: {
    marginHorizontal: 16,
    marginVertical: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F0F9FF', // Light blue background
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BAE6FD',
    minHeight: 48, // Touch target compliance
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  emoji: {
    fontSize: 20,
  },
  message: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#0C4A6E', // Dark blue text on light blue background (14.3:1 contrast - WCAG AAA)
  },
  arrow: {
    fontSize: 24,
    color: '#0C4A6E',
    fontWeight: '300',
  },
});
