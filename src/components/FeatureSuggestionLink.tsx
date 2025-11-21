import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { logEvent } from '../services/analytics';
import { FeedbackModal } from './FeedbackModal';

export const FeatureSuggestionLink: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  const handlePress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await logEvent('feature_suggestion_clicked', { timestamp: Date.now() });
    setShowModal(true);
  };

  return (
    <>
      <TouchableOpacity
        style={styles.container}
        onPress={handlePress}
        accessibilityRole="button"
        accessibilityLabel="Sugerir funcionalidade"
      >
        <Ionicons name="bulb-outline" size={16} color="#1E40AF" />
        <Text style={styles.text}>Sugerir Funcionalidade</Text>
      </TouchableOpacity>

      <FeedbackModal
        visible={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginVertical: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#BAE6FD',
    borderRadius: 8,
    gap: 8,
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1E40AF',
  },
});
